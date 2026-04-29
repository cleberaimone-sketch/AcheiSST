import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type') // 'signup' | 'recovery' | 'invite' | null

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Confirmação de email de novo cadastro → página de boas-vindas
      if (type === 'signup') {
        return NextResponse.redirect(`${origin}/bem-vindo`)
      }

      // Recuperação de senha → página de redefinição
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/painel/redefinir-senha`)
      }

      // Login OAuth (Google) ou magic link → redireciona por tipo de conta
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('user_id', user.id)
          .single()
        const isEmpresa = ['clinica', 'empresa_sst', 'empresa_epi'].includes(profile?.account_type ?? '')
        return NextResponse.redirect(`${origin}${isEmpresa ? '/painel/fornecedor' : '/painel'}`)
      }

      return NextResponse.redirect(`${origin}/painel`)
    }
  }

  return NextResponse.redirect(`${origin}/painel/login?error=link_invalido`)
}
