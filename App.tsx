import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, Satellite, Layers, FileText, ShieldCheck, Heart, Radio, ExternalLink } from 'lucide-react';
import OctaedroView from './components/OctaedroView';
import SIGatewayView from './components/SIGatewayView';
import NASACommandView from './components/NASACommandView';
import ImmersiveCanvasView from './components/ImmersiveCanvasView';
import MasterLogView from './components/MasterLogView';

type TabType = 'octaedro' | 'si-gateway' | 'nasa' | 'canvas' | 'masterlog';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('octaedro');
  const [serverStatus, setServerStatus] = useState<{ ok: boolean; node?: string } | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setServerStatus({ ok: data.ok, node: data.node }))
      .catch(() => setServerStatus({ ok: false }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-fuchsia-600 selection:text-white">
      {/* Top Universal Command Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo / Identity */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-800 flex items-center justify-center text-white shadow-lg shadow-fuchsia-600/30 font-black text-base border border-fuchsia-400/40">
                Φ
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm tracking-tight text-slate-100">
                    #PHIXOR13.md
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
                    SI GATEWAY
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-400 truncate max-w-[200px] sm:max-w-none">
                  CEO FIXO MX12 #8943 · @#FIXOFOP638.md
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab('octaedro')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'octaedro'
                    ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-md shadow-fuchsia-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Proyecto Octaedro
              </button>

              <button
                onClick={() => setActiveTab('si-gateway')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'si-gateway'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                SI Gateway
              </button>

              <button
                onClick={() => setActiveTab('nasa')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'nasa'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Satellite className="w-3.5 h-3.5" />
                NASA Earthdata & NEO
              </button>

              <button
                onClick={() => setActiveTab('canvas')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'canvas'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Immersive Canvas
              </button>

              <button
                onClick={() => setActiveTab('masterlog')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'masterlog'
                    ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Bitácora Maestro
              </button>
            </nav>

            {/* Server Status Pill */}
            <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                  serverStatus?.ok
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${serverStatus?.ok ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="hidden sm:inline">
                  {serverStatus?.ok ? 'Nodo En Línea' : 'Conectando'}
                </span>
              </span>
            </div>
          </div>

          {/* Mobile Navigation Scrollbar */}
          <div className="md:hidden flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-hide border-t border-slate-800/60">
            <button
              onClick={() => setActiveTab('octaedro')}
              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                activeTab === 'octaedro' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 bg-slate-900'
              }`}
            >
              💎 Octaedro
            </button>
            <button
              onClick={() => setActiveTab('si-gateway')}
              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                activeTab === 'si-gateway' ? 'bg-purple-600 text-white' : 'text-slate-400 bg-slate-900'
              }`}
            >
              ⚡ SI Gateway
            </button>
            <button
              onClick={() => setActiveTab('nasa')}
              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                activeTab === 'nasa' ? 'bg-blue-600 text-white' : 'text-slate-400 bg-slate-900'
              }`}
            >
              🛰️ NASA NEO
            </button>
            <button
              onClick={() => setActiveTab('canvas')}
              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                activeTab === 'canvas' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'
              }`}
            >
              🖼️ Canvas
            </button>
            <button
              onClick={() => setActiveTab('masterlog')}
              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                activeTab === 'masterlog' ? 'bg-slate-800 text-white' : 'text-slate-400 bg-slate-900'
              }`}
            >
              📜 Bitácora
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'octaedro' && <OctaedroView />}
        {activeTab === 'si-gateway' && <SIGatewayView />}
        {activeTab === 'nasa' && <NASACommandView />}
        {activeTab === 'canvas' && <ImmersiveCanvasView />}
        {activeTab === 'masterlog' && <MasterLogView />}
      </main>

      {/* Persistent Operational Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>© 2026 Josue Eduardo Illescas Granillo</span>
            <span>·</span>
            <span className="text-fuchsia-400">#PHIXOR13.md</span>
            <span>·</span>
            <span>@#FIXOFOP638.md</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Cd. Juárez, Chihuahua, México</span>
            <span>·</span>
            <span>FIXO MX12 #8943</span>
            <span>·</span>
            <span className="text-slate-400">BUILD. TEST. DOCUMENT. REPEAT.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;