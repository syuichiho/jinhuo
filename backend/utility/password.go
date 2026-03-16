// ============================================================================
// 工具模块 - 密码加密
// ============================================================================
// 功能说明：
// 1. 密码加密：使用 bcrypt 算法对密码进行单向加密
// 2. 密码验证：验证用户输入的密码是否与存储的哈希值匹配
//
// 安全特性：
// - bcrypt 是专门为密码存储设计的算法
// - 内置盐值，防止彩虹表攻击
// - 可调节计算复杂度（cost），默认 cost=10
// - 即使数据库泄露，攻击者也无法还原原始密码
//
// 为什么不用 MD5/SHA256？
// - MD5/SHA256 是快速哈希，容易被暴力破解
// - bcrypt 是慢哈希算法，专门对抗暴力破解
// ============================================================================

package utility

import (
	"golang.org/x/crypto/bcrypt"
)

// DefaultCost bcrypt 默认计算复杂度
// 值越大，加密越安全但越耗时
// 推荐值：10-12，默认为 10
const DefaultCost = 10

// ============================================================================
// 密码加密函数
// ============================================================================

// HashPassword 对密码进行加密
// 参数：
//   - password: 用户输入的原始密码（明文）
// 返回：
//   - string: 加密后的密码哈希值（可直接存入数据库）
//   - error: 加密过程中的错误
//
// 使用示例：
//
//	hashedPassword, err := utility.HashPassword("user_password_123")
//	// 将 hashedPassword 存入数据库
func HashPassword(password string) (string, error) {
	// 使用 bcrypt 生成哈希
	// 内部会自动生成随机盐值并添加到哈希结果中
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), DefaultCost)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

// ============================================================================
// 密码验证函数
// ============================================================================

// CheckPassword 验证密码是否正确
// 参数：
//   - password: 用户输入的原始密码（明文）
//   - hash: 数据库中存储的密码哈希值
// 返回：
//   - bool: true 表示密码正确，false 表示密码错误
//
// 使用示例：
//
//	isValid := utility.CheckPassword("user_input_password", storedHash)
//	if !isValid {
//	    return errors.New("密码错误")
//	}
func CheckPassword(password, hash string) bool {
	// bcrypt.CompareHashAndPassword 会：
	// 1. 从 hash 中提取盐值
	// 2. 使用相同盐值对 password 进行哈希
	// 3. 比较两个哈希值是否相同
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}