# Implementação Fase 2.1 — Profissionais SST

## Status: ✅ Código Pronto para Executar

Toda a estrutura para a página `/profissionais` foi criada. Agora é necessário executar as migrações SQL no Supabase.

---

## 📋 Checklist de Implementação

### 1. Executar Migrations no Supabase

#### Passo 1: Expandir tabela `profissionais`
1. Acesse: [Supabase Dashboard](https://app.supabase.com)
2. Vá para **SQL Editor**
3. Cole o conteúdo de `/docs/migrations/expand_profissionais_fields.sql`
4. Clique em **Run**
5. Verifique a mensagem: "Success — Executed"

#### Passo 2: Popular com dados de exemplo
1. No SQL Editor, cole o conteúdo de `/docs/migrations/seed_profissionais.sql`
2. Clique em **Run**
3. Deve inserir **13 profissionais** (técnicos, engenheiros, médicos, peritos, professores, higienistas)

---

### 2. Verificar Estrutura Criada

No Supabase, acesse **Table Editor** → `profissionais` e verifique os campos:
- ✅ nome
- ✅ especialidade
- ✅ especialidade_tipo (Perito, Professor)
- ✅ uf, cidade
- ✅ registro_profissional
- ✅ email, telefone, whatsapp
- ✅ bio, foto_url, linkedin_url
- ✅ nrs_expertise (array)
- ✅ experiencia_anos
- ✅ areas_atuacao (array)
- ✅ avaliacao, num_avaliacoes
- ✅ verified, criado_em, atualizado_em

---

### 3. Testar Localmente

```bash
npm run dev
```

Acesse: **http://localhost:3000/profissionais**

#### Testes:
- [ ] Grid de profissionais carrega com 13+ registros
- [ ] Filtro por **UF** funciona
- [ ] Filtro por **Cidade** aparece e funciona
- [ ] Filtro por **Especialidade** funciona
- [ ] Filtro por **Tipo de Especialista** (Perito/Professor) funciona
- [ ] **Busca** funciona (nome, especialidade, registro)
- [ ] **Cards** mostram:
  - Nome com badge de verificação
  - Especialidade + tipo (ex: "Técnico (Perito)")
  - Cidade, UF, registro profissional
  - Anos de experiência
  - Avaliação com ⭐
  - NRs de expertise em tags
  - Bio/descrição
  - Botões: WhatsApp, Email, Telefone, LinkedIn
- [ ] Link **WhatsApp** funciona (abre wa.me)
- [ ] Responsivo em **mobile**

---

### 4. Melhorias Futuras (Fase 2.1+)

Depois que tudo estiver funcionando:

- [ ] Adicionar mais profissionais (scraping CREA, CFM, CFT)
- [ ] Implementar avaliação/rating de profissionais
- [ ] Sistema de "Verificado" com checklist (documento, CNPJ, etc.)
- [ ] Página de detalhe individual `/profissionais/[slug]`
- [ ] Sistema de mensagens/contato via painel
- [ ] Integração com email automático para contato

---

## 🔧 Estrutura de Código

### Arquivos Modificados

1. **`src/types/index.ts`**
   - Expandido tipo `Profissional` com 20 campos
   
2. **`src/components/ProfissionaisClient.tsx`**
   - Novo filtro: `especialidadeTipo` (Perito/Professor)
   - Cards melhorados com mais informações
   - NRs de expertise em tags
   - WhatsApp integrado

3. **`src/app/profissionais/page.tsx`**
   - Sem mudanças (já estava correto)

### Arquivos Criados

1. **`docs/migrations/expand_profissionais_fields.sql`**
   - Criação da tabela `profissionais` com 20 campos
   - Índices para busca rápida
   - Full-text search em português
   - Row Level Security

2. **`docs/migrations/seed_profissionais.sql`**
   - 13 profissionais de exemplo (técnicos, engenheiros, médicos, peritos, professores)
   - Dados realistas com NRs, cidades, avaliações

---

## 📊 Dados Populados

| Nome | Especialidade | Tipo | UF | Experiência |
|---|---|---|---|---|
| João Silva | Técnico | — | PR | 15 anos |
| Maria Santos | Técnico | — | SP | 12 anos |
| Carlos Oliveira | Técnico | — | RJ | 18 anos |
| Dr. Pedro Lima | Engenheiro | — | MG | 20 anos |
| Eng. Ana Costa | Engenheiro | — | RS | 14 anos |
| Dra. Fernanda Gomes | Médico | — | SP | 18 anos |
| Dr. Roberto Alves | Médico | — | RJ | 22 anos |
| Carlos Perito | Engenheiro | **Perito** | RJ | 25 anos |
| Dra. Beatriz Ferreira | Médico | **Perito** | SP | 20 anos |
| Prof. Dr. Alberto Santos | Engenheiro | **Professor** | SP | 28 anos |
| Profa. Dra. Cecília Martins | Engenheiro | **Professor** | RS | 16 anos |
| Rafael Souza | Higienista | — | PR | 12 anos |

---

## 🚀 Próximas Seções (Fase 2)

Após validar a Seção 2.1 (Profissionais), prosseguir com:

- **2.2** — Fornecedores (Clínicas, Lojas, Software, Equipamentos, Treinamentos)
- **2.3** — Conteúdo (Revista, Artigos, Podcasts)
- **2.4** — Educação (Cursos, Escolas, Faculdades)
- **2.5** — Eventos & Vagas
- **2.6** — Legislação, Calendário, Glossário
- **2.7** — Integração na Homepage

---

## ⚠️ Troubleshooting

### Erro: "relation 'profissionais' does not exist"
→ Executar `expand_profissionais_fields.sql` primeiro

### Cards não carregam
→ Verificar se dados foram inseridos: `SELECT COUNT(*) FROM profissionais;` deve retornar 13+

### Filtros não funcionam
→ Recarregar página (`Ctrl+Shift+R` para cache clearing)

### Imagens de profissionais não aparecem
→ Campos `foto_url` estão NULL. Adicionar URLs de imagens válidas depois.

---

**Status:** Código pronto ✅ — Aguardando execução das migrações SQL 🔄
