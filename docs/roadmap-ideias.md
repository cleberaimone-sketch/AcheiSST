# Roadmap de Ideias — Ecossistema SST Brasil

> Este documento registra ideias de evolução da plataforma. Nada aqui está implementado.
> Use como base para priorização e planejamento de sprints.

---

## 1. Hub de Empresas SST — Raspagem por Estado e Cidade

### O problema
Cadastrar empresas manualmente não escala. O Brasil tem 26 estados + DF e centenas de municípios
com prestadores de serviço SST que nunca seriam encontrados de outra forma.

### Abordagem recomendada: por ondas geográficas

Tentar raspar todas as empresas do Brasil de uma vez seria inviável — seria bloqueado rapidamente
e os dados viriam sujos. A estratégia certa é trabalhar em ondas:

**Onda 1 — Capitais (27 cidades)**
Começar pelas capitais. São Paulo, Rio, BH, Curitiba, etc. Maior densidade de empresas SST,
maior facilidade de validação manual posterior.

**Onda 2 — Municípios industriais (aprox. 80 cidades)**
Cidades com grande concentração industrial: Campinas, ABC Paulista, Betim, Caxias do Sul,
Joinville, Manaus (ZFM), etc. Onde SST tem maior demanda.

**Onda 3 — Demais municípios**
Automatizado em lote por UF, com curadoria mínima.

### Fontes de dados para raspagem

| Fonte | O que oferece | Viabilidade |
|-------|--------------|-------------|
| **Google Maps / Places API** | Nome, endereço, telefone, site, avaliações, categoria | Alta — API oficial, paga por requisição. Busca: "consultoria SST São Paulo" |
| **Receita Federal (CNPJ)** | CNAE 7490-1/04 (atividades de saúde ocupacional) e similares | Alta — dados públicos. Serviço `minhareceita.org` tem API gratuita |
| **CREA** | Engenheiros de segurança registrados por estado | Média — requer scraping do portal de cada CREA estadual |
| **LinkedIn** | Empresas com palavra-chave SST/SESMT | Baixa — anti-bot agressivo, risco de bloqueio |
| **Catho / InfoJobs** | Empresas que contratam Técnico de Segurança | Média — útil para identificar empresas com SESMT interno |

### Fluxo sugerido (sem código ainda)

```
1. Definir lista de CNAEs SST (7490-1/04, 8690-9/99, etc.)
2. Consultar API Receita Federal por CNAE + UF → lista de CNPJs
3. Enriquecer cada CNPJ com Google Places (endereço, site, telefone)
4. Processar com IA para classificar segmento (consultoria, EPI, medicina, etc.)
5. Salvar como status "pending_review" no Supabase
6. Curadoria humana antes de publicar
```

### Custo estimado
- Google Places API: ~USD 0,017 por request. 1.000 empresas ≈ USD 17.
- Receita Federal: gratuito via API pública.
- IA (classificação): ~USD 0,01 por empresa. 1.000 empresas ≈ USD 10.

---

## 2. Feed de Notícias — Fontes Governamentais a Explorar

### Fontes prioritárias (alto valor, conteúdo oficial)

| Fonte | Tipo | O que publica | URL base |
|-------|------|--------------|----------|
| **eSocial** | RSS / scraping | Circulares, manuais, prazos, leiautes | esocial.gov.br |
| **Ministério do Trabalho** | RSS oficial | Portarias, NRs, programas | gov.br/trabalho |
| **Diário Oficial da União (DOU)** | API INLABS | Publicação de portarias, NRs, resoluções | in.gov.br |
| **Fundacentro** | RSS | Pesquisas, publicações técnicas | fundacentro.gov.br |
| **Previdência Social / INSS** | Scraping | Estatísticas de CAT, acidentes | previdencia.gov.br |
| **ANAMT** | RSS | Medicina do trabalho | anamt.org.br |
| **ABHO** | RSS | Higiene ocupacional | abho.org.br |
| **DRTs estaduais** | Scraping | Fiscalizações regionais, autuações | Por estado |

