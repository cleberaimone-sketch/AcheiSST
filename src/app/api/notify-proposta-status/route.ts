import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { propostaId } = await req.json();
    if (!propostaId) return NextResponse.json({ ok: false, error: 'missing_propostaId' }, { status: 400 });

    // Busca proposta + projeto + contratante
    const { data: proposta } = await supabaseAdmin
      .from('propostas')
      .select('id, projeto_id, prestador_user_id, valor, prazo_dias, status')
      .eq('id', propostaId)
      .single();

    if (!proposta) return NextResponse.json({ ok: false, error: 'proposta_nao_encontrada' }, { status: 404 });
    if (!['aceita', 'recusada'].includes(proposta.status)) {
      return NextResponse.json({ ok: true, skipped: 'status_nao_dispara_email' });
    }

    const { data: projeto } = await supabaseAdmin
      .from('projetos_servico')
      .select('id, titulo, categoria_id, contratante_user_id, cidade, uf')
      .eq('id', proposta.projeto_id)
      .single();

    if (!projeto) return NextResponse.json({ ok: false, error: 'projeto_nao_encontrado' }, { status: 404 });

    // Email do prestador (destinatário)
    const { data: authPrestador } = await supabaseAdmin.auth.admin.getUserById(proposta.prestador_user_id);
    const emailPrestador = authPrestador?.user?.email;
    if (!emailPrestador) return NextResponse.json({ ok: true, skipped: 'sem_email_prestador' });

    const { data: perfilPrestador } = await supabaseAdmin
      .from('profiles')
      .select('display_name')
      .eq('user_id', proposta.prestador_user_id)
      .maybeSingle();
    const nomePrestador = perfilPrestador?.display_name ?? 'Prestador';

    // Dados do contratante (pra mostrar quem aceitou/recusou)
    const { data: perfilContratante } = await supabaseAdmin
      .from('profiles')
      .select('display_name, whatsapp')
      .eq('user_id', projeto.contratante_user_id)
      .maybeSingle();
    const nomeContratante = perfilContratante?.display_name ?? 'Contratante AcheiSST';

    // Categoria pra título do email
    const { data: categoria } = await supabaseAdmin
      .from('categorias_sst')
      .select('nome, icon')
      .eq('id', projeto.categoria_id)
      .maybeSingle();

    const linkProjeto = `https://acheisst.com.br/projetos/${projeto.id}`;
    const linkPainel = 'https://acheisst.com.br/painel/propostas';

    // ─────────── Email: PROPOSTA ACEITA ───────────
    if (proposta.status === 'aceita') {
      const whatsappBtn = perfilContratante?.whatsapp
        ? `<a href="https://wa.me/55${perfilContratante.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
            `Olá ${nomeContratante}! Sou ${nomePrestador}, do AcheiSST. Você aceitou minha proposta para "${projeto.titulo}". Vamos conversar?`
          )}" style="display:inline-block;background:#16a34a;color:#fff;font-weight:700;font-size:14px;padding:14px 24px;border-radius:10px;text-decoration:none;margin-right:8px">📱 Falar no WhatsApp</a>`
        : '';

      await resend.emails.send({
        from: 'AcheiSST <noreply@acheisst.com.br>',
        to: emailPrestador,
        subject: `🎉 Sua proposta foi ACEITA — ${projeto.titulo}`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
            <div style="background:linear-gradient(135deg,#16a34a,#15803d);padding:32px;text-align:center">
              <div style="font-size:48px;margin-bottom:8px">🎉</div>
              <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">Sua proposta foi aceita!</h1>
              <p style="color:#bbf7d0;margin:8px 0 0;font-size:14px">Agora é só combinar os detalhes</p>
            </div>
            <div style="padding:32px">
              <p style="color:#475569;font-size:15px;margin:0 0 24px">
                Olá, <strong>${nomePrestador}</strong>! Ótima notícia: <strong>${nomeContratante}</strong> aceitou sua proposta para:
              </p>
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:24px">
                <p style="color:#15803d;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;margin:0 0 6px">${categoria?.icon ?? ''} ${categoria?.nome ?? 'Projeto SST'}</p>
                <p style="color:#0f172a;font-size:16px;font-weight:700;margin:0 0 12px">${projeto.titulo}</p>
                <table style="width:100%;border-collapse:collapse;font-size:13px">
                  <tr><td style="padding:4px 0;color:#64748b;width:120px">Valor combinado</td><td style="color:#0f172a;font-weight:600">R$ ${Number(proposta.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td></tr>
                  <tr><td style="padding:4px 0;color:#64748b">Prazo</td><td style="color:#0f172a;font-weight:600">${proposta.prazo_dias} dias</td></tr>
                  <tr><td style="padding:4px 0;color:#64748b">Localização</td><td style="color:#0f172a">${projeto.cidade}, ${projeto.uf}</td></tr>
                </table>
              </div>

              <p style="color:#475569;font-size:14px;margin:0 0 16px"><strong>Próximo passo:</strong> entre em contato direto com o contratante pra alinhar a entrega:</p>

              <div style="margin:0 0 24px">
                ${whatsappBtn}
                <a href="${linkProjeto}" style="display:inline-block;border:1px solid #e2e8f0;color:#475569;font-weight:600;font-size:14px;padding:13px 22px;border-radius:10px;text-decoration:none">Ver projeto</a>
              </div>

              <p style="color:#94a3b8;font-size:12px;margin:0;padding-top:16px;border-top:1px solid #f1f5f9">
                Você recebeu esse email porque enviou uma proposta no AcheiSST. <a href="${linkPainel}" style="color:#16a34a">Ver minhas propostas</a>
              </p>
            </div>
          </div>
        `,
      });
    }

    // ─────────── Email: PROPOSTA RECUSADA ───────────
    if (proposta.status === 'recusada') {
      await resend.emails.send({
        from: 'AcheiSST <noreply@acheisst.com.br>',
        to: emailPrestador,
        subject: `Atualização sobre sua proposta — ${projeto.titulo}`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
            <div style="background:#475569;padding:24px 32px">
              <h1 style="color:#fff;margin:0;font-size:20px;font-weight:800">Atualização da sua proposta</h1>
              <p style="color:#cbd5e1;margin:4px 0 0;font-size:13px">AcheiSST</p>
            </div>
            <div style="padding:32px">
              <p style="color:#475569;font-size:15px;margin:0 0 16px">
                Olá, <strong>${nomePrestador}</strong>. Sua proposta para o projeto abaixo não foi escolhida desta vez:
              </p>
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:24px">
                <p style="color:#0f172a;font-size:15px;font-weight:700;margin:0">${projeto.titulo}</p>
                <p style="color:#64748b;font-size:13px;margin:4px 0 0">${projeto.cidade}, ${projeto.uf}</p>
              </div>

              <p style="color:#475569;font-size:14px;margin:0 0 16px">
                Não desanima! O mercado de SST tem muito espaço. Continue enviando propostas — quanto mais ativo, mais chances.
              </p>

              <a href="https://acheisst.com.br/projetos" style="display:inline-block;background:#16a34a;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;text-decoration:none">
                Ver outros projetos abertos →
              </a>

              <p style="color:#94a3b8;font-size:12px;margin:24px 0 0;padding-top:16px;border-top:1px solid #f1f5f9">
                <a href="${linkPainel}" style="color:#16a34a">Ver minhas propostas</a> · <a href="https://acheisst.com.br" style="color:#16a34a">acheisst.com.br</a>
              </p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('notify-proposta-status error:', err);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
