// ============================================================================
// 服务层模块 - 业务逻辑处理
// ============================================================================
// 功能说明：
// 1. 接收 Controller 层的请求
// 2. 执行业务逻辑处理
// 3. 与数据库交互（通过 DAO 层）
// 4. 返回处理结果
//
// 服务层职责：
// 1. 数据验证和业务规则校验
// 2. 数据转换和格式化
// 3. 调用其他服务或外部 API
// 4. 事务管理
//
// 安全特性：
// 1. 密码使用 bcrypt 加密存储
// 2. 敏感信息不在日志中输出
// ============================================================================

package service

import (
	"context"

	"github.com/gogf/gf/v2/frame/g"

	"jinhuo-tech/backend/internal/model"
	"jinhuo-tech/backend/utility"
)

// ============================================================================
// 作品服务
// ============================================================================

// workService 作品相关业务逻辑
type workService struct{}

// Work 作品服务实例
var Work = workService{}

// GetList 获取作品列表
// 参数：
//   - ctx: 请求上下文
//   - page: 页码（从1开始）
//   - size: 每页数量
//   - workType: 作品类型筛选（空字符串表示不筛选）
// 返回：
//   - list: 作品列表
//   - total: 总数量
func (s *workService) GetList(ctx context.Context, page, size int, workType string) (map[string]interface{}, error) {
	// 构建查询
	m := g.Model("works")

	// 如果指定了类型，添加筛选条件
	if workType != "" {
		m = m.Where("type", workType)
	}

	// 获取总数
	total, _ := m.Count()

	// 获取列表
	// 按 sort 降序（优先显示置顶内容）
	// 按 id 降序（最新内容在前）
	var list []model.Work
	m.Page(page, size).Order("sort desc, id desc").Scan(&list)

	return map[string]interface{}{
		"list":  list,
		"total": total,
	}, nil
}

// GetDetail 获取作品详情
// 参数：
//   - ctx: 请求上下文
//   - id: 作品ID
// 返回：
//   - 作品详细信息
func (s *workService) GetDetail(ctx context.Context, id uint) (*model.Work, error) {
	var work model.Work
	err := g.Model("works").Where("id", id).Scan(&work)
	return &work, err
}

// Create 创建作品
// 参数：
//   - ctx: 请求上下文
//   - data: 作品数据
func (s *workService) Create(ctx context.Context, data *model.Work) error {
	// 插入数据库，不包含 id（让数据库自动生成）
	_, err := g.Model("works").Data(g.Map{
		"title":       data.Title,
		"description": data.Description,
		"type":        data.Type,
		"file_url":    data.FileUrl,
		"thumbnail":   data.Thumbnail,
		"sort":        data.Sort,
		"status":      1, // 默认启用状态
	}).Insert()
	return err
}

// Update 更新作品
// 参数：
//   - ctx: 请求上下文
//   - id: 作品ID
//   - data: 更新的数据
func (s *workService) Update(ctx context.Context, id uint, data *model.Work) error {
	_, err := g.Model("works").Data(g.Map{
		"title":       data.Title,
		"description": data.Description,
		"type":        data.Type,
		"file_url":    data.FileUrl,
		"thumbnail":   data.Thumbnail,
		"sort":        data.Sort,
		"status":      data.Status,
	}).Where("id", id).Update()
	return err
}

// Delete 删除作品
// 参数：
//   - ctx: 请求上下文
//   - id: 作品ID
func (s *workService) Delete(ctx context.Context, id uint) error {
	_, err := g.Model("works").Where("id", id).Delete()
	return err
}

// ============================================================================
// 资讯服务
// ============================================================================

// articleService 资讯文章相关业务逻辑
type articleService struct{}

// Article 资讯服务实例
var Article = articleService{}

// GetList 获取资讯列表
// 只返回已发布的文章（status = 1）
func (s *articleService) GetList(ctx context.Context, page, size int, articleType string) (map[string]interface{}, error) {
	// 构建查询，只查询已发布的文章
	m := g.Model("articles").Where("status", 1)

	// 类型筛选
	if articleType != "" {
		m = m.Where("type", articleType)
	}

	total, _ := m.Count()

	var list []model.Article
	m.Page(page, size).Order("id desc").Scan(&list)

	return map[string]interface{}{
		"list":  list,
		"total": total,
	}, nil
}

// GetDetail 获取资讯详情
// 只返回已发布的文章
func (s *articleService) GetDetail(ctx context.Context, id uint) (*model.Article, error) {
	var article model.Article
	err := g.Model("articles").Where("id", id).Where("status", 1).Scan(&article)
	return &article, err
}

// Create 创建资讯
func (s *articleService) Create(ctx context.Context, data *model.Article) error {
	_, err := g.Model("articles").Data(g.Map{
		"title":   data.Title,
		"content": data.Content,
		"type":    data.Type,
		"author":  data.Author,
		"cover":   data.Cover,
		"status":  1, // 默认发布状态
	}).Insert()
	return err
}

// Update 更新资讯
func (s *articleService) Update(ctx context.Context, id uint, data *model.Article) error {
	_, err := g.Model("articles").Data(g.Map{
		"title":   data.Title,
		"content": data.Content,
		"type":    data.Type,
		"author":  data.Author,
		"cover":   data.Cover,
		"status":  data.Status,
	}).Where("id", id).Update()
	return err
}

// Delete 删除资讯
func (s *articleService) Delete(ctx context.Context, id uint) error {
	_, err := g.Model("articles").Where("id", id).Delete()
	return err
}

// ============================================================================
// 咨询服务
// ============================================================================

// inquiryService 用户咨询相关业务逻辑
type inquiryService struct{}

