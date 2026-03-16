import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'

function Home() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* 动态背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#DC143C]/30 rounded-full blur-[200px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#FFD700]/20 rounded-full blur-[180px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-[#DC143C]/10 to-transparent rounded-full"></div>
      </div>

      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="backdrop-blur-2xl bg-black/40 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[#DC143C] via-[#FF6B6B] to-[#FFD700] rounded-xl rotate-12 animate-spin-slow"></div>
                <div className="absolute inset-0 w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#DC143C] to-[#FFD700]">烬</span>
                </div>
              </div>
              <div>
                <span className="text-2xl font-black tracking-tighter">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DC143C] via-[#FF6B6B] to-[#FFD700]">烬火</span>
                  <span className="text-white">科技</span>
                </span>
                <div className="text-[10px] text-gray-500 tracking-widest uppercase">{t('home.tagline')}</div>
              </div>
            </div>
            
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
                  className="px-5 py-2 text-gray-400 font-medium hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
                >
                  {item.label}
                </Link>
              ))}
              <div className="ml-4">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero区域 */}
      <section className="relative min-h-screen flex items-center justify-center px-8">
        <div className="text-center relative z-10">
          {/* 标签 */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-[#DC143C]/30 bg-[#DC143C]/5 backdrop-blur-sm">
            <div className="w-2 h-2 bg-[#DC143C] rounded-full animate-pulse"></div>
            <span className="text-[#FFD700] text-xs font-bold tracking-[0.3em] uppercase">AI-Powered Creative Studio</span>
          </div>

          {/* 主标题 */}
          <h1 className="text-[120px] font-black leading-none tracking-tighter mb-4">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#DC143C] via-[#FF6B6B] to-[#FFD700] animate-gradient">
              {t('home.heroTitle1')}
            </span>
            <span className="block text-white/90">{t('home.heroTitle2')}</span>
          </h1>

          <p className="text-2xl text-gray-400 font-light tracking-wide mb-2">
            {t('home.heroSubtitle')}
          </p>
          
          <p className="text-gray-500 max-w-xl mx-auto mb-12 leading-relaxed">
            {t('home.heroDesc')}
          </p>

          {/* CTA按钮 */}
          <div className="flex gap-4 justify-center">
            <Link
              to="/works"
              className="group relative px-10 py-4 rounded-2xl font-bold text-white overflow-hidden transition-transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#DC143C] via-[#FF6B6B] to-[#FFD700] animate-gradient-x"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#DC143C] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center gap-2">
                {t('home.exploreWorks')}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              to="/contact"
              className="px-10 py-4 rounded-2xl font-bold text-white border-2 border-white/20 hover:border-[#FFD700] hover:bg-[#FFD700]/10 transition-all duration-300"
            >
              {t('home.startCollaboration')}
            </Link>
          </div>
        </div>

        {/* 滚动提示 */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs tracking-widest uppercase">{t('home.scroll')}</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-gray-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* 服务区域 */}
      <section className="relative py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[#FFD700] text-sm font-black tracking-[0.3em] uppercase">Our Services</span>
            <h2 className="text-6xl font-black text-white mt-4 tracking-tight">{t('home.servicesTitle')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🎬',
                title: t('home.services.aiDrama'),
                desc: t('home.services.aiDramaDesc'),
                color: 'from-[#DC143C] to-[#FF6B6B]',
              },
              {
                icon: '🎥',
                title: t('home.services.aiVideo'),
                desc: t('home.services.aiVideoDesc'),
                color: 'from-[#FFD700] to-[#FFA500]',
              },
              {
                icon: '🎨',
                title: t('home.services.aiImage'),
                desc: t('home.services.aiImageDesc'),
                color: 'from-[#8B5CF6] to-[#EC4899]',
              },
              {
                icon: '💻',
                title: t('home.services.website'),
                desc: t('home.services.websiteDesc'),
                color: 'from-[#06B6D4] to-[#3B82F6]',
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="group relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-b-3xl`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 特色区域 */}
      <section className="relative py-32 px-8 bg-gradient-to-b from-transparent via-[#DC143C]/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[#FFD700] text-sm font-black tracking-[0.3em] uppercase">Why Us</span>
            <h2 className="text-6xl font-black text-white mt-4 tracking-tight">{t('home.whyUs')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: t('home.reasons.tech'),
                desc: t('home.reasons.techDesc'),
              },
              {
                number: '02',
                title: t('home.reasons.creative'),
                desc: t('home.reasons.creativeDesc'),
              },
              {
                number: '03',
                title: t('home.reasons.fast'),
                desc: t('home.reasons.fastDesc'),
              },
            ].map((item) => (
              <div key={item.number} className="group p-8 rounded-3xl border border-white/10 hover:border-[#DC143C]/50 transition-all duration-500">
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#DC143C] to-[#FFD700] opacity-20 group-hover:opacity-40 transition-opacity mb-4">
                  {item.number}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="relative py-16 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#DC143C] to-[#FFD700] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">烬</span>
              </div>
              <span className="text-white font-bold text-xl">烬火科技</span>
            </div>
            
            <div className="flex gap-8 text-gray-500 text-sm">
              <Link to="/works" className="hover:text-white transition-colors">{t('footer.works')}</Link>
              <Link to="/articles" className="hover:text-white transition-colors">{t('footer.articles')}</Link>
              <Link to="/about" className="hover:text-white transition-colors">{t('footer.about')}</Link>
              <Link to="/contact" className="hover:text-white transition-colors">{t('footer.contact')}</Link>
            </div>
            
            <div className="text-gray-600 text-sm">
              {t('footer.copyright')}
            </div>
          </div>
        </div>
      </footer>

      {/* 动画样式 */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Home