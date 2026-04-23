'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Fornecedores', href: '/fornecedores' },
  { label: 'Profissionais', href: '/profissionais' },
  { label: 'Notícias',     href: '/informativos' },
  { label: 'Empresas',     href: '/empresas' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100'
        : 'bg-white/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src="/logo-horizontal.png"
              alt="AcheiSST"
              className="h-14 w-auto object-contain"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={`transition-colors hover:text-navy-600 ${
                  pathname === href ? 'text-navy-600 font-semibold' : ''
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/painel/login"
              className="bg-navy-600 hover:bg-navy-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Entrar
            </a>
          </div>

          {/* Mobile button */}
          <button
            className="md:hidden p-2 text-slate-700 hover:text-navy-600 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 flex flex-col gap-3 text-sm font-medium text-slate-700">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={href} href={href} className="py-1.5 hover:text-navy-600 transition-colors">
                {label}
              </a>
            ))}
            <div className="pt-2">
              <a
                href="/painel/login"
                className="block text-center bg-navy-600 text-white font-bold py-3 rounded-xl hover:bg-navy-700 transition-colors"
              >
                Entrar
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
