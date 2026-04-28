/**
 * AcheiSST — Scraping de Médicos do Trabalho (Doctoralia)
 * Usa Playwright (browser real) para evitar detecção de bot.
 *
 * Fonte: www.doctoralia.com.br — dados públicos
 * Regra: NUNCA inventar dados. Só inserir o que está na fonte.
 *
 * Uso: node scripts/scrape-profissionais.mjs
 * Requisitos: npm install playwright (já instalado)
 */

import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync, existsSync } from 'fs';

// ── Config ────────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://ufuxerlqhsskynhnwjeb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdXhlcmxxaHNza3luaG53amViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjYxMzUsImV4cCI6MjA5MjQwMjEzNX0.K7wIVRHGipHgTX2c2UMNaZGgwqSQt4oK_VuaX5nSX1Y';
const MAX_POR_ESTADO = 20;
const DELAY_MS = 2000;
const CHECKPOINT_FILE = './scripts/checkpoint.json';

// ── Estados ───────────────────────────────────────────────────────────────────
const ESTADOS = [
  { uf: 'SP', cidade: 'sao-paulo-sp',         nome: 'São Paulo' },
  { uf: 'RJ', cidade: 'rio-de-janeiro-rj',    nome: 'Rio de Janeiro' },
  { uf: 'MG', cidade: 'belo-horizonte-mg',    nome: 'Belo Horizonte' },
  { uf: 'RS', cidade: 'porto-alegre-rs',      nome: 'Porto Alegre' },
  { uf: 'PR', cidade: 'curitiba-pr',          nome: 'Curitiba' },
  { uf: 'BA', cidade: 'salvador-ba',          nome: 'Salvador' },
  { uf: 'CE', cidade: 'fortaleza-ce',         nome: 'Fortaleza' },
  { uf: 'PE', cidade: 'recife-pe',            nome: 'Recife' },
  { uf: 'GO', cidade: 'goiania-go',           nome: 'Goiânia' },
  { uf: 'DF', cidade: 'brasilia-df',          nome: 'Brasília' },
  { uf: 'SC', cidade: 'florianopolis-sc',     nome: 'Florianópolis' },
  { uf: 'AM', cidade: 'manaus-am',            nome: 'Manaus' },
  { uf: 'PA', cidade: 'belem-pa',             nome: 'Belém' },
  { uf: 'MA', cidade: 'sao-luis-ma',          nome: 'São Luís' },
  { uf: 'ES', cidade: 'vitoria-es',           nome: 'Vitória' },
  { uf: 'MT', cidade: 'cuiaba-mt',            nome: 'Cuiabá' },
  { uf: 'MS', cidade: 'campo-grande-ms',      nome: 'Campo Grande' },
  { uf: 'RN', cidade: 'natal-rn',             nome: 'Natal' },
  { uf: 'PB', cidade: 'joao-pessoa-pb',       nome: 'João Pessoa' },
  { uf: 'AL', cidade: 'maceio-al',            nome: 'Maceió' },
  { uf: 'PI', cidade: 'teresina-pi',          nome: 'Teresina' },
  { uf: 'SE', cidade: 'aracaju-se',           nome: 'Aracaju' },
  { uf: 'TO', cidade: 'palmas-to',            nome: 'Palmas' },
  { uf: 'RO', cidade: 'porto-velho-ro',       nome: 'Porto Velho' },
  { uf: 'AP', cidade: 'macapa-ap',            nome: 'Macapá' },
  { uf: 'AC', cidade: 'rio-branco-ac',        nome: 'Rio Branco' },
  { uf: 'RR', cidade: 'boa-vista-rr',         nome: 'Boa Vista' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function normalizeImageUrl(url = '') {
  if (!url) return null;
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('http')) return url;
  return null;
}

function extractUF(addressRegion = '') {
  const match = addressRegion.trim().match(/\b([A-Z]{2})$/);
  return match?.[1] || null;
}

function loadCheckpoint() {
  if (!existsSync(CHECKPOINT_FILE)) return { done: [] };
  try { return JSON.parse(readFileSync(CHECKPOINT_FILE, 'utf-8')); } catch { return { done: [] }; }
}

function saveCheckpoint(done) {
  writeFileSync(CHECKPOINT_FILE, JSON.stringify({ done }, null, 2));
}

// ── Scraping com Playwright ───────────────────────────────────────────────────
async function scrapeEstado(page, estado) {
  const url = `https://www.doctoralia.com.br/medico-do-trabalho/${estado.cidade}`;
  console.log(`  → ${url}`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await sleep(1500); // Aguarda JS carregar

    // Verifica se a página existe
    const title = await page.title();
    if (title.includes('404') || title.includes('não existe')) {
      console.log(`  ⚠️  Página não encontrada para ${estado.cidade}`);
      return [];
    }

    // Extrai JSON-LD com dados estruturados
    const medicos = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const script of scripts) {
        try {
          const data = JSON.parse(script.textContent);
          if (data['@type'] === 'ItemList' && data.itemListElement) {
            return data.itemListElement
              .map(el => el.item)
              .filter(item => item?.['@type'] === 'Physician');
          }
        } catch {}
      }
      return [];
    });

    return medicos;
  } catch (err) {
    console.log(`  ⚠️  Erro ao carregar ${estado.cidade}: ${err.message}`);
    return [];
  }
}

