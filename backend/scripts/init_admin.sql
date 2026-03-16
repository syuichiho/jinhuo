-- ============================================================================
-- 数据库初始化脚本
-- ============================================================================
-- 功能说明：
-- 创建默认的管理员账户
--
-- 默认账户信息：
-- 用户名：admin
-- 密码：admin123
--
-- 安全说明：
-- 密码使用 bcrypt 加密，下面是 "admin123" 的哈希值
-- 登录后请立即修改密码！
-- ============================================================================

-- 插入默认管理员
-- 如果用户名已存在则跳过
INSERT INTO admins (username, password, role, status)
VALUES (
    'admin',
    -- bcrypt hash of "admin123" (cost=10)
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.eG1W8qBWeHlO9B7Y1W',
    'admin',
    1
) ON CONFLICT (username) DO NOTHING;

-- 查询确认
SELECT id, username, role, status FROM admins;