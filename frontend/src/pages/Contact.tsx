import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'

function Contact() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', contact: '', content: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.name || !form.content) {
      alert(t('contact.fillRequired'))
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('http://localhost:8080/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.code === 0) {
        alert(t('contact.success'))
        setForm({ name: '', contact: '', content: '' })
      } else {
        alert(t('contact.failed') + data.message)
      }
    } catch (err) {
      alert(t('contact.retry'))
    }
    setSubmitting(false)
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
                  item.to === '/contact' 
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#FFD700] text-sm font-black tracking-[0.3em] uppercase">Contact</span>
            <h1 className="text-6xl font-black text-white mt-4 tracking-tight">{t('contact.title')}</h1>
          </div>

          <div className="p-8 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">{t('contact.name')} {t('contact.required')}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:border-[#DC143C] focus:outline-none transition-colors"
                  placeholder={t('contact.namePlaceholder')}
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">{t('contact.contactInfo')}</label>
                <input
                  type="text"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:border-[#DC143C] focus:outline-none transition-colors"
                  placeholder={t('contact.contactPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">{t('contact.content')} {t('contact.required')}</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:border-[#DC143C] focus:outline-none transition-colors min-h-[150px] resize-none"
                  placeholder={t('contact.contentPlaceholder')}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#DC143C] to-[#FFD700] hover:from-[#DC143C] hover:via-[#FF6B6B] hover:to-[#FFD700] text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
              >
                {submitting ? t('contact.submitting') : t('contact.submit')}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-gray-500">
            <p>📍 日本石川县志贺町</p>
            <p>📧 contact@jinhuo.tech</p>
          </div>
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

export default Contact