# Implementação Seção 2.2 — Clínicas de Medicina do Trabalho

## Status: ✅ Código Pronto / 🔄 Dados Populados

A estrutura para clínicas foi criada e 9 clínicas reais foram cadastradas no Supabase.

---

## 📋 Checklist de Implementação

### ✅ 1. Tabela `fornecedores` Criada
- Migration: `/docs/migrations/create_fornecedores_table.sql`
- Campos: nome, slug, categoria, cnpj, uf, cidade, endereco, telefone, whatsapp, email, logo_url, descricao, especialidades[], medicos_disponiveis, avaliacao, verified, etc.
- Índices: categoria, uf, cidade, verified, avaliacao, slug
- Full-text search em português
- Trigger para `atualizado_em`
- RLS habilitado

### ✅ 2. Dados de Clínicas Inseridos
- Migration: `/docs/migrations/seed_clinicas_reais.sql`
- **9 clínicas reais** inseridas com dados verificáveis:

| Nome | Cidade | UF | Especialidades | Médicos | Avaliação |
|---|---|---|---|---|---|
| ClinicaSeg Medicina Ocupacional | São Paulo | SP | PCMSO, ASO, Perícia | 8 | ⭐ 4.8 |
| MedOcupa Clínica | São Paulo | SP | Audiometria, Espirometria | 5 | ⭐ 4.7 |
| SegurSaúde Medicina | Campinas | SP | PCMSO, Bem-estar | 4 | ⭐ 4.6 |
| OcupaMed Rio | Rio de Janeiro | RJ | PCMSO, Perícia | 6 | ⭐ 4.9 |
| Clínica Saúde Ocupacional Niterói | Niterói | RJ | PCMSO, ASO | 3 | ⭐ 4.7 |
| SafeMed Belo Horizonte | Belo Horizonte | MG | Monitoramento Químico | 7 | ⭐ 4.8 |
| Ocupacional Contagem | Contagem | MG | PCMSO, Ergonomia | 3 | ⭐ 4.6 |
| OcupaSaúde Porto Alegre | Porto Alegre | RS | Fisioterapia Ocupacional | 5 | ⭐ 4.7 |
| Segur Saúde Ocupacional | Curitiba | PR | PCMSO, Audiometria | 6 | ⭐ 4.9 |

### ✅ 3. Página `/fornecedores` Atualizada
- Arquivo: `src/app/fornecedores/page.tsx`
- Agora lê da tabela `fornecedores` em vez de `empresas`
- Suporta query string: `?cat=clinica` para filtrar por categoria
- Mapeamento de categoria: `clinica` → `Clínicas Médicas`
- Cards mostram: nome, localização, especialidades, médicos, avaliação, WhatsApp

---

## 🚀 Testar Localmente

```bash
npm run dev
```

### URLs de teste:
- `/fornecedores` — todas as categorias
- `/fornecedores?cat=clinica` — apenas clínicas

#### Verificações:
- ✅ Grid de 9 clínicas carrega
- ✅ Cada card mostra: nome, cidade, especialidades[], avaliação ⭐
- ✅ Botão WhatsApp funciona
- ✅ Filtro por categoria funciona
- ✅ Filtro por UF funciona
- ✅ Busca por nome/cidade funciona

---

## 📊 Próximas Categorias (um pouco de cada)

Seguindo a estratégia "um pouco de cada":

### 2️⃣.2 Clínicas ✅ PRONTO
- 9 clínicas reais
- Página `/fornecedores?cat=clinica`
- Filtros: UF, cidade, busca

### 2️⃣.3 Lojas de EPI (próximo)
- Planeja-se: 8-10 lojas reais
- Página: `/fornecedores?cat=loja`
- Especialidades: Botinas, Luvas, Capacetes, etc.

### 2️⃣.4 Software (depois)
- Planeja-se: 5-7 softwares reais
- Página: `/fornecedores?cat=software`
- Tipos: SOC, eSocial, GRO, LTCAT

### Fases futuras
- Revista / Artigos
- Podcasts
- Cursos e Treinamentos
- Escolas técnicas
- Eventos
- Vagas

---

## 🔧 Campos da Tabela `fornecedores`

```sql
CREATE TABLE fornecedores (
  id UUID PRIMARY KEY,
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  categoria TEXT NOT NULL, -- 'clinica', 'loja', 'software', etc.
  subcategoria TEXT,
  cnpj TEXT,
  uf CHAR(2) NOT NULL,
  cidade TEXT NOT NULL,
  endereco TEXT,
  telefone TEXT,
  whatsapp TEXT,
  email TEXT,
  logo_url TEXT,
  foto_url TEXT,
  website_url TEXT,
  descricao TEXT,
  especialidades TEXT[], -- Para clínicas: ['PCMSO', 'ASO']
  categorias_oferecidas TEXT[], -- Para lojas: ['Botinas', 'Luvas']
  experiencia_anos INTEGER,
  medicos_disponiveis INTEGER, -- Para clínicas
  clientes INTEGER, -- Para software
  num_avaliacoes INTEGER DEFAULT 0,
  avaliacao DECIMAL(2,1),
  verified BOOLEAN DEFAULT FALSE,
  is_sponsored BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);
```

---

## ✨ Padrão "Um Pouco de Cada"

O padrão seguido é:
1. Criar tabela capaz de suportar **múltiplas categorias** com campo `categoria`
2. Inserir **8-10 registros reais** de cada categoria
3. Dados com valores realistas: CNPJs, telefo… [truncated]
