// ============================================================================
// 账号管理页面
// ============================================================================
// 功能说明：
// 1. 管理员账号列表
// 2. 添加/编辑/删除账号
// 3. 修改密码
// ============================================================================

import { useState, useEffect } from 'react'
import { API_BASE } from '../../api/config'
import { getToken, getUser } from '../../api/auth'

interface Admin {
  id: number
  username: string
  role: string
  status: number
  created_at: string
}

function AdminsManage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'admin',
  })

  // 当前登录用户
  const currentUser = getUser()

  // 获取认证请求头
  const getAuthHeaders = () => {
    const token = getToken()
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }

  // 获取管理员列表
  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/admins`, {
        headers: getAuthHeaders(),
      })
      const data = await res.json()
      if (data.code === 0) {
        setAdmins(data.data.list || [])
      } else if (data.code === 401) {
        alert('登录已过期，请重新登录')
        window.location.href = '/admin/login'
      }
    } catch (err) {
      console.error('获取管理员列表失败:', err)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const resetForm = () => {
    setFormData({ username: '', password: '', role: 'admin' })
    setEditingAdmin(null)
  }

  // 添加管理员
  const handleAdd = async () => {
    if (!formData.username || !formData.password) {
      alert('请填写用户名和密码')
      return
    }
    if (formData.password.length < 6) {
      alert('密码至少6位')
      return
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/admins`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.code === 0) {
        alert('添加成功！')
        setShowModal(false)
        resetForm()
        fetchAdmins()
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

  // 编辑管理员
  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin)
    setFormData({
      username: admin.username,
      password: '', // 密码留空，不修改则不填
      role: admin.role,
    })
    setShowModal(true)
  }

  // 更新管理员
  const handleUpdate = async () => {
    if (!editingAdmin || !formData.username) {
      alert('请填写用户名')
      return
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/admins/${editingAdmin.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          username: formData.username,
          password: formData.password || undefined, // 密码为空则不修改
          role: formData.role,
          status: 1,
        }),
      })
      const data = await res.json()
      if (data.code === 0) {
        alert('更新成功！')
        setShowModal(false)
        resetForm()
        fetchAdmins()
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

  // 删除管理员
  const handleDelete = async (id: number, username: string) => {
    // 不能删除自己
    if (username === currentUser?.username) {
      alert('不能删除自己的账号！')
      return
    }
    if (!confirm('确定删除这个管理员吗？')) return
    try {
      const res = await fetch(`${API_BASE}/api/admin/admins/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      const data = await res.json()
      if (data.code === 0) {
        alert('删除成功！')
        fetchAdmins()
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
        <h1 className="text-3xl font-bold text-white">账号管理</h1>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#DC143C] to-[#FF6B6B] text-white font-medium hover:from-[#DC143C] hover:to-[#FFD700] transition-all cursor-pointer"
        >
          + 添加账号
        </button>
      </div>

      <div className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0D0D0D]">
            <tr>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">用户名</th>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">角色</th>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">状态</th>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">📭</span>
                    <span>暂无数据</span>
                  </div>
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id} className="border-t border-[#2A2A2A] hover:bg-[#2A2A2A]">
                  <td className="px-6 py-4 text-white font-medium">
                    {admin.username}
                    {admin.username === currentUser?.username && (
                      <span className="ml-2 text-xs text-[#DC143C]">（当前）</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{admin.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      admin.status === 1 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {admin.status === 1 ? '正常' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleEdit(admin)}
                      className="text-[#FFD700] hover:underline mr-4 cursor-pointer"
                    >
                      编辑
                    </button>
                    {admin.username !== currentUser?.username && (
                      <button 
                        onClick={() => handleDelete(admin.id, admin.username)}
                        className="text-red-400 hover:underline cursor-pointer"
                      >
                        删除
                      </button>
                    )}
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
          <div className="bg-[#1A1A1A] rounded-2xl p-8 w-full max-w-md border border-[#2A2A2A]">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingAdmin ? '编辑账号' : '添加账号'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">用户名 *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:border-[#DC143C] outline-none"
                  placeholder="请输入用户名"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">
                  密码 {editingAdmin ? '（留空不修改）' : '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white focus:border-[#DC143C] outline-none"
                  placeholder={editingAdmin ? '留空则不修改密码' : '请输入密码（至少6位）'}
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">角色</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white"
                >
                  <option value="admin">管理员</option>
                  <option value="editor">编辑</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => { setShowModal(false); resetForm(); }} 
                className="flex-1 py-3 rounded-lg border border-[#2A2A2A] text-gray-400 hover:bg-[#2A2A2A] cursor-pointer"
              >
                取消
              </button>
              <button 
                onClick={editingAdmin ? handleUpdate : handleAdd} 
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#DC143C] to-[#FFD700] text-white font-medium cursor-pointer"
              >
                {editingAdmin ? '保存修改' : '确认添加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminsManage