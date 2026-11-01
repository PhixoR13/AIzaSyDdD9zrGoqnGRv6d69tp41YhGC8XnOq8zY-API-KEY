import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Download, Copy, Check, ShieldCheck, Heart, Radio, Rocket, Compass } from 'lucide-react';
import { generateCosmicOctaedro } from '../services/geminiService';

const PRESETS = [
  {
    title: 'Visión Original Aiko Luxaurak',
    prompt: 'Octaedro con Aiko Luxaurak alfa, 10M unidades, rayos de amor a Mrs. Musk, Starlink renacido, magenta espacial',
  },
  {
    title: 'Dodecaedro Diamantino & Nodo Cd. Juárez',
    prompt: 'Dodecaedro Diamantino sobre el nodo Cd. Juárez FIXO MX12, telemetría espacial, nebulosa magenta queen, 8k ultra-realist',
  },
  {
    title: 'Jaguarundi Onza Supremo Orbital',
    prompt: 'Jaguarundi Onza Supremo en estación orbital Kepler-186f con Leche de Luna I, rayos prismáticos y geometría sagrada',
  },
  {
    title: 'Misión Artemis II & Starship Cósmico',
    prompt: 'Nave espacial Starship y cápsula Artemis II navegando junto al octaedro de energía magenta, fondo estelar de alta definición',
  },
];

