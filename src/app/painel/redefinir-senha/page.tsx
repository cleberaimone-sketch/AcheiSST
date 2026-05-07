'use client'

import Logo from "@/components/Logo";

import { useState, useEffect } from 'react'
import { Loader2, Lock, CheckCircle2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

export default function RedefinirSenhaPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isValidLink, setIsValidLink] = useState(false)
  const [checkingLink, setCheckingLink] = useState(true)

  useEffect(() => {
    const verifyLink = async () => {
      const supabase = createSupabaseBrowser()
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setIsValidLink(true)
      }
      setCheckingLink(false)
    }
    verifyLink()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!password.trim() || !confirmPassword.trim()) {
      setError('Preencha ambos os campos.')
      return
    }

    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)

    const supabase = createSupabaseBrowser()
    const { error: updateError } = await supabase.auth.updateUser({
      password: password.trim(),
    })

    if (updateError) {
      setError(updateError.message || 'Erro ao redefinir senha. Tente novamente.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    setTimeout(() => {
      router.push('/painel/login')
    }, 2000)
  }

  if (checkingLink) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Verificando link...</p>
        </div>
      </div>
    )
  }

  if (!isValidLink) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Link inválido ou expirado</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            O link para redefinir sua senha não é válido ou já expirou.
          </p>
          <a
            href="/painel/resetar-senha"
            className="inline-block mt-6 text-green-600 hover:underline font-medium text-sm"
          >
            Solicitar novo link
          </a>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-14 h-14 bg-sst-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-sst-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Senha redefinida!</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Sua senha foi alterada com sucesso. Redirecionando para o login...
          </p>
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

        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Nova senha</h1>
        <p className="text-slate-500 text-sm mb-7">
          Digite uma nova senha para sua conta.
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
              Nova Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mín. 8 caracteres"
                required
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Confirmar Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
                required
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm mt-2"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Redefinindo...</>
              : 'Redefinir senha'
            }
          </button>
        </form>
      </div>
    </div>
  )
}
