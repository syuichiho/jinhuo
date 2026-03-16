// ============================================================================
// 作品管理页面
// ============================================================================
// 功能说明：
// 1. 作品列表展示
// 2. 添加/编辑/删除作品
// 3. 文件上传（需认证）
//
// 安全说明：
// - 所有 API 请求都需要携带 JWT Token
// - Token 从 localStorage 获取
// ============================================================================

import { useState, useEffect } from 'react'
import { API_BASE } from '../../api/config'
import { getToken } from '../../api/auth'

interface Work {
  id: number
  title: string
  description: string
  type: string
  file_url: string
  thumbnail: string
  status: number
}

function WorksManage() {
  const [works, setWorks] = useState<Work[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingWork, setEditingWork] = useState<Work | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ai-drama',
    file_url: '',
    thumbnail: '',
  })
  const [uploading, setUploading] = useState(false)
  const [previewWork, setPreviewWork] = useState<Work | null>(null)

  /**
   * 获取认证请求头
   * 包含 JWT Token
   */
  const getAuthHeaders = () => {
    const token = getToken()
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }

  /**
   * 获取作品列表
   */
  const fetchWorks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/works`, {
        headers: getAuthHeaders(),
      })
      const data = await res.json()
      if (data.code === 0) {
        setWorks(data.data.list || [])
      } else if (data.code === 401) {
        alert('登录已过期，请重新登录')
        window.location.href = '/admin/login'
      }
    } catch (err) {
      console.error('获取作品失败:', err)
    }
  }

  useEffect(() => {
    fetchWorks()
  }, [])

  /**
   * 文件上传
   * 注意：上传接口也需要认证
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'file_url' | 'thumbnail') => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    
    try {
      const uploadedUrls: string[] = []
      const token = getToken()
      
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData()
        fd.append('file', files[i])
        
        const res = await fetch(`${API_BASE}/api/admin/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: fd,
        })
        const data = await res.json()
        if (data.code === 0) {
          uploadedUrls.push(data.data.url)
        } else if (data.code === 401) {
          alert('登录已过期，请重新登录')
          window.location.href = '/admin/login'
          return
        } else {
          alert('上传失败：' + data.message)
        }
      }
      
      if (uploadedUrls.length > 0) {
        const newValue = field === 'file_url' && uploadedUrls.length > 1 
          ? uploadedUrls.join(',') 
          : uploadedUrls[0]
        
        setFormData({ ...formData, [field]: newValue })
        alert(`成功上传 ${uploadedUrls.length} 个文件！`)
      }
    } catch (err) {
      alert('上传失败')
    }
    setUploading(false)
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', type: 'ai-drama', file_url: '', thumbnail: '' })
    setEditingWork(null)
  }

  /**
   * 添加作品
   */
  const handleAdd = async () => {
    if (!formData.title) {
      alert('请输入标题')
      return
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/works`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.code === 0) {
        alert('添加成功！')
        setShowModal(false)
        resetForm()
        fetchWorks()
      } else if (data.code === 401) {
        alert('登录已过期，请重新登录')
        window.location.href = '/admin/login'
      } else {
        alert('添加失败：' + data.message)
      }
    } catch (err) {
      alert('添加失败')
    }
  }

  const handleEdit = (work: Work) => {
    setEditingWork(work)
    setFormData({
      title: work.title,
      description: work.description,
      type: work.type,
      file_url: work.file_url,
      thumbnail: work.thumbnail,
    })
    setShowModal(true)
  }

  /**
   * 更新作品
   */
  const handleUpdate = async () => {
    if (!editingWork || !formData.title) {
      alert('请输入标题')
      return
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/works/${editingWork.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...formData, status: 1 }),
      })
      const data = await res.json()
      if (data.code === 0) {
        alert('更新成功！')
        setShowModal(false)
        resetForm()
        fetchWorks()
      } else if (data.code === 401) {
        alert('登录已过期，请重新登录')
        window.location.href = '/admin/login'
      } else {
        alert('更新失败：' + data.message)
      }
    } catch (err) {
      alert('更新失败')
    }
  }

  /**
   * 删除作品
   */
  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这个作品吗？')) return
    try {
      const res = await fetch(`${API_BASE}/api/admin/works/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      const data = await res.json()
      if (data.code === 0) {
        alert('删除成功！')
        fetchWorks()
      } else if (data.code === 401) {
        alert('登录已过期，请重新登录')
        window.location.href = '/admin/login'
      }
    } catch (err) {
      alert('删除失败')
    }
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'ai-drama': 'AI漫剧',
      'ai-video': 'AI广告视频',
      'ai-image': '图片生成',
      'website': '网站制作',
    }
    return types[type] || type
  }

  const getFileUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${API_BASE}${url}`
  }

  const getImageUrls = (url: string) => {
    if (!url) return []
    return url.split(',').map(u => getFileUrl(u.trim()))
  }

  const isVideo = (type: string, url: string) => {
    if (type === 'ai-video') return true
    if (url && url.includes('.mp4')) return true
    return false
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">作品管理</h1>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#DC143C] to-[#FF6B6B] text-white font-medium hover:from-[#DC143C] hover:to-[#FFD700] transition-all cursor-pointer"
        >
          + 添加作品
        </button>
      </div>

      <div className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0D0D0D]">
            <tr>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">标题</th>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">类型</th>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">预览</th>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {works.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">📭</span>
                    <span>暂无数据</span>
                  </div>
                </td>
              </tr>
            ) : (
              works.map((work) => {
                const images = getImageUrls(work.file_url)
                return (
                  <tr key={work.id} className="border-t border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    <td className="px-6 py-4 text-white">{work.title}</td>
                    <td className="px-6 py-4 text-gray-400">{getTypeLabel(work.type)}</td>
                    <td className="px-6 py-4">
                      {work.file_url ? (
                        <button onClick={() => setPreviewWork(work)} className="text-[#DC143C] hover:underline cursor-pointer">
                          {isVideo(work.type, work.file_url) ? '🎬 查看视频' : `🖼️ 查看${images.length > 1 ? `(${images.length}张)` : ''}`}
                        </button>
                      ) : (
                        <span className="text-gray-600">无文件</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEdit(work)} className="text-[#FFD700] hover:underline mr-4 cursor-pointer">编辑</button>
                      <button onClick={() => handleDelete(work.id)} className="text-red-400 hover:underline cursor-pointer">删除</button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 添加/编辑弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] rounded-2xl p-8 w-full max-w-lg border border-[#2A2A2A] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">{editingWork ? '编辑作品' : '添加作品'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">标题 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:border-[#DC143C] outline-none"
                  placeholder="请输入作品标题"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">类型</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white"
                >
                  <option value="ai-drama">AI漫剧</option>
                  <option value="ai-video">AI广告视频</option>
                  <option value="ai-image">图片生成</option>
                  <option value="website">网站制作</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white min-h-[100px]"
                  placeholder="请输入作品描述"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">作品文件（支持多选图片）</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'file_url')}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:bg-[#DC143C] file:text-white file:cursor-pointer"
                  disabled={uploading}
                />
                <p className="text-gray-500 text-xs mt-1">💡 按住 Ctrl 可多选图片</p>
                {formData.file_url && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getImageUrls(formData.file_url).map((url, i) => (
                      <img key={i} src={url} alt={`预览${i+1}`} className="w-20 h-20 object-cover rounded" />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-400 mb-2">缩略图（可选）</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'thumbnail')}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white file:bg-[#FFD700] file:text-black"
                  disabled={uploading}
                />
                {formData.thumbnail && (
                  <img src={getFileUrl(formData.thumbnail)} alt="缩略图" className="w-32 h-20 object-cover rounded mt-2" />
                )}
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 py-3 rounded-lg border border-[#2A2A2A] text-gray-400 hover:bg-[#2A2A2A] cursor-pointer">取消</button>
              <button 
                onClick={editingWork ? handleUpdate : handleAdd} 
                disabled={uploading}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#DC143C] to-[#FFD700] text-white font-medium cursor-pointer disabled:opacity-50"
              >
                {uploading ? '上传中...' : (editingWork ? '保存修改' : '确认添加')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 预览弹窗 */}
      {previewWork && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8" onClick={() => setPreviewWork(null)}>
          <div className="bg-[#1A1A1A] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-[#2A2A2A]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-[#2A2A2A]">
              <h2 className="text-2xl font-bold text-white">{previewWork.title}</h2>
              <button onClick={() => setPreviewWork(null)} className="text-gray-400 hover:text-white text-2xl cursor-pointer">✕</button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {isVideo(previewWork.type, previewWork.file_url) ? (
                <video src={getFileUrl(previewWork.file_url)} className="w-full rounded-lg" controls autoPlay />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {getImageUrls(previewWork.file_url).map((url, i) => (
                    <img key={i} src={url} alt={`${previewWork.title} ${i+1}`} className="w-full rounded-lg" />
                  ))}
                </div>
              )}
              <div className="mt-4">
                <span className="px-4 py-1 rounded-full bg-[#DC143C]/10 text-[#DC143C] text-sm">{getTypeLabel(previewWork.type)}</span>
              </div>
              <p className="text-gray-400 mt-4">{previewWork.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorksManage