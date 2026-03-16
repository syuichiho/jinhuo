// ============================================================================
// 控制器模块 - 文件上传
// ============================================================================
// 功能说明：
// 1. 处理文件上传请求
// 2. 验证文件类型和大小
// 3. 保存文件到服务器
// 4. 返回文件访问 URL
//
// 安全特性：
// 1. 文件类型白名单：只允许上传安全的文件类型
// 2. 文件大小限制：防止上传过大文件占用存储空间
// 3. 文件名处理：使用时间戳生成文件名，避免文件名冲突和路径遍历攻击
//
// 支持的文件类型：
// - 图片：jpg, jpeg, png, gif, webp, svg
// - 视频：mp4, webm
// - 文档：pdf（可选）
// ============================================================================

package controller

import (
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
)

// ============================================================================
// 上传控制器
// ============================================================================

// uploadController 文件上传控制器
type uploadController struct{}

// Upload 上传控制器实例
var Upload = uploadController{}

// ============================================================================
// 上传配置常量
// ============================================================================

// MaxFileSize 最大文件大小（10MB）
// 超过此大小的文件将被拒绝
const MaxFileSize = 10 * 1024 * 1024

// AllowedFileTypes 允许的文件类型（白名单）
// 只有这些后缀的文件才能上传
// 使用小写，匹配时忽略大小写
var AllowedFileTypes = map[string]bool{
	// 图片类型
	".jpg":  true,
	".jpeg": true,
	".png":  true,
	".gif":  true,
	".webp": true,
	".svg":  true,
	// 视频类型
	".mp4":  true,
	".webm": true,
	// 文档类型（可选）
	".pdf": true,
}

// ============================================================================
// 文件上传处理
// ============================================================================

// File 处理文件上传请求
// POST /api/admin/upload
// 需要认证
//
// 请求格式：multipart/form-data
// 参数：
//   - file: 上传的文件
//
// 返回：
//   - url: 文件访问 URL
//   - filename: 原始文件名
//
// 处理流程：
//  1. 检查是否有文件
//  2. 验证文件大小
//  3. 验证文件类型
//  4. 生成安全文件名
//  5. 保存文件
//  6. 返回访问 URL
func (c *uploadController) File(req *ghttp.Request) {
	// ----------------------------------------------------------------
	// 第一步：获取上传文件
	// ----------------------------------------------------------------
	uploadFile := req.GetUploadFile("file")
	if uploadFile == nil {
		req.Response.WriteJson(g.Map{
			"code":    400,
			"message": "请选择要上传的文件",
		})
		return
	}

	// ----------------------------------------------------------------
	// 第二步：验证文件大小
	// ----------------------------------------------------------------
	// 获取文件大小（字节数）
	fileSize := uploadFile.Size
	if fileSize > MaxFileSize {
		req.Response.WriteJson(g.Map{
			"code":    400,
			"message": "文件大小超过限制（最大10MB）",
		})
		return
	}

	// ----------------------------------------------------------------
	// 第三步：验证文件类型
	// ----------------------------------------------------------------
	ext := strings.ToLower(filepath.Ext(uploadFile.Filename))
	if ext == "" {
		req.Response.WriteJson(g.Map{
			"code":    400,
			"message": "无法识别文件类型",
		})
		return
	}

	// 检查是否在白名单中
	if !AllowedFileTypes[ext] {
		// 构建允许的类型列表用于错误提示
		allowedList := make([]string, 0, len(AllowedFileTypes))
		for k := range AllowedFileTypes {
			allowedList = append(allowedList, k)
		}
		req.Response.WriteJson(g.Map{
			"code":    400,
			"message": "不支持的文件类型，只允许上传图片和视频文件",
		})
		return
	}

	// ----------------------------------------------------------------
	// 第四步：准备上传目录
	// ----------------------------------------------------------------
	uploadDir := "./uploads"

	// 创建上传目录（如果不存在）
	// 权限 0755：所有者可读写执行，其他用户可读执行
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		req.Response.WriteJson(g.Map{
			"code":    500,
			"message": "创建上传目录失败",
		})
		return
	}

	// ----------------------------------------------------------------
	// 第五步：生成安全的文件名
	// ----------------------------------------------------------------
	// 使用时间戳生成唯一文件名
	// 格式：YYYYMMDDHHMMSS + 扩展名
	// 例如：20260315145230.jpg
	//
	// 为什么不用原始文件名？
	// 1. 避免文件名冲突
	// 2. 防止路径遍历攻击（如 ../../../malicious.jpg）
	// 3. 避免特殊字符导致的问题
	filename := time.Now().Format("20060102150405") + ext
	savePath := filepath.Join(uploadDir, filename)

	// ----------------------------------------------------------------
	// 第六步：保存文件
	// ----------------------------------------------------------------
	// 打开上传的临时文件
	src, err := uploadFile.Open()
	if err != nil {
		req.Response.WriteJson(g.Map{
			"code":    500,
			"message": "读取上传文件失败",
		})
		return
	}
	defer src.Close()

	// 创建目标文件
	dst, err := os.Create(savePath)
	if err != nil {
		req.Response.WriteJson(g.Map{
			"code":    500,
			"message": "创建目标文件失败",
		})
		return
	}
	defer dst.Close()

	// 复制文件内容
	if _, err := io.Copy(dst, src); err != nil {
		req.Response.WriteJson(g.Map{
			"code":    500,
			"message": "保存文件失败",
		})
		return
	}

	// ----------------------------------------------------------------
	// 第七步：返回文件 URL
	// ----------------------------------------------------------------
	fileUrl := "/uploads/" + filename
	req.Response.WriteJson(g.Map{
		"code": 0,
		"data": g.Map{
			"url":      fileUrl,
			"filename": uploadFile.Filename, // 返回原始文件名供前端显示
		},
	})
}