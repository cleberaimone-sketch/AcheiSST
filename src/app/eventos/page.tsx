import { Navbar } from "@/components/Navbar";
import { Calendar, MapPin, ExternalLink, Search } from "lucide-react";

export const metadata = {
  title: "Eventos de SST 2026 — AcheiSST",
  description: "Congressos, feiras e conferências de Saúde e Segurança do Trabalho no Brasil em 2026.",
};

const eventos = [
  {
    nome: "Prevensul – 21ª Feira de Saúde e Segurança do Trabalho",
    data: "27–29 mai 2026",
    mes: "MAI",
    dia: "27",
    local: "Porto Alegre, RS",
    tipo: "Feira",
    cor: "bg-green-500",
    descricao: "Uma das maiores feiras de SST do Sul do Brasil. Reúne expositores com soluções, produtos e tecnologias para prevenção de acidentes e saúde no trabalho.",
    site: "https://www.feiraprevensul.com.br/",
  },
  {
    nome: "3º Encontro SSG – Segurança, Saúde e Gestão",
    data: "22 mai 2026",
    mes: "MAI",
    dia: "22",
    local: "Belo Horizonte, MG",
    tipo: "Congresso",
    cor: "bg-blue-500",
    descricao: "Debate de boas práticas e estratégias de prevenção em segurança, saúde e gestão do trabalho. Voltado para profissionais e gestores da área.",
    site: "https://lp.sgg.net.br/3-encontro-sgg",
  },
  {
    nome: "V Congresso Sul-Brasileiro de Segurança e Saúde Ocupacional",
    data: "1 set 2026",
    mes: "SET",
    dia: "1",
    local: "Sul do Brasil",
    tipo: "Congresso",
    cor: "bg-indigo-500",
    descricao: "Discussão de temas atuais e desafios práticos da SST. Reúne especialistas, pesquisadores e profissionais de todo o Brasil.",
    site: "https://www.even3.com.br/v-congresso-sul-brasileiro-sso/",
  },
  {
    nome: "PreveNor – 12ª Feira Norte-Nordeste de SST e Emergência",
    data: "22–24 set 2026",
    mes: "SET",
    dia: "22",
    local: "Olinda, PE",
    tipo: "Feira",
    cor: "bg-orange-500",
    descricao: "Maior evento de SST do Norte e Nordeste. Apresenta soluções e tecnologias para prevenção de acidentes com foco nas realidades regionais.",
    site: "https://feiraprevenor.com.br/",
  },
  {
    nome: "FISP – Feira Internacional de Segurança e Proteção",
    data: "6–8 out 2026",
    mes: "OUT",
    dia: "6",
    local: "São Paulo Expo, SP",
    tipo: "Feira Internacional",
    cor: "bg-rose-500",
    descricao: "O maior evento de segurança do trabalho da América Latina. Expositores nacionais e internacionais, palestras, workshops e lançamentos de produtos.",
    site: "https://feirafisp.com.br/",
  },
  {
    nome: "Proteminas – Conferência de Segurança do Trabalho e Prevenção",
    data: "14 abr 2026",
    mes: "ABR",
    dia: "14",
    local: "Belo Horizonte, MG",
    tipo: "Conferência",
    cor: "bg-purple-500",
    descricao: "Estratégias, normas e ferramentas para aprimorar a prevenção de acidentes. Focado em empresas e profissionais de Minas Gerais.",
    site: "https://proteminas.com.br/",
  },
];

const tipoCor: Record<string, string> = {
  "Feira": "bg-green-100 text-green-700",
  "Conferência": "bg-purple-100 text-purple-700",
  "Congresso": "bg-blue-100 text-blue-700",
  "Feira Internacional": "bg-rose-100 text-rose-700",
};

export default function EventosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-24 pb-16">

        {/* Header */}
        <div className="bg-white border-b border-slate-200 pb-8 pt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
              📅 Agenda 2026
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Eventos de SST no Brasil
            </h1>
            <p className="text-slate-500 text-base max-w-2xl">
              Congressos, feiras e conferências de Saúde e Segurança do Trabalho confirmados para 2026.
              Fique por dentro da agenda do setor.
            </p>
          </div>
        </div>

        {/* Grid de eventos */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {eventos.map((ev) => (
              <div
                key={ev.nome}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className={`${ev.cor} h-2 w-full`} />
                <div className="p-6 flex flex-col flex-1">

                  {/* Tipo + Data destaque */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tipoCor[ev.tipo] ?? 'bg-slate-100 text-slate-600'}`}>
                      {ev.tipo}
                    </span>
                    <div className="text-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shrink-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">{ev.mes}</p>
                      <p className="text-xl font-extrabold text-slate-900 leading-none">{ev.dia}</p>
                    </div>
                  </div>

                  {/* Nome */}
                  <h2 className="font-bold text-slate-900 text-base leading-snug mb-3">
                    {ev.nome}
                  </h2>

                  {/* Descrição */}
                  <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-1">
                    {ev.descricao}
                  </p>

                  {/* Info */}
                  <div className="flex flex-col gap-2 mb-5">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="font-semibold">{ev.data}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                      {ev.local}
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href={ev.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Ver site oficial
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-indigo-50 border border-indigo-200 rounded-2xl p-6 text-center">
            <p className="text-sm font-bold text-indigo-900 mb-1">Conhece um evento que não está na lista?</p>
            <p className="text-sm text-indigo-700 mb-4">Entre em contato e adicionamos à agenda.</p>
            <a
              href="mailto:contato@acheisst.com.br"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              Sugerir evento
            </a>
          </div>

          <p className="text-xs text-slate-400 mt-6 text-center">
            Dados baseados em fontes públicas. Verifique datas e locais nos sites oficiais dos eventos.
          </p>
        </div>
      </main>
    </>
  );
}
