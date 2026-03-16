// ============================================================================
// 控制器模块 - 处理 HTTP 请求
// ============================================================================
// 功能说明：
// 接收 HTTP 请求，解析参数，调用 Service 层处理业务逻辑，返回 JSON 响应
//
// 控制器职责：
// 1. 参数解析和验证
// 2. 调用 Service 层方法
// 3. 处理错误并返回统一格式的响应
//
// 响应格式：
//   成功：{"code": 0, "data": {...}, "message": "操作成功"}
//   失败：{"code": 错误码, "message": "错误信息"}
//
// 常见错误码：
//   0    - 成功
//   400  - 参数错误
//   401  - 未授权（未登录或 Token 无效）
//   404  - 资源不存在
//   500  - 服务器内部错误
// ============================================================================

package controller

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"

	"jinhuo-tech/backend/internal/middleware"
	"jinhuo-tech/backend/internal/model"
	"jinhuo-tech/backend/internal/service"
)

// ============================================================================
// 作品控制器
// ============================================================================

// workController 作品相关操作
// 处理作品的增删改查
type workController struct{}

// Work 作品控制器实例
var Work = workController{}

// List 获取作品列表（前台）
// GET /api/works
// 参数：
//   - page: 页码，默认 1
//   - size: 每页数量，默认 10
//   - type: 作品类型筛选（可选）
// 返回：
//   - list: 作品列表
//   - total: 总数量
func (c *workController) List(req *ghttp.Request) {
	page := req.Get("page", 1).Int()
	size := req.Get("size", 10).Int()
	workType := req.Get("type").String()

	res, err := service.Work.GetList(req.Context(), page, size, workType)
	if err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "data": res})
}

// Detail 获取作品详情（前台）
// GET /api/works/:id
// 参数：
//   - id: 作品ID（URL路径参数）
// 返回：
//   - 作品详细信息
func (c *workController) Detail(req *ghttp.Request) {
	id := req.Get("id").Uint()
	res, err := service.Work.GetDetail(req.Context(), id)
	if err != nil {
		req.Response.WriteJson(g.Map{"code": 404, "message": "作品不存在"})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "data": res})
}

// Create 创建作品（后台）
// POST /api/admin/works
// 需要认证
// 参数：JSON Body
//   - title: 标题
//   - description: 描述
//   - type: 类型
//   - file_url: 文件URL
//   - thumbnail: 缩略图URL
//   - sort: 排序权重
func (c *workController) Create(req *ghttp.Request) {
	var data model.Work
	if err := req.Parse(&data); err != nil {
		req.Response.WriteJson(g.Map{"code": 400, "message": "参数错误"})
		return
	}
	if err := service.Work.Create(req.Context(), &data); err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "message": "创建成功"})
}

// Update 更新作品（后台）
// PUT /api/admin/works/:id
// 需要认证
// 参数：
//   - id: 作品ID（URL路径参数）
//   - JSON Body: 要更新的字段
func (c *workController) Update(req *ghttp.Request) {
	id := req.Get("id").Uint()
	var data model.Work
	if err := req.Parse(&data); err != nil {
		req.Response.WriteJson(g.Map{"code": 400, "message": "参数错误"})
		return
	}
	if err := service.Work.Update(req.Context(), id, &data); err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "message": "更新成功"})
}

// Delete 删除作品（后台）
// DELETE /api/admin/works/:id
// 需要认证
// 参数：
//   - id: 作品ID（URL路径参数）
func (c *workController) Delete(req *ghttp.Request) {
	id := req.Get("id").Uint()
	if err := service.Work.Delete(req.Context(), id); err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "message": "删除成功"})
}

// AdminList 获取作品列表（后台）
// GET /api/admin/works
// 需要认证
// 功能与 List 相同，但需要认证才能访问
func (c *workController) AdminList(req *ghttp.Request) {
	c.List(req)
}

// ============================================================================
// 资讯控制器
// ============================================================================

