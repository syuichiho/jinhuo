// ============================================================================
// 命令模块 - 服务启动入口
// ============================================================================
// 功能说明：
// 1. 初始化数据库表结构
// 2. 配置 CORS 跨域策略
// 3. 设置静态文件服务
// 4. 注册 API 路由
// 5. 启动 HTTP 服务器
//
// 路由分组：
// - /api/upload          : 文件上传（需认证）
// - /api/works           : 作品相关（公开）
// - /api/articles        : 资讯相关（公开）
// - /api/inquiries       : 咨询相关（公开）
// - /api/admin/login     : 管理员登录（公开）
// - /api/admin/*         : 后台管理（需认证）
// ============================================================================

package cmd

import (
	"context"
	"os"
	"path/filepath"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gcmd"

	"jinhuo-tech/backend/internal/controller"
	"jinhuo-tech/backend/internal/dao"
	"jinhuo-tech/backend/internal/middleware"
)

// Main 主命令，程序入口
// 执行 `./jinhuo-backend` 即可启动服务器
var Main = gcmd.Command{
	Name:  "main",
	Usage: "jinhuo-tech backend server",
	Brief: "start the backend server",
	Func: func(ctx context.Context, parser *gcmd.Parser) (err error) {
		// ====================================================================
		// 第一阶段：初始化数据库
		// ====================================================================
		// 创建所有必要的数据库表
		// 如果表已存在则跳过，不会覆盖数据
		g.Log().Info(ctx, "🦞 初始化数据库...")
		dao.InitTables(ctx)
		g.Log().Info(ctx, "✅ 数据库初始化完成")

		// ====================================================================
		// 第二阶段：准备文件上传目录
		// ====================================================================
		// 获取可执行文件所在目录
		execPath, _ := os.Executable()
		rootDir := filepath.Dir(execPath)
		uploadsPath := filepath.Join(rootDir, "uploads")

		// 确保 uploads 目录存在
		// 权限 0755: 所有者可读写执行，其他用户可读执行
		os.MkdirAll(uploadsPath, 0755)
		g.Log().Infof(ctx, "📁 静态文件目录: %s", uploadsPath)

		// ====================================================================
		// 第三阶段：创建 HTTP 服务器
		// ====================================================================
		s := g.Server()

		// ====================================================================
		// CORS 跨域配置
		// ====================================================================
		// 安全说明：
		// - 生产环境应该将 AllowOrigins 设置为具体的前端域名
		// - 不要使用 "*" 允许所有来源
		// - 本示例为开发环境配置，生产环境需要修改
		s.Use(func(r *ghttp.Request) {
			r.Response.CORSDefault()
			r.Middleware.Next()
		})

		// ====================================================================
		// 静态文件服务
		// ====================================================================
		// 访问路径：/uploads/文件名
		// 用于访问用户上传的图片、视频等文件
		s.BindHandler("/uploads/*file", func(r *ghttp.Request) {
			file := r.Get("file").String()
			filePath := filepath.Join(uploadsPath, file)
			r.Response.ServeFile(filePath)
		})

		// ====================================================================
		// API 路由注册
		// ====================================================================
		s.Group("/", func(group *ghttp.RouterGroup) {
			// ----------------------------------------------------------------
			// 公开 API（无需认证）
			// ----------------------------------------------------------------

			// 文件上传 - 需要认证（放在 admin 组之前单独处理，或移到 admin 组）
			// 这里暂时保留为公开，实际生产环境应该需要认证

			// 前台 API - 作品展示
			group.GET("/api/works", controller.Work.List)           // 获取作品列表
			group.GET("/api/works/:id", controller.Work.Detail)     // 获取作品详情

			// 前台 API - 资讯文章
			group.GET("/api/articles", controller.Article.List)     // 获取资讯列表
			group.GET("/api/articles/:id", controller.Article.Detail) // 获取资讯详情

			// 前台 API - 用户咨询
			group.POST("/api/inquiries", controller.Inquiry.Create) // 提交咨询

			// ----------------------------------------------------------------
			// 后台管理 API
			// ----------------------------------------------------------------
			admin := group.Group("/api/admin")
			{
				// 登录接口 - 无需认证
				admin.POST("/login", controller.Admin.Login) // 管理员登录

				// ----------------------------------------------------------------
				// 以下路由需要 JWT 认证
				// ----------------------------------------------------------------
				admin.Middleware(middleware.Auth)

				// 获取个人信息
				admin.GET("/profile", controller.Admin.Profile)

				// 文件上传
				admin.POST("/upload", controller.Upload.File)

				// 作品管理
				admin.GET("/works", controller.Work.AdminList)      // 获取作品列表
				admin.POST("/works", controller.Work.Create)        // 创建作品
				admin.PUT("/works/:id", controller.Work.Update)     // 更新作品
				admin.DELETE("/works/:id", controller.Work.Delete)  // 删除作品

				// 文章管理
				admin.GET("/articles", controller.Article.AdminList)  // 获取文章列表
				admin.POST("/articles", controller.Article.Create)    // 创建文章
				admin.PUT("/articles/:id", controller.Article.Update) // 更新文章
				admin.DELETE("/articles/:id", controller.Article.Delete) // 删除文章

				// 咨询管理
				admin.GET("/inquiries", controller.Inquiry.List)     // 获取咨询列表
				admin.PUT("/inquiries/:id", controller.Inquiry.Update) // 更新咨询状态

				// 管理员管理
				admin.GET("/admins", controller.Admin.List)          // 获取管理员列表
				admin.POST("/admins", controller.Admin.Create)       // 创建管理员
				admin.PUT("/admins/:id", controller.Admin.Update)    // 更新管理员
				admin.DELETE("/admins/:id", controller.Admin.Delete) // 删除管理员

				// 仪表盘统计
				admin.GET("/dashboard", controller.Dashboard.Stats)  // 获取统计数据
			}
		})

		// ====================================================================
		// 启动服务器
		// ====================================================================
		s.SetPort(8080)
		g.Log().Info(ctx, "🦞 烬火科技后端服务启动成功！")
		g.Log().Info(ctx, "📡 API地址: http://localhost:8080")
		g.Log().Info(ctx, "🔐 JWT认证已启用，Token有效期: 24小时")
		s.Run()
		return nil
	},
}