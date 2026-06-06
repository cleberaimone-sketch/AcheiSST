'use client';
import { useState } from 'react';
import { ComposableMap, Geographies, Geography, type Geography as GeoType } from 'react-simple-maps';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight } from 'lucide-react';

const GEO_URL = '/brazil-states.geojson';

type Mode = 'fornecedores' | 'profissionais';

const FORN_BY_UF: Record<string, number> = {
  SP: 1011, RJ: 245, MG: 193, PR: 121, RS: 100, BA: 86, GO: 64,
  PE: 56, CE: 51, SC: 49, ES: 43, MA: 39, AM: 35, PA: 31, SE: 28,
  DF: 28, MS: 25, MT: 25, AL: 25, PB: 24, RN: 24, RO: 13, PI: 12,
  AP: 7, AC: 4, RR: 2, TO: 0,
};

const PROF_BY_UF: Record<string, number> = {
  PR: 44, SP: 25, RJ: 24, SC: 19, MG: 5, RS: 2,
};

const STATE_NAMES: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia',
  CE: 'Ceará', DF: 'Brasília (DF)', ES: 'Espírito Santo', GO: 'Goiás',
  MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná',
  PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul',
  RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina',
  SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
};

function getColor(count: number, mode: Mode): string {
  if (count === 0) return '#f1f5f9';
  if (mode === 'fornecedores') {
    if (count < 25)  return '#dcfce7';
    if (count < 50)  return '#86efac';
    if (count < 100) return '#4ade80';
    if (count < 200) return '#16a34a';
    return '#14532d';
  } else {
    if (count < 5)  return '#dcfce7';
    if (count < 20) return '#86efac';
    if (count < 40) return '#4ade80';
    return '#16a34a';
  }
}

export default function BrasilMapSection() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('fornecedores');
  const [tooltip, setTooltip] = useState<{ uf: string; x: number; y: number } | null>(null);

  const counts = mode === 'fornecedores' ? FORN_BY_UF : PROF_BY_UF;
  const allUFs = Object.keys(mode === 'fornecedores' ? FORN_BY_UF : STATE_NAMES);

  const topStates = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  function handleStateClick(uf: string) {
    const count = counts[uf] ?? 0;
    if (count === 0) return;
    const base = mode === 'fornecedores' ? '/fornecedores' : '/profissionais';
    router.push(`${base}?uf=${uf}`);
  }

  return (
    <section className="bg-slate-50 py-8 md:py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">
              Explore por estado
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              SST em todo o Brasil
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {totalCount.toLocaleString('pt-BR')} {mode} em{' '}
              {Object.values(counts).filter((v) => v > 0).length} estados
            </p>
          </div>

          {/* Toggle */}
          <div className="inline-flex bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-sm">
            <button
              onClick={() => setMode('fornecedores')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                mode === 'fornecedores'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-green-600'
              }`}
            >
              Fornecedores
            </button>
            <button
              onClick={() => setMode('profissionais')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                mode === 'profissionais'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-green-600'
              }`}
            >
              Profissionais
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Mapa */}
          <div className="relative flex-1 min-w-0 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ center: [-54, -16], scale: 700 }}
              width={700}
              height={560}
              className="w-full h-auto"
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: GeoType[] }) =>
                  geographies.map((geo: GeoType) => {
                    const uf = geo.properties.sigla as string;
                    const count = counts[uf] ?? 0;
                    const color = getColor(count, mode);
                    const hasData = count > 0;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={color}
                        stroke="#FFFFFF"
                        strokeWidth={0.6}
                        style={{
                          default: { outline: 'none' },
                          hover: {
                            fill: hasData ? '#15803d' : '#e2e8f0',
                            outline: 'none',
                            cursor: hasData ? 'pointer' : 'default',
                          },
                          pressed: { fill: '#14532d', outline: 'none' },
                        }}
                        onMouseEnter={(e: React.MouseEvent) => {
                          setTooltip({ uf, x: e.clientX, y: e.clientY });
                        }}
                        onMouseMove={(e: React.MouseEvent) => {
                          setTooltip({ uf, x: e.clientX, y: e.clientY });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        onClick={() => handleStateClick(uf)}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>

            {/* Hint */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-slate-100 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-green-600" />
              <span className="text-[11px] text-slate-500 font-medium">Clique no estado para ver listagem</span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-52 xl:w-60 space-y-4 shrink-0">

            {/* Top 5 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-3">
                Top estados
              </p>
              <div className="space-y-1">
                {topStates.map(([uf, count], i) => (
                  <button
                    key={uf}
                    onClick={() => handleStateClick(uf)}
                    className="w-full flex items-center gap-2.5 hover:bg-slate-50 rounded-xl px-2 py-2 transition-colors text-left group"
                  >
                    <span className="text-xs text-slate-400 font-mono w-3.5 shrink-0">{i + 1}</span>
                    <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-extrabold text-green-700">{uf}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                        {STATE_NAMES[uf]}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {count.toLocaleString('pt-BR')} {mode === 'fornecedores' ? 'fornec.' : 'profis.'}
                      </p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-green-500 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Legenda */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Legenda</p>
              <div className="space-y-2">
                {[
                  { color: '#f1f5f9', label: 'Nenhum cadastrado' },
                  { color: '#dcfce7', label: 'Poucos (1–24)' },
                  { color: '#86efac', label: 'Alguns (25–99)' },
                  { color: '#4ade80', label: 'Muitos (100–199)' },
                  { color: '#14532d', label: '200 ou mais' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div
                      className="w-4 h-4 rounded border border-slate-200 shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[11px] text-slate-500 leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Mobile: grid de estados (visível só em mobile) */}
        <div className="mt-5 lg:hidden">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            Todos os estados
          </p>
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
            {Object.keys(STATE_NAMES)
              .sort()
              .map((uf) => {
                const count = counts[uf] ?? 0;
                return (
                  <button
                    key={uf}
                    onClick={() => handleStateClick(uf)}
                    disabled={count === 0}
                    className={`flex flex-col items-center rounded-xl p-2 border transition-colors ${
                      count > 0
                        ? 'bg-white border-slate-200 hover:border-green-400 hover:bg-green-50 cursor-pointer'
                        : 'bg-slate-50 border-slate-100 opacity-50 cursor-default'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-green-700">{uf}</span>
                    <span className="text-[9px] text-slate-400">{count || '–'}</span>
                  </button>
                );
              })}
          </div>
        </div>

      </div>

      {/* Tooltip global (fixed, segue mouse) */}
      {tooltip && (
        <div
          className="fixed pointer-events-none z-50 bg-slate-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl"
          style={{ left: tooltip.x + 14, top: tooltip.y - 48 }}
        >
          <p className="font-bold leading-tight">{STATE_NAMES[tooltip.uf] ?? tooltip.uf}</p>
          <p className="text-slate-300 text-[11px] mt-0.5">
            {(counts[tooltip.uf] ?? 0).toLocaleString('pt-BR')}{' '}
            {mode === 'fornecedores' ? 'fornecedores' : 'profissionais'}
          </p>
          {(counts[tooltip.uf] ?? 0) > 0 && (
            <p className="text-green-400 text-[10px] mt-0.5">Clique para ver →</p>
          )}
        </div>
      )}
    </section>
  );
}
