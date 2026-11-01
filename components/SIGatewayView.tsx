import React, { useState } from 'react';
import { Cpu, Send, ShieldAlert, ShieldCheck, Zap, Sliders, Layers, Terminal, Clock, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';
import { callSIGateway } from '../services/geminiService';
import { SIGatewayMessage } from '../types';

interface ModelOption {
  id: string;
  name: string;
  category: 'Frontier' | 'Robotics/Live' | 'TTS/Speech' | 'Open Dense';
  badge: string;
  isPaid?: boolean;
  description: string;
}

const MODELS: ModelOption[] = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    category: 'Frontier',
    badge: 'Recomendado',
    description: 'Baja latencia, razonamiento sostenido y capacidades avanzadas de código y agentes.',
  },
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    category: 'Frontier',
    badge: 'Frontier Ultra',
    isPaid: true,
    description: 'Máximo razonamiento STEM, matemáticas complejas y orquestación multi-paso.',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    category: 'Frontier',
    badge: 'Ultra Rápido',
    description: 'Optimizado para rendimiento masivo y respuestas instantáneas.',
  },
  {
    id: 'gemini-3.8-live',
    name: 'Gemini 3.8 Live',
    category: 'Robotics/Live',
    badge: 'Conversacional',
    description: 'Modelo dialógico de tiempo real para flujos continuos y llamadas asíncronas.',
  },
  {
    id: 'gemini-3.8-flash-lite-tts',
    name: 'Gemini 3.8 Flash Lite TTS',
    category: 'TTS/Speech',
    badge: 'Síntesis de Voz',
    description: 'Síntesis de voz y doblaje de alta fidelidad para agentes interactivos.',
  },
  {
    id: 'gemma-4-26b-a4b-it',
    name: 'Gemma 4 26B A4B IT',
    category: 'Open Dense',
    badge: 'MoE 4B Activos',
    description: 'Arquitectura Mixture-of-Experts con 4B parámetros activos por inferencia.',
  },
  {
    id: 'gemma-4-31b-it',
    name: 'Gemma 4 31B IT',
    category: 'Open Dense',
    badge: '256K Context',
    description: 'Modelo denso open-weights de DeepMind con ventana de contexto de 256K.',
  },
];

