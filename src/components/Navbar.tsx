'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, UserCircle2, LogOut, LayoutDashboard, ChevronDown, Sparkles } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const NAV_LINKS = [
  { label: 'Profissionais', href: '/profissionais'            },
  { label: 'Clínicas',      href: '/fornecedores?cat=clinica' },
  { label: 'Fornecedores',  href: '/fornecedores'             },
  { label: 'Notícias',      href: '/informativos'             },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
          <a href="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo-horizontal.png"
              alt="AcheiSST"
              className="h-14 w-48 object-contain"
            />
          </a>

          {/* Desktop Nav — Centered */}
          <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8 text-sm font-medium text-slate-600">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={`transition-colors hover:text-green-600 ${
                  pathname === href ? 'text-green-600 font-semibold' : ''
                }`}
              >
                {label}
              </a>
            ))}
            <a
              href="/planos"
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              Assine
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
                >
                  <UserCircle2 className="w-4 h-4" />
                  Minha conta
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                    <p className="px-4 py-2 text-xs text-slate-400 truncate border-b border-slate-100">
                      {user.email}
                    </p>
                    <a
                      href="/painel"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Painel
                    </a>
                    <button
                      onClick={() => { signOut(); setDropdownOpen(false) }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a
                  href="/painel/login"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Entrar
                </a>
                <a
                  href="/planos"
                  className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors"
                >
                  Cadastrar
                </a>
              </>
            )}
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
              <a key={href} href={href} className="py-1.5 hover:text-green-600 transition-colors">
                {label}
              </a>
            ))}
            <a href="/planos" className="py-1.5 text-amber-500 font-semibold hover:text-amber-600 transition-colors">
              ✨ Assine
            </a>
            {user ? (
              <>
                <a href="/painel" className="py-1.5 text-green-600 font-semibold hover:text-green-700 transition-colors">
                  Minha conta
                </a>
                <button onClick={signOut} className="py-1.5 text-red-500 hover:text-red-600 transition-colors text-left">
                  Sair
                </button>
              </>
            ) : (
              <>
                <a href="/painel/login" className="py-1.5 hover:text-navy-600 transition-colors">Entrar</a>
                <a href="/planos" className="py-1.5 text-green-600 font-semibold hover:text-green-700 transition-colors">Cadastrar</a>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
