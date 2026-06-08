'use client'

import Logo from "@/components/Logo";
import { useState } from 'react'
import { Loader2, Mail, Lock, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

export default function PainelLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    setError('')
    setLoading(true)

    const supabase = createSupabaseBrowser()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    })

    if (authError) {
      setError('E-mail ou senha incorretos. Tente novamente.')
      setLoading(false)
      return
    }

    // Redireciona baseado no tipo de conta
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id ?? '')
      .single()

    const isEmpresa = ['clinica', 'empresa_sst', 'empresa_epi'].includes(profile?.account_type ?? '')
    router.push(isEmpresa ? '/painel/fornecedor' : '/painel')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full shadow-sm">

        {/* Logo */}
        <div className="mb-8">
          <Logo textClassName="text-3xl" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Acessar painel</h1>
        <p className="text-slate-500 text-sm mb-7">
          Entre com seu e-mail e senha.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-5">
            {error}
          </div>
        )}

        {/* Email + Senha */}
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

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</>
              : 'Entrar'
            }
          </button>
        </form>

        <div className="flex items-center justify-between mt-4 text-xs">
          <a href="/painel/resetar-senha" className="text-green-600 hover:underline font-medium">
            Esqueci minha senha
          </a>
        </div>

        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-100">
          <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <p className="text-xs text-slate-400">
            Acesso seguro com criptografia de ponta a ponta.
          </p>
        </div>

        <p className="text-xs text-slate-400 text-center mt-4">
          Não tem conta?{' '}
          <a href="/painel/cadastrar" className="text-green-600 hover:underline font-medium">
            Criar conta
          </a>
        </p>
      </div>
    </div>
  )
}