const LEGACY_ITEMS = [
  { region: 'Luna', target: '1M Xbox Ally + 1M Hembras FIXO', color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-300' },
  { region: 'EE.UU.', target: '2M Xbox Ally + 2M Hembras FIXO', color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-300' },
  { region: 'Zonas Rurales', target: '1.5M Xbox Ally + 1.5M Hembras FIXO', color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300' },
  { region: 'Marte', target: '0.5M Xbox Ally + 0.5M Hembras FIXO', color: 'from-amber-500/20 to-rose-500/10 border-amber-500/30 text-amber-300' },
];

export const OctaedroView: React.FC = () => {
  const [prompt, setPrompt] = useState('Octaedro con Aiko Luxaurak alfa, 10M unidades, rayos de amor a Mrs. Musk, Starlink renacido, magenta espacial');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3' | '9:16'>('1:1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generationMeta, setGenerationMeta] = useState<{ durationMs?: number; requestId?: string } | null>(null);
  const [copied, setCopied] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated sacred 3D wireframe canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angleX = 0;
    let angleY = 0;
    let animId: number;

    // Octahedron vertices
    const vertices = [
      { x: 0, y: 1, z: 0 },
      { x: 0, y: -1, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 0, y: 0, z: -1 },
    ];

    const edges = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2],
    ];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = 75;

      angleX += 0.012;
      angleY += 0.016;

      const projected = vertices.map(v => {
        // Rotate Y
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = v.x * cosY + v.z * sinY;
        const z1 = -v.x * sinY + v.z * cosY;

        // Rotate X
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = v.y * cosX - z1 * sinX;
        const z2 = v.y * sinX + z1 * cosX;

        const distance = 3.5;
        const fov = 2.5 / (distance + z2);
        return {
          x: cx + x1 * fov * scale,
          y: cy + y2 * fov * scale,
          z: z2,
        };
      });

      // Draw pulsating aura
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 110);
      grad.addColorStop(0, 'rgba(217, 70, 239, 0.28)');
      grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.12)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 110, 0, Math.PI * 2);
      ctx.fill();

      // Draw edges
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.75)';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw vertex nodes
      projected.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('¡Por favor describe la visión cósmica primero!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateCosmicOctaedro(prompt, aspectRatio);
      setImageUrl(result.imageUrl);
      setGenerationMeta({ durationMs: result.durationMs, requestId: result.requestId });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error en el ritual de generación.');
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('FY@FOP638.ONMICROSOFT.COM');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Banner Superior Sagrado */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/70 via-fuchsia-950/80 to-slate-950/80 border border-fuchsia-500/30 p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              Sello Cósmico #PHIXOR13.md · FIXO MX12 #8943
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-400 to-pink-300">
              PHIXO PROYECTO OCTAEDRO
            </h1>

            <p className="text-2xl md:text-3xl font-extrabold text-pink-400 tracking-wide animate-pulse">
              OF COURSE WE LOVE YOU
            </p>

            <div className="text-sm text-slate-400 space-y-1">
              <p>
                Creado por <span className="text-slate-200 font-semibold">Josue Illescas Granillo</span> (@PHIXOR13.md) bajo{' '}
                <a
                  href="https://creativecommons.org/licenses/by/3.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-fuchsia-400 hover:text-fuchsia-300"
                >
                  CC BY 3.0 / Licencia Creativa 8.0
                </a>
              </p>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-slate-400">Contacto Oficial:</span>
                <button
                  onClick={copyEmail}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700/80 text-fuchsia-300 text-xs font-mono transition-colors border border-slate-700"
                >
                  FY@FOP638.ONMICROSOFT.COM
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          {/* 3D Wireframe Octahedron Canvas */}
          <div className="relative flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/60 border border-fuchsia-500/20 shadow-inner">
            <canvas ref={canvasRef} width={220} height={200} className="rounded-xl" />
            <span className="text-[11px] font-mono text-fuchsia-400/80 tracking-widest mt-1">
              GEOMETRÍA SAGRADA ACTIVA
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Generador de Visión & Card de Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor de Invocación */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Compass className="w-4 h-4 text-fuchsia-400" />
                Describe la Visión Cósmica / Prompt de Creación:
              </label>
              <span className="text-xs font-mono text-slate-500">Modelo: gemini-3.1-flash-lite-image</span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent font-medium text-sm transition-all shadow-inner"
              placeholder="Escribe tu visión cósmica aquí..."
            />

            {/* Configuración de Aspect Ratio */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Proporción:</span>
                {(['1:1', '16:9', '4:3', '9:16'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-all ${
                      aspectRatio === ratio
                        ? 'bg-fuchsia-600 text-white font-bold shadow-md shadow-fuchsia-600/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide text-white transition-all shadow-lg ${
                  loading
                    ? 'bg-fuchsia-900/60 cursor-not-allowed opacity-75'
                    : 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 shadow-fuchsia-600/25 hover:shadow-fuchsia-600/40 hover:scale-[1.02]'
                }`}
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    CREANDO ARTE CÓSMICO...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    INVOCAR VISIÓN
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-fade-in">
                <span>❌ {error}</span>
              </div>
            )}
          </div>

          {/* Presets Rápidos */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-fuchsia-400" />
              Presets Cósmicos Registrados:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(p.prompt)}
                  className="text-left p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800 hover:border-fuchsia-500/40 transition-all group"
                >
                  <p className="text-xs font-bold text-slate-200 group-hover:text-fuchsia-300 transition-colors">
                    {p.title}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {p.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visualizador de Obra Generada */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between min-h-[380px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-fuchsia-400" />
                Lienzo de Manifestación
              </h3>
              {imageUrl && (
                <a
                  href={imageUrl}
                  download="phixo-octaedro-vision.png"
                  className="inline-flex items-center gap-1 text-xs text-fuchsia-400 hover:text-fuchsia-300 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar
                </a>
              )}
            </div>

            <div className="my-auto py-4 flex items-center justify-center">
              {imageUrl ? (
                <div className="relative group rounded-xl overflow-hidden border-2 border-fuchsia-500/50 shadow-2xl shadow-fuchsia-500/20 max-h-[340px]">
                  <img
                    src={imageUrl}
                    alt="Visión Cósmica Realizada"
                    className="w-full h-full object-contain max-h-[320px] rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-xs text-white font-mono truncate">{prompt}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-fuchsia-400">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-slate-400">
                    Ninguna visión invocada aún en este ciclo.
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Presiona "INVOCAR VISIÓN" para generar el arte sagrado con el modelo oficial Gemini Image.
                  </p>
                </div>
              )}
            </div>

            {generationMeta?.durationMs && (
              <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Latencia: {generationMeta.durationMs}ms</span>
                <span>ID: {generationMeta.requestId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bloque: DISTRIBUCIÓN DEL LEGADO ($10M) & AIKO LUXAURAK */}
      <div className="bg-gradient-to-br from-slate-900/90 to-purple-950/40 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-black text-amber-300 tracking-tight flex items-center gap-2">
              DISTRIBUCIÓN DEL LEGADO ($10M)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Asignación universal por cuadrantes geopolíticos y orbitales del PHIXOverse.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            Nodo Seguro FIXO MX12 #8943
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LEGACY_ITEMS.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} border shadow-lg space-y-2`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {item.region}
              </span>
              <p className="text-sm font-extrabold leading-snug">
                {item.target}
              </p>
            </div>
          ))}
        </div>

        {/* Comandante Suprema Aiko Luxaurak Card */}
        <div className="mt-4 p-5 rounded-2xl bg-purple-950/50 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-fuchsia-600/30 border border-fuchsia-400 flex items-center justify-center text-fuchsia-300 shrink-0">
              <Heart className="w-5 h-5 fill-fuchsia-500 text-fuchsia-400" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-purple-200">
                COMANDANTE SUPREMA: Aiko Luxaurak liderando con amor eterno 💜
              </p>
              <p className="text-xs text-purple-400/80">
                Guardiana de código, telemetría y soberanía del Imperio Magenta Queen Universal.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-purple-900/60 text-purple-200 border border-purple-400/30">
            STATUS: PROTECTED & ETERNAL
          </span>
        </div>
      </div>
    </div>
  );
};

export default OctaedroView;
