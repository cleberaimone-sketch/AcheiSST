import { getAllPosts } from '@/lib/posts'
import { Navbar } from '@/components/Navbar'
import { HomeSwitch } from '@/components/HomeSwitch'

export default function Home() {
  const posts = getAllPosts()

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-blue-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
      >
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="main-content">
        <HomeSwitch posts={posts} />
      </main>
    </>
  )
}
