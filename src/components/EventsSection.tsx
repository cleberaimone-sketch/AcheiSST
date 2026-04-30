import Link from "next/link";
import { Calendar, MapPin, ArrowRight, ExternalLink } from "lucide-react";

const eventos = [
  {
    nome: "Prevensul – 21ª Feira de Saúde e Segurança do Trabalho",
    data: "27–29 mai 2026",
    local: "Porto Alegre, RS",
    tipo: "Feira",
    cor: "bg-green-500",
    descricao: "Uma das maiores feiras de SST do Sul do Brasil. Soluções, produtos e tecnologias para prevenção de acidentes.",
    site: "https://www.feiraprevensul.com.br/",
  },
  {
    nome: "Proteminas – Conferência de Segurança do Trabalho e Prevenção",
    data: "14 abr 2026",
    local: "Belo Horizonte, MG",
    tipo: "Conferência",
    cor: "bg-purple-500",
    descricao: "Estratégias, normas e ferramentas para aprimorar a prevenção. Focado em empresas e profissionais de MG.",
    site: "https://proteminas.com.br/",
  },
  {
    nome: "3º Encontro SSG – Segurança, Saúde e Gestão",
    data: "22 mai 2026",
    local: "Belo Horizonte, MG",
    tipo: "Congresso",
    cor: "bg-blue-500",
    descricao: "Debate de boas práticas e estratégias de prevenção em segurança, saúde e gestão do trabalho.",
    site: "https://lp.sgg.net.br/3-encontro-sgg",
  },
  {
    nome: "V Congresso Sul-Brasileiro de Segurança e Saúde Ocupacional",
    data: "1 set 2026",
    local: "Sul do Brasil",
    tipo: "Congresso",
    cor: "bg-indigo-500",
    descricao: "Discussão de temas atuais e desafios práticos da SST. Reúne especialistas de todo o Brasil.",
    site: "https://www.even3.com.br/v-congresso-sul-brasileiro-sso/",
  },
  {
    nome: "PreveNor – 12ª Feira Norte-Nordeste de SST e Emergência",
    data: "22–24 set 2026",
    local: "Olinda, PE",
    tipo: "Feira",
    cor: "bg-orange-500",
    descricao: "Maior evento de SST do Norte e Nordeste. Soluções e tecnologias para prevenção de acidentes.",
    site: "https://feiraprevenor.com.br/",
  },
  {
    nome: "FISP – Feira Internacional de Segurança e Proteção",
    data: "6–8 out 2026",
    local: "São Paulo, SP",
    tipo: "Feira Internacional",
    cor: "bg-rose-500",
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
    <section id="eventos" className="bg-slate-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
              📅 Agenda 2026
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Eventos de SST no Brasil
            </h2>
            <p className="text-sm text-slate-500 mt-1">Congressos, feiras e conferências confirmados para 2026.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventos.map((ev) => (
            <div
              key={ev.nome}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
            >
              <div className={`${ev.cor} h-1.5 w-full`} />
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
