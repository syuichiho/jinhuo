import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'

const API_BASE = 'http://localhost:8080'

function Articles() {
  const { t } = useTranslation()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/articles`)
      const data = await res.json()
      if (data.code === 0) {
        setArticles(data.data.list || [])
      }
    } catch (err) {
      console.error('获取资讯失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('zh-CN')
    } catch {
      return dateStr
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* 动态背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#DC143C]/20 rounded-full blur-[200px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFD700]/15 rounded-full blur-[180px]"></div>
      </div>

      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#DC143C] via-[#FF6B6B] to-[#FFD700] rounded-xl rotate-12"></div>
              <div className="absolute inset-0 w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#DC143C] to-[#FFD700]">烬</span>
              </div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tighter">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DC143C] to-[#FFD700]">烬火</span>
                <span className="text-white">科技</span>
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-1">
            {[
              { to: '/', label: t('nav.home') },
              { to: '/works', label: t('nav.works') },
              { to: '/articles', label: t('nav.articles') },
              { to: '/about', label: t('nav.about') },
              { to: '/contact', label: t('nav.contact') },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-5 py-2 font-medium rounded-lg transition-all duration-300 cursor-pointer ${
                  item.to === '/articles' 
                    ? 'text-white bg-white/10' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="ml-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#FFD700] text-sm font-black tracking-[0.3em] uppercase">News</span>
            <h1 className="text-6xl font-black text-white mt-4 tracking-tight">{t('articles.title')}</h1>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-20">
              <span className="text-4xl">⏳</span>
              <p className="mt-4">{t('articles.loading')}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              <span className="text-6xl">📭</span>
              <p className="mt-4">{t('articles.noArticles')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div 
                  key={article.id} 
                  onClick={() => setSelectedArticle(article)}
                  className="group p-6 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#DC143C]/50 transition-all duration-500 cursor-pointer"
                >
                  <div className="flex gap-6">
                    {article.cover && (
                      <div className="w-40 h-28 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={article.cover.startsWith('http') ? article.cover : `${API_BASE}${article.cover}`} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-[#DC143C]/10 text-[#DC143C] text-xs">
                          {article.type === 'news' ? t('articles.news') : t('articles.announcement')}
                        </span>
                        <span className="text-gray-500 text-sm">{formatDate(article.created_at)}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#DC143C] transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {article.content}
                      </p>
                      <p className="text-gray-500 text-xs mt-2 group-hover:text-gray-400 transition-colors">
                        {t('articles.viewDetail')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 资讯详情弹窗 */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="bg-[#1A1A1A] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#2A2A2A]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-[#2A2A2A] sticky top-0 bg-[#1A1A1A]">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#DC143C]/10 text-[#DC143C] text-xs mr-3">
                  {selectedArticle.type === 'news' ? t('articles.news') : t('articles.announcement')}
                </span>
                <span className="text-gray-500 text-sm">{formatDate(selectedArticle.created_at)}</span>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="text-gray-400 hover:text-white text-2xl cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">{selectedArticle.title}</h2>
              
              {selectedArticle.cover && (
                <img 
                  src={selectedArticle.cover.startsWith('http') ? selectedArticle.cover : `${API_BASE}${selectedArticle.cover}`}
                  alt={selectedArticle.title}
                  className="w-full rounded-lg mb-6"
                />
              )}
              
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {selectedArticle.content}
              </div>
              
              {selectedArticle.author && (
                <div className="mt-6 pt-6 border-t border-[#2A2A2A] text-gray-500 text-sm">
                  {t('articles.author')}：{selectedArticle.author}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 页脚 */}
      <footer className="relative py-12 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          {t('footer.copyright')}
        </div>
      </footer>
    </div>
  )
}

export default Articles