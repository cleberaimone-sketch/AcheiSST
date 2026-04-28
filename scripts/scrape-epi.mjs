/**
 * AcheiSST — Scraping de Lojas de EPI (TeleListas)
 * Usa Playwright (browser real) para evitar bloqueio.
 *
 * Fonte: www.telelistas.net — diretório público de empresas do Brasil
 * Regra: NUNCA inventar dados. Só inserir o que está na fonte.
 *
 * Uso: node scripts/scrape-epi.mjs
 * Dados salvos em: tabela fornecedores (categoria=loja, subcategoria=epi)
 */

import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync, existsSync } from 'fs';

// ── Config ────────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://ufuxerlqhsskynhnwjeb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdXhlcmxxaHNza3luaG53amViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjYxMzUsImV4cCI6MjA5MjQwMjEzNX0.K7wIVRHGipHgTX2c2UMNaZGgwqSQt4oK_VuaX5nSX1Y';
const MAX_POR_CAPITAL = 20;
const MAX_PAGINAS    = 5;
const DELAY_MS       = 2000;
const CHECKPOINT     = './scripts/checkpoint-epi.json';

// ── Capitais → slugs TeleListas ───────────────────────────────────────────────
const CAPITAIS = [
  { uf: 'SP', cidade: 'São Paulo',      slug: 'sp/sao+paulo'      },
  { uf: 'RJ', cidade: 'Rio de Janeiro', slug: 'rj/rio+de+janeiro' },
  { uf: 'MG', cidade: 'Belo Horizonte', slug: 'mg/belo+horizonte' },
  { uf: 'RS', cidade: 'Porto Alegre',   slug: 'rs/porto+alegre'   },
  { uf: 'PR', cidade: 'Curitiba',       slug: 'pr/curitiba'       },
  { uf: 'BA', cidade: 'Salvador',       slug: 'ba/salvador'       },
  { uf: 'CE', cidade: 'Fortaleza',      slug: 'ce/fortaleza'      },
  { uf: 'PE', cidade: 'Recife',         slug: 'pe/recife'         },
  { uf: 'GO', cidade: 'Goiânia',        slug: 'go/goiania'        },
  { uf: 'DF', cidade: 'Brasília',       slug: 'df/brasilia'       },
  { uf: 'SC', cidade: 'Florianópolis',  slug: 'sc/florianopolis'  },
  { uf: 'AM', cidade: 'Manaus',         slug: 'am/manaus'         },
  { uf: 'PA', cidade: 'Belém',          slug: 'pa/belem'          },
  { uf: 'MA', cidade: 'São Luís',       slug: 'ma/sao+luis'       },
  { uf: 'ES', cidade: 'Vitória',        slug: 'es/vitoria'        },
  { uf: 'MT', cidade: 'Cuiabá',         slug: 'mt/cuiaba'         },
  { uf: 'MS', cidade: 'Campo Grande',   slug: 'ms/campo+grande'   },
  { uf: 'RN', cidade: 'Natal',          slug: 'rn/natal'          },
  { uf: 'PB', cidade: 'João Pessoa',    slug: 'pb/joao+pessoa'    },
  { uf: 'AL', cidade: 'Maceió',         slug: 'al/maceio'         },
  { uf: 'PI', cidade: 'Teresina',       slug: 'pi/teresina'       },
  { uf: 'SE', cidade: 'Aracaju',        slug: 'se/aracaju'        },
  { uf: 'TO', cidade: 'Palmas',         slug: 'to/palmas'         },
  { uf: 'RO', cidade: 'Porto Velho',    slug: 'ro/porto+velho'    },
  { uf: 'AP', cidade: 'Macapá',         slug: 'ap/macapa'         },
  { uf: 'AC', cidade: 'Rio Branco',     slug: 'ac/rio+branco'     },
  { uf: 'RR', cidade: 'Boa Vista',      slug: 'rr/boa+vista'      },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Remove " em NomeDoBairro" do final do nome que TeleListas adiciona
function limparNome(nome) {
  return nome.replace(/\s+em\s+.+$/i, '').trim();
}

function loadCheckpoint() {
  if (!existsSync(CHECKPOINT)) return [];
  try { return JSON.parse(readFileSync(CHECKPOINT, 'utf-8')); } catch { return []; }
}
function saveCheckpoint(done) {
  writeFileSync(CHECKPOINT, JSON.stringify(done, null, 2));
}

// ── Extrai cards de uma página ────────────────────────────────────────────────
async function extrairCards(page) {
  return page.evaluate(() => {
    // Cards são div.card que contêm button.ver-tel
    const cards = Array.from(document.querySelectorAll('div.card')).filter(c =>
      c.querySelector('button.ver-tel')
    );

    return cards.map(card => {
      const nome = card.querySelector('h5.card-title')?.textContent?.trim() || '';

      const telefone = card.querySelector('button.ver-tel')?.dataset?.telefone || '';
      const whatsapp = card.querySelector('button.call-zap')?.dataset?.telefone || '';
      const website  = card.querySelector('button.vai-site')?.dataset?.site || '';
      const logoUrl  = (() => {
        const src = card.querySelector('img.clogo')?.src || '';
        return src.includes('image-solid.svg') ? '' : src; // descarta placeholder
      })();

      // Endereço fica em p.card-text.text-muted — duas linhas separadas por <br>
      const endEl = card.querySelector('p.card-text.text-muted');
      const endTexto = endEl?.innerText?.trim() || '';
      const endLinhas = endTexto.split('\n').map(l => l.trim()).filter(Boolean);
      const endereco = endLinhas[0] || '';
      const bairroLine = endLinhas[1] || ''; // "Bairro - Cidade - UF"
      const bairro = bairroLine.split(' - ')[0] || '';

      // Descrição (versão longa, oculta)
      const descricao = card.querySelector('.visually-hidden')?.textContent?.trim() || '';

      // Avaliação — contar estrelas douradas
      const estrelas = card.querySelectorAll('i.icon-star.star-gold').length;
      const semEstrela = card.querySelectorAll('i.icon-empty-star').length;
      const avaliacao = estrelas > 0 ? estrelas : null;

      return { nome, telefone, whatsapp, website, logoUrl, endereco, bairro, descricao, avaliacao };
    });
  });
}

// ── Scrape de uma capital ─────────────────────────────────────────────────────
async function scrapeCapital(page, capital) {
  const BASE = `https://www.telelistas.net/${capital.slug}/epi+equipamentos+de+protecao+individual`;
  const empresas = [];

  for (let pag = 1; pag <= MAX_PAGINAS; pag++) {
    if (empresas.length >= MAX_POR_CAPITAL) break;

    const url = pag === 1 ? BASE : `${BASE}?pag=${pag}`;
    console.log(`  📄 Pág ${pag}: ${url}`);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await sleep(DELAY_MS);
    } catch {
      console.log(`  ⚠ Timeout pág ${pag}, parando`);
      break;
    }

    const cards = await extrairCards(page);

    if (cards.length === 0) {
      console.log('  ℹ Sem mais resultados');
      break;
    }

    for (const c of cards) {
      if (!c.nome || c.nome.length < 2) continue;
      if (empresas.length >= MAX_POR_CAPITAL) break;
      empresas.push(c);
    }

    console.log(`  ✓ ${cards.length} cards | acumulado ${capital.uf}: ${empresas.length}`);

    // Verifica se tem próxima página
    const temProx = await page.$('a[rel="next"], a.page-next, [class*="pagination"] a:last-child').catch(() => null);
    if (!temProx) break;
  }

  return empresas;
}

