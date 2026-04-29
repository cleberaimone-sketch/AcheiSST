/**
 * AcheiSST — Scraping de Vídeos SST
 * Estratégia híbrida: RSS (canais que permitem) + oEmbed para IDs curados.
 *
 * Fonte: YouTube RSS público + YouTube oEmbed (sem API key)
 * Regra: NUNCA inventar dados. Só inserir o que está na fonte.
 *
 * Uso: node scripts/scrape-videos.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ufuxerlqhsskynhnwjeb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdXhlcmxxaHNza3luaG53amViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjYxMzUsImV4cCI6MjA5MjQwMjEzNX0.K7wIVRHGipHgTX2c2UMNaZGgwqSQt4oK_VuaX5nSX1Y';

// ── Canais com RSS funcionando ────────────────────────────────────────────────
const RSS_CHANNELS = [
  { id: 'UC8tuwCwJN5JPffq61lhrFeg', name: 'Nestor W Neto SST',  tags: ['NR', 'treinamento', 'cultura de segurança'] },
  { id: 'UC4ecmbiTa0RjOZj6mAjO-HQ', name: 'Segura Trabalho',    tags: ['NR', 'EPI', 'CIPA', 'engenharia'] },
];

// ── Vídeos específicos curados (verificados via oEmbed) ───────────────────────
const CURATED_VIDEOS = [
  { id: 'mPXtPr2KIuA', tags: ['fundacentro', 'institucional'] },
  { id: '0RUOY0pT1nI', tags: ['fundacentro', 'história SST'] },
  { id: 'euTRHG84PMo', tags: ['NR-12', 'máquinas', 'equipamentos'] },
  { id: 'iHbzrGk6Cd0', tags: ['NR-12', 'análise de risco', 'inventário'] },
  { id: '-EtliBHIOGk', tags: ['PGR', 'PPRA', 'NR-1', 'NR-7', 'NR-9'] },
  { id: 'OceLoLj0Kz4', tags: ['PPRA', 'PGR', 'LTCAT', 'eSocial'] },
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' };

// ── RSS parser ────────────────────────────────────────────────────────────────
function parseRSS(xml, channel) {
  const videos = [];
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
  for (const [, entry] of entries) {
    const youtube_id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    if (!youtube_id) continue;
    const title     = entry.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() || '';
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] || null;
    const descMatch = entry.match(/<media:description>([\s\S]*?)<\/media:description>/);
    const description = descMatch?.[1]?.trim().slice(0, 500) || null;
    videos.push({
      youtube_id,
      title,
      description,
      thumbnail_url: `https://i.ytimg.com/vi/${youtube_id}/hqdefault.jpg`,
      channel_name: channel.name,
      channel_id: channel.id,
      published_at: published,
      categoria: detectCategoria(title),
      tags: channel.tags,
      verified: true,
    });
  }
  return videos;
}

// ── oEmbed fetch para vídeos curados ─────────────────────────────────────────
async function fetchOEmbed(videoId) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  const r = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

// ── Classificação automática de categoria ────────────────────────────────────
function detectCategoria(title = '') {
  const t = title.toLowerCase();
  if (t.includes('podcast') || t.includes('episódio') || t.includes(' ep.') || t.includes(' ep ')) return 'podcast';
  if (t.includes('#shorts') || t.includes('short')) return 'short';
  if (t.includes('curso') || t.includes('aula ') || t.includes('módulo') || t.includes('vídeo aula')) return 'curso';
  return 'video';
}

// ── Inserir no Supabase ───────────────────────────────────────────────────────
async function upsertVideo(supabase, video) {
  const { error } = await supabase.from('videos').upsert(video, {
    onConflict: 'youtube_id',
    ignoreDuplicates: false,
  });
  if (error) { console.log(`  ✗ ${video.title?.slice(0, 50)}: ${error.message}`); return false; }
  console.log(`  ✓ [${video.categoria}] ${video.title?.slice(0, 60)}`);
  return true;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  let total = 0;

  console.log('\n🎬 AcheiSST — Scraper Vídeos SST\n');

  // 1. Canais via RSS
  for (const channel of RSS_CHANNELS) {
    console.log(`📺 ${channel.name} (RSS)`);
    try {
      const res = await fetch(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`,
        { headers: HEADERS, signal: AbortSignal.timeout(12000) }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      const videos = parseRSS(xml, channel);
      console.log(`   ${videos.length} vídeos encontrados`);
      for (const v of videos) {
        if (await upsertVideo(supabase, v)) total++;
        await sleep(100);
      }
    } catch (err) {
      console.log(`  ✗ Erro: ${err.message}`);
    }
    await sleep(800);
  }

  // 2. Vídeos curados via oEmbed
  console.log('\n📌 Vídeos curados (oEmbed)');
  for (const { id, tags } of CURATED_VIDEOS) {
    try {
      const oe = await fetchOEmbed(id);
      const video = {
        youtube_id:    id,
        title:         oe.title,
        description:   null,
        thumbnail_url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        channel_name:  oe.author_name,
        channel_id:    null,
        published_at:  null,
        categoria:     detectCategoria(oe.title),
        tags,
        verified:      true,
      };
      if (await upsertVideo(supabase, video)) total++;
    } catch (err) {
      console.log(`  ✗ ${id}: ${err.message}`);
    }
    await sleep(400);
  }

  console.log(`\n✅ Concluído! ${total} vídeos inseridos/atualizados.`);
}

main().catch(console.error);
