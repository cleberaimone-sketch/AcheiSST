import { type NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const { data: empresa } = await supabase
    .from('empresas')
    .select('id, nome, whatsapp')
    .eq('slug', slug)
    .single()

  if (!empresa?.whatsapp) {
    return NextResponse.redirect(new URL('/fornecedores', request.url))
  }

  // Registra o clique na tabela metricas (upsert diário)
  await supabase.rpc('incrementar_whatsapp_click', { p_fornecedor_id: empresa.id }).then(null, () => {
    // silencioso — não bloqueia o redirect se a função não existir ainda
  })

  const numero = empresa.whatsapp.replace(/\D/g, '')
  const texto = encodeURIComponent(
    `Olá! Vi seu perfil no AcheiSST e gostaria de mais informações sobre os serviços de ${empresa.nome}.`
  )

  return NextResponse.redirect(`https://wa.me/55${numero}?text=${texto}`)
}
