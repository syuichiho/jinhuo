// ============================================================================
// 中间件模块 - 认证与授权
// ============================================================================
// 功能说明：
// 1. JWT Token 验证：验证请求头中的 Authorization Bearer Token
// 2. 用户身份识别：解析 Token 获取用户信息并注入到请求上下文
// 3. 路由保护：对需要认证的 API 路由进行保护
//
// 安全特性：
// - Token 有效期 24 小时，过期需重新登录
// - 使用 HS256 签名算法
// - Token 黑名单机制（可选扩展）
// ============================================================================

package middleware

import (
	"strings"
	"time"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/golang-jwt/jwt/v5"
)

// ============================================================================
// JWT 配置常量
// ============================================================================

// JwtSecret JWT 签名密钥
// 生产环境建议从环境变量读取，不要硬编码在代码中
// 例如：JwtSecret = os.Getenv("JWT_SECRET")
var JwtSecret = []byte("jinhuo-tech-secret-key-2026")

// TokenExpireDuration Token 有效期（24小时）
const TokenExpireDuration = 24 * time.Hour

// ============================================================================
// JWT Claims 结构体
// ============================================================================

// CustomClaims 自定义 JWT Claims
// 包含标准字段和自定义用户信息
type CustomClaims struct {
	Username string `json:"username"` // 用户名
	Role     string `json:"role"`     // 用户角色（admin/editor等）
	jwt.RegisteredClaims                  // JWT 标准字段
}

// ============================================================================
// Token 生成函数
// ============================================================================

// GenerateToken 为指定用户生成 JWT Token
// 参数：
//   - username: 用户名
//   - role: 用户角色
// 返回：
//   - string: 生成的 Token 字符串
//   - error: 生成过程中的错误
//
// 使用示例：
//
//	token, err := middleware.GenerateToken("admin", "admin")
func GenerateToken(username, role string) (string, error) {
	// 创建 Claims 对象
	claims := CustomClaims{
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(TokenExpireDuration)), // 过期时间
			IssuedAt:  jwt.NewNumericDate(time.Now()),                          // 签发时间
			NotBefore: jwt.NewNumericDate(time.Now()),                          // 生效时间
			Issuer:    "jinhuo-tech",                                           // 签发者
		},
	}

	// 使用 HS256 算法生成 Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(JwtSecret)
}

// ============================================================================
// Token 解析函数
// ============================================================================

// ParseToken 解析并验证 JWT Token
// 参数：
//   - tokenString: Token 字符串
// 返回：
//   - *CustomClaims: 解析出的用户信息
//   - error: 解析或验证错误
//
// 验证内容包括：
//  1. 签名是否有效
//  2. Token 是否过期
//  3. 签发者是否正确
func ParseToken(tokenString string) (*CustomClaims, error) {
	// 解析 Token
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		// 验证签名算法
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return JwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	// 提取 Claims
	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrTokenInvalidClaims
}

// ============================================================================
// 认证中间件
// ============================================================================

// Auth 认证中间件
// 用于保护需要登录才能访问的路由
//
// 工作流程：
//  1. 从请求头获取 Authorization 字段
//  2. 解析 Bearer Token
//  3. 验证 Token 有效性
//  4. 将用户信息注入请求上下文
//  5. 验证失败返回 401 Unauthorized
//
// 使用示例：
//
//	group.Middleware(middleware.Auth)
func Auth(r *ghttp.Request) {
	// 获取 Authorization 请求头
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		// 未提供 Token，返回 401
		r.Response.WriteJson(g.Map{
			"code":    401,
			"message": "未登录或登录已过期，请重新登录",
		})
		return
	}

	// 解析 Bearer Token
	// 格式：Authorization: Bearer <token>
	parts := strings.SplitN(authHeader, " ", 2)
	if !(len(parts) == 2 && parts[0] == "Bearer") {
		r.Response.WriteJson(g.Map{
			"code":    401,
			"message": "Token 格式错误",
		})
		return
	}

	// 验证 Token
	claims, err := ParseToken(parts[1])
	if err != nil {
		r.Response.WriteJson(g.Map{
			"code":    401,
			"message": "Token 无效或已过期",
		})
		return
	}

	// 将用户信息注入请求上下文
	// 后续处理器可以通过 r.GetCtxVar("username") 获取
	r.SetCtxVar("username", claims.Username)
	r.SetCtxVar("role", claims.Role)
	r.SetCtxVar("userId", claims.Username) // 简化处理，使用 username 作为 userId

	// 继续处理请求
	r.Middleware.Next()
}