// Inquiry 咨询服务实例
var Inquiry = inquiryService{}

// Create 创建咨询记录
// 用户提交的咨询会存入数据库
func (s *inquiryService) Create(ctx context.Context, data *model.Inquiry) error {
	_, err := g.Model("inquiries").Data(g.Map{
		"name":    data.Name,
		"contact": data.Contact,
		"content": data.Content,
	}).Insert()
	return err
}

// GetList 获取咨询列表
// 用于后台管理查看所有咨询
func (s *inquiryService) GetList(ctx context.Context, page, size int) (map[string]interface{}, error) {
	m := g.Model("inquiries")

	total, _ := m.Count()

	var list []model.Inquiry
	m.Page(page, size).Order("id desc").Scan(&list)

	return map[string]interface{}{
		"list":  list,
		"total": total,
	}, nil
}

// UpdateStatus 更新咨询状态
// 用于标记咨询是否已处理
// 参数：
//   - status: 0=未处理, 1=已处理
func (s *inquiryService) UpdateStatus(ctx context.Context, id uint, status int) error {
	_, err := g.Model("inquiries").Data(g.Map{"status": status}).Where("id", id).Update()
	return err
}

// ============================================================================
// 管理员服务
// ============================================================================

// adminService 管理员相关业务逻辑
// 包含登录验证、密码加密等功能
type adminService struct{}

// Admin 管理员服务实例
var Admin = adminService{}

// Login 管理员登录验证
// 验证用户名和密码是否正确
//
// 安全说明：
// 1. 密码使用 bcrypt 加密存储，不能逆向解密
// 2. 使用 bcrypt.CompareHashAndPassword 验证密码
// 3. 即使数据库泄露，攻击者也无法获取原始密码
//
// 参数：
//   - ctx: 请求上下文
//   - username: 用户名
//   - password: 密码（明文，来自用户输入）
// 返回：
//   - string: 登录成功标记（由 Controller 层生成 JWT Token）
//   - error: 验证失败错误
func (s *adminService) Login(ctx context.Context, username, password string) (string, error) {
	// 从数据库查询用户
	var admin model.Admin
	err := g.Model("admins").
		Where("username", username).
		Where("status", 1). // 只查询启用状态的管理员
		Scan(&admin)

	// 用户不存在
	if err != nil || admin.Id == 0 {
		return "", err
	}

	// 验证密码
	// bcrypt.CheckPassword 会：
	// 1. 从数据库的 hash 值中提取盐值
	// 2. 使用相同盐值对用户输入的密码进行哈希
	// 3. 比较两个哈希值是否相同
	if !utility.CheckPassword(password, admin.Password) {
		return "", err
	}

	// 返回成功标记
	// 注意：JWT Token 在 Controller 层生成
	return "success", nil
}

// GetList 获取管理员列表
func (s *adminService) GetList(ctx context.Context, page, size int) (map[string]interface{}, error) {
	m := g.Model("admins")

	total, _ := m.Count()

	var list []model.Admin
	m.Page(page, size).Order("id desc").Scan(&list)

	return map[string]interface{}{
		"list":  list,
		"total": total,
	}, nil
}

// Create 创建管理员
// 重要：密码会在存储前进行加密
func (s *adminService) Create(ctx context.Context, data *model.Admin) error {
	// 对密码进行加密
	// bcrypt 是专门为密码存储设计的单向加密算法
	// 即使数据库泄露，攻击者也无法还原原始密码
	hashedPassword, err := utility.HashPassword(data.Password)
	if err != nil {
		return err
	}

	_, err = g.Model("admins").Data(g.Map{
		"username": data.Username,
		"password": hashedPassword, // 存储加密后的密码
		"role":     data.Role,
		"status":   1,
	}).Insert()
	return err
}

// Update 更新管理员
// 注意：如果传入了新密码，会自动加密存储
func (s *adminService) Update(ctx context.Context, id uint, data *model.Admin) error {
	updateData := g.Map{
		"username": data.Username,
		"role":     data.Role,
		"status":   data.Status,
	}

	// 如果提供了新密码，进行加密后更新
	if data.Password != "" {
		hashedPassword, err := utility.HashPassword(data.Password)
		if err != nil {
			return err
		}
		updateData["password"] = hashedPassword
	}

	_, err := g.Model("admins").Data(updateData).Where("id", id).Update()
	return err
}

// Delete 删除管理员
func (s *adminService) Delete(ctx context.Context, id uint) error {
	_, err := g.Model("admins").Where("id", id).Delete()
	return err
}

// ============================================================================
// 仪表盘服务
// ============================================================================

// dashboardService 仪表盘统计数据相关业务逻辑
type dashboardService struct{}

// Dashboard 仪表盘服务实例
var Dashboard = dashboardService{}

// GetStats 获取仪表盘统计数据
// 返回各类数据的统计信息
func (s *dashboardService) GetStats(ctx context.Context) (map[string]interface{}, error) {
	// 作品总数
	worksCount, _ := g.Model("works").Count()

	// 已发布的文章总数
	articlesCount, _ := g.Model("articles").Where("status", 1).Count()

	// 咨询总数
	inquiriesCount, _ := g.Model("inquiries").Count()

	// 访问总数
	visitsTotal, _ := g.Model("visits").Count()

	return map[string]interface{}{
		"works_count":     worksCount,
		"articles_count":  articlesCount,
		"inquiries_count": inquiriesCount,
		"visits_today":    0, // TODO: 实现今日访问统计
		"visits_total":    visitsTotal,
		"visits_trend":    []int{}, // TODO: 实现访问趋势
	}, nil
}