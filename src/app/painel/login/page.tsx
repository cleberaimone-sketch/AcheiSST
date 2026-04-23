'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, Mail, ShieldCheck } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.8591-3.0477.8591-2.3441 0-4.3282-1.5831-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573A8.9961 8.9961 0 0 0 0 9c0 1.4523.3477 2.8268.9573 4.0418L3.964 10.71z" fill="#FBBC05"/>
      <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z" fill="#EA4335"/>
    </svg>
  )
}

export default function PainelLoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const urlError = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('error')
    : null

  async function handleGoogle() {
    setLoadingGoogle(true)
    setError('')
    const supabase = createSupabaseBrowser()
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (authError) {
      setError('Não foi possível conectar com o Google. Tente novamente.')
      setLoadingGoogle(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setError('')
    setLoading(true)

    const supabase = createSupabaseBrowser()
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: false,
      },
    })

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
            Enviamos um link de acesso para <strong className="text-slate-700">{email}</strong>.
            Clique no link para entrar no painel.
          </p>
          <p className="text-xs text-slate-400 mt-4">
            Não recebeu? Verifique a caixa de spam ou{' '}
            <button
              onClick={() => setSent(false)}
              className="text-navy-600 hover:underline font-medium"
            >
              tente novamente
            </button>
            .
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
          <img src="/logo-horizontal.png" alt="AcheiSST" className="h-10 w-auto object-contain" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Acessar painel</h1>
        <p className="text-slate-500 text-sm mb-7">
          Entre com Google ou receba um link por e-mail.
        </p>

        {urlError === 'link_invalido' && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-5">
            Link expirado ou inválido. Solicite um novo link abaixo.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-5">
            {error}
          </div>
        )}

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          disabled={loadingGoogle || loading}
          className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60 mb-5"
        >
          {loadingGoogle
            ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            : <GoogleIcon />
          }
          Entrar com Google
        </button>

        {/* Divisor */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs text-slate-400 font-medium">ou por e-mail</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Magic Link */}
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
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600/20 focus:border-navy-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || loadingGoogle}
            className="w-full bg-navy-600 hover:bg-navy-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
              : 'Enviar link de acesso'
            }
          </button>
        </form>

        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-100">
          <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <p className="text-xs text-slate-400">
            Acesso seguro — sem senha armazenada. O link por e-mail expira em 1 hora.
          </p>
        </div>

        <p className="text-xs text-slate-400 text-center mt-4">
          Ainda não cadastrado?{' '}
          <a href="/cadastrar" className="text-navy-600 hover:underline font-medium">
            Cadastre sua empresa
          </a>
        </p>
      </div>
    </div>
  )
}
