// ============================================================================
// 咨询管理页面
// ============================================================================
// 功能说明：
// 1. 用户咨询列表
// 2. 查看咨询详情
// 3. 标记处理状态
// ============================================================================

import { useState, useEffect } from 'react'
import { API_BASE } from '../../api/config'
import { getToken } from '../../api/auth'

interface Inquiry {
  id: number
  name: string
  contact: string
  content: string
  status: number
  created_at: string
}

function InquiriesManage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)

  // 获取认证请求头
  const getAuthHeaders = () => {
    const token = getToken()
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }

  const fetchInquiries = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/inquiries`, {
        headers: getAuthHeaders(),
      })
      const data = await res.json()
      if (data.code === 0) {
        setInquiries(data.data.list || [])
      } else if (data.code === 401) {
        alert('登录已过期，请重新登录')
        window.location.href = '/admin/login'
      }
    } catch (err) {
      console.error('获取咨询失败:', err)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  const handleStatusChange = async (id: number, status: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/inquiries/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (data.code === 0) {
        fetchInquiries()
      } else if (data.code === 401) {
        alert('登录已过期，请重新登录')
        window.location.href = '/admin/login'
      }
    } catch (err) {
      alert('操作失败')
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleString('zh-CN')
    } catch {
      return dateStr
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">咨询管理</h1>

      <div className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0D0D0D]">
            <tr>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">姓名</th>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">联系方式</th>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">内容</th>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">时间</th>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">状态</th>
              <th className="px-6 py-4 text-left text-gray-400 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">📭</span>
                    <span>暂无咨询</span>
                  </div>
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-t border-[#2A2A2A] hover:bg-[#2A2A2A]">
                  <td className="px-6 py-4 text-white font-medium">{inquiry.name}</td>
                  <td className="px-6 py-4 text-gray-400">{inquiry.contact || '-'}</td>
                  <td className="px-6 py-4">
                    <div 
                      onClick={() => setSelectedInquiry(inquiry)}
                      className="cursor-pointer text-gray-400 hover:text-white transition-colors"
                    >
                      <p className="line-clamp-2">{inquiry.content}</p>
                      <span className="text-[#DC143C] text-sm hover:underline">点击查看详情</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(inquiry.created_at)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      inquiry.status === 1 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {inquiry.status === 1 ? '已处理' : '待处理'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {inquiry.status === 0 && (
                      <button 
                        onClick={() => handleStatusChange(inquiry.id, 1)}
                        className="text-green-400 hover:underline cursor-pointer"
                      >
                        标记已处理
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 咨询详情弹窗 */}
      {selectedInquiry && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8"
          onClick={() => setSelectedInquiry(null)}
        >
          <div 
            className="bg-[#1A1A1A] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-[#2A2A2A]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="flex justify-between items-center p-6 border-b border-[#2A2A2A]">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedInquiry.name}</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {selectedInquiry.contact && `联系方式：${selectedInquiry.contact}`}
                </p>
              </div>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="text-gray-400 hover:text-white text-2xl cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            {/* 内容 */}
            <div className="p-6">
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedInquiry.status === 1 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {selectedInquiry.status === 1 ? '已处理' : '待处理'}
                </span>
                <span className="text-gray-500 text-sm ml-4">
                  {formatDate(selectedInquiry.created_at)}
                </span>
              </div>
              
              <div className="bg-[#0D0D0D] rounded-lg p-4">
                <h3 className="text-gray-400 text-sm mb-2">咨询内容</h3>
                <p className="text-white leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.content}
                </p>
              </div>
              
              {selectedInquiry.status === 0 && (
                <div className="mt-6">
                  <button 
                    onClick={() => {
                      handleStatusChange(selectedInquiry.id, 1)
                      setSelectedInquiry(null)
                    }}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-[#DC143C] to-[#FFD700] text-white font-medium hover:opacity-90 transition cursor-pointer"
                  >
                    标记为已处理
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InquiriesManage