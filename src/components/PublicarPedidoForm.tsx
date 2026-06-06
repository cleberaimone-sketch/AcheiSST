'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Check, MapPin, Calendar, DollarSign,
  Sparkles, AlertCircle, Loader2,
} from 'lucide-react';
import { createSupabaseBrowser } from '@/lib/supabase-browser';

interface Categoria {
  id: string;
  nome: string;
  descricao: string | null;
  icon: string | null;
  ordem: number;
}

interface Props {
  categorias: Categoria[];
  userId: string;
}

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
];

const PRAZO_OPCOES = [
  { dias: 7,  label: '1 semana' },
  { dias: 15, label: '15 dias' },
  { dias: 30, label: '1 mês' },
  { dias: 60, label: '2 meses' },
  { dias: 90, label: '3 meses' },
];

type Step = 1 | 2 | 3 | 4;

export function PublicarPedidoForm({ categorias, userId }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Form state
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [atendeRemoto, setAtendeRemoto] = useState(false);
  const [prazoDias, setPrazoDias] = useState(30);
  const [semOrcamento, setSemOrcamento] = useState(false);
  const [orcamentoMin, setOrcamentoMin] = useState('');
  const [orcamentoMax, setOrcamentoMax] = useState('');

  const categoriaEscolhida = categorias.find((c) => c.id === categoriaId);

  // Validações por step
  function validaStep1(): string | null {
    if (!categoriaId) return 'Selecione uma categoria';
    if (titulo.trim().length < 10) return 'Título precisa ter no mínimo 10 caracteres';
    if (titulo.trim().length > 120) return 'Título não pode passar de 120 caracteres';
    if (descricao.trim().length < 30) return 'Descrição precisa ter no mínimo 30 caracteres';
    return null;
  }
  function validaStep2(): string | null {
    if (!cidade.trim()) return 'Informe a cidade';
    if (!uf) return 'Selecione o estado (UF)';
    if (!prazoDias || prazoDias <= 0) return 'Selecione um prazo';
    return null;
  }

  function avancar() {
    setErro(null);
    if (step === 1) {
      const e = validaStep1();
      if (e) { setErro(e); return; }
      setStep(2);
    } else if (step === 2) {
      const e = validaStep2();
      if (e) { setErro(e); return; }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  }

  function voltar() {
    setErro(null);
    if (step > 1) setStep((step - 1) as Step);
  }

  async function publicar() {
    setSubmitting(true);
    setErro(null);

    const supabase = createSupabaseBrowser();
    const { data, error } = await supabase
      .from('projetos_servico')
      .insert({
        contratante_user_id: userId,
        categoria_id: categoriaId,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        cidade: cidade.trim(),
        uf,
        atende_remoto: atendeRemoto,
        prazo_dias: prazoDias,
        orcamento_min: semOrcamento || !orcamentoMin ? null : Number(orcamentoMin),
        orcamento_max: semOrcamento || !orcamentoMax ? null : Number(orcamentoMax),
        status: 'aberto',
      })
      .select()
      .single();

    if (error) {
      setErro(`Erro ao publicar: ${error.message}`);
      setSubmitting(false);
      return;
    }

    router.push(`/projetos/${data.id}?novo=1`);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* Progress bar */}
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-green-600">
            Passo {step} de 4
          </p>
          <p className="text-xs text-slate-400">
            {step === 1 && 'Sobre o serviço'}
            {step === 2 && 'Localização e prazo'}
            {step === 3 && 'Orçamento'}
            {step === 4 && 'Revisão'}
          </p>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-6 sm:p-8">

        {/* ───────── STEP 1: Categoria + Título + Descrição ───────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3">
                Qual serviço você precisa?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categorias.map((c) => {
                  const isSel = c.id === categoriaId;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategoriaId(c.id)}
                      className={`flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all ${
                        isSel
                          ? 'border-green-500 bg-green-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-green-300'
                      }`}
                    >
                      <span className="text-2xl mb-1">{c.icon}</span>
                      <span className={`text-xs font-semibold leading-tight ${isSel ? 'text-green-800' : 'text-slate-700'}`}>
                        {c.nome}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Título do pedido
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Preciso de PGR para indústria com 30 funcionários"
                maxLength={120}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                {titulo.length}/120 caracteres — seja claro e específico
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Descrição detalhada
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={6}
                placeholder="Descreva o serviço. Quanto mais detalhes, melhores as propostas. Ex: empresa do ramo metalúrgico, 32 funcionários CLT, precisa elaborar PGR conforme NR-1. Já temos PPRA antigo de 2022. Localizada na zona leste de SP..."
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none"
              />
              <p className="text-xs text-slate-400 mt-1">
                {descricao.length} caracteres (mínimo 30)
              </p>
            </div>
          </div>
        )}

        {/* ───────── STEP 2: Localização + Prazo ───────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex: São Paulo"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Estado (UF)
                </label>
                <select
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                  className="w-full px-3 py-3 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer"
                >
                  <option value="">UF...</option>
                  {UFS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-green-300 transition-colors">
              <input
                type="checkbox"
                checked={atendeRemoto}
                onChange={(e) => setAtendeRemoto(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-green-600 focus:ring-green-500"
              />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Aceito serviço remoto / online
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Recomendado para PGR, LTCAT documental, treinamentos EAD e consultoria por videochamada.
                </p>
              </div>
            </label>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-3">
                Prazo desejado para conclusão
              </label>
              <div className="grid grid-cols-5 gap-2">
                {PRAZO_OPCOES.map((p) => {
                  const isSel = p.dias === prazoDias;
                  return (
                    <button
                      key={p.dias}
                      type="button"
                      onClick={() => setPrazoDias(p.dias)}
                      className={`px-3 py-3 rounded-xl text-xs font-bold transition-all ${
                        isSel
                          ? 'bg-green-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-green-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ───────── STEP 3: Orçamento ───────── */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center py-2">
              <DollarSign className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Informar uma faixa ajuda a atrair propostas alinhadas ao seu bolso.
                Mas você pode pular e deixar os prestadores sugerirem.
              </p>
            </div>

            {!semOrcamento && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    De (R$)
                  </label>
                  <input
                    type="number"
                    value={orcamentoMin}
                    onChange={(e) => setOrcamentoMin(e.target.value)}
                    placeholder="500"
                    min={0}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Até (R$)
                  </label>
                  <input
                    type="number"
                    value={orcamentoMax}
                    onChange={(e) => setOrcamentoMax(e.target.value)}
                    placeholder="1500"
                    min={0}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>
              </div>
            )}

            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-green-300 transition-colors">
              <input
                type="checkbox"
                checked={semOrcamento}
                onChange={(e) => setSemOrcamento(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-green-600 focus:ring-green-500"
              />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Não tenho ideia, prestadores que sugerem
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Você compara os valores propostos depois.
                </p>
              </div>
            </label>
          </div>
        )}

        {/* ───────── STEP 4: Revisão ───────── */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-900">
                  Confira antes de publicar
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  Após publicado, prestadores poderão enviar propostas. Você poderá editar ou cancelar a qualquer momento no seu painel.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <span className="text-3xl">{categoriaEscolhida?.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">
                    {categoriaEscolhida?.nome}
                  </p>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    {titulo}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {descricao}
              </p>

              <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100 text-xs">
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {cidade}, {uf}
                  {atendeRemoto && ' · Aceita remoto'}
                </span>
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Prazo: {PRAZO_OPCOES.find(p => p.dias === prazoDias)?.label}
                </span>
                {!semOrcamento && (orcamentoMin || orcamentoMax) && (
                  <span className="inline-flex items-center gap-1 text-slate-600">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    R$ {orcamentoMin || '?'} – R$ {orcamentoMax || '?'}
                  </span>
                )}
                {semOrcamento && (
                  <span className="text-slate-500 italic">Orçamento a sugerir</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div className="mt-5 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{erro}</p>
          </div>
        )}

        {/* Navegação */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={voltar}
            disabled={step === 1 || submitting}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={avancar}
              className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={publicar}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Publicar pedido grátis
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