// articleController 资讯文章相关操作
type articleController struct{}

// Article 资讯控制器实例
var Article = articleController{}

// List 获取资讯列表（前台）
// GET /api/articles
// 参数：
//   - page: 页码
//   - size: 每页数量
//   - type: 文章类型筛选（可选）
// 返回：
//   - list: 文章列表（只返回已发布的）
func (c *articleController) List(req *ghttp.Request) {
	page := req.Get("page", 1).Int()
	size := req.Get("size", 10).Int()
	articleType := req.Get("type").String()

	res, err := service.Article.GetList(req.Context(), page, size, articleType)
	if err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "data": res})
}

// Detail 获取资讯详情（前台）
// GET /api/articles/:id
// 只返回已发布的文章
func (c *articleController) Detail(req *ghttp.Request) {
	id := req.Get("id").Uint()
	res, err := service.Article.GetDetail(req.Context(), id)
	if err != nil {
		req.Response.WriteJson(g.Map{"code": 404, "message": "资讯不存在"})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "data": res})
}

// Create 创建资讯（后台）
// POST /api/admin/articles
// 需要认证
func (c *articleController) Create(req *ghttp.Request) {
	var data model.Article
	if err := req.Parse(&data); err != nil {
		req.Response.WriteJson(g.Map{"code": 400, "message": "参数错误"})
		return
	}
	if err := service.Article.Create(req.Context(), &data); err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "message": "创建成功"})
}

// Update 更新资讯（后台）
// PUT /api/admin/articles/:id
// 需要认证
func (c *articleController) Update(req *ghttp.Request) {
	id := req.Get("id").Uint()
	var data model.Article
	if err := req.Parse(&data); err != nil {
		req.Response.WriteJson(g.Map{"code": 400, "message": "参数错误"})
		return
	}
	if err := service.Article.Update(req.Context(), id, &data); err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "message": "更新成功"})
}

// Delete 删除资讯（后台）
// DELETE /api/admin/articles/:id
// 需要认证
func (c *articleController) Delete(req *ghttp.Request) {
	id := req.Get("id").Uint()
	if err := service.Article.Delete(req.Context(), id); err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "message": "删除成功"})
}

// AdminList 获取资讯列表（后台）
// GET /api/admin/articles
// 需要认证
func (c *articleController) AdminList(req *ghttp.Request) {
	c.List(req)
}

// ============================================================================
// 咨询控制器
// ============================================================================

// inquiryController 用户咨询相关操作
type inquiryController struct{}

// Inquiry 咨询控制器实例
var Inquiry = inquiryController{}

// Create 提交咨询（前台）
// POST /api/inquiries
// 无需认证，任何访客都可以提交
// 参数：
//   - name: 姓名（必填）
//   - contact: 联系方式（可选）
//   - content: 咨询内容（必填）
func (c *inquiryController) Create(req *ghttp.Request) {
	var data model.Inquiry
	if err := req.Parse(&data); err != nil {
		req.Response.WriteJson(g.Map{"code": 400, "message": "参数错误"})
		return
	}
	if err := service.Inquiry.Create(req.Context(), &data); err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "message": "提交成功"})
}

// List 获取咨询列表（后台）
// GET /api/admin/inquiries
// 需要认证
func (c *inquiryController) List(req *ghttp.Request) {
	page := req.Get("page", 1).Int()
	size := req.Get("size", 10).Int()

	res, err := service.Inquiry.GetList(req.Context(), page, size)
	if err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "data": res})
}

// Update 更新咨询状态（后台）
// PUT /api/admin/inquiries/:id
// 需要认证
// 参数：
//   - id: 咨询ID
//   - status: 新状态（0=未处理, 1=已处理）
func (c *inquiryController) Update(req *ghttp.Request) {
	id := req.Get("id").Uint()
	status := req.Get("status").Int()

	if err := service.Inquiry.UpdateStatus(req.Context(), id, status); err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "message": "更新成功"})
}

