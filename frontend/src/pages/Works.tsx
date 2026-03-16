import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'

interface Work {
  id: number
  title: string
  description: string
  type: string
  file_url: string
  thumbnail: string
}

const API_BASE = 'http://localhost:8080'

function Works() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('all')
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const categories = [
    { id: 'all', label: t('works.all') },
    { id: 'ai-drama', label: t('works.aiDrama') },
    { id: 'ai-video', label: t('works.aiVideo') },
    { id: 'ai-image', label: t('works.aiImage') },
    { id: 'website', label: t('works.website') },
  ]

  const fetchWorks = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/works`)
      const data = await res.json()
      if (data.code === 0) {
        setWorks(data.data.list || [])
      }
    } catch (err) {
      console.error('获取作品失败:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorks()
  }, [])

  const filteredWorks = activeCategory === 'all' 
    ? works 
    : works.filter(work => work.type === activeCategory)

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'ai-drama': t('works.types.ai-drama'),
      'ai-video': t('works.types.ai-video'),
      'ai-image': t('works.types.ai-image'),
      'website': t('works.types.website'),
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
    return url.split(',').map(u => getFileUrl(u.trim())).filter(u => u)
  }

  const isVideo = (type: string, url: string) => {
    if (type === 'ai-video') return true
    if (url && url.includes('.mp4')) return true
    return false
  }

  const handleWorkClick = (work: Work) => {
    setSelectedWork(work)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedWork) {
      const images = getImageUrls(selectedWork.file_url)
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (selectedWork) {
      const images = getImageUrls(selectedWork.file_url)
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* 动态背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#DC143C]/20 rounded-full blur-[200px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#FFD700]/15 rounded-full blur-[180px]"></div>
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
                  item.to === '/works' 
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

      {/* 主内容 */}
      <main className="relative pt-32 px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#FFD700] text-sm font-black tracking-[0.3em] uppercase">Portfolio</span>
            <h1 className="text-6xl font-black text-white mt-4 tracking-tight">{t('works.title')}</h1>
            <p className="text-gray-500 mt-4">{t('works.subtitle')}</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-[#DC143C] to-[#FFD700] text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-20">
              <span className="text-4xl">⏳</span>
              <p className="mt-4">{t('works.loading')}</p>
            </div>
          ) : filteredWorks.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              <span className="text-6xl">📭</span>
              <p className="mt-4">{t('works.noWorks')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorks.map((work) => {
                const images = getImageUrls(work.file_url)
                const thumbnailUrl = getFileUrl(work.thumbnail)
                const video = isVideo(work.type, work.file_url)
                
                return (
                  <div
                    key={work.id}
                    onClick={() => handleWorkClick(work)}
                    className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-[#DC143C]/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                  >
                    <div className="aspect-[4/3] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
                      {work.file_url ? (
                        video ? (
                          <div className="relative w-full h-full">
                            <video src={getFileUrl(work.file_url)} poster={thumbnailUrl} className="w-full h-full object-cover" preload="metadata" muted />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : images.length > 1 ? (
                          <div className="relative w-full h-full">
                            <img src={thumbnailUrl || images[0]} alt={work.title} className="w-full h-full object-cover" loading="lazy" />
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {images.length}
                            </div>
                          </div>
                        ) : (
                          <img src={thumbnailUrl || images[0]} alt={work.title} className="w-full h-full object-cover" loading="lazy" />
                        )
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-[#DC143C]/20 to-[#FFD700]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <span className="text-6xl opacity-20 group-hover:opacity-40 transition-opacity">🎨</span>
                        </>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[#DC143C] bg-[#DC143C]/10 px-3 py-1 rounded-full">
                          {getTypeLabel(work.type)}
                        </span>
                        {images.length > 1 && <span className="text-xs text-gray-500">{t('works.viewAll')}</span>}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#DC143C] group-hover:to-[#FFD700] transition-all">
                        {work.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{work.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* 作品详情弹窗 */}
      {selectedWork && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8" onClick={() => setSelectedWork(null)}>
          <div className="bg-[#1A1A1A] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-[#2A2A2A]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-[#2A2A2A]">
              <h2 className="text-2xl font-bold text-white">{selectedWork.title}</h2>
              <button onClick={() => setSelectedWork(null)} className="text-gray-400 hover:text-white text-2xl cursor-pointer">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {isVideo(selectedWork.type, selectedWork.file_url) ? (
                <video src={getFileUrl(selectedWork.file_url)} className="w-full rounded-lg" controls autoPlay />
              ) : (
                (() => {
                  const images = getImageUrls(selectedWork.file_url)
                  return (
                    <div className="relative">
                      {/* 图片显示 */}
                      <img 
                        src={images[currentImageIndex] || getFileUrl(selectedWork.thumbnail)} 
                        alt={selectedWork.title}
                        className="w-full rounded-lg"
                      />
                      
                      {/* 多图导航 */}
                      {images.length > 1 && (
                        <>
                          {/* 上一张按钮 */}
                          <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          
                          {/* 下一张按钮 */}
                          <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          
                          {/* 底部指示器 */}
                          <div className="flex justify-center gap-2 mt-4">
                            {images.map((_, i) => (
                              <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                                  i === currentImageIndex 
                                    ? 'bg-[#DC143C] w-6' 
                                    : 'bg-gray-600 hover:bg-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                          
                          {/* 图片计数 */}
                          <p className="text-center text-gray-400 text-sm mt-2">
                            {currentImageIndex + 1} / {images.length}
                          </p>
                        </>
                      )}
                    </div>
                  )
                })()
              )}
              
              <div className="mt-4">
                <span className="px-4 py-1 rounded-full bg-[#DC143C]/10 text-[#DC143C] text-sm">
                  {getTypeLabel(selectedWork.type)}
                </span>
              </div>
              <p className="text-gray-400 mt-4 leading-relaxed">{selectedWork.description}</p>
            </div>
          </div>
        </div>
      )}

      <footer className="relative py-12 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          {t('footer.copyright')}
        </div>
      </footer>
    </div>
  )
}

export default Works