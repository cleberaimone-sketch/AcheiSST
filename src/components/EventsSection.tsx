import Link from "next/link";
import { Calendar, MapPin, ArrowRight, ExternalLink } from "lucide-react";

const eventos = [
  {
    nome: "Prevensul – 21ª Feira de Saúde e Segurança do Trabalho",
    data: "27–29 mai 2026",
    local: "Porto Alegre, RS",
    tipo: "Feira",
    emoji: "🎪",
    gradiente: "from-green-500 to-emerald-600",
    cor: "bg-green-500",
    imagem: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&auto=format&fit=crop&q=80",
    descricao: "Uma das maiores feiras de SST do Sul do Brasil. Soluções, produtos e tecnologias para prevenção de acidentes.",
    site: "https://www.feiraprevensul.com.br/",
  },
  {
    nome: "SafetyCon 2026 – Segurança e Saúde na Construção Civil",
    data: "27–28 mai 2026",
    local: "Balneário Camboriú, SC",
    tipo: "Congresso",
    emoji: "🏗️",
    gradiente: "from-purple-500 to-violet-600",
    cor: "bg-purple-500",
    imagem: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
    descricao: "Evento focado em SST na construção civil, promovido pelo CREA-SC. Debates sobre normas, ferramentas e boas práticas do setor.",
    site: "https://portal.crea-sc.org.br/agenda_evento/safetycon-evento-aborda-seguranca-e-saude-do-trabalho-na-construcao-civil-em-balneario-camboriu/",
  },
  {
    nome: "3º Encontro SGG – Segurança, Saúde e Gestão",
    data: "22 mai 2026",
    local: "Belo Horizonte, MG",
    tipo: "Congresso",
    emoji: "🏛️",
    gradiente: "from-blue-500 to-sky-600",
    cor: "bg-blue-500",
    imagem: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    descricao: "Debate de boas práticas e estratégias de prevenção em segurança, saúde e gestão do trabalho.",
    site: "https://lp.sgg.net.br/3-encontro-sgg",
  },
  {
    nome: "Exposec – Feira Internacional de Tecnologia em Segurança",
    data: "1–3 jun 2026",
    local: "São Paulo, SP",
    tipo: "Feira Internacional",
    emoji: "🔐",
    gradiente: "from-indigo-500 to-blue-700",
    cor: "bg-indigo-500",
    imagem: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
    descricao: "27ª edição da maior feira de tecnologia em segurança da América Latina. Mais de 300 expositores no São Paulo Expo.",
    site: "https://exposec.tmp.br/",
  },
  {
    nome: "PreveNor – 12ª Feira Norte-Nordeste de SST e Emergência",
    data: "22–24 set 2026",
    local: "Olinda, PE",
    tipo: "Feira",
    emoji: "🛡️",
    gradiente: "from-orange-500 to-amber-600",
    cor: "bg-orange-500",
    imagem: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80",
    descricao: "Maior evento de SST do Norte e Nordeste. Soluções e tecnologias para prevenção de acidentes.",
    site: "https://feiraprevenor.com.br/",
  },
  {
    nome: "FISP – Feira Internacional de Segurança e Proteção",
    data: "6–8 out 2026",
    local: "São Paulo, SP",
    tipo: "Feira Internacional",
    emoji: "🌎",
    gradiente: "from-rose-500 to-pink-600",
    cor: "bg-rose-500",
    imagem: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&auto=format&fit=crop&q=80",
    descricao: "O maior evento de segurança do trabalho da América Latina. Expositores de todo o mundo em São Paulo.",
    site: "https://feirafisp.com.br/",
  },
];

const tipoCor: Record<string, string> = {
  "Feira": "bg-green-100 text-green-700",
  "Conferência": "bg-purple-100 text-purple-700",
  "Congresso": "bg-blue-100 text-blue-700",
  "Feira Internacional": "bg-rose-100 text-rose-700",
};

export default function EventsSection() {
  return (
    <section id="eventos" className="bg-slate-50 py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-5 gap-4 flex-wrap">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
              📅 Agenda 2026
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Eventos de SST no Brasil
            </h2>
            <p className="text-sm text-slate-500 mt-1">Congressos, feiras e conferências confirmados para 2026.</p>
          </div>
          <Link href="/eventos" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 shrink-0">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventos.map((ev) => (
            <div
              key={ev.nome}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
            >
              {/* Banner */}
              <div className="h-36 overflow-hidden relative">
                {ev.imagem ? (
                  <img
                    src={ev.imagem}
                    alt={ev.nome}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${ev.gradiente} flex items-center justify-center`}>
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/30" />
                      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/20" />
                    </div>
                    <span className="text-5xl relative z-10 drop-shadow-sm">{ev.emoji}</span>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tipoCor[ev.tipo] ?? 'bg-slate-100 text-slate-600'}`}>
                    {ev.tipo}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug mb-3 flex-1">
                  {ev.nome}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {ev.descricao}
                </p>

                <div className="flex flex-col gap-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="font-semibold">{ev.data}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    {ev.local}
                  </div>
                </div>

                <a
                  href={ev.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Saiba mais <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-400 mt-6 text-center">
          Dados baseados em fontes públicas. Verifique datas e locais nos sites oficiais dos eventos.
        </p>
      </div>
    </section>
  );
}
