/**
 * AcheiSST — Scraping de Clínicas de Medicina do Trabalho (Doctoralia)
 * Usa Playwright (browser real) para evitar detecção de bot.
 *
 * Fonte: www.doctoralia.com.br — dados públicos
 * Regra: NUNCA inventar dados. Só inserir o que está na fonte.
 *
 * Uso: node scripts/scrape-clinicas.mjs
 * Dados salvos em: tabela fornecedores (categoria=clinica)
 */

import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync, existsSync } from 'fs';

// ── Config ────────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://ufuxerlqhsskynhnwjeb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdXhlcmxxaHNza3luaG53amViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjYxMzUsImV4cCI6MjA5MjQwMjEzNX0.K7wIVRHGipHgTX2c2UMNaZGgwqSQt4oK_VuaX5nSX1Y';
const MAX_POR_CIDADE = 15;
const DELAY_MS = 2000;
const CHECKPOINT = './scripts/checkpoint-clinicas.json';

// ── Cidades (slug sem sufixo de UF — formato Doctoralia para /clinicas/) ──────
const CIDADES = [
  { uf: 'SP', nome: 'São Paulo',        slug: 'sao-paulo'        },
  { uf: 'RJ', nome: 'Rio de Janeiro',   slug: 'rio-de-janeiro'   },
  { uf: 'MG', nome: 'Belo Horizonte',   slug: 'belo-horizonte'   },
  { uf: 'RS', nome: 'Porto Alegre',     slug: 'porto-alegre'     },
  { uf: 'PR', nome: 'Curitiba',         slug: 'curitiba'         },
  { uf: 'BA', nome: 'Salvador',         slug: 'salvador'         },
  { uf: 'CE', nome: 'Fortaleza',        slug: 'fortaleza'        },
  { uf: 'PE', nome: 'Recife',           slug: 'recife'           },
  { uf: 'GO', nome: 'Goiânia',          slug: 'goiania'          },
  { uf: 'DF', nome: 'Brasília',         slug: 'brasilia'         },
  { uf: 'SC', nome: 'Florianópolis',    slug: 'florianopolis'    },
  { uf: 'AM', nome: 'Manaus',           slug: 'manaus'           },
  { uf: 'PA', nome: 'Belém',            slug: 'belem'            },
  { uf: 'MA', nome: 'São Luís',         slug: 'sao-luis'         },
  { uf: 'ES', nome: 'Vitória',          slug: 'vitoria'          },
  { uf: 'MT', nome: 'Cuiabá',           slug: 'cuiaba'           },
  { uf: 'MS', nome: 'Campo Grande',     slug: 'campo-grande'     },
  { uf: 'RN', nome: 'Natal',            slug: 'natal'            },
  { uf: 'PB', nome: 'João Pessoa',      slug: 'joao-pessoa'      },
  { uf: 'AL', nome: 'Maceió',           slug: 'maceio'           },
  { uf: 'PI', nome: 'Teresina',         slug: 'teresina'         },
  { uf: 'SE', nome: 'Aracaju',          slug: 'aracaju'          },
  { uf: 'TO', nome: 'Palmas',           slug: 'palmas'           },
  { uf: 'RO', nome: 'Porto Velho',      slug: 'porto-velho'      },
  { uf: 'AP', nome: 'Macapá',           slug: 'macapa'           },
  { uf: 'AC', nome: 'Rio Branco',       slug: 'rio-branco'       },
  { uf: 'RR', nome: 'Boa Vista',        slug: 'boa-vista'        },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Extrai o código UF de 2 letras de strings como "São Paulo, SP" ou "SP"
function extractUF(addressRegion = '') {
  const match = addressRegion.trim().match(/\b([A-Z]{2})$/);
  return match?.[1] ?? null;
}

function normalizeImageUrl(url = '') {
  if (!url) return null;
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('http')) return url;
  return null;
}

