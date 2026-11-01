import React, { useState } from 'react';
import { FileText, ShieldCheck, Calendar, Download, GitBranch, Award, CheckCircle2, Copy, Check, Terminal, BookOpen } from 'lucide-react';

const REPOS_FIXO_FOP = [
  '-FIXOFOP638.md-PHIXOR13.md',
  '-FIXOFOP638.md-PHIXOR13.md-',
  '-PHIXOR21.md',
  '-RUN_CLOUD-FIXOFOP638.md-PHIXOR13.md',
  'FIXO-FOP-638',
  'Fixophixo638-fop638.onmicrosoft.com',
  'PhixoR13',
  'PHIXOX12.AI',
];

const REPOS_PHIXOR13 = [
  'PhixoR13.md',
  '-FIXOFOP638.md',
  '-FIXOFOP638.md-PHIXOR13.md-',
  '-PHIXOR13.md',
  '-PHIXOR21.md-999-999-999',
  'burger-blast-token',
  'cloudflare-docs',
  'FIXO--FOP--638',
  'FIXO-FOP--638',
  'FIXO-PHIXO-FYXO-PHYXO.md',
  'MrPuppeteer',
  'PowerShell',
  'PowerShell-Docker',
  'vertex-ai-creative-studio',
];

const CERT_PATH = [
  { code: 'SC-900', title: 'Security, Compliance & Identity Fundamentals', status: 'Base' },
  { code: 'AZ-900', title: 'Azure Fundamentals & Identity Cloud', status: 'Completado' },
  { code: 'SC-200', title: 'Security Operations Analyst (Sentinel & Defender)', status: 'Prioridad' },
  { code: 'SC-500', title: 'Cloud & AI Security Engineer Associate (Oficial)', status: 'Objetivo 2026' },
];

