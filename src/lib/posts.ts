import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import type { Informativo, NewsCategory } from '@/types'

const POSTS_DIR = path.join(process.cwd(), 'posts')

export interface PostStat {
  value: string
  label: string
  color?: 'red' | 'orange' | 'green' | 'blue' | 'violet'
}

export interface PostMeta extends Omit<Informativo, 'id' | 'content' | 'created_at' | 'status' | 'ai_model' | 'ai_prompt_version'> {
  slug: string
  stats?: PostStat[]
  read_time?: number
}

export interface PostFull extends PostMeta {
  contentHtml: string
}

function parsePost(slug: string, fileContents: string): PostMeta {
  const { data } = matter(fileContents)

  const category = (data.category ?? 'Segurança') as NewsCategory

  // Assign a default newspaper-ish or SST-related image if none is provided
  let image_url = data.image_url
  if (!image_url) {
    if (category === 'Legislativo') image_url = 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop'
    else if (category === 'Saúde Ocupacional') image_url = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop'
    else if (category === 'Segurança') image_url = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop'
    else image_url = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop'
  }

  return {
    slug,
    title: data.title ?? '',
    summary: data.summary ?? '',
    category,
    uf: data.uf ?? null,
    source_name: data.source_name ?? '',
    source_url: data.source_url ?? '',
    tags: data.tags ?? [],
    published_at: data.published_at ?? new Date().toISOString(),
    image_url,
    stats: data.stats ?? undefined,
    read_time: data.read_time ?? undefined,
  }
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  const filenames = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))

  return filenames
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '')
      const fullPath = path.join(POSTS_DIR, filename)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      return parsePost(slug, fileContents)
    })
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
}

export async function getPostBySlug(slug: string): Promise<PostFull | null> {
  const fullPath = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const processed = await remark().use(remarkHtml, { sanitize: false }).process(content)
  const contentHtml = processed.toString()

  return {
    ...parsePost(slug, fileContents),
    contentHtml,
  }
}
