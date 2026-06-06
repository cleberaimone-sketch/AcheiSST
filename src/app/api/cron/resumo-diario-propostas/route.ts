import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

/**
 * Resumo diário de propostas recebidas — enviado 1x/dia ao contratante.
 * Disparado pelo Vercel Cron (configurado em vercel.json).
 * Protegido por CRON_SECRET (header Authorization: Bearer ...).
 */
export async function GET(req: NextRequest) {
  // Verificação de segurança — Vercel Cron envia esse header automaticamente
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Janela: últimas 24h
    const desde = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Busca propostas novas das últimas 24h ainda em status 'enviada' ou 'visualizada'
    const { data: propostas } = await supabaseAdmin
      .from('propostas')
      .select('id, projeto_id, prestador_user_id, valor, prazo_dias, created_at, status')
      .gte('created_at', desde)
      .in('status', ['enviada', 'visualizada']);

    if (!propostas || propostas.length === 0) {
      return NextResponse.json({ ok: true, enviados: 0, motivo: 'nenhuma_proposta_nova' });
    }

    // Agrupa por projeto
    const propostasPorProjeto: Record<string, typeof propostas> = {};
    propostas.forEach((p) => {
      if (!propostasPorProjeto[p.projeto_id]) propostasPorProjeto[p.projeto_id] = [];
      propostasPorProjeto[p.projeto_id].push(p);
    });

    // Busca os projetos correspondentes
    const projetoIds = Object.keys(propostasPorProjeto);
    const { data: projetos } = await supabaseAdmin
      .from('projetos_servico')
      .select('id, titulo, categoria_id, contratante_user_id')
      .in('id', projetoIds);

    if (!projetos || projetos.length === 0) {
      return NextResponse.json({ ok: true, enviados: 0, motivo: 'projetos_nao_encontrados' });
    }

    // Categorias para enriquecer o email
    const { data: categorias } = await supabaseAdmin
      .from('categorias_sst')
      .select('id, nome, icon');
    const catMap = (categorias ?? []).reduce<Record<string, { nome: string; icon: string | null }>>((acc, c) => {
      acc[c.id] = c; return acc;
    }, {});

    // Agrupa projetos por contratante
    const projetosPorContratante: Record<string, typeof projetos> = {};
    projetos.forEach((proj) => {
      if (!projetosPorContratante[proj.contratante_user_id]) projetosPorContratante[proj.contratante_user_id] = [];
      projetosPorContratante[proj.contratante_user_id].push(proj);
    });

    let enviados = 0;
    let falhas = 0;

    // Pra cada contratante, envia 1 email com o resumo de TODOS os projetos dele
    for (const [contratanteId, projetosDoContratante] of Object.entries(projetosPorContratante)) {
      // Pula contratantes que desativaram o email diário
      const { data: perfil } = await supabaseAdmin
        .from('profiles')
        .select('display_name, notificacoes_email_resumo_diario')
        .eq('user_id', contratanteId)
        .maybeSingle();

      if (perfil?.notificacoes_email_resumo_diario === false) continue;

      // Busca email do contratante
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(contratanteId);
      const emailContratante = authUser?.user?.email;
      if (!emailContratante) { falhas++; continue; }

      const nomeContratante = perfil?.display_name ?? 'Contratante';

      // Total de propostas novas pra esse contratante
      const totalPropostas = projetosDoContratante.reduce(
        (acc, p) => acc + (propostasPorProjeto[p.id]?.length ?? 0),
        0
      );

      // Monta blocos de projeto
      const blocosHtml = projetosDoContratante.map((proj) => {
        const props = propostasPorProjeto[proj.id] ?? [];
        const cat = catMap[proj.categoria_id];
        const valores = props.map((p) => Number(p.valor));
        const min = Math.min(...valores);
        const max = Math.max(...valores);
        const faixaValores = min === max
          ? `R$ ${min.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          : `R$ ${min.toLocaleString('pt-BR')} – R$ ${max.toLocaleString('pt-BR')}`;

        return `
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px;margin-bottom:14px">
            ${cat ? `<p style="color:#15803d;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;margin:0 0 6px">${cat.icon ?? ''} ${cat.nome}</p>` : ''}
            <p style="color:#0f172a;font-size:15px;font-weight:700;margin:0 0 10px">${proj.titulo}</p>
            <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:13px">
              <span style="color:#16a34a;font-weight:700">${props.length} ${props.length === 1 ? 'nova proposta' : 'novas propostas'}</span>
              <span style="color:#64748b">${faixaValores}</span>
            </div>
            <a href="https://acheisst.com.br/projetos/${proj.id}" style="display:inline-block;margin-top:10px;background:#16a34a;color:#fff;font-weight:600;font-size:13px;padding:8px 16px;border-radius:8px;text-decoration:none">Ver propostas →</a>
          </div>
        `;
      }).join('');

      try {
        await resend.emails.send({
          from: 'AcheiSST <noreply@acheisst.com.br>',
          to: emailContratante,
          subject: `📨 ${totalPropostas} ${totalPropostas === 1 ? 'nova proposta' : 'novas propostas'} no AcheiSST hoje`,
          html: `
            <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
              <div style="background:#16a34a;padding:28px 32px">
                <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800">📨 Seu resumo diário</h1>
                <p style="color:#bbf7d0;margin:6px 0 0;font-size:14px">${totalPropostas} ${totalPropostas === 1 ? 'nova proposta recebida' : 'novas propostas recebidas'} nas últimas 24h</p>
              </div>
              <div style="padding:28px 32px">
                <p style="color:#475569;font-size:15px;margin:0 0 20px">
                  Olá, <strong>${nomeContratante}</strong>! Aqui está o resumo das propostas que chegaram pros seus projetos:
                </p>

                ${blocosHtml}

                <div style="margin-top:24px;padding-top:24px;border-top:1px solid #f1f5f9">
                  <a href="https://acheisst.com.br/painel/projetos" style="display:inline-block;background:#16a34a;color:#fff;font-weight:700;font-size:14px;padding:13px 24px;border-radius:10px;text-decoration:none">
                    Ver tudo no painel →
                  </a>
                </div>

                <p style="color:#94a3b8;font-size:11px;margin:24px 0 0;line-height:1.5">
                  Você recebe esse email 1x por dia com o resumo das suas propostas.
                  <a href="https://acheisst.com.br/painel" style="color:#16a34a">Configurações</a> · <a href="https://acheisst.com.br" style="color:#16a34a">acheisst.com.br</a>
                </p>
              </div>
            </div>
          `,
        });
        enviados++;
      } catch (err) {
        console.error('Falha ao enviar resumo:', err);
        falhas++;
      }
    }

    return NextResponse.json({
      ok: true,
      enviados,
      falhas,
      total_contratantes: Object.keys(projetosPorContratante).length,
      total_propostas: propostas.length,
    });
  } catch (err) {
    console.error('cron resumo-diario error:', err);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
