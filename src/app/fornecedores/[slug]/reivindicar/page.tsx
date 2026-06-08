import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServer } from '@/lib/supabase-server';
import { Navbar } from '@/components/Navbar';
import { ReivindicarForm } from '@/components/ReivindicarForm';
import {
  Shield, CheckCircle2, ArrowLeft, MapPin, Lock, UserPlus, LogIn,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Reivindicar perfil — AcheiSST',
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReivindicarPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServer();

  const { data: fornecedor } = await supabase
    .from('fornecedores')
    .select('id, slug, nome, categoria, cidade, uf, foto_url, logo_url, auth_user_id, descricao')
    .eq('slug', slug)
    .single();

  if (!fornecedor) notFound();

  // Já reivindicado por alguém? Redireciona pro perfil
  if (fornecedor.auth_user_id) {
    redirect(`/fornecedores/${slug}?ja_reivindicado=1`);
  }

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-5">
            <Link href={`/fornecedores/${slug}`} className="hover:text-green-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar para o perfil
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-amber-100 items-center justify-center mb-3">
              <Shield className="w-7 h-7 text-amber-700" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Reivindicar este perfil
            </h1>
            <p className="text-slate-500 max-w-xl mx-auto">
              Confirme que você é o responsável por esta empresa e ganhe controle total do perfil.
            </p>
          </div>

          {/* Preview da empresa */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-6">
            <div className="flex items-start gap-4">
              {fornecedor.logo_url ? (
                <img
                  src={fornecedor.logo_url}
                  alt={fornecedor.nome}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-slate-100"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-extrabold text-white">
                    {fornecedor.nome[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1 leading-tight">
                  {fornecedor.nome}
                </h2>
                <p className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-green-600 mb-2">
                  {fornecedor.categoria}
                </p>
                <p className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {fornecedor.cidade}, {fornecedor.uf}
                </p>
              </div>
            </div>
          </div>

          {/* Benefícios */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-3">
              O que você ganha
            </p>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                <span className="text-sm text-slate-700">Editar todos os dados da empresa (descrição, contatos, fotos, serviços)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                <span className="text-sm text-slate-700">Receber leads diretos no painel + email</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                <span className="text-sm text-slate-700">Aceitar projetos no marketplace (contratantes enviam pedidos pra você)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                <span className="text-sm text-slate-700">Selo "Perfil verificado pelo dono" visível pra qualquer visitante</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                <span className="text-sm text-slate-700">Tudo gratuito durante a fase beta</span>
              </li>
            </ul>
          </div>

          {/* Ação: logado vs não logado */}
          {user ? (
            <ReivindicarForm
              fornecedorId={fornecedor.id}
              fornecedorSlug={fornecedor.slug}
              fornecedorNome={fornecedor.nome}
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                href={`/painel/cadastrar?next=/fornecedores/${slug}/reivindicar`}
                className="flex flex-col items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-2xl p-6 transition-colors text-center"
              >
                <UserPlus className="w-6 h-6" />
                <span className="font-extrabold">Criar conta grátis</span>
                <span className="text-xs text-green-100">Leva menos de 1 minuto</span>
              </Link>
              <Link
                href={`/painel/login?next=/fornecedores/${slug}/reivindicar`}
                className="flex flex-col items-center gap-2 bg-white border border-slate-200 hover:border-green-400 text-slate-700 hover:text-green-700 rounded-2xl p-6 transition-colors text-center"
              >
                <LogIn className="w-6 h-6" />
                <span className="font-extrabold">Já tenho conta</span>
                <span className="text-xs text-slate-400">Entrar com email e senha</span>
              </Link>
            </div>
          )}

          {/* Aviso */}
          <div className="mt-6 bg-slate-100 border border-slate-200 rounded-xl p-4 flex items-start gap-2.5">
            <Lock className="w-4 h-4 mt-0.5 text-slate-500 shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Importante:</strong> ao reivindicar, você declara ser o representante legal ou autorizado da empresa.
              Reivindicações fraudulentas podem ser revogadas e a conta suspensa.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
