/**
 * AcheiSST — Scraping de Empresas SST (oHub.com.br)
 * Usa fetch nativo do Node.js (sem Playwright) — páginas carregam sem JS.
 *
 * Fonte: www.ohub.com.br — diretório público de empresas
 * Regra: NUNCA inventar dados. Só inserir o que está na fonte.
 *
 * Uso: node scripts/scrape-empresas-sst.mjs
 * Dados salvos em: tabela fornecedores (categoria=consultoria)
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync, existsSync } from 'fs';

// ── Config ────────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://ufuxerlqhsskynhnwjeb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdXhlcmxxaHNza3luaG53amViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjYxMzUsImV4cCI6MjA5MjQwMjEzNX0.K7wIVRHGipHgTX2c2UMNaZGgwqSQt4oK_VuaX5nSX1Y';
const BASE_URL     = 'https://www.ohub.com.br/empresas/consultoria-em-seguranca-do-trabalho';
const DETAIL_BASE  = 'https://www.ohub.com.br';
const MAX_PAGINAS  = 60;
const DELAY_MS     = 1500;
const CHECKPOINT   = './scripts/checkpoint-ohub.json';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'pt-BR,pt;q=0.9',
  'Accept': 'text/html,application/xhtml+xml',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Extrai UF do slug oHub: empresa-nome-cidade-SP-123456 → SP
function extractUFFromSlug(path) {
  const parts = path.split('-');
  // O ID numérico está no final; UF é o segmento de 2 letras maiúsculas antes do ID
  const numericId = parts[parts.length - 1];
  if (!/^\d+$/.test(numericId)) return null;
  const candidate = parts[parts.length - 2];
  if (/^[A-Z]{2}$/.test(candidate)) return candidate;
  return null;
}

// Extrai cidade do slug oHub (segmentos entre o nome da empresa e UF-ID)
function extractCidadeFromSlug(path, nomeSlugged) {
  const segmentos = path.replace('/empresa/', '').split('-');
  // Localiza o ID e UF no final
  const idx = segmentos.length - 2; // posição da UF
  // Nome da empresa (slugify) ocupa os primeiros segmentos
  const nomePartes = nomeSlugged.split('-').length;
  const cidadePartes = segmentos.slice(nomePartes, idx);
  return cidadePartes.join(' ').split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') || null;
}

function loadCheckpoint() {
  if (!existsSync(CHECKPOINT)) return { done: [] };
  try { return JSON.parse(readFileSync(CHECKPOINT, 'utf-8')); } catch { return { done: [] }; }
}
function saveCheckpoint(data) {
  writeFileSync(CHECKPOINT, JSON.stringify(data, null, 2));
}

// ── Extrai slugs de empresas de uma página de listagem ───────────────────────
function extrairSlugs(html) {
  const matches = [...html.matchAll(/href="(\/empresa\/[^"?#]+)"/g)];
  const seen = new Set();
  const slugs = [];
  for (const m of matches) {
    if (!seen.has(m[1])) { seen.add(m[1]); slugs.push(m[1]); }
  }
  return slugs;
}

// ── Extrai dados JSON-LD da página de detalhe de uma empresa ─────────────────
function extrairJsonLD(html) {
  const matches = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  for (const m of matches) {
    try {
      const data = JSON.parse(m[1]);
      if (data['@type'] === 'LocalBusiness') return data;
    } catch {}
  }
  return null;
}

// ── Fetch com retry ───────────────────────────────────────────────────────────
async function fetchHtml(url, tentativas = 3) {
  for (let i = 0; i < tentativas; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (i < tentativas - 1) { await sleep(2000 * (i + 1)); continue; }
      throw err;
    }
  }
}

// ── Inserir empresa no Supabase ───────────────────────────────────────────────
async function inserirEmpresa(supabase, empresa) {
  const { error } = await supabase.from('fornecedores').upsert(empresa, {
    onConflict: 'slug',
    ignoreDuplicates: true,
  });
  if (error) console.log(`  ✗ ${empresa.nome}: ${error.message}`);
  else       console.log(`  ✓ ${empresa.nome} (${empresa.uf ?? '?'}) — ${empresa.cidade ?? '?'}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const checkpoint = loadCheckpoint();
  const slugsJaFeitos = new Set(checkpoint.done ?? []);

  console.log('\n🏢 AcheiSST — Scraper Empresas SST (oHub.com.br)');
  console.log(`📄 Máximo ${MAX_PAGINAS} páginas | delay ${DELAY_MS}ms`);
  console.log(`   Já inseridos: ${slugsJaFeitos.size} empresas\n`);

  let total = 0;
  let paginasVazias = 0;

  for (let pag = 1; pag <= MAX_PAGINAS; pag++) {
    const url = pag === 1 ? BASE_URL : `${BASE_URL}/${pag}`;
    console.log(`\n📄 Página ${pag}: ${url}`);

    let html;
    try {
      html = await fetchHtml(url);
    } catch (err) {
      console.log(`  ✗ Erro na página ${pag}: ${err.message}`);
      paginasVazias++;
      if (paginasVazias >= 3) { console.log('  ℹ 3 páginas com erro, parando.'); break; }
      continue;
    }

    const slugs = extrairSlugs(html);
    console.log(`   ${slugs.length} empresas encontradas`);

    if (slugs.length === 0) {
      paginasVazias++;
      if (paginasVazias >= 2) { console.log('  ℹ Fim do conteúdo.'); break; }
      continue;
    }
    paginasVazias = 0;

    for (const slugPath of slugs) {
      if (slugsJaFeitos.has(slugPath)) {
        process.stdout.write('  ⏭ ' + slugPath + '\n');
        continue;
      }

      await sleep(DELAY_MS);

      let detalheHtml;
      try {
        detalheHtml = await fetchHtml(`${DETAIL_BASE}${slugPath}`);
      } catch (err) {
        console.log(`  ✗ Detalhe ${slugPath}: ${err.message}`);
        continue;
      }

      const ld = extrairJsonLD(detalheHtml);
      if (!ld) {
        console.log(`  ⚠ Sem JSON-LD: ${slugPath}`);
        slugsJaFeitos.add(slugPath);
        continue;
      }

      const nome = ld.name?.trim();
      if (!nome) { slugsJaFeitos.add(slugPath); continue; }

      const uf   = ld.address?.addressRegion ?? extractUFFromSlug(slugPath);
      const cidade = ld.address?.addressLocality ?? null;
      const endParts = [ld.address?.streetAddress, ld.address?.postalCode].filter(Boolean);
      const endereco = endParts.length > 0 ? endParts.join(', ') : null;

      const rating = ld.aggregateRating?.ratingValue
        ? Math.min(Number(ld.aggregateRating.ratingValue) / 2, 5)  // oHub escala 1-10 → 1-5
        : null;
      const numAval = ld.aggregateRating?.ratingCount
        ? Number(ld.aggregateRating.ratingCount)
        : 0;

      const slug = `sst-${slugify(nome)}-${(uf ?? 'br').toLowerCase()}-${Math.random().toString(36).slice(2, 5)}`;

      await inserirEmpresa(supabase, {
        slug,
        nome,
        categoria:    'consultoria',
        subcategoria: 'sst',
        uf:           uf ?? null,
        cidade:       cidade ?? null,
        endereco,
        logo_url:     ld.logo ?? null,
        website_url:  ld.url ?? null,
        descricao:    ld.description?.slice(0, 500) ?? null,
        avaliacao:    rating,
        num_avaliacoes: numAval,
        verified:     false,
        is_sponsored: false,
      });

      slugsJaFeitos.add(slugPath);
      total++;

      // Salva checkpoint a cada 10 inserções
      if (total % 10 === 0) {
        checkpoint.done = [...slugsJaFeitos];
        saveCheckpoint(checkpoint);
      }
    }

    checkpoint.done = [...slugsJaFeitos];
    saveCheckpoint(checkpoint);
    await sleep(DELAY_MS);
  }

  console.log(`\n✅ Concluído! ${total} empresas inseridas.`);
}

main().catch(console.error);
