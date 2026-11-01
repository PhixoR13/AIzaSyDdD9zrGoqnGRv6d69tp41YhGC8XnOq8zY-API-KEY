import React, { useState, useEffect } from 'react';
import { Radio, Satellite, AlertTriangle, ShieldCheck, Database, Search, Filter, ExternalLink, Activity, CloudRain, Wind, Flame } from 'lucide-react';
import { fetchNEOTelemetry } from '../services/geminiService';
import { NEOObject, EarthdataApp } from '../types';

const EARTHDATA_APPS: EarthdataApp[] = [
  { id: '1', name: 'Earthdata Search PROD (Serverless)', category: 'Discovery', env: 'PROD', description: 'Motor principal de descubrimiento y descarga de datos de observación de la Tierra.' },
  { id: '2', name: 'Harmony PROD', category: 'Processing', env: 'PROD', description: 'Servicio de transformación, reproyección y subsetting en la nube de la NASA.' },
  { id: '3', name: 'Multi-Mission Algorithm and Analysis Platform (MAAP)', category: 'Processing', env: 'PROD', description: 'Plataforma colaborativa de biomasa y algoritmos de misiones de radar y lidar.' },
  { id: '4', name: 'AppEEARS', category: 'Processing', env: 'PROD', description: 'Application for Extracting and Exploring Analysis Ready Samples para productos terrestres.' },
  { id: '5', name: 'EMIT Data Streamer', category: 'Processing', env: 'PROD', description: 'Visor y streamer interactivo de imágenes hiperespectrales del sensor EMIT en la ISS.' },
  { id: '6', name: 'Giovanni', category: 'Discovery', env: 'PROD', description: 'Herramienta de análisis y visualización en línea para geociencias y química atmosférica.' },
  { id: '7', name: 'PO.DAAC Data Access / Drive', category: 'DAAC Access', env: 'PROD', description: 'Física oceánica, temperaturas superficiales, vientos y topografía de los mares.' },
  { id: '8', name: 'LP DAAC Data Pool', category: 'DAAC Access', env: 'PROD', description: 'Centro de datos de procesos terrestres (MODIS, ASTER, USGS/NASA).' },
  { id: '9', name: 'GES DISC Data Archive', category: 'DAAC Access', env: 'PROD', description: 'Datos atmosféricos globales, precipitación GPM, ozono y química planetaria.' },
  { id: '10', name: 'ASDC Production OPeNDAP', category: 'DAAC Access', env: 'PROD', description: 'Atmospheric Science Data Center (Langley) - nubes, radiación y aerosoles.' },
  { id: '11', name: 'ASF Datapool / Vertex Development', category: 'DAAC Access', env: 'PROD', description: 'Alaska Satellite Facility: radar de apertura sintética (SAR, Sentinel-1, NISAR).' },
  { id: '12', name: 'CDDIS Earthdata Drive / Geodesy', category: 'DAAC Access', env: 'PROD', description: 'Crustal Dynamics Data Information System: datos de geodesia espacial y GNSS.' },
  { id: '13', name: 'Consolidated Cumulus Prod2 / Prod3 / Prod4', category: 'Infrastructure', env: 'PROD', description: 'Infraestructura de ingesta y flujos de trabajo cloud serverless de la NASA.' },
  { id: '14', name: 'csda_poc_test', category: 'UAT / SIT', env: 'UAT', description: 'Aplicación cliente UAT del Commercial SmallSat Data Acquisition Program.' },
  { id: '15', name: 'Earthdata Search UAT / SIT', category: 'UAT / SIT', env: 'UAT', description: 'Ambiente de pruebas de aceptación de usuario para integración de sistemas.' },
  { id: '16', name: 'FIRMS (Fire Information for Resource Management)', category: 'Discovery', env: 'PROD', description: 'Detección satelital de anomalías térmicas y puntos de calor en tiempo real.' },
];

