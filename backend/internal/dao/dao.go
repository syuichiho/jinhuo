package dao

import (
	"context"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"

	"jinhuo-tech/backend/utility"
)

// InitTables 初始化数据库表
// 创建所有必要的数据表，并插入默认管理员账户
func InitTables(ctx context.Context) {
	db := g.DB()

	// 创建admins表
	db.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS admins (
			id SERIAL PRIMARY KEY,
			username VARCHAR(50) UNIQUE NOT NULL,
			password VARCHAR(255) NOT NULL,
			role VARCHAR(20) DEFAULT 'admin',
			status INTEGER DEFAULT 1,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)

	// 创建works表
	db.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS works (
			id SERIAL PRIMARY KEY,
			title VARCHAR(200) NOT NULL,
			description TEXT,
			type VARCHAR(20),
			file_url VARCHAR(500),
			thumbnail VARCHAR(500),
			sort INTEGER DEFAULT 0,
			status INTEGER DEFAULT 1,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)

	// 创建articles表
	db.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS articles (
			id SERIAL PRIMARY KEY,
			title VARCHAR(200) NOT NULL,
			content TEXT,
			type VARCHAR(20),
			author VARCHAR(50),
			cover VARCHAR(500),
			published_at TIMESTAMP,
			status INTEGER DEFAULT 0,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)

	// 创建inquiries表
	db.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS inquiries (
			id SERIAL PRIMARY KEY,
			name VARCHAR(50) NOT NULL,
			contact VARCHAR(100),
			content TEXT NOT NULL,
			status INTEGER DEFAULT 0,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)

	// 创建visits表
	db.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS visits (
			id SERIAL PRIMARY KEY,
			ip VARCHAR(50),
			path VARCHAR(200),
			user_agent VARCHAR(500),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)

	// ====================================================================
	// 插入默认管理员
	// ====================================================================
	// 检查是否已存在 admin 用户
	var count int
	err := db.GetScan(ctx, &count, "SELECT COUNT(*) FROM admins WHERE username = $1", "admin")
	if err == nil && count == 0 {
		// 使用 bcrypt 加密密码
		// 默认密码：admin123
		// 重要：登录后请立即修改密码！
		hashedPassword, err := utility.HashPassword("admin123")
		if err != nil {
			g.Log().Errorf(ctx, "密码加密失败: %v", err)
			return
		}

		_, err = db.Exec(ctx,
			"INSERT INTO admins (username, password, role, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
			"admin", hashedPassword, "admin", 1, gtime.Now(), gtime.Now())

		if err != nil {
			g.Log().Errorf(ctx, "创建默认管理员失败: %v", err)
		} else {
			g.Log().Info(ctx, "✅ 默认管理员已创建 - 用户名: admin, 密码: admin123")
			g.Log().Warning(ctx, "⚠️ 请登录后立即修改默认密码！")
		}
	}
}