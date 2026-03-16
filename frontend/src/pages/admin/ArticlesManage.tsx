// ============================================================================
// 资讯管理页面
// ============================================================================
// 功能说明：
// 1. 资讯列表展示
// 2. 添加/编辑/删除资讯
// 3. 封面图片上传
// ============================================================================

import { useState, useEffect } from 'react'
import { API_BASE } from '../../api/config'
import { getToken } from '../../api/auth'

interface Article {
  id: number
  title: string
  content: string
  type: string
  author: string
  cover: string
  status: number
  created_at: string
}

function ArticlesManage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'news',
    author: '',
    cover: '',
  })
  const [uploading, setUploading] = useState(false)

  // 获取认证请求头
  const getAuthHeaders = () => {
    const token = getToken()
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/articles`, {
        headers: getAuthHeaders(),
      })
      const data = await res.json()
      if (data.code === 0) {
        setArticles(data.data.list || [])
      } else if (data.code === 401) {
        alert('登录已过期，请重新登录')
        window.location.href = '/admin/login'
      }
    } catch (err) {
      console.error('获取资讯失败:', err)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const token = getToken()

    try {
      const res = await fetch(`${API_BASE}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: fd,
      })
      const data = await res.json()
      if (data.code === 0) {
        setFormData({ ...formData, cover: data.data.url })
        alert('上传成功！')
      } else if (data.code === 401) {
        alert('登录已过期，请重新登录')
        window.location.href = '/admin/login'
      } else {
        alert('上传失败：' + data.message)
      }
    } catch (err) {
      alert('上传失败')
    }
    setUploading(false)
  }

  const resetForm = () => {
    setFormData({ title: '', content: '', type: 'news', author: '', cover: '' })
    setEditingArticle(null)
  }

  const handleAdd = async () => {
    if (!formData.title) {
      alert('请输入标题')
      return
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/articles`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...formData, status: 1 }),
      })
      const data = await res.json()
      if (data.code === 0) {
        alert('添加成功！')
        setShowModal(false)
        resetForm()
        fetchArticles()
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

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      content: article.content,
      type: article.type,
      author: article.author || '',
      cover: article.cover || '',
    })
    setShowModal(true)
  }

  const handleUpdate = async () => {
    if (!editingArticle || !formData.title) {
      alert('请输入标题')
      return
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/articles/${editingArticle.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...formData, status: 1 }),
      })
      const data = await res.json()
      if (data.code === 0) {
        alert('更新成功！')
        setShowModal(false)
        resetForm()
        fetchArticles()
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

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除？')) return
    try {
      const res = await fetch(`${API_BASE}/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      const data = await res.json()
      if (data.code === 0) {
        alert('删除成功！')
        fetchArticles()
      } else if (data.code === 401) {
        alert('登录已过期，请重新登录')
        window.location.href = '/admin/login'
      }
    } catch (err) {
      alert('删除失败')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">资讯管理</h1>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#DC143C] to-[#FF6B6B] text-white font-medium hover:from-[#DC143C] hover:to-[#FFD700] transition-all cursor-pointer"
        >
          + 添加资讯
        </button>
      </div>

      <div className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0D0D0D]">
            <tr>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">标题</th>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">类型</th>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">封面</th>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">📭</span>
                    <span>暂无数据</span>
                  </div>
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="border-t border-[#2A2A2A] hover:bg-[#2A2A2A]">
                  <td className="px-6 py-4 text-white">{article.title}</td>
                  <td className="px-6 py-4 text-gray-400">{article.type === 'news' ? '新闻' : '公告'}</td>
                  <td className="px-6 py-4">
                    {article.cover ? (
                      <img 
                        src={article.cover.startsWith('http') ? article.cover : `${API_BASE}${article.cover}`}
                        alt={article.title}
                        className="w-20 h-14 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-600">无封面</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleEdit(article)} 
                      className="text-[#FFD700] hover:underline mr-4 cursor-pointer"
                    >
                      编辑
                    </button>
                    <button onClick={() => handleDelete(article.id)} className="text-red-400 hover:underline cursor-pointer">删除</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 添加/编辑弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] rounded-2xl p-8 w-full max-w-2xl border border-[#2A2A2A] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">{editingArticle ? '编辑资讯' : '添加资讯'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">标题 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:border-[#DC143C] outline-none"
                  placeholder="请输入标题"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-400 mb-2">类型</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white"
                  >
                    <option value="news">新闻</option>
                    <option value="notice">公告</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-400 mb-2">作者</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white"
                    placeholder="作者名称"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">封面图片</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:bg-[#DC143C] file:text-white file:cursor-pointer"
                  disabled={uploading}
                />
                {formData.cover && (
                  <div className="mt-2">
                    <img 
                      src={formData.cover.startsWith('http') ? formData.cover : `${API_BASE}${formData.cover}`}
                      alt="封面预览"
                      className="w-40 h-28 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">内容 *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white min-h-[200px]"
                  placeholder="请输入内容"
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 py-3 rounded-lg border border-[#2A2A2A] text-gray-400 hover:bg-[#2A2A2A] cursor-pointer">取消</button>
              <button 
                onClick={editingArticle ? handleUpdate : handleAdd} 
                disabled={uploading}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#DC143C] to-[#FFD700] text-white font-medium cursor-pointer disabled:opacity-50"
              >
                {uploading ? '上传中...' : (editingArticle ? '保存修改' : '确认添加')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArticlesManage