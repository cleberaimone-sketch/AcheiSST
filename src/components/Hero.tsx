'use client'

import { ArrowRight, Users, Briefcase, TrendingUp, ShieldCheck } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export function Hero() {
  const { theme } = useTheme()
  const isMin = theme === 'brazil_min'

  return (
    <section aria-labelledby="hero-heading" className={`${isMin ? 'bg-slate-50' : 'bg-white'} relative overflow-hidden pt-24 pb-16 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid Layout for Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Left Column - Copy */}
          <div className="col-span-1 lg:col-span-6 flex flex-col gap-6">
            <div className={`inline-flex items-center gap-2 ${isMin ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-700'} text-sm font-bold px-4 py-2 rounded-full w-fit`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isMin ? 'bg-green-400' : 'bg-blue-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isMin ? 'bg-green-500' : 'bg-blue-500'}`}></span>
              </span>
              Conexões de Alto Padrão SST
            </div>
            
            <h1 id="hero-heading" className={`text-5xl lg:text-7xl font-extrabold ${isMin ? 'text-slate-800' : 'text-slate-900'} tracking-tight leading-[1.1]`}>
              Conectando quem <span className={isMin ? 'text-green-600' : 'text-blue-600'}>faz</span> a segurança no Brasil.
            </h1>
            
            <p className={`text-xl ${isMin ? 'text-slate-500 font-medium' : 'text-slate-600'} leading-relaxed max-w-lg`}>
              Mais de 430 mil técnicos formados. Um mercado de EPIs de R$ 21 Bilhões. 
              Encontre clínicas, engenharias e soluções para manter sua empresa em conformidade com as NRs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <a href="#buscar-empresas" className={`${isMin ? 'bg-green-600 hover:bg-green-700 shadow-green-600/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'} text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 hover:-translate-y-1`}>
                Buscar Parceiros SST
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#ser-parceiro" className={`${isMin ? 'bg-white hover:bg-slate-100 border border-slate-200' : 'bg-slate-100 hover:bg-slate-200'} text-slate-900 font-bold text-lg px-8 py-4 rounded-2xl transition-all flex items-center justify-center`}>
                Sou Empresa SST
              </a>
            </div>
          </div>

          {/* Right Column - Editorial / Magazine Callout */}
          <div className="col-span-1 lg:col-span-6 grid grid-cols-2 gap-4 mt-8 lg:mt-0 relative">
            {/* Top Left Callout */}
            <div className={`${isMin ? 'bg-green-50 border border-green-100' : 'bg-orange-100'} rounded-3xl p-6 flex flex-col justify-end relative overflow-hidden min-h-[250px] group`}>
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80" alt="Engenheiro" className={`absolute inset-0 w-full h-full object-cover mix-blend-overlay ${isMin ? 'opacity-40 grayscale group-hover:grayscale-0' : 'opacity-60'} group-hover:scale-105 transition-all duration-700`} />
              <div className="relative z-10">
                <h3 className={`text-4xl font-black ${isMin ? 'text-green-900' : 'text-orange-900'} mb-1`}>430k+</h3>
                <p className={`${isMin ? 'text-green-800' : 'text-orange-950'} font-semibold text-sm leading-tight`}>Técnicos em Segurança do Trabalho formados</p>
              </div>
            </div>
            
            {/* Top Right Callout */}
            <div className={`${isMin ? 'bg-yellow-50 border border-yellow-100' : 'bg-teal-100'} rounded-3xl p-6 flex flex-col justify-end relative overflow-hidden min-h-[250px] group transform lg:translate-y-12`}>
              <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop" alt="Consultoria" className={`absolute inset-0 w-full h-full object-cover mix-blend-overlay ${isMin ? 'opacity-40 grayscale group-hover:grayscale-0' : 'opacity-50'} group-hover:scale-105 transition-all duration-700`} />
              <div className="relative z-10">
                <h3 className={`text-4xl font-black ${isMin ? 'text-yellow-700' : 'text-teal-900'} mb-1`}>2.000+</h3>
                <p className={`${isMin ? 'text-yellow-900' : 'text-teal-950'} font-semibold text-sm leading-tight`}>Empresas e Consultorias Especializadas no Hub</p>
              </div>
            </div>

            {/* Bottom Callout (Spans 2 cols) */}
            <div className={`col-span-2 ${isMin ? 'bg-slate-900 shadow-slate-900/20' : 'bg-blue-600 shadow-blue-900/20'} rounded-3xl p-8 flex items-center justify-between relative overflow-hidden group shadow-xl mt-4 lg:mt-8`}>
              <img src="https://images.unsplash.com/photo-1574411132644-8d960f58d929?q=80&w=1200&auto=format&fit=crop" alt="Mercado EPI" className={`absolute inset-0 w-full h-full object-cover ${isMin ? 'opacity-30' : 'opacity-20'} group-hover:opacity-40 transition-opacity duration-700`} />
              <div className="relative z-10">
                <h3 className="text-white font-black text-3xl md:text-5xl mb-2">R$ 21.05 Bi</h3>
                <p className={`${isMin ? 'text-green-400' : 'text-blue-100'} font-medium text-lg`}>Faturamento anual do Mercado de EPIs (2024)</p>
              </div>
              <div className={`relative z-10 hidden md:flex w-16 h-16 ${isMin ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/20 text-white'} rounded-full items-center justify-center backdrop-blur-md`}>
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
