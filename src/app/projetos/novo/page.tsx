import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase-server';
import { Navbar } from '@/components/Navbar';
import { PublicarPedidoForm } from '@/components/PublicarPedidoForm';

export const metadata = {
  title: 'Publicar pedido de serviço SST — AcheiSST',
  description: 'Publique seu pedido de serviço SST grátis e receba propostas de prestadores qualificados em todo o Brasil.',
};

export const dynamic = 'force-dynamic';

export default async function NovoProjetoPage() {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth?next=/projetos/novo');
  }

  const { data: categorias } = await supabase
    .from('categorias_sst')
    .select('id, nome, descricao, icon, ordem')
    .eq('ativo', true)
    .order('ordem');

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
              <a href="/" className="hover:text-green-600 transition-colors">Início</a>
              <span>/</span>
              <a href="/projetos" className="hover:text-green-600 transition-colors">Projetos</a>
              <span>/</span>
              <span className="text-slate-700 font-medium">Publicar pedido</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Publique seu pedido <span className="text-green-600">grátis</span>
            </h1>
            <p className="text-slate-500 text-base">
              Descreva o serviço SST que você precisa e receba propostas de prestadores qualificados.
            </p>
          </div>

          <PublicarPedidoForm
            categorias={categorias ?? []}
            userId={user.id}
          />
        </div>
      </main>
    </>
  );
}
