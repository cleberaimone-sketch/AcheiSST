/**
 * AcheiSST — Busca de imagens OG dos sites das empresas
 *
 * Estratégia:
 *   1. Consulta fornecedores sem foto_url mas com website_url
 *   2. Para cada empresa: faz fetch do site e extrai og:image / twitter:image
 *   3. Valida a URL (absoluta, não data:, tamanho razoável)
 *   4. Atualiza foto_url no Supabase
 *
 * Uso:
 *   node scripts/scrape-og-images.mjs
 *   node scripts/scrape-og-images.mjs --categoria clinica
 *   node scripts/scrape-og-images.mjs --limite 50
 *
 * Requer: SUPABASE_SERVICE_ROLE_KEY no .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, existsSync } from 'fs';

// ── Configuração ──────────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://ufuxerlqhsskynhnwjeb.supabase.co';

// Lê .env.local para obter a service role key
function loadEnv() {
  try {
    const env = readFileSync('.env.local', 'utf8');
    const match = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
    if (match) return match[1].trim();
  } catch {}
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
}

const SERVICE_KEY = loadEnv();
if (!SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrada no .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const CHECKPOINT_FILE = 'scripts/checkpoint-og-images.json';
const TIMEOUT_MS = 8000;
const DELAY_MS = 600; // pausa entre requests para não sobrecarregar

// Args
const args = process.argv.slice(2);
const catArg = args.find((a, i) => args[i - 1] === '--categoria');
const limiteArg = parseInt(args.find((a, i) => args[i - 1] === '--limite') ?? '200');

// ── Utilitários ───────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function loadCheckpoint() {
  if (!existsSync(CHECKPOINT_FILE)) return { processados: [], atualizados: 0, pulados: 0 };
  try { return JSON.parse(readFileSync(CHECKPOINT_FILE, 'utf8')); }
  catch { return { processados: [], atualizados: 0, pulados: 0 }; }
}

function saveCheckpoint(cp) {
  writeFileSync(CHECKPOINT_FILE, JSON.stringify(cp, null, 2));
}

/**
 * Extrai a melhor imagem OG do HTML de uma página.
 * Tenta em ordem: og:image → twitter:image → primeira <img> relevante
 */
function extractOgImage(html, baseUrl) {
  // og:image (dois formatos possíveis de atributo)
  const patterns = [
    /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
    /<meta[^>]*property=["']og:image:secure_url["'][^>]*content=["']([^"']+)["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      const url = match[1].trim();
      if (isValidImageUrl(url)) return resolveUrl(url, baseUrl);
    }
  }
  return null;
}

function isValidImageUrl(url) {
  if (!url) return false;
  if (url.startsWith('data:')) return false;
  if (url.length < 10) return false;
  // Aceita http(s) ou caminhos relativos
  if (url.startsWith('http') || url.startsWith('/') || url.startsWith('//')) return true;
  return false;
}

function resolveUrl(url, base) {
  try {
    if (url.startsWith('//')) return 'https:' + url;
    if (url.startsWith('/')) return new URL(base).origin + url;
    if (url.startsWith('http')) return url;
    return new URL(url, base).href;
  } catch {
    return url;
  }
}

/**
 * Faz fetch do site com timeout e retorna o HTML.
 */
async function fetchHtml(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AcheiSST-ImageBot/1.0; +https://acheisst.com.br)',
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
      redirect: 'follow',
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    // Lê no máximo 100KB (suficiente para pegar o <head>)
    const reader = res.body?.getReader();
    if (!reader) return null;
    let html = '';
    let bytes = 0;
    while (bytes < 100_000) {
      const { done, value } = await reader.read();
      if (done) break;
      html += new TextDecoder().decode(value);
      bytes += value.length;
    }
    reader.cancel();
    return html;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

// ── Principal ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 AcheiSST — Busca de imagens OG das empresas\n');

  const cp = loadCheckpoint();
  const jaProcessados = new Set(cp.processados ?? []);
  let { atualizados = 0, pulados = 0 } = cp;

  // Busca fornecedores sem foto_url mas com website_url
  let query = supabase
    .from('fornecedores')
    .select('id, nome, website_url, categoria')
    .is('foto_url', null)
    .not('website_url', 'is', null)
    .neq('website_url', '')
    .order('categoria')
    .limit(limiteArg + jaProcessados.size); // compensa os já processados

  if (catArg) query = query.eq('categoria', catArg);

  const { data: fornecedores, error } = await query;

  if (error) { console.error('Erro ao buscar:', error); process.exit(1); }

  const pendentes = (fornecedores ?? []).filter(f => !jaProcessados.has(f.id));
  console.log(`📋 ${pendentes.length} empresas para processar (${jaProcessados.size} já feitos)\n`);

  for (const f of pendentes.slice(0, limiteArg)) {
    const nome = f.nome.slice(0, 45).padEnd(45);
    process.stdout.write(`  ${nome} → `);

    const html = await fetchHtml(f.website_url);
    if (!html) {
      process.stdout.write('❌ sem resposta\n');
      pulados++;
    } else {
      const ogImage = extractOgImage(html, f.website_url);
      if (ogImage) {
        const { error: upErr } = await supabase
          .from('fornecedores')
          .update({ foto_url: ogImage })
          .eq('id', f.id);

        if (upErr) {
          process.stdout.write(`⚠️  erro ao salvar: ${upErr.message}\n`);
          pulados++;
        } else {
          process.stdout.write(`✅ ${ogImage.slice(0, 55)}\n`);
          atualizados++;
        }
      } else {
        process.stdout.write('⬜ sem og:image\n');
        pulados++;
      }
    }

    // Checkpoint após cada empresa
    cp.processados = [...jaProcessados, f.id];
    jaProcessados.add(f.id);
    cp.atualizados = atualizados;
    cp.pulados = pulados;
    saveCheckpoint(cp);

    await sleep(DELAY_MS);
  }

  console.log(`\n✅ Concluído: ${atualizados} imagens atualizadas, ${pulados} sem imagem`);
  console.log(`   Checkpoint salvo em ${CHECKPOINT_FILE}`);
}

main().catch(console.error);
