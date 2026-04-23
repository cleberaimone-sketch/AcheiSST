"""
Ecossistema SST Brasil — Pipeline de automação de conteúdo
Fluxo: RSS/Scraper → Claude API → Supabase

Dependências:
  pip install feedparser httpx anthropic supabase python-dotenv
"""

import os
import json
import hashlib
import logging
from datetime import datetime, timezone
from typing import Optional

import feedparser
import httpx
import anthropic
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

# ── Clientes ────────────────────────────────────────────────
claude = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

supabase: Client = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_ROLE_KEY"],   # service role para escrita server-side
)

# ── Prompt do sistema (versionado) ──────────────────────────
AI_PROMPT_VERSION = 1

SYSTEM_PROMPT = """Você é um editor especializado em Saúde e Segurança no Trabalho (SST) no Brasil.

Sua tarefa é receber o conteúdo bruto de uma notícia e transformá-lo em um informativo técnico, conciso e profissional.

Retorne APENAS um JSON válido com esta estrutura exata:
{
  "title": "Título claro e informativo (máx 120 caracteres)",
  "summary": "Resumo objetivo de 1-2 frases (máx 300 caracteres), destacando o impacto prático para o profissional SST",
  "content": "Artigo completo em Markdown (200-500 palavras). Use ## para subtítulos quando necessário. Mantenha tom profissional e técnico, mas acessível. Mencione a norma ou lei aplicável quando relevante.",
  "category": "Um de: Legislativo | Saúde Ocupacional | Segurança | Regional",
  "tags": ["array", "de", "tags", "relevantes", "max_5"]
}

Não invente informações. Se o conteúdo for insuficiente, retorne {"error": "conteúdo insuficiente"}.
"""

# ── Funções principais ───────────────────────────────────────

def fetch_rss_entries(feed_url: str) -> list[dict]:
    """Baixa e parseia entradas de um feed RSS."""
    feed = feedparser.parse(feed_url)
    entries = []
    for entry in feed.entries:
        entries.append({
            "title": entry.get("title", ""),
            "summary": entry.get("summary", ""),
            "link": entry.get("link", ""),
            "published": entry.get("published", ""),
        })
    return entries


def scrape_full_text(url: str, timeout: int = 10) -> Optional[str]:
    """Baixa o texto bruto de uma URL. Substituir por Playwright para SPAs."""
    try:
        r = httpx.get(url, timeout=timeout, follow_redirects=True, headers={
            "User-Agent": "Mozilla/5.0 (compatible; SSTBrasilBot/1.0; +https://sstbrasil.com.br)"
        })
        r.raise_for_status()
        # Extração básica — para produção use readability-lxml ou trafilatura
        return r.text[:8000]
    except Exception as e:
        log.warning(f"Falha ao baixar {url}: {e}")
        return None


def content_hash(text: str) -> str:
    """Hash SHA-256 para deduplicação de conteúdo."""
    return hashlib.sha256(text.encode()).hexdigest()


def already_processed(source_url: str) -> bool:
    """Verifica se a URL já foi processada para evitar duplicatas."""
    result = (
        supabase.table("informativos")
        .select("id")
        .eq("source_url", source_url)
        .limit(1)
        .execute()
    )
    return len(result.data) > 0


def process_with_claude(raw_content: str, source_name: str) -> Optional[dict]:
    """Envia conteúdo bruto ao Claude e recebe JSON formatado."""
    user_message = f"""Fonte: {source_name}

Conteúdo bruto:
{raw_content[:6000]}
"""
    try:
        response = claude.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1500,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )
        text = response.content[0].text.strip()

        # Remove markdown code fences se presentes
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        text = text.rstrip("`").strip()

        data = json.loads(text)
        if "error" in data:
            log.warning(f"Claude recusou processar: {data['error']}")
            return None
        return data, response.usage.input_tokens + response.usage.output_tokens

    except json.JSONDecodeError as e:
        log.error(f"JSON inválido retornado pelo Claude: {e}")
        return None
    except Exception as e:
        log.error(f"Erro ao chamar Claude API: {e}")
        return None


def save_to_supabase(
    parsed: dict,
    raw_content: str,
    source_url: str,
    source_name: str,
    uf: Optional[str],
    fonte_id: Optional[str],
    tokens_used: int,
) -> Optional[str]:
    """Persiste o informativo processado no Supabase."""
    record = {
        "title": parsed["title"],
        "summary": parsed["summary"],
        "content": parsed["content"],
        "source_url": source_url,
        "source_name": source_name,
        "raw_content": raw_content[:10000],
        "category": parsed["category"],
        "uf": uf,
        "tags": parsed.get("tags", []),
        "status": "draft",           # revisão humana antes de publicar
        "ai_model": "claude-sonnet-4-6",
        "ai_prompt_version": AI_PROMPT_VERSION,
        "published_at": None,
    }

    result = supabase.table("informativos").insert(record).execute()
    informativo_id = result.data[0]["id"]

    # Log de auditoria
    supabase.table("automacao_log").insert({
        "fonte_id": fonte_id,
        "informativo_id": informativo_id,
        "stage": "ai_process",
        "status": "success",
        "message": f"Processado com {tokens_used} tokens",
        "tokens_used": tokens_used,
    }).execute()

    return informativo_id


def process_feed(fonte: dict) -> None:
    """Pipeline completo para uma fonte RSS."""
    log.info(f"Processando fonte: {fonte['name']}")

    entries = fetch_rss_entries(fonte["url"])
    if not entries:
        log.warning(f"Nenhuma entrada no feed: {fonte['url']}")
        return

    for entry in entries:
        source_url = entry["link"]
        if not source_url:
            continue

        if already_processed(source_url):
            log.debug(f"Já processado: {source_url}")
            continue

        # Texto bruto: prefer summary do RSS, mas tenta full-text
        raw = entry.get("summary") or ""
        if len(raw) < 200:
            raw = scrape_full_text(source_url) or raw

        if len(raw) < 100:
            log.warning(f"Conteúdo insuficiente para: {source_url}")
            continue

        result = process_with_claude(raw, fonte["name"])
        if not result:
            continue

        parsed, tokens = result
        informativo_id = save_to_supabase(
            parsed=parsed,
            raw_content=raw,
            source_url=source_url,
            source_name=fonte["name"],
            uf=fonte.get("uf"),
            fonte_id=fonte.get("id"),
            tokens_used=tokens,
        )

        log.info(f"Salvo: {parsed['title'][:60]}... (id: {informativo_id})")

        # Atualiza last_checked_at da fonte
        if fonte.get("id"):
            supabase.table("fontes_rss").update({
                "last_checked_at": datetime.now(timezone.utc).isoformat()
            }).eq("id", fonte["id"]).execute()


def run():
    """Ponto de entrada: busca fontes ativas e processa todas."""
    log.info("Iniciando pipeline SST Brasil")

    fontes = supabase.table("fontes_rss").select("*").eq("is_active", True).execute().data
    log.info(f"{len(fontes)} fontes ativas encontradas")

    for fonte in fontes:
        try:
            process_feed(fonte)
        except Exception as e:
            log.error(f"Erro na fonte {fonte['name']}: {e}")
            supabase.table("automacao_log").insert({
                "fonte_id": fonte.get("id"),
                "stage": "scrape",
                "status": "error",
                "message": str(e),
            }).execute()

    log.info("Pipeline concluído")


if __name__ == "__main__":
    run()
