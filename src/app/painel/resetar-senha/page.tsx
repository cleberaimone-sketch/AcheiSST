'use client'

import Logo from "@/components/Logo";

import { useState } from 'react'
import { Loader2, Mail, CheckCircle2, ArrowLeft } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

export default function ResetarSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setError('')
    setLoading(true)

    const supabase = createSupabaseBrowser()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/painel/redefinir-senha`,
      }
    )

    if (authError) {
      setError('Não foi possível enviar o link. Verifique o e-mail e tente novamente.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-14 h-14 bg-sst-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-sst-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Link enviado!</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Enviamos um link para redefinir sua senha para <strong className="text-slate-700">{email}</strong>.
            Clique no link para continuar.
          </p>
          <p className="text-xs text-slate-400 mt-4">
            O link expira em 1 hora. Não recebeu? Verifique a caixa de spam.
          </p>
          <a
            href="/painel/login"
            className="inline-flex items-center gap-2 mt-6 text-green-600 hover:underline font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full shadow-sm">

        {/* Logo */}
        <div className="mb-8">
          <Logo textClassName="text-3xl" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Redefinir senha</h1>
        <p className="text-slate-500 text-sm mb-7">
          Digite seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-5">
            {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
              : 'Enviar link de redefinição'
            }
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-6 pt-5 border-t border-slate-100">
          Lembrou a senha?{' '}
          <a href="/painel/login" className="text-green-600 hover:underline font-medium">
            Voltar ao login
          </a>
        </p>
      </div>
    </div>
  )
}
