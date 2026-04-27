'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

export function LikeButtonDetail({ id }: { id: string }) {
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('acheisst_likes') ?? '[]') as string[]
    setLiked(saved.includes(id))
  }, [id])

  const toggle = () => {
    const saved = JSON.parse(localStorage.getItem('acheisst_likes') ?? '[]') as string[]
    const next = liked ? saved.filter((x) => x !== id) : [...saved, id]
    localStorage.setItem('acheisst_likes', JSON.stringify(next))
    setLiked(!liked)
  }

  return (
    <button
      onClick={toggle}
      aria-label={liked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className="bg-white/90 backdrop-blur rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
    >
      <Heart className={`w-6 h-6 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-400'}`} />
    </button>
  )
}
