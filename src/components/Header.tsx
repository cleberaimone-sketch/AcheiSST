"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, UserCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logoText from "@/assets/acheisst-logo-text.png";

const navItems = [
  { label: "Profissionais", to: "/#categorias" },
  { label: "Clínicas", to: "/#categorias" },
  { label: "Empresas SST", to: "/#categorias" },
  { label: "Planos", to: "/#planos" },
  { label: "Novidades", to: "/#novidades" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur border-b border-border">
      <div className="px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center" aria-label="AcheiSST">
          <img src={logoText.src} alt="AcheiSST" className="h-7 md:h-9 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.to}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#categorias"
            aria-label="Buscar"
            className="hidden md:inline-flex items-center justify-center h-10 w-10 rounded-full border border-border text-foreground hover:bg-muted transition-colors"
          >
            <Search className="w-4 h-4" />
          </Link>
          {user ? (
            <Link
              href="/conta"
              className="hidden md:inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all"
            >
              <UserCircle2 className="w-4 h-4" /> Minha conta
            </Link>
          ) : (
            <>
              <Link
                href="/auth"
                className="hidden md:inline-flex items-center text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/auth"
                className="hidden md:inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all"
              >
                Cadastre-se
              </Link>
            </>
          )}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden bg-background border-t border-border px-6 py-4 flex flex-col">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.to}
              className="py-3 border-b border-border last:border-b-0 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={user ? "/conta" : "/auth"}
            className="mt-4 inline-flex items-center justify-center bg-primary text-primary-foreground px-5 py-3 rounded-full text-sm font-semibold"
            onClick={() => setMobileOpen(false)}
          >
            {user ? "Minha conta" : "Cadastre-se"}
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
