// ============================================================================
// 关于我们页面
// ============================================================================

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'

function About() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-black">
      {/* 动态背景 - 和其他页面一致 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#DC143C]/20 rounded-full blur-[200px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFD700]/15 rounded-full blur-[180px]"></div>
      </div>

      {/* 导航栏 - 和其他页面一致 */}
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
                  item.to === '/about' 
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
            <span className="text-[#FFD700] text-sm font-black tracking-[0.3em] uppercase">About Us</span>
            <h1 className="text-6xl font-black text-white mt-4 tracking-tight">{t('about.title')}</h1>
          </div>

          {/* 公司介绍 */}
          <section className="mb-16 p-8 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A]">
            <h2 className="text-2xl font-bold text-white mb-6">{t('about.companyIntro')}</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              {t('about.companyDesc')}
            </p>
          </section>

          {/* 发展历程 */}
          <section className="mb-16 p-8 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A]">
            <h2 className="text-2xl font-bold text-white mb-6">{t('about.history')}</h2>
            <div className="space-y-4">
              <div className="flex gap-6 items-center">
                <div className="w-24 text-[#DC143C] font-bold text-xl">2026.03</div>
                <div className="flex-1 h-px bg-[#2A2A2A]"></div>
                <div className="flex-1 text-gray-300">{t('about.historyItems.202603')}</div>
              </div>
            </div>
          </section>

          {/* 核心业务 */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">{t('about.businessScope')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: '🎬', title: t('about.services.aiDrama'), desc: t('about.services.aiDramaDesc'), color: 'from-[#DC143C] to-[#FF6B6B]' },
                { icon: '🎥', title: t('about.services.aiVideo'), desc: t('about.services.aiVideoDesc'), color: 'from-[#FFD700] to-[#FFA500]' },
                { icon: '🎨', title: t('about.services.aiImage'), desc: t('about.services.aiImageDesc'), color: 'from-[#8B5CF6] to-[#EC4899]' },
                { icon: '💻', title: t('about.services.website'), desc: t('about.services.websiteDesc'), color: 'from-[#06B6D4] to-[#3B82F6]' },
              ].map((item) => (
                <div key={item.title} className="group p-6 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#DC143C]/50 transition-all duration-500 hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-500`}>
                    {item.icon}
                  </div>
                  <div className="text-white font-bold mb-2">{item.title}</div>
                  <div className="text-gray-400 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 联系我们 */}
          <section className="p-8 rounded-2xl bg-gradient-to-r from-[#DC143C]/10 to-[#FFD700]/10 border border-[#2A2A2A]">
            <h2 className="text-2xl font-bold text-white mb-6">{t('about.contactUs')}</h2>
            <div className="space-y-3 text-gray-300">
              <p>📍 {t('about.address')}</p>
              <p>📞 {t('about.phone')}</p>
              <p>📧 {t('about.email')}</p>
            </div>
          </section>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="relative py-12 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          {t('footer.copyright')}
        </div>
      </footer>
    </div>
  )
}

export default About