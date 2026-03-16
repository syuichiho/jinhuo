# 烬火科技 - 公司官网项目需求文档

## 项目概述

**项目名称：** 烬火科技公司官网
**项目类型：** 企业展示网站 + 后台管理系统
**命名理念：** 红色+金色=火焰，黑色=灰烬。烬火，燃烧后的余火，象征不灭的创造力。

---

## 主营业务

| 服务 | 描述 |
|------|------|
| 🎬 **AI漫剧** | 智能生成动漫剧情，打造沉浸式视觉体验 |
| 🎥 **AI广告视频** | 一键生成专业级商业广告视频内容 |
| 🎨 **图片生成** | AI驱动的创意图像生成与设计服务 |
| 💻 **网站制作** | 定制化网站开发与数字化解决方案 |

---

## 设计规范

### 主色调
- **主色：** #DC143C (Crimson Red) - 红色
- **辅色：** #1A1A1A (Dark) - 黑色  
- **点缀：** #FFD700 (Gold) - 金色
- **背景：** #0D0D0D / #1A1A1A

### 设计风格
- 科技感 + 未来感
- 顶级大师级视觉设计
- 动态效果与交互体验
- 响应式设计（PC端为主）

---

## 技术栈

### 前端
- Vite + React 18 + TypeScript
- Tailwind CSS
- shadcn/ui 组件库
- React Router v6
- Framer Motion (动画)

### 后端
- Go 1.21+
- GoFrame 框架
- PostgreSQL
- JWT 认证

### 部署
- Docker
- Nginx (反向代理)

---

## 功能模块

### 一、前台展示（面向客户）

#### 页面结构

1. **首页**
   - 主营业务展示（AI漫剧、AI广告视频、图片生成、网站制作）
   - 公司核心亮点
   - 动态视觉效果
   - 快速导航

2. **作品展示**
   - AI漫剧作品
   - AI广告视频作品
   - 图片生成作品
   - 网站制作案例
   - 分类筛选

3. **资讯公告**
   - 公司动态
   - 公告通知
   - 文章列表

4. **关于我们**
   - 公司介绍
   - 公司历史
   - 业务范围
   - 联系地址

5. **联系我们**
   - 咨询表单
   - 联系方式

---

### 二、后台管理系统

需要登录认证，角色权限管理。

#### 功能模块

| 模块 | 功能 |
|------|------|
| 作品管理 | 增删改查作品 |
| 资讯管理 | 增删改查文章/公告 |
| 咨询管理 | 查看客户咨询 |
| 账号管理 | 管理员账号增删改 |
| 数据分析 | 访问统计、增长趋势 |

---

## 数据库设计

```sql
-- 管理员表
admins (id, username, password, role, status, created_at, updated_at)

-- 作品表
works (id, title, description, type, file_url, thumbnail, sort, status, created_at, updated_at)

-- 资讯表
articles (id, title, content, type, author, cover, published_at, status, created_at, updated_at)

-- 咨询表
inquiries (id, name, contact, content, status, created_at)

-- 访问记录表
visits (id, ip, path, user_agent, created_at)
```

---

## API 设计

### 前台 API
```
GET  /api/works          # 作品列表
GET  /api/works/:id      # 作品详情
GET  /api/articles       # 资讯列表
GET  /api/articles/:id   # 资讯详情
POST /api/inquiries      # 提交咨询
```

### 后台 API
```
POST   /api/admin/login      # 登录
GET    /api/admin/profile    # 当前用户信息
GET    /api/admin/works      # 作品管理
POST   /api/admin/works
PUT    /api/admin/works/:id
DELETE /api/admin/works/:id
GET    /api/admin/articles   # 资讯管理
POST   /api/admin/articles
PUT    /api/admin/articles/:id
DELETE /api/admin/articles/:id
GET    /api/admin/inquiries  # 咨询管理
GET    /api/admin/admins     # 账号管理
GET    /api/admin/dashboard  # 数据统计
```

---

## 开发计划

### Phase 1: 项目初始化 ✅
- [x] 前端项目初始化
- [x] 后端项目初始化
- [x] 数据库设计

### Phase 2: 前端开发 🔄
- [x] 首页设计
- [x] 作品展示页
- [x] 资讯公告页
- [x] 关于我们页
- [x] 联系我们页
- [x] 后台管理页面

### Phase 3: 后端开发
- [ ] 安装Go环境
- [ ] 完善API实现
- [ ] 数据库连接

### Phase 4: 完善与部署
- [ ] 前后端联调
- [ ] 测试
- [ ] 部署

---

## 团队分工

- 🦞 **小龙虾**：产品规划、需求文档、进度协调
- 🎨 **美工**：UI/UX 设计、视觉稿
- 💻 **图灵**：前后端代码实现

---

*文档版本：v3.0*
*最后更新：2026-03-11*