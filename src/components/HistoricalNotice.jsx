import React, { useState } from 'react';
import { History, ChevronDown, ChevronUp, Scroll, Sparkles } from 'lucide-react';

export default function HistoricalNotice() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-amber-950/30 border border-amber-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-md transition-all">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
            <History className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-syne text-slate-100 flex items-center space-x-2">
              <span>🏛️ Curiosidad Histórica: Títulos Traducidos al Español</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hidden sm:inline-block">
                Ediciones Argentinas
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              ¿Por qué canciones de Queen, Pink Floyd o Beatles figuran en castellano en este catálogo?
            </p>
          </div>
        </div>

        <button className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-400 transition-colors shrink-0">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-amber-500/20 text-xs text-slate-300 space-y-3 animate-fadeIn leading-relaxed">
          <div className="bg-slate-950/60 border border-amber-500/20 rounded-xl p-3.5 space-y-2">
            <p>
              <strong className="text-amber-400">El contexto de época (COMFER, Ley 22.285 y SADAIC):</strong> Durante las décadas de 1970 y 1980 en la Argentina, los organismos de censura y radiodifusión —encabezados por el COMFER— exigían por norma legal que los álbumes y canciones internacionales fueran obligatoriamente registrados e impresos con sus <em className="text-slate-100">títulos traducidos al castellano</em> en las etiquetas centrales y contraportadas de los discos de vinilo.
            </p>
            <p>
              En muchos casos, las discográficas realizaban traducciones directas o literales para aprobar la circulación del material. Por esta razón histórica, en nuestra colección física encontrarás registros de época con nombres como:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-amber-300">
              <li className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                • <span className="font-bold text-slate-100">Queen:</span> <em>"Ata a tu madre"</em> (Tie Your Mother Down)
              </li>
              <li className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                • <span className="font-bold text-slate-100">Pink Floyd:</span> <em>"El Muro"</em> (The Wall)
              </li>
              <li className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                • <span className="font-bold text-slate-100">Donna Summer:</span> <em>"Amar para amarte"</em> (Love to Love You)
              </li>
              <li className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                • <span className="font-bold text-slate-100">Michael Jackson:</span> <em>"Escalosfrío"</em> (Thriller)
              </li>
            </ul>
          </div>
          <p className="text-slate-400 italic text-[11px]">
            💡 Este catálogo respeta fielmente la impresión original de cada vinilo de la colección, preservando su valor histórico y documental.
          </p>
        </div>
      )}
    </div>
  );
}
