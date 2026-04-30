'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

interface Props {
  id: string
  type: 'profissional' | 'clinica'
}

export function LikeCardButton({ id, type }: Props) {
  const key = `like_${type}_${id}`
  const [liked, setLiked] = useState(false)
  const [popping, setPopping] = useState(false)

  useEffect(() => {
    setLiked(localStorage.getItem(key) === '1')
  }, [key])

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const next = !liked
    setLiked(next)
    localStorage.setItem(key, next ? '1' : '0')
    if (next) {
      setPopping(true)
      setTimeout(() => setPopping(false), 400)
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={liked ? 'Remover curtida' : 'Curtir'}
      className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all
        ${liked ? 'bg-red-50' : 'bg-white/80 hover:bg-red-50'}
        ${popping ? 'scale-125' : 'scale-100'}
        shadow-sm border border-slate-100`}
    >
      <Heart
        className={`w-3.5 h-3.5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-slate-300'}`}
      />
    </button>
  )
}
