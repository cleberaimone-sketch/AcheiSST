"use client";
import { Newspaper, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

interface NewsSectionProps {
  posts?: PostMeta[];
}

const NewsSection = ({ posts = [] }: NewsSectionProps) => {
  // Caso venha vazio, exibimos placeholders visuais apenas para não quebrar a UI
  const displayItems = posts.length > 0 ? posts : [
    {
      slug: "esocial-atualizacao",
      category: "eSocial",
      title: "Novos eventos de SST no eSocial: o que muda em 2026",
      summary: "Confira as atualizações dos eventos S-2210, S-2220 e S-2240 e como elas impactam o envio de informações de saúde e segurança.",
    },
    {
      slug: "riscos-psicossociais",
      category: "NR-1",
      title: "Riscos psicossociais passam a ser obrigatórios no PGR",
      summary: "A nova redação da NR-1 inclui a gestão de riscos psicossociais. Veja como adequar o Programa de Gerenciamento de Riscos.",
    },
    {
      slug: "demanda-tecnicos",
      category: "Mercado",
      title: "Demanda por técnicos de segurança cresce 18% no Brasil",
      summary: "Levantamento mostra aumento de vagas para profissionais de SST em indústrias, construção civil e logística.",
    },
  ];

  return (
    <section id="novidades" className="bg-background py-10 md:py-14">
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-7 gap-6 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-3 inline-flex items-center gap-2">
              <Newspaper className="w-3.5 h-3.5" /> Novidades em SST
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground max-w-2xl">
              O que está acontecendo no universo da Saúde e Segurança
            </h2>
          </div>
          <Link
            href="/informativos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            Ver todas as notícias <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {displayItems.map((item: any) => (
            <Link
              key={item.slug || item.title}
              href={`/informativos/${item.slug || "#"}`}
              className="group bg-background border border-border rounded-xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary block"
            >
              <span className="inline-block bg-secondary/10 text-secondary text-xs font-semibold px-2.5 py-1 rounded-full mb-4">
                {item.category}
              </span>
              <h3 className="font-display text-lg font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{item.summary}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Ler artigo <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
