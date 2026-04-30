"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, UserCircle2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logoText from "@/assets/acheisst-logo-text.png";

const navItems = [
  { label: "Profissionais", to: "/profissionais"            },
  { label: "Clínicas",      to: "/fornecedores?cat=clinica" },
  { label: "Fornecedores",  to: "/fornecedores"             },
  { label: "Notícias",      to: "/informativos"             },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-6">

        <Link href="/" className="flex items-center shrink-0" aria-label="AcheiSST">
          <img src={logoText.src} alt="AcheiSST" className="h-7 md:h-9 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.to}
              className="hover:text-green-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/planos"
            className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            Assine
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              href="/painel"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <UserCircle2 className="w-4 h-4" /> Minha conta
            </Link>
          ) : (
            <>
              <Link
                href="/painel/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/planos"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-slate-700"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.to}
              className="py-3 border-b border-slate-100 last:border-b-0 text-sm font-medium text-slate-700 hover:text-green-600 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/planos"
            className="py-3 border-b border-slate-100 text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            ✨ Assine
          </Link>
          <Link
            href={user ? "/painel" : "/planos"}
            className="mt-3 inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {user ? "Minha conta" : "Cadastrar"}
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