export const SIGatewayView: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [prompt, setPrompt] = useState<string>('Explica en 3 puntos estratégicos la función del SI Gateway en la integración de NASA Earthdata y el PHIXOverse.');
  const [systemInstruction, setSystemInstruction] = useState<string>(
    'Eres el PHIXO SI Gateway oficial bajo el puntero maestro @#FIXOFOP638.md operado por Josue Eduardo Illescas Granillo (CEO FIXO MX12 #8943). Mantén separación rigurosa FACT/STATEMENT/ANALYSIS.'
  );
  const [showSystemInstruction, setShowSystemInstruction] = useState<boolean>(false);
  const [messages, setMessages] = useState<SIGatewayMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: '⚡ PHIXO SI Gateway v1.0 inicializado. Listo para enrutar consultas de inferencia multi-modelo a través del proxy seguro del servidor.',
      model: 'gemini-3.8-flash',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeChunkStrategy, setActiveChunkStrategy] = useState<boolean>(false);
  const [chunkSize, setChunkSize] = useState<number>(50000);

  const handleSend = async () => {
    if (!prompt.trim() || isLoading) return;

    const userMsg: SIGatewayMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await callSIGateway(
        prompt,
        selectedModel,
        showSystemInstruction ? systemInstruction : undefined
      );

      const assistantMsg: SIGatewayMessage = {
        id: response.requestId || `resp_${Date.now()}`,
        role: 'assistant',
        content: response.text,
        model: response.model,
        timestamp: new Date().toLocaleTimeString(),
        durationMs: response.durationMs,
        tokens: {
          prompt: response.usage?.promptTokenCount ?? null,
          candidates: response.usage?.candidatesTokenCount ?? null,
          total: response.usage?.totalTokenCount ?? null,
        },
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: SIGatewayMessage = {
        id: `err_${Date.now()}`,
        role: 'system',
        content: `❌ Error de Inferencia: ${err?.message || 'Fallo desconocido en el Gateway.'}`,
        timestamp: new Date().toLocaleTimeString(),
        errorCode: 'PROVIDER_ERROR',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentModelMeta = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Security Shield Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900/80 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-100 text-sm">
                Arquitectura Zero-Exposed-Keys & Telemetría Segura
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PORT 3000 /api/*
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Las claves API residen exclusivamente en el backend Node/Express con cabecera <code className="text-emerald-400">User-Agent: aistudio-build</code>. Nunca se exponen al navegador.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Nodo: FIXO MX12 #8943</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Selector de Modelos y Parámetros */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                Catálogo de Inferencia
              </h3>
              <span className="text-xs font-mono text-purple-400">{MODELS.length} Modelos</span>
            </div>

            <div className="space-y-2">
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedModel === model.id
                      ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg shadow-purple-900/20'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{model.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                        model.isPaid
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {model.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {model.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Model Info Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>Identificador:</span>
                <span className="font-mono text-purple-300">{currentModelMeta.id}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Categoría:</span>
                <span className="text-slate-200">{currentModelMeta.category}</span>
              </div>
              {currentModelMeta.isPaid && (
                <div className="p-2 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>Requiere API Key de pago para cuotas ampliadas.</span>
                </div>
              )}
            </div>

            {/* Chunking / Token Optimizer */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <button
                onClick={() => setActiveChunkStrategy(!activeChunkStrategy)}
                className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 font-semibold"
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-fuchsia-400" />
                  Optimizador de Chunking & Límite de Tokens
                </span>
                <span className="text-[10px] font-mono text-fuchsia-400">
                  {activeChunkStrategy ? 'Activo' : 'Inactivo'}
                </span>
              </button>

              {activeChunkStrategy && (
                <div className="p-3 rounded-xl bg-fuchsia-950/20 border border-fuchsia-500/30 space-y-2.5 text-xs animate-fade-in">
                  <p className="text-[11px] text-slate-300">
                    Estrategia Baldor/Modular: Divide textos masivos en bloques para prevenir errores de contexto (1.3M+ tokens).
                  </p>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Tamaño de Bloque:</span>
                    <span className="font-mono text-fuchsia-300">{chunkSize.toLocaleString()} chars</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="100000"
                    step="5000"
                    value={chunkSize}
                    onChange={(e) => setChunkSize(Number(e.target.value))}
                    className="w-full accent-fuchsia-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Consola de Inferencia */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col min-h-[500px]">
            {/* Header de Consola */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Consola de Inferencia PHIXO</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSystemInstruction(!showSystemInstruction)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                    showSystemInstruction
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-3 h-3" />
                  Instrucciones del Sistema
                </button>
                <button
                  onClick={() => setMessages([])}
                  className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
                  title="Limpiar historial"
                >
                  Limpiar
                </button>
              </div>
            </div>

            {/* Editor de Instrucciones del Sistema */}
            {showSystemInstruction && (
              <div className="py-3 border-b border-slate-800 space-y-2 animate-fade-in">
                <label className="text-[11px] font-mono text-purple-300 uppercase">
                  System Instruction activa para el Gateway:
                </label>
                <textarea
                  value={systemInstruction}
                  onChange={(e) => setSystemInstruction(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none"
                />
              </div>
            )}

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[460px] scrollbar-hide">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 space-y-2 shadow-md ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : msg.role === 'system'
                        ? 'bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs'
                        : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[11px] opacity-75 pb-1 border-b border-white/10">
                      <span className="font-semibold uppercase tracking-wider">
                        {msg.role === 'user' ? 'Operador' : msg.role === 'system' ? 'Aviso del Sistema' : msg.model}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>

                    {msg.tokens && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3 text-[10px] font-mono text-slate-400">
                        {msg.durationMs && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-purple-400" />
                            {msg.durationMs}ms
                          </span>
                        )}
                        <span>Tokens: {msg.tokens.total ?? 'N/A'}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 text-xs text-purple-400 font-mono p-3 bg-purple-950/30 rounded-xl border border-purple-500/20 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Enrutando inferencia en {selectedModel}...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={`Escribe una instrucción para ${selectedModel}...`}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !prompt.trim()}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold transition-all shadow-md shadow-purple-600/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SIGatewayView;