async function scrapePerfilTelefone(page, profileUrl) {
  try {
    await page.goto(profileUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await sleep(1000);

    const dados = await page.evaluate(() => {
      const phone = document.querySelector('[href^="tel:"]')?.href?.replace('tel:', '');
      const crmMatch = document.body.innerText.match(/CRM\/([A-Z]{2})\s+([\dA-Z]+)/);
      const crm = crmMatch ? `CRM/${crmMatch[1]} ${crmMatch[2]}` : null;
      const allText = document.body.innerText;
      const sobreIdx = allText.indexOf('Sobre mim');
      let bio = null;
      if (sobreIdx > -1) {
        bio = allText.slice(sobreIdx + 9, sobreIdx + 600).trim();
        if (bio.length < 20) bio = null;
      }
      return { telefone: phone || null, crm, bio };
    });

    return dados;
  } catch {
    return { telefone: null, crm: null, bio: null };
  }
}

// ── Inserção no Supabase ───────────────────────────────────────────────────────
async function inserir(supabase, dados) {
  const { error } = await supabase.from('profissionais').upsert(dados, {
    onConflict: 'nome,uf',
    ignoreDuplicates: true,
  });
  if (error) {
    console.error(`    ERRO: ${error.message}`);
    return false;
  }
  return true;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const checkpoint = loadCheckpoint();
  let totalInseridos = 0;

  console.log('🚀 AcheiSST — Scraping Médicos do Trabalho (Playwright)');
  console.log(`   Máximo por estado: ${MAX_POR_ESTADO} | Delay: ${DELAY_MS}ms`);
  console.log(`   Já processados: ${checkpoint.done.join(', ') || 'nenhum'}\n`);

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
    const permitir = page.locator('button:has-text("ACEITAR"), button:has-text("Aceito"), button:has-text("PERMITIR")');
    if (await permitir.count() > 0) await permitir.first().click();
  } catch {}

  for (const estado of ESTADOS) {
    if (checkpoint.done.includes(estado.uf)) {
      console.log(`⏭️  ${estado.uf} — já processado`);
      continue;
    }

    console.log(`\n📍 ${estado.uf} — ${estado.nome}`);

    const medicos = await scrapeEstado(page, estado);
    const selecionados = medicos.slice(0, MAX_POR_ESTADO);
    console.log(`   ${selecionados.length} médico(s) encontrado(s)`);

    for (const [i, medico] of selecionados.entries()) {
      const nome = medico.name?.trim();
      if (!nome) continue;

      process.stdout.write(`   [${i + 1}/${selecionados.length}] ${nome.slice(0, 40)} ... `);

      const especialidades = medico.medicalSpecialty || [];
      const rating = medico.aggregateRating?.ratingValue || null;
      const numAvaliacoes = medico.aggregateRating?.reviewCount || null;
      const fotoUrl = normalizeImageUrl(medico.image);
      const cidadeNome = medico.address?.addressLocality || estado.nome;
      const ufExtraido = extractUF(medico.address?.addressRegion) || estado.uf;
      const profileUrl = medico.url;

      // Busca telefone e CRM no perfil
      let telefone = null, crm = null, bio = null;
      if (profileUrl) {
        await sleep(DELAY_MS);
        const perfil = await scrapePerfilTelefone(page, profileUrl);
        telefone = perfil.telefone;
        crm = perfil.crm;
        bio = perfil.bio;
      }

      // Bio factual se não encontrada
      const bioFinal = bio || [
        `${nome} — Médico do Trabalho em ${cidadeNome}, ${ufExtraido}.`,
        especialidades.length > 1 ? `Especialidades: ${especialidades.join(', ')}.` : '',
        numAvaliacoes ? `${numAvaliacoes} avaliações no Doctoralia.` : '',
        'Fonte: Doctoralia.',
      ].filter(Boolean).join(' ');

      const ok = await inserir(supabase, {
        nome,
        especialidade: 'Médico do Trabalho',
        especialidade_tipo: 'medico_trabalho',
        registro_profissional: crm || null,
        registro: crm || null,
        uf: ufExtraido,
        cidade: cidadeNome,
        telefone,
        whatsapp: null,
        bio: bioFinal,
        foto_url: fotoUrl,
        avaliacao: rating ? parseFloat(String(rating)) : null,
        num_avaliacoes: numAvaliacoes || null,
        verified: !!crm,
        areas_atuacao: especialidades,
        nrs_expertise: [],
        linkedin_url: profileUrl || null,
      });

      if (ok) { totalInseridos++; process.stdout.write(`✅\n`); }
      else process.stdout.write(`⏩ (duplicado)\n`);

      await sleep(DELAY_MS);
    }

    checkpoint.done.push(estado.uf);
    saveCheckpoint(checkpoint.done);
    console.log(`   ✅ ${estado.uf} concluído. Total novos: ${totalInseridos}`);
  }

  await browser.close();
  console.log(`\n──────────────────────────────────────`);
  console.log(`✅ Finalizado! Total inseridos: ${totalInseridos}`);
  console.log(`──────────────────────────────────────`);
}

main().catch(err => {
  console.error('ERRO FATAL:', err);
  process.exit(1);
});