// ── Inserir no Supabase ───────────────────────────────────────────────────────
async function inserirEmpresa(supabase, empresa, capital) {
  const nome = limparNome(empresa.nome);
  const baseSlug = slugify(`${nome}-epi-${capital.cidade}`);
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

  const { error } = await supabase.from('fornecedores').upsert({
    slug,
    nome,
    categoria:    'loja',
    subcategoria: 'epi',
    uf:           capital.uf,
    cidade:       capital.cidade,
    endereco:     empresa.endereco || null,
    telefone:     empresa.telefone || null,
    whatsapp:     empresa.whatsapp || null,
    website_url:  empresa.website  || null,
    logo_url:     empresa.logoUrl  || null,
    descricao:    empresa.descricao || `Loja de EPI em ${capital.cidade}/${capital.uf}.`,
    avaliacao:    empresa.avaliacao || null,
    verified:     false,
    is_sponsored: false,
  }, { onConflict: 'slug', ignoreDuplicates: true });

  if (error) console.log(`  ✗ ${nome}: ${error.message}`);
  else       console.log(`  ✓ ${nome} (${capital.uf}) — tel: ${empresa.telefone || 'sem tel'}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const done = loadCheckpoint();
  const pendentes = CAPITAIS.filter(c => !done.includes(c.uf));

  console.log(`\n🏪 AcheiSST — Scraper Lojas EPI (TeleListas)`);
  console.log(`📍 ${pendentes.length} capitais | max ${MAX_POR_CAPITAL}/capital\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'pt-BR',
  });
  const page = await context.newPage();
  await page.route('**/*.{woff,woff2,ttf,otf}', r => r.abort()); // bloqueia só fontes

  let total = 0;

  for (const capital of pendentes) {
    console.log(`\n📍 ${capital.cidade} (${capital.uf})`);
    try {
      const empresas = await scrapeCapital(page, capital);
      for (const e of empresas) {
        await inserirEmpresa(supabase, e, capital);
        total++;
        await sleep(150);
      }
      done.push(capital.uf);
      saveCheckpoint(done);
    } catch (e) {
      console.log(`  ✗ Erro: ${e.message}`);
    }
    await sleep(DELAY_MS);
  }

  await browser.close();
  console.log(`\n✅ Concluído! ${total} lojas inseridas.`);
}

main().catch(console.error);
