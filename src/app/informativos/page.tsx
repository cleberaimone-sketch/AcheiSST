import { getAllPosts } from '@/lib/posts'
import InformativosClient from '@/components/InformativosClient'

export default function NoticiasPage() {
  const posts = getAllPosts()
  return <InformativosClient posts={posts} />
}
