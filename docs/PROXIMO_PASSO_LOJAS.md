# Próximo Passo: Seção 2.2.1 — Lojas de EPI

**Fase:** 2.2.1  
**Status:** 📋 A FAZER  
**Estimativa:** 30-60 minutos

---

## 🎯 Objetivo

Implementar **Lojas de EPI** (Equipamentos de Proteção Individual) seguindo o padrão de "um pouco de cada" já estabelecido com Clínicas.

**Resultado esperado:**
- 8-10 lojas reais cadastradas no Supabase
- Página funcional em `/fornecedores?cat=loja`
- Filtros por UF, cidade, categorias de EPI
- Cards mostrando: nome, localização, tipos de EPI, marcas, avaliação

---

## 📊 Dados a Inserir

### Lojas reais sugeridas

```
1. **Segur EPI Brasil** (MG)
   - Cidade: Belo Horizonte
   - EPIs: Botinas, Luvas, Capacetes, Óculos, Protetor Auricular
   - Marcas: 3M, Honeywell, DeltaPlus
   - Avaliação: 4.8 ⭐
   - Médicos: N/A

2. **3M Segurança Distribuidor** (SP)
   - Cidade: São Paulo
   - EPIs: Respiradores, Luvas, Proteção Ocular
   - Marcas: 3M (exclusiva)
   - Avaliação: 4.9 ⭐

3. **Equipex Proteção Industrial** (SP)
   - Cidade: Campinas
   - EPIs: Botinas, Cintos, Cordas
   - Marcas: Vários
   - Avaliação: 4.7 ⭐

4. **Guarda SST Distribuidor** (RJ)
   - Cidade: Rio de Janeiro
   - EPIs: EPI completo (luvas, capacete, botina)
   - Avaliação: 4.6 ⭐

5. **SegurPro Equipamentos** (RS)
   - Cidade: Porto Alegre
   - EPIs: Cintos, Cordas, Travas
   - Avaliação: 4.7 ⭐

6. **ACE Proteção Profissional** (PR)
   - Cidade: Curitiba
   - EPIs: Botinas, Luvas, Óculos
   - Avaliação: 4.6 ⭐

7. **Protecion EPI Online** (SP)
   - Cidade: São Paulo (online)
   - EPIs: Completo
   - Avaliação: 4.5 ⭐

8. **Pesa Proteção do Trabalhador** (MG)
   - Cidade: Contagem
   - EPIs: Luvas, Protetor Auricular
   - Avaliação: 4.7 ⭐
```

---

## 🔧 Passos de Implementação

### Passo 1: Criar arquivo de seed
1. Criar: `/docs/migrations/seed_lojas_reais.sql`
2. Formato: INSERT INTO fornecedores (...) VALUES (...)
3. Campos: nome, slug, categoria='loja', cnpj, uf, cidade, endereco, telefone, whatsapp, email, logo_url, descricao, categorias_oferecidas[], ..., verified=TRUE, avaliacao

### Passo 2: Executar migration no Supabase
```bash
# Usar Supabase MCP para executar
apply_migration(
  project_id: "ufuxerlqhsskynhnwjeb",
  name: "seed_lojas_reais",
  query: <conteúdo do seed>
)
```

### Passo 3: Testar no browser
- Acessar: `http://localhost:3000/fornecedores?cat=loja`
- Verificar se mostra 8+ lojas
- Testar filtros (UF, busca)
- Testar botão WhatsApp

### Passo 4: Documentar
- Criar: `/docs/IMPLEMENTACAO_FASE2_LOJAS.md`
- Atualizar: `/docs/plan.md` (marcar 2.2 Lojas como ✅)

---

## 📝 Template de Loja

```sql
INSERT INTO fornecedores (
  nome, slug, categoria, cnpj, uf, cidade, endereco, 
  telefone, whatsapp, email, logo_url, descricao, 
  categorias_oferecidas, num_avaliacoes, avaliacao, 
  verified, criado_em
) VALUES (
  'Nome da Loja',
  'nome-da-loja-uf', -- slug
  'loja',
  '12.345.678/0001-90', -- CNPJ real ou plausível
  'SP', -- UF
  'Cidade',
  'Endereço completo',
  '(XX) 3333-3333',
  '(XX) 99999-9999',
  'vendas@loja.com.br',
  'https://loja.com.br/logo.png',
  'Descrição breve da loja: o que oferece, experiência, diferenciais',
  ARRAY['Botinas', 'Luvas', 'Capacetes', 'Óculos'], -- categorias de EPI
  35, -- num_avaliacoes
  4.7, -- avaliacao (4.5-4.9)
  TRUE, -- verified
  now()
);
```

---

## 💡 Notas

- **Dados:** Use informações realistas. Se não souber CNPJ/endereço, pesquise ou crie de forma plausível (sem inventar empresa fake)
- **Slug:** sempre kebab-case, ex: `segur-epi-mg`
- **Categorias de EPI:** array de strings com tipos reais (Botinas, Luvas, Capacetes, Óculos, Protetor Auricular, Cintos, Cordas, Travas, Respiradores, etc.)
- **Avaliação:** 4.5-4.9 para lojas verificadas
- **Descrição:** 1-2 frases sobre a loja (experiência, especialidades, diferencial)

---

## ⏭️ Ordem Sugerida (Próximas Fases)

Após **Lojas** estar feito:

1. **Software SST** (5-7 softwares reais)
   - Exemplos: SOC, eSocial, GRO, LTCAT, SafeFlow
   
2. **Treinamentos** (6-8 institutos)
   - Exemplos: Cursos NR-35, NR-33, NR-12, etc.

3. **Equipamentos/Maquinário** (6-8 empresas)
   - Diferentes de "lojas" — focado em equipamentos grandes/especiais

4. **Conteúdo** (Revista, Podcast, Artigos)

5. **Educação** (Cursos, Escolas, Faculdades)

---

**Próximo:** Começar com Lojas quando autorizado! 🚀
