// ============================================================================
// 数据模型模块 - 定义数据库表结构
// ============================================================================
// 功能说明：
// 1. 定义数据库表对应的 Go 结构体
// 2. 使用 orm 标签映射数据库字段
// 3. 使用 json 标签定义 JSON 序列化字段名
//
// 命名规范：
// - 结构体名使用大驼峰（如 Admin, Work）
// - 数据库字段使用蛇形命名（如 created_at, file_url）
// - JSON 字段使用蛇形命名（与数据库字段一致）
// ============================================================================

package model

// ============================================================================
// 管理员模型
// ============================================================================

// Admin 管理员表
// 对应数据库表：admins
// 用途：存储后台管理员账号信息
//
// 安全说明：
// - Password 字段存储的是 bcrypt 加密后的密码哈希值
// - 原始密码永远不会存储在数据库中
// - 即使数据库泄露，攻击者也无法还原原始密码
type Admin struct {
	Id       uint   `json:"id" orm:"id,primary"`         // 主键ID，自增
	Username string `json:"username" orm:"username"`     // 用户名，唯一
	Password string `json:"-" orm:"password"`            // 密码哈希值，JSON不输出（安全考虑）
	Role     string `json:"role" orm:"role"`             // 角色：admin/editor
	Status   int    `json:"status" orm:"status"`         // 状态：0=禁用, 1=启用
}

// TableName 指定表名
// GoFrame 默认会将结构体名转为蛇形复数作为表名
// 这里显式指定确保表名正确
func (Admin) TableName() string {
	return "admins"
}

// ============================================================================
// 作品模型
// ============================================================================

// Work 作品表
// 对应数据库表：works
// 用途：存储公司作品/案例信息
//
// 作品类型说明：
// - ai-drama: AI漫剧
// - ai-video: AI广告视频
// - ai-image: 图片生成
// - website: 网站制作
type Work struct {
	Id          uint   `json:"id" orm:"id,primary"`               // 主键ID，自增
	Title       string `json:"title" orm:"title"`                 // 作品标题
	Description string `json:"description" orm:"description"`     // 作品描述
	Type        string `json:"type" orm:"type"`                   // 作品类型
	FileUrl     string `json:"file_url" orm:"file_url"`           // 文件URL（图片/视频），多个用逗号分隔
	Thumbnail   string `json:"thumbnail" orm:"thumbnail"`         // 缩略图URL
	Sort        int    `json:"sort" orm:"sort"`                   // 排序权重，越大越靠前
	Status      int    `json:"status" orm:"status"`               // 状态：0=隐藏, 1=显示
}

// TableName 指定表名
func (Work) TableName() string {
	return "works"
}

// ============================================================================
// 文章模型
// ============================================================================

// Article 资讯文章表
// 对应数据库表：articles
// 用途：存储公司新闻、公告等资讯内容
//
// 文章类型说明：
// - news: 新闻
// - announcement: 公告
type Article struct {
	Id          uint   `json:"id" orm:"id,primary"`               // 主键ID，自增
	Title       string `json:"title" orm:"title"`                 // 文章标题
	Content     string `json:"content" orm:"content"`             // 文章内容（支持Markdown）
	Type        string `json:"type" orm:"type"`                   // 文章类型
	Author      string `json:"author" orm:"author"`               // 作者
	Cover       string `json:"cover" orm:"cover"`                 // 封面图片URL
	PublishedAt string `json:"published_at" orm:"published_at"`   // 发布时间
	Status      int    `json:"status" orm:"status"`               // 状态：0=草稿, 1=已发布
}

// TableName 指定表名
func (Article) TableName() string {
	return "articles"
}

// ============================================================================
// 咨询模型
// ============================================================================

// Inquiry 用户咨询表
// 对应数据库表：inquiries
// 用途：存储用户通过联系表单提交的咨询信息
//
// 状态说明：
// - 0: 未处理（新咨询）
// - 1: 已处理
type Inquiry struct {
	Id      uint   `json:"id" orm:"id,primary"`           // 主键ID，自增
	Name    string `json:"name" orm:"name"`               // 姓名
	Contact string `json:"contact" orm:"contact"`         // 联系方式（电话/邮箱/微信）
	Content string `json:"content" orm:"content"`         // 咨询内容
	Status  int    `json:"status" orm:"status"`           // 处理状态：0=未处理, 1=已处理
}

// TableName 指定表名
func (Inquiry) TableName() string {
	return "inquiries"
}

// ============================================================================
// 访问记录模型
// ============================================================================

// Visit 访问记录表
// 对应数据库表：visits
// 用途：记录网站访问日志，用于统计分析
//
// 注意：
// - 此表数据量可能很大，建议定期归档或清理
// - 可以考虑使用专业的日志分析工具替代
type Visit struct {
	Id        uint   `json:"id" orm:"id,primary"`               // 主键ID，自增
	Ip        string `json:"ip" orm:"ip"`                       // 访问者IP地址
	Path      string `json:"path" orm:"path"`                   // 访问路径
	UserAgent string `json:"user_agent" orm:"user_agent"`       // 浏览器标识
}

// TableName 指定表名
func (Visit) TableName() string {
	return "visits"
}