// ============================================================================
// 管理员控制器
// ============================================================================

// adminController 管理员相关操作
type adminController struct{}

// Admin 管理员控制器实例
var Admin = adminController{}

// Login 管理员登录
// POST /api/admin/login
// 无需认证
// 参数：
//   - username: 用户名
//   - password: 密码
// 返回：
//   - token: JWT Token，用于后续请求认证
//   - username: 用户名
//   - role: 角色
func (c *adminController) Login(req *ghttp.Request) {
	username := req.Get("username").String()
	password := req.Get("password").String()

	// 调用 Service 验证用户名密码
	_, err := service.Admin.Login(req.Context(), username, password)
	if err != nil {
		req.Response.WriteJson(g.Map{"code": 401, "message": "用户名或密码错误"})
		return
	}

	// 生成 JWT Token
	jwtToken, err := middleware.GenerateToken(username, "admin")
	if err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": "生成Token失败"})
		return
	}

	req.Response.WriteJson(g.Map{
		"code": 0,
		"data": g.Map{
			"token":    jwtToken,
			"username": username,
			"role":     "admin",
		},
	})
}

// Profile 获取当前登录管理员信息
// GET /api/admin/profile
// 需要认证
// 从请求上下文获取用户信息（由认证中间件注入）
func (c *adminController) Profile(req *ghttp.Request) {
	// 从上下文获取用户信息
	username := req.GetCtxVar("username").String()
	role := req.GetCtxVar("role").String()

	req.Response.WriteJson(g.Map{
		"code": 0,
		"data": g.Map{
			"username": username,
			"role":     role,
		},
	})
}

// List 获取管理员列表（后台）
// GET /api/admin/admins
// 需要认证
func (c *adminController) List(req *ghttp.Request) {
	page := req.Get("page", 1).Int()
	size := req.Get("size", 10).Int()

	res, err := service.Admin.GetList(req.Context(), page, size)
	if err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "data": res})
}

// Create 创建管理员（后台）
// POST /api/admin/admins
// 需要认证
// 注意：密码会在 Service 层自动加密
func (c *adminController) Create(req *ghttp.Request) {
	var data model.Admin
	if err := req.Parse(&data); err != nil {
		req.Response.WriteJson(g.Map{"code": 400, "message": "参数错误"})
		return
	}
	if err := service.Admin.Create(req.Context(), &data); err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "message": "创建成功"})
}

// Update 更新管理员（后台）
// PUT /api/admin/admins/:id
// 需要认证
func (c *adminController) Update(req *ghttp.Request) {
	id := req.Get("id").Uint()
	var data model.Admin
	if err := req.Parse(&data); err != nil {
		req.Response.WriteJson(g.Map{"code": 400, "message": "参数错误"})
		return
	}
	if err := service.Admin.Update(req.Context(), id, &data); err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "message": "更新成功"})
}

// Delete 删除管理员（后台）
// DELETE /api/admin/admins/:id
// 需要认证
// 注意：不能删除自己
func (c *adminController) Delete(req *ghttp.Request) {
	id := req.Get("id").Uint()
	if err := service.Admin.Delete(req.Context(), id); err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "message": "删除成功"})
}

// ============================================================================
// 仪表盘控制器
// ============================================================================

// dashboardController 仪表盘统计相关
type dashboardController struct{}

// Dashboard 仪表盘控制器实例
var Dashboard = dashboardController{}

// Stats 获取仪表盘统计数据
// GET /api/admin/dashboard
// 需要认证
// 返回：
//   - works_count: 作品总数
//   - articles_count: 文章总数
//   - inquiries_count: 咨询总数
//   - visits_total: 访问总数
func (c *dashboardController) Stats(req *ghttp.Request) {
	stats, err := service.Dashboard.GetStats(req.Context())
	if err != nil {
		req.Response.WriteJson(g.Map{"code": 500, "message": err.Error()})
		return
	}
	req.Response.WriteJson(g.Map{"code": 0, "data": stats})
}