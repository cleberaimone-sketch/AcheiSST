'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const TRANSITIONS: Record<string, { next: string; label: string; cls: string }[]> = {
  novo:       [{ next: 'visto',      label: 'Marcar como visto',      cls: 'bg-amber-100 text-amber-700 hover:bg-amber-200' }],
  visto:      [{ next: 'respondido', label: 'Marcar como respondido', cls: 'bg-blue-100 text-blue-700 hover:bg-blue-200'   },
               { next: 'fechado',    label: 'Fechar negociação',       cls: 'bg-green-100 text-green-700 hover:bg-green-200' }],
  respondido: [{ next: 'fechado',    label: 'Fechar negociação',       cls: 'bg-green-100 text-green-700 hover:bg-green-200' }],
  fechado:    [],
}

export function LeadStatusButton({ leadId, currentStatus }: { leadId: string; currentStatus: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const actions = TRANSITIONS[currentStatus] ?? []

  if (actions.length === 0) return null

  async function handleUpdate(nextStatus: string) {
    setLoading(true)
    const supabase = createSupabaseBrowser()
    await supabase.from('leads').update({ status: nextStatus }).eq('id', leadId)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {actions.map(({ next, label, cls }) => (
        <button
          key={next}
          onClick={() => handleUpdate(next)}
          disabled={loading}
          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5 ${cls}`}
        >
          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
          {label}
        </button>
      ))}
    </div>
  )
}
