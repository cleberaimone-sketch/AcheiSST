import { createSupabaseServer } from '@/lib/supabase-server';
import { Navbar } from '@/components/Navbar';
import { ProjetosListClient } from '@/components/ProjetosListClient';

export const metadata = {
  title: 'Projetos abertos — AcheiSST',
  description: 'Encontre projetos abertos de SST no Brasil: PGR, PCMSO, LTCAT, treinamentos NR e mais. Envie propostas e cresça seu negócio.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjetosPage() {
  const supabase = await createSupabaseServer();

  // Busca projetos abertos com join nas categorias e contagem de propostas
  const { data: projetosRaw } = await supabase
    .from('projetos_servico')
    .select(`
      id, titulo, descricao, categoria_id, cidade, uf,
      atende_remoto, prazo_dias, orcamento_min, orcamento_max,
      status, created_at, expires_at, contratante_user_id
    `)
    .in('status', ['aberto', 'em_analise'])
    .order('created_at', { ascending: false });

  const { data: categorias } = await supabase
    .from('categorias_sst')
    .select('id, nome, icon, ordem')
    .eq('ativo', true)
    .order('ordem');

  // Contagem de propostas por projeto (1 query agregada)
  const projetoIds = (projetosRaw ?? []).map((p) => p.id);
  let propostasCount: Record<string, number> = {};
  if (projetoIds.length > 0) {
    const { data: propostas } = await supabase
      .from('propostas')
      .select('projeto_id')
      .in('projeto_id', projetoIds);
    propostasCount = (propostas ?? []).reduce<Record<string, number>>((acc, p) => {
      acc[p.projeto_id] = (acc[p.projeto_id] ?? 0) + 1;
      return acc;
    }, {});
  }

  const projetos = (projetosRaw ?? []).map((p) => ({
    ...p,
    num_propostas: propostasCount[p.id] ?? 0,
  }));

  // Estatísticas para o topo
  const stats = {
    total: projetos.length,
    estados: new Set(projetos.map((p) => p.uf)).size,
    remoto: projetos.filter((p) => p.atende_remoto).length,
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-slate-50">
        <ProjetosListClient
          projetos={projetos}
          categorias={categorias ?? []}
          stats={stats}
        />
      </main>
    </>
  );
}