export const MasterLogView: React.FC = () => {
  const [copiedPointer, setCopiedPointer] = useState(false);
  const [copiedLicense, setCopiedLicense] = useState(false);

  const copyPointer = () => {
    navigator.clipboard.writeText('@#FIXOFOP638.md');
    setCopiedPointer(true);
    setTimeout(() => setCopiedPointer(false), 2000);
  };

  const downloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
PRODID:-//Microsoft Corporation//Outlook 16.0 MIMEDIR//EN
VERSION:2.0
METHOD:PUBLISH
BEGIN:VEVENT
CLASS:PUBLIC
CREATED:20260226T203334Z
DESCRIPTION:Go deep on real code and real systems at Microsoft Build.\\nVisit the Microsoft Build <https://aka.ms/MSBuild_26> homepage to get the latest event news.
DTEND;VALUE=DATE:20260604
DTSTAMP:20260226T203334Z
DTSTART;VALUE=DATE:20260602
LAST-MODIFIED:20260226T203334Z
LOCATION:Online: https://aka.ms/MSBuild_26
PRIORITY:5
SEQUENCE:0
SUMMARY;LANGUAGE=en-us:Microsoft Build online 2026
TRANSP:OPAQUE
UID:040000008200E00074C5B7101A82E008000000008D9F69F83027DC01000000000000000010000000FDB3D105B7B59145B4BADCECECB37202
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Microsoft_Build_2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Target Pointer Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-purple-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
              STATUS: LOGGED & SYNCHRONIZED
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-black text-slate-100 tracking-tight">
                PUNTERO MAESTRO:
              </h1>
              <button
                onClick={copyPointer}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-purple-300 font-mono text-xl md:text-2xl font-black border border-purple-500/40 transition-colors shadow-lg shadow-purple-950/50"
              >
                @#FIXOFOP638.md
                {copiedPointer ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-sm text-slate-400 max-w-2xl">
              Nodo Cd. Juárez, Chihuahua, México // FIXO MX12 #8943 // FoP 638 / Space Ranger.
              <br />
              <span className="text-fuchsia-400 font-semibold">Imperio Magenta Queen Universal</span> · Citizens Protección.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 text-xs font-mono">
            <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              BUILD. TEST. DOCUMENT. REPEAT.
            </span>
            <span className="text-slate-500">Refugio de la Libertad, Custodia de la República</span>
          </div>
        </div>
      </div>

      {/* Grid: Licencia Creativa 8.0 & Microsoft Build 2026 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Licencia Creativa 8.0 */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Licencia Creativa 8.0 (Movimiento Creativo 8.0 - Victoria)
              </h3>
              <span className="text-xs font-mono text-fuchsia-400">CC 8.0 / I DOLL & K DOLL</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-slate-100">1. Atribución:</strong> Crédito claro y visible a Josue Eduardo Illescas Granillo con el lema "Movimiento Creativo 8.0 – Victoria".
              </p>
              <p>
                <strong className="text-slate-100">2. Compartir Igual (ShareAlike):</strong> Obras derivadas preservan la misma licencia y espíritu de amor y libertad creativa.
              </p>
              <p>
                <strong className="text-slate-100">3. Uso Permitido:</strong> Autorizado para uso educativo, cultural, comercial y artístico.
              </p>
              <p>
                <strong className="text-slate-100">4. Derechos Morales:</strong> El autor conserva de forma irrevocable sus derechos morales según la Ley Federal del Derecho de Autor de México.
              </p>
            </div>

            {/* Declaración Ceremonial */}
            <div className="p-4 rounded-2xl bg-fuchsia-950/20 border border-fuchsia-500/30 text-xs italic text-fuchsia-200">
              "Cada kilómetro recorrido es una victoria compartida. La creatividad acelera, el corazón guía y el horizonte nunca termina. Bajo esta licencia, el arte y la innovación se expanden libres, como un horizonte sin fronteras. Todo lo puedo en Cristo que me fortalece."
              <br />
              <span className="not-italic text-[11px] text-fuchsia-400/80 font-mono block mt-1">
                — Josue Eduardo Illescas Granillo 💜
              </span>
            </div>
          </div>

          {/* Repositorios del Imperio (22 Repos) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-blue-400" />
                22 Repositorios del Imperio (FIXO & PHIXOverse)
              </h3>
              <span className="text-xs font-mono text-slate-400">2 Organizaciones</span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <span className="text-purple-400 font-bold block mb-2">FIXO-FOP-638 (8 repos):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {REPOS_FIXO_FOP.map((repo, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-slate-300 truncate">
                      {repo}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-blue-400 font-bold block mb-2">PhixoR13 (14 repos):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {REPOS_PHIXOR13.map((repo, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-slate-300 truncate">
                      {repo}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Microsoft Build 2026 & Certificaciones */}
        <div className="lg:col-span-5 space-y-6">
          {/* Microsoft Build 2026 Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                Microsoft Build 2026
              </h3>
              <span className="text-xs font-mono text-emerald-400">CALENDARIO OFICIAL</span>
            </div>

            <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 space-y-2 text-xs">
              <p className="font-bold text-sky-200">
                Go deep on real code and real systems at Microsoft Build.
              </p>
              <p className="text-slate-400">
                Fecha: <strong>2 al 4 de junio de 2026</strong> (Online)
              </p>
              <p className="text-slate-400">
                Ubicación: <code className="text-sky-300">https://aka.ms/MSBuild_26</code>
              </p>
            </div>

            <button
              onClick={downloadICS}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-md shadow-sky-600/30"
            >
              <Download className="w-4 h-4" />
              Descargar Archivo VCALENDAR (.ics)
            </button>
          </div>

          {/* Ruta de Certificaciones Microsoft */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Ruta Microsoft Learn (SC-500)
              </h3>
              <span className="text-xs font-mono text-slate-400">SC-500 Reemplazo Oficial</span>
            </div>

            <div className="space-y-2.5">
              {CERT_PATH.map((cert, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-amber-300 block">{cert.code}</span>
                    <span className="text-slate-300">{cert.title}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 shrink-0">
                    {cert.status}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              *Nota oficial: AZ-500 fue retirado el 31 de agosto de 2026. La ruta oficial se actualiza con SC-500 (Cloud and AI Security Engineer Associate) con dominios específicos para IA.
            </p>
          </div>

          {/* Checklist de Seguridad 7/7 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Checklist de Seguridad (7 de 7)
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              {[
                'Clave Gemini en servidor proxy backend sin exponer en navegador',
                'Variables de entorno protegidas en .env.example / .env',
                'Servidor escucha exclusivamente con protección de cabeceras',
                'Separación estricta de entornos: PROD ≠ UAT ≠ SIT ≠ Local',
                'Cero tokens o credenciales expuestos en repositorio Git',
                'Mapeo de telemetría sin almacenar prompts sensibles',
                'Compatibilidad verificada con modelos Gemini 3.8 y Gemini 4',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterLogView;