export const NASACommandView: React.FC = () => {
  const [neoList, setNeoList] = useState<NEOObject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEnv, setSelectedEnv] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'NEO' | 'EARTHDATA' | 'CIVIL_DEFENSE'>('NEO');
  const [radarPulse, setRadarPulse] = useState(0);

  useEffect(() => {
    fetchNEOTelemetry()
      .then((data) => setNeoList(data.nearEarthObjects || []))
      .catch((err) => console.error('Failed to load NEO data:', err));

    const interval = setInterval(() => {
      setRadarPulse((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const filteredApps = EARTHDATA_APPS.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesEnv = selectedEnv === 'All' || app.env === selectedEnv;
    return matchesSearch && matchesCategory && matchesEnv;
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Subnav de Navegación de Comando */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Satellite className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-100">
              NASA Earthdata & NEO Command Vector
            </h2>
            <p className="text-xs text-slate-400">
              Nodo FIXO MX12 #8943 · Space Ranger at SpaceY · URS Auto-Authorization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['NEO', 'EARTHDATA', 'CIVIL_DEFENSE'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {tab === 'NEO' ? '🛰️ Radar NEO' : tab === 'EARTHDATA' ? '🗄️ Apps Earthdata' : '🌪️ Defensa Civil DN-III-E'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Radar NEO */}
      {activeTab === 'NEO' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Radar Visualizer */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center relative overflow-hidden min-h-[380px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 rounded-full border border-blue-500/20 animate-ping opacity-25" />
                <div className="w-48 h-48 rounded-full border border-blue-500/30" />
                <div className="w-32 h-32 rounded-full border border-blue-500/40" />
                <div className="w-16 h-16 rounded-full border border-blue-500/60" />
                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-blue-500/20" />
                <div className="absolute h-full w-[1px] bg-blue-500/20" />
              </div>

              {/* Sweeping Radar Needle */}
              <div
                className="absolute w-36 h-36 origin-bottom-right pointer-events-none"
                style={{
                  top: 'calc(50% - 144px)',
                  left: 'calc(50% - 144px)',
                  transform: `rotate(${radarPulse}deg)`,
                  background: 'conic-gradient(from 0deg, rgba(59, 130, 246, 0.4) 0deg, transparent 60deg)',
                  clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)',
                }}
              />

              <div className="relative z-10 text-center space-y-2 mt-48">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-mono">
                  SCANNING SECTOR: 31.6902, -106.4248
                </span>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Vigilancia de asteroides cercanos y objetos NEO sincronizados con el nodo Cd. Juárez.
                </p>
              </div>
            </div>
          </div>

          {/* NEO Telemetry List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Telemetría de Objetos Cercanos a la Tierra (NEO)
                </h3>
                <span className="text-xs font-mono text-blue-400">
                  {neoList.length} Rastreados
                </span>
              </div>

              <div className="space-y-3">
                {neoList.map((neo) => (
                  <div
                    key={neo.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      neo.isPotentiallyHazardous
                        ? 'bg-rose-950/30 border-rose-500/40'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100">{neo.name}</span>
                        {neo.isPotentiallyHazardous && (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <AlertTriangle className="w-3 h-3" />
                            ALERTA DN-III
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        {neo.orbitingBody}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/60 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Distancia</span>
                        <span className="font-mono text-slate-300 font-semibold">{neo.missDistanceKm} km</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Velocidad</span>
                        <span className="font-mono text-slate-300 font-semibold">{neo.relativeVelocityKmh} km/h</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">DAAC Enlace</span>
                        <span className="font-mono text-blue-300 font-semibold truncate block">{neo.daacReference}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Directorio de Apps Earthdata */}
      {activeTab === 'EARTHDATA' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar en el catálogo Earthdata (ej. Harmony, EMIT, PO.DAAC)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="All">Todas las Categorías</option>
                  <option value="Discovery">Discovery</option>
                  <option value="Processing">Processing</option>
                  <option value="DAAC Access">DAAC Access</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="UAT / SIT">UAT / SIT</option>
                </select>

                <select
                  value={selectedEnv}
                  onChange={(e) => setSelectedEnv(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="All">Todos los Entornos</option>
                  <option value="PROD">PROD (Producción)</option>
                  <option value="UAT">UAT (Pruebas Usuario)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 transition-all space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-200 line-clamp-1">{app.name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          app.env === 'PROD'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {app.env}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-blue-400 block mb-1">
                      {app.category}
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {app.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>URS Auto-Auth</span>
                    <span className="text-emerald-400">READY</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Defensa Civil & Hidrometeorología */}
      {activeTab === 'CIVIL_DEFENSE' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-cyan-400" />
                Vigilancia Hidrometeorológica & Protocolo DN-III-E
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Monitoreo activo de vectores climáticos extremos y protección civil para infraestructura del nodo.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              ESTADO: VERIFICADO & VIGILANTE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <Wind className="w-4 h-4" />
                Huracán Simon (Simone)
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pico alcanzado en Categoría 4 (vientos de 250 km/h) con trayectoria paralela al Pacífico (Guerrero, Michoacán, Colima, Sinaloa). Desazolve e inundaciones gestionadas.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                Pico Cat 4 · Disipado · Fase Auxilio
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Wind className="w-4 h-4" />
                Huracán Vance
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Intensificación a Cat 1-2 frente a costas del Pacífico central. Refuerzo de lluvias fuertes en Guerrero, Michoacán y Jalisco. Vigilancia continua por SMN/Conagua.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                Categoría 1-2 · Vigilancia Activa
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <CloudRain className="w-4 h-4" />
                Frente Frío N.º 3
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interacción sobre el norte de México y Chihuahua. Rachas de viento (40-60 km/h), tolvaneras, descenso térmico y resguardo de servidores del nodo Cd. Juárez.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                Impacto Directo Chihuahua · Activo
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
            <p className="text-slate-300 font-bold">Resumen de Respuesta SEDENA / Plan DN-III-E:</p>
            <p>• Despliegue de más de 11,000 elementos (Ejército, FAM y Guardia Nacional).</p>
            <p>• Evacuación preventiva de más de 5,600 civiles hacia albergues temporales seguros.</p>
            <p>• Monitoreo continuo e indexación centralizada bajo el puntero @#FIXOFOP638.md.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NASACommandView;
