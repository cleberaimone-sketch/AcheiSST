'use client';
import { useState } from 'react';
import { ComposableMap, Geographies, Geography, type Geography as GeoType } from 'react-simple-maps';
import { useRouter } from 'next/navigation';
import { MapPin, X } from 'lucide-react';

const GEO_URL = '/brazil-states.geojson';

const FORN_BY_UF: Record<string, number> = {
  SP: 1011, RJ: 245, MG: 193, PR: 121, RS: 100, BA: 86, GO: 64,
  PE: 56, CE: 51, SC: 49, ES: 43, MA: 39, AM: 35, PA: 31, SE: 28,
  DF: 28, MS: 25, MT: 25, AL: 25, PB: 24, RN: 24, RO: 13, PI: 12,
  AP: 7, AC: 4, RR: 2, TO: 0,
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

function getColor(count: number, isSelected: boolean): string {
  if (isSelected) return '#15803d';
  if (count === 0) return '#f1f5f9';
  if (count < 25)  return '#dcfce7';
  if (count < 100) return '#86efac';
  if (count < 200) return '#4ade80';
  return '#166534';
}

interface Props {
  selectedUF?: string;
  selectedCat?: string;
}

export function FornecedoresMapFilter({ selectedUF, selectedCat }: Props) {
  const router = useRouter();
  const [tooltip, setTooltip] = useState<{ uf: string; x: number; y: number } | null>(null);

  function handleStateClick(uf: string) {
    const params = new URLSearchParams();
    if (selectedCat) params.set('cat', selectedCat);
    if (uf !== selectedUF) params.set('uf', uf);
    const qs = params.toString();
    router.push(`/fornecedores${qs ? '?' + qs : ''}`);
  }

  function clearUF() {
    const params = new URLSearchParams();
    if (selectedCat) params.set('cat', selectedCat);
    const qs = params.toString();
    router.push(`/fornecedores${qs ? '?' + qs : ''}`);
  }

  const topStates = Object.entries(FORN_BY_UF)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="bg-white border-b border-slate-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header da seção */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-slate-700">Filtrar por estado</span>
            {selectedUF && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full">
                {STATE_NAMES[selectedUF]} · {(FORN_BY_UF[selectedUF] ?? 0).toLocaleString('pt-BR')} fornecedores
              </span>
            )}
          </div>
          {selectedUF && (
            <button
              onClick={clearUF}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Ver todos os estados
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-stretch">

          {/* Mapa compacto */}
          <div className="relative flex-1 min-w-0 rounded-2xl border border-slate-100 overflow-hidden bg-slate-50">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ center: [-54, -16], scale: 630 }}
              width={700}
              height={420}
              className="w-full h-auto"
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: GeoType[] }) =>
                  geographies.map((geo: GeoType) => {
                    const uf = geo.properties.sigla as string;
                    const count = FORN_BY_UF[uf] ?? 0;
                    const isSelected = uf === selectedUF;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getColor(count, isSelected)}
                        stroke="#FFFFFF"
                        strokeWidth={isSelected ? 1.5 : 0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: { fill: '#15803d', outline: 'none', cursor: 'pointer' },
                          pressed: { fill: '#14532d', outline: 'none' },
                        }}
                        onMouseEnter={(e: React.MouseEvent) =>
                          setTooltip({ uf, x: e.clientX, y: e.clientY })
                        }
                        onMouseMove={(e: React.MouseEvent) =>
                          setTooltip({ uf, x: e.clientX, y: e.clientY })
                        }
                        onMouseLeave={() => setTooltip(null)}
                        onClick={() => handleStateClick(uf)}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>

            <div className="absolute bottom-2 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] text-slate-400 border border-slate-100">
              <span>Clique no estado · clique novamente para desmarcar</span>
            </div>
          </div>

          {/* Sidebar: top estados + mobile grid */}
          <div className="w-full lg:w-48 xl:w-56 flex flex-col gap-3 shrink-0">

            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                Mais fornecedores
              </p>
              <div className="space-y-1">
                {topStates.map(([uf, count]) => {
                  const isSelected = uf === selectedUF;
                  return (
                    <button
                      key={uf}
                      onClick={() => handleStateClick(uf)}
                      className={`w-full flex items-center gap-2 rounded-xl px-2 py-2 transition-colors text-left group ${
                        isSelected
                          ? 'bg-green-600 text-white'
                          : 'hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-green-500' : 'bg-white border border-slate-200'
                      }`}>
                        <span className={`text-[10px] font-extrabold ${isSelected ? 'text-white' : 'text-green-700'}`}>
                          {uf}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {STATE_NAMES[uf]}
                        </p>
                        <p className={`text-[10px] ${isSelected ? 'text-green-200' : 'text-slate-400'}`}>
                          {count.toLocaleString('pt-BR')} fornec.
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile: todos os estados em grid pequeno */}
            <div className="lg:hidden grid grid-cols-6 gap-1.5">
              {Object.keys(STATE_NAMES).sort().map((uf) => {
                const count = FORN_BY_UF[uf] ?? 0;
                const isSelected = uf === selectedUF;
                return (
                  <button
                    key={uf}
                    onClick={() => count > 0 && handleStateClick(uf)}
                    className={`rounded-lg py-1.5 text-center transition-colors text-[10px] font-bold ${
                      isSelected
                        ? 'bg-green-600 text-white'
                        : count > 0
                        ? 'bg-white border border-slate-200 text-green-700 hover:border-green-400'
                        : 'bg-slate-50 text-slate-300 cursor-default'
                    }`}
                  >
                    {uf}
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* Tooltip global */}
      {tooltip && (
        <div
          className="fixed pointer-events-none z-50 bg-slate-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl"
          style={{ left: tooltip.x + 14, top: tooltip.y - 50 }}
        >
          <p className="font-bold">{STATE_NAMES[tooltip.uf] ?? tooltip.uf}</p>
          <p className="text-slate-300 text-[11px] mt-0.5">
            {(FORN_BY_UF[tooltip.uf] ?? 0).toLocaleString('pt-BR')} fornecedores
          </p>
          {tooltip.uf === selectedUF ? (
            <p className="text-amber-400 text-[10px] mt-0.5">Clique para desmarcar</p>
          ) : (FORN_BY_UF[tooltip.uf] ?? 0) > 0 && (
            <p className="text-green-400 text-[10px] mt-0.5">Clique para filtrar →</p>
          )}
        </div>
      )}
    </div>
  );
}
