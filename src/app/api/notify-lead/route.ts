import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { leadId } = await req.json()
    if (!leadId) return NextResponse.json({ ok: false }, { status: 400 })

    // Busca o lead com dados do profissional ou fornecedor
    const { data: lead } = await supabaseAdmin
      .from('leads')
      .select('*, profissional:profissional_id(display_name, public_email, user_id), fornecedor:fornecedor_id(nome, email, user_id)')
      .eq('id', leadId)
      .single()

    if (!lead) return NextResponse.json({ ok: false }, { status: 404 })

    // Descobre o email de destino
    let destinatario: string | null = null
    let nomeDestinatario = 'Profissional'

    if (lead.profissional) {
      destinatario = lead.profissional.public_email
      nomeDestinatario = lead.profissional.display_name ?? 'Profissional'
      // Fallback: email da conta auth
      if (!destinatario && lead.profissional.user_id) {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(lead.profissional.user_id)
        destinatario = authUser?.user?.email ?? null
      }
    } else if (lead.fornecedor) {
      destinatario = lead.fornecedor.email
      nomeDestinatario = lead.fornecedor.nome ?? 'Fornecedor'
      if (!destinatario && lead.fornecedor.user_id) {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(lead.fornecedor.user_id)
        destinatario = authUser?.user?.email ?? null
      }
    }

    if (!destinatario) return NextResponse.json({ ok: true, skipped: 'no_email' })

    await resend.emails.send({
      from: 'AcheiSST <noreply@acheisst.com.br>',
      to: destinatario,
      subject: `📋 Novo lead recebido: ${lead.nome}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
          <div style="background:#16a34a;padding:24px 32px">
            <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800">AcheiSST</h1>
            <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px">Novo lead recebido no seu perfil</p>
          </div>
          <div style="padding:32px">
            <p style="color:#475569;font-size:15px;margin:0 0 24px">Olá, <strong>${nomeDestinatario}</strong>! Você recebeu uma nova solicitação de orçamento.</p>

            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:6px 0;color:#64748b;font-size:13px;width:110px">Nome</td><td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600">${lead.nome}</td></tr>
                ${lead.email ? `<tr><td style="padding:6px 0;color:#64748b;font-size:13px">E-mail</td><td style="padding:6px 0;color:#0f172a;font-size:14px"><a href="mailto:${lead.email}" style="color:#16a34a">${lead.email}</a></td></tr>` : ''}
                ${lead.telefone ? `<tr><td style="padding:6px 0;color:#64748b;font-size:13px">Telefone</td><td style="padding:6px 0;color:#0f172a;font-size:14px">${lead.telefone}</td></tr>` : ''}
                ${lead.cidade ? `<tr><td style="padding:6px 0;color:#64748b;font-size:13px">Localização</td><td style="padding:6px 0;color:#0f172a;font-size:14px">${lead.cidade}${lead.uf ? `, ${lead.uf}` : ''}</td></tr>` : ''}
                ${lead.prazo ? `<tr><td style="padding:6px 0;color:#64748b;font-size:13px">Prazo</td><td style="padding:6px 0;color:#0f172a;font-size:14px">${lead.prazo}</td></tr>` : ''}
              </table>
            </div>

            ${lead.descricao ? `
            <div style="margin-bottom:24px">
              <p style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin:0 0 8px">Mensagem</p>
              <p style="color:#1e293b;font-size:14px;line-height:1.6;margin:0;background:#f0fdf4;border-left:3px solid #16a34a;padding:12px 16px;border-radius:0 8px 8px 0">${lead.descricao}</p>
            </div>` : ''}

            <a href="https://acheisst.com.br/painel" style="display:inline-block;background:#16a34a;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;text-decoration:none">
              Ver leads no painel →
            </a>

            <p style="color:#94a3b8;font-size:12px;margin:24px 0 0">Você recebeu este email porque tem um perfil ativo no AcheiSST. <a href="https://acheisst.com.br" style="color:#16a34a">acheisst.com.br</a></p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
