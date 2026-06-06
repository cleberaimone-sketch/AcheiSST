import { Check, Sparkles, ArrowLeft, Crown, Zap, Lock, MessageSquare, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { LeadPlanosForm } from "@/components/LeadPlanosForm";

export const metadata = {
  title: "Planos — AcheiSST",
  description: "Conheça os planos do AcheiSST. Durante a fase beta tudo é gratuito.",
};

interface Plano {
  id: 'gratuito' | 'profissional' | 'premium';
  nome: string;
  preco: string;
  periodo: string;
  precoFuturo?: string;
  descricao: string;
  badge?: string;
  badgeClasse?: string;
  destaque?: boolean;
  beneficios: string[];
  ctaTexto: string;
  ctaHref?: string;
  ctaDesabilitado?: boolean;
  icon: typeof Crown;
  iconColor: string;
  borderColor: string;
}

const PLANOS: Plano[] = [
  {
    id: 'gratuito',
    nome: 'Gratuito (Beta)',
    preco: 'R$ 0',
    periodo: 'agora',
    descricao: 'Durante a fase beta, todas as funcionalidades estão liberadas. Sem cobrança.',
    badge: '🎉 Você está aqui',
    badgeClasse: 'bg-green-100 text-green-700 border-green-300',
    destaque: true,
    beneficios: [
      'Perfil público completo',
      'Receber propostas em projetos publicados',
      'Enviar propostas ilimitadas',
      'Ver contato do contratante após aceitar',
      'WhatsApp direto liberado',
      'Aparece nas buscas por estado',
    ],
    ctaTexto: 'Criar conta grátis',
    ctaHref: '/auth?next=/projetos',
    icon: Sparkles,
    iconColor: 'text-green-600',
    borderColor: 'border-green-500',
  },
  {
    id: 'profissional',
    nome: 'Profissional',
    preco: 'R$ 79',
    periodo: '/mês (quando ativar)',
    precoFuturo: 'Em breve',
    descricao: 'Para quem quer destaque e mais propostas aceitas.',
    badge: 'Em breve',
    badgeClasse: 'bg-amber-100 text-amber-700 border-amber-300',
    beneficios: [
      'Tudo do plano Gratuito',
      'Perfil destacado na busca',
      'Selo "Profissional Verificado"',
      'Notificação em tempo real de novos projetos',
      'Histórico completo de propostas',
      'Suporte prioritário por WhatsApp',
    ],
    ctaTexto: 'Quero ser avisado',
    ctaDesabilitado: true,
    icon: Zap,
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-200',
  },
  {
    id: 'premium',
    nome: 'Premium',
    preco: 'R$ 169',
    periodo: '/mês (quando ativar)',
    precoFuturo: 'Em breve',
    descricao: 'Visibilidade máxima em todo o Brasil.',
    badge: 'Em breve',
    badgeClasse: 'bg-violet-100 text-violet-700 border-violet-300',
    beneficios: [
      'Tudo do plano Profissional',
      'Topo do ranking em todas as buscas',
      'Banner próprio na homepage',
      'Estatísticas detalhadas (visualizações, conversão)',
      'Visibilidade nacional (todo o Brasil)',
      'Página personalizada com portfólio',
      'Gerente de conta dedicado',
    ],
    ctaTexto: 'Quero ser avisado',
    ctaDesabilitado: true,
    icon: Crown,
    iconColor: 'text-violet-600',
    borderColor: 'border-violet-200',
  },
];

export default function PlanosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o início
          </a>

          {/* Banner BETA */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl p-6 sm:p-8 mb-10 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10" />
            <div className="absolute -right-32 -bottom-20 w-64 h-64 rounded-full bg-white/5" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-green-100 mb-1">
                  Fase Beta · Junho 2026
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
                  Tudo gratuito enquanto crescemos com você
                </h2>
                <p className="text-green-100 text-sm sm:text-base max-w-2xl leading-relaxed">
                  Durante a fase beta, <strong>todas as funcionalidades estão liberadas para todo mundo</strong>.
                  Sem mensalidade, sem comissão, sem pegadinha. Quando ativarmos os planos pagos,
                  você é avisado com antecedência.
                </p>
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">
              Planos AcheiSST
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Conheça os planos de <span className="text-green-600">amanhã</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto">
              A estrutura dos planos pagos está pronta. Mas hoje você não paga nada.
              Aproveite a beta pra crescer, fechar projetos e construir sua reputação.
            </p>
          </div>

          {/* Cards de planos */}
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {PLANOS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  className={`relative bg-white rounded-2xl border-2 ${p.borderColor} p-6 sm:p-7 shadow-sm flex flex-col ${
                    p.destaque ? 'ring-2 ring-green-500 ring-offset-2' : ''
                  }`}
                >
                  {p.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 ${p.badgeClasse} border px-3 py-1 rounded-full text-[11px] font-bold shadow-sm whitespace-nowrap`}>
                      {p.badge}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center ${p.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900">{p.nome}</h2>
                  </div>

                  <p className="text-sm text-slate-500 mb-5 min-h-[2.5rem]">{p.descricao}</p>

                  <div className="mb-5 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-slate-900">{p.preco}</span>
                    <span className="text-xs text-slate-400">{p.periodo}</span>
                  </div>

                  {p.ctaDesabilitado ? (
                    <div className="mb-5">
                      <LeadPlanosForm plano={p.id as 'profissional' | 'premium'} />
                    </div>
                  ) : (
                    <a
                      href={p.ctaHref}
                      className={`w-full text-center py-3 rounded-xl font-bold text-sm transition-colors mb-5 ${
                        p.destaque
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {p.ctaTexto}
                    </a>
                  )}

                  <ul className="space-y-2.5 flex-1 pt-4 border-t border-slate-100">
                    {p.beneficios.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${p.iconColor}`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Seção: o que muda quando ativarmos cobrança */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-10">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                  O que muda quando ativarmos os planos pagos?
                </h3>
                <p className="text-sm text-slate-500">
                  Transparência total: aqui está o que o plano gratuito vai e não vai poder fazer no futuro.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-2">
                  ✓ Plano gratuito CONTINUA podendo
                </p>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 mt-1 shrink-0 text-green-600" /> Publicar projetos como contratante</li>
                  <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 mt-1 shrink-0 text-green-600" /> Ver listagem de projetos abertos</li>
                  <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 mt-1 shrink-0 text-green-600" /> Receber propostas em seus projetos</li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">
                  ⚠️ Plano gratuito NÃO vai poder
                </p>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2"><Lock className="w-3.5 h-3.5 mt-1 shrink-0 text-amber-600" /> Enviar propostas em projetos</li>
                  <li className="flex items-start gap-2"><Lock className="w-3.5 h-3.5 mt-1 shrink-0 text-amber-600" /> Ver dados de contato do contratante</li>
                  <li className="flex items-start gap-2"><Lock className="w-3.5 h-3.5 mt-1 shrink-0 text-amber-600" /> Ter destaque na busca</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ rápido */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <MessageSquare className="w-5 h-5 text-green-600 mb-2" />
              <p className="text-sm font-bold text-slate-900 mb-1">Quando vai cobrar?</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Quando atingirmos massa crítica de usuários ativos. Sem prazo definido —
                queremos primeiro entregar valor real.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <Zap className="w-5 h-5 text-amber-600 mb-2" />
              <p className="text-sm font-bold text-slate-900 mb-1">Vou ser avisado?</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sim. Com no mínimo 30 dias de antecedência por email. Você decide se continua ou cancela.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <TrendingUp className="w-5 h-5 text-violet-600 mb-2" />
              <p className="text-sm font-bold text-slate-900 mb-1">Posso testar antes?</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Já está testando! A beta é gratuita e ilimitada. Quem entrar agora terá
                desconto vitalício na ativação.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">
            Dúvidas? Fale conosco em{" "}
            <a href="mailto:contato@acheisst.com.br" className="text-green-600 hover:underline">
              contato@acheisst.com.br
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