function slugFromDoctoraliaUrl(url = '') {
  // https://www.doctoralia.com.br/clinicas/nome-da-clinica → nome-da-clinica
  const match = url.match(/\/clinicas\/([^?#]+)$/);
  return match ? match[1] : null;
}

function loadCheckpoint() {
  if (!existsSync(CHECKPOINT)) return [];
  try { return JSON.parse(readFileSync(CHECKPOINT, 'utf-8')); } catch { return []; }
}
function saveCheckpoint(done) {
  writeFileSync(CHECKPOINT, JSON.stringify(done, null, 2));
}

// ── Scrape da listagem de uma cidade ─────────────────────────────────────────
async function scrapeCidade(page, cidade) {
  const url = `https://www.doctoralia.com.br/clinicas/medicina-do-trabalho/${cidade.slug}`;
  console.log(`  → ${url}`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await sleep(1500);

    const title = await page.title();
    if (title.includes('404') || title.includes('não existe')) {
      console.log(`  ⚠ Página não encontrada: ${cidade.slug}`);
      return [];
    }

    const clinicas = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const script of scripts) {
        try {
          const data = JSON.parse(script.textContent);
          if (data['@type'] === 'ItemList' && data.itemListElement) {
            return data.itemListElement
              .map(el => el.item)
              .filter(item => item != null);
          }
        } catch {}
      }
      return [];
    });

    return clinicas;
  } catch (err) {
    console.log(`  ⚠ Erro: ${err.message}`);
    return [];
  }
}

// ── Inserir no Supabase ───────────────────────────────────────────────────────
async function inserirClinica(supabase, item, cidade) {
  const nome = item.name?.trim();
  if (!nome || nome.length < 2) return;

  const profileSlug = slugFromDoctoraliaUrl(item.url ?? '');
  const slug = profileSlug
    ? `clinica-${profileSlug}`
    : `clinica-${nome.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${cidade.uf.toLowerCase()}-${Math.random().toString(36).slice(2, 5)}`;

  const especialidades = item.medicalSpecialty ?? [];
  const rating = item.aggregateRating?.ratingValue
    ? Math.min(Number(item.aggregateRating.ratingValue), 5)
    : null;
  const numAval = item.aggregateRating?.reviewCount
    ? Number(item.aggregateRating.reviewCount)
    : 0;

  const endereco = [
    item.address?.streetAddress,
    item.address?.addressLocality,
  ].filter(Boolean).join(', ') || null;

  const cidadeNome = item.address?.addressLocality || cidade.nome;
  const uf = extractUF(item.address?.addressRegion ?? '') || cidade.uf;

  const descricao = especialidades.length > 0
    ? `Clínica de Medicina do Trabalho em ${cidadeNome}/${uf}. Especialidades: ${especialidades.slice(0, 6).join(', ')}.`
    : `Clínica de Medicina do Trabalho em ${cidadeNome}/${uf}.`;

  const { error } = await supabase.from('fornecedores').upsert({
    slug,
    nome,
    categoria:    'clinica',
    subcategoria: 'medicina_do_trabalho',
    uf,
    cidade:       cidadeNome,
    endereco,
    logo_url:     normalizeImageUrl(item.image),
    website_url:  item.url ?? null,
    descricao,
    especialidades: especialidades.length > 0 ? especialidades : null,
    avaliacao:    rating,
    num_avaliacoes: numAval,
    verified:     false,
    is_sponsored: false,
  }, { onConflict: 'slug', ignoreDuplicates: true });

  if (error) console.log(`  ✗ ${nome}: ${error.message}`);
  else       console.log(`  ✓ ${nome} (${uf}) — ${especialidades.length} especialidades`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const done = loadCheckpoint();
  const pendentes = CIDADES.filter(c => !done.includes(c.uf));

  console.log('\n🏥 AcheiSST — Scraper Clínicas Medicina do Trabalho (Doctoralia)');
  console.log(`📍 ${pendentes.length} cidades | max ${MAX_POR_CIDADE}/cidade\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'pt-BR',
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  // Aceita cookies na primeira visita
  await page.goto('https://www.doctoralia.com.br', { waitUntil: 'domcontentloaded' });
  await sleep(1000);
  try {
    const btn = page.locator('button:has-text("ACEITAR"), button:has-text("Aceito"), button:has-text("PERMITIR")');
    if (await btn.count() > 0) await btn.first().click();
  } catch {}

  let total = 0;

  for (const cidade of pendentes) {
    console.log(`\n📍 ${cidade.nome} (${cidade.uf})`);
    const clinicas = await scrapeCidade(page, cidade);
    const selecionadas = clinicas.slice(0, MAX_POR_CIDADE);
    console.log(`   ${selecionadas.length} clínica(s) encontrada(s)`);

    for (const item of selecionadas) {
      await inserirClinica(supabase, item, cidade);
      total++;
      await sleep(300);
    }

    done.push(cidade.uf);
    saveCheckpoint(done);
    await sleep(DELAY_MS);
  }

  await browser.close();
  console.log(`\n✅ Concluído! ${total} clínicas inseridas.`);
}

main().catch(console.error);
