"use client";
import Link from "next/link";
import Logo from "@/components/Logo";
import { ArrowUpRight } from "lucide-react";

const socials = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/acheisst",
    color: "hover:bg-[#0A66C2]",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/acheisst",
    color: "hover:bg-[#E1306C]",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@acheisst",
    color: "hover:bg-[#FF0000]",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/5511999999999",
    color: "hover:bg-[#25D366]",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  },
];

const Footer = () => (
  <footer className="bg-slate-950 text-slate-300">
    {/* Top band */}
    <div className="px-6 md:px-10 pt-16 pb-10 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-12 gap-10">

        {/* Brand col */}
        <div className="md:col-span-4">
          <div className="inline-block bg-white rounded-lg px-3 py-1.5 mb-4">
            <Logo textClassName="text-2xl" />
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            A primeira plataforma que reúne profissionais e empresas de Saúde e Segurança do Trabalho do Brasil.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2 mt-6">
            {socials.map(({ label, href, svg, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all ${color}`}
              >
                {svg}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="md:col-span-2">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Plataforma</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/#categorias" className="hover:text-white transition-colors">Categorias</Link></li>
            <li><Link href="/profissionais" className="hover:text-white transition-colors">Profissionais</Link></li>
            <li><Link href="/fornecedores" className="hover:text-white transition-colors">Fornecedores</Link></li>
            <li><Link href="/#planos" className="hover:text-white transition-colors">Planos</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Conteúdo</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/informativos" className="hover:text-white transition-colors">Informativos</Link></li>
            <li><Link href="/busca" className="hover:text-white transition-colors">Busca</Link></li>
            <li><Link href="/#novidades" className="hover:text-white transition-colors">Novidades</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Empresa</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Termos de uso</Link></li>
            <li><Link href="/code-of-conduct" className="hover:text-white transition-colors">Código de conduta</Link></li>
          </ul>
        </div>

        {/* CTA card */}
        <div className="md:col-span-2">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">É fornecedor?</p>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">Cadastre seu negócio e apareça para milhares de empresas.</p>
            <Link
              href="/#planos"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-white transition-colors"
            >
              Cadastrar agora <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-slate-800">
      <div className="px-6 md:px-10 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span>© {new Date().getFullYear()} AcheiSST · Fazendo um mundo mais seguro.</span>
        <span className="flex items-center gap-1">
          Desenvolvido pelo{" "}
          <a href="https://safework.com.br" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors ml-1">
            Grupo SafeWork
          </a>
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