### Destaque: API do Diário Oficial (INLABS)

O governo federal disponibiliza a **API INLABS** para acesso programático ao DOU.
É possível filtrar por palavras-chave ("NR-", "saúde do trabalhador", "SESMT") e receber
apenas publicações relevantes para SST. Isso seria a fonte mais rica e confiável.

- Requer cadastro no Portal INLABS
- Retorna JSON com texto completo das publicações
- Pode ser filtrado por seção (Seção 1 = atos normativos), data e palavras-chave

### Destaque: Estatísticas de Acidente (CAT/INSS)

O INSS publica dados de Comunicação de Acidente de Trabalho (CAT) por:
- CID (tipo de lesão)
- CNAE (setor econômico)
- UF e município
- Faixa etária e gênero

Esses dados poderiam alimentar um **painel de acidentes por região** — um diferencial
enorme para o ecossistema, pois nenhuma plataforma SST hoje apresenta isso de forma visual.

### Destaque: eSocial — eventos SST

O portal eSocial publica periodicamente:
- Novos leiautes (S-2210, S-2220, S-2240)
- Prazos por grupo de empresas
- Perguntas e respostas técnicas (FAQ)
- Manuais de orientação

Esses conteúdos têm altíssima demanda entre profissionais SST e empresas de RH,
mas estão espalhados no site sem organização adequada. Centralizar isso seria um
diferencial imediato.

---

## 3. Outras Ideias de Conteúdo para o Ecossistema

### 3.1 Painel de Normas Regulamentadoras (NRs)
Uma página dedicada às 36 NRs com:
- Status de cada NR (vigente / em revisão / suspensa)
- Data da última atualização
- Link para o texto oficial
- Resumo em linguagem acessível gerado por IA

Atualizado automaticamente via scraping do gov.br.

### 3.2 Calendário SST
Eventos importantes do calendário SST:
- Prazos do eSocial por grupo
- SIPAT (Semana Interna de Prevenção de Acidentes do Trabalho) — outubro
- Datas de audiências públicas de revisão de NRs
- Congressos e eventos do setor (ABHO, ANAMT, etc.)

### 3.3 Calculadora de SESMT
Ferramenta interativa: a empresa informa número de empregados + CNAE e o sistema
calcula a composição obrigatória do SESMT conforme NR-04. Alta demanda, fácil de implementar.

### 3.4 Mapa Interativo de Fiscalizações
Visualização geográfica de operações das DRTs por estado.
Dados públicos disponíveis no portal do Ministério do Trabalho.

### 3.5 Glossário SST com IA
Glossário técnico de termos SST (PPRA, PGR, LTCAT, CAT, PPP, etc.) com definições
geradas e revisadas por IA. Ótimo para SEO de cauda longa.

---

## 4. Estratégia de Crescimento do Ecossistema

### Modelo de dados por estágios

```
Estágio 1 — Conteúdo (agora)
  └─ Informativos diários via RSS + IA

Estágio 2 — Empresas (próximo)
  └─ Raspagem por CNAE + enriquecimento Google Places

Estágio 3 — Ferramentas (futuro)
  └─ Calculadora SESMT, painel NRs, calendário

Estágio 4 — Comunidade (visão)
  └─ Perfis de profissionais, grupos por UF, fórum técnico
```

### Custo de operação estimado (mensal, escala inicial)
| Serviço | Custo |
|---------|-------|
| Supabase (free tier) | R$ 0 |
| Vercel (Next.js hosting) | R$ 0 |
| Claude API (500 artigos/mês) | ~R$ 25 |
| Google Places API (1.000 consultas) | ~R$ 85 |
| **Total** | **~R$ 110/mês** |

---

## Prioridade Sugerida

1. **Fontes de notícias** — menor custo, maior impacto imediato. Adicionar DOU (INLABS) e eSocial.
2. **Raspagem de empresas por capital** — começar por SP e RJ para validar o fluxo.
3. **Painel de NRs** — diferencial de SEO e referência técnica.
4. **Calculadora de SESMT** — ferramenta que gera cadastros orgânicos.
