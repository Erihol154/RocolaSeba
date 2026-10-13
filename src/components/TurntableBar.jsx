import React from 'react';
import { Square, Disc, Volume2, Music } from 'lucide-react';

export default function TurntableBar({ playingVinyl, onStop }) {
  if (!playingVinyl) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 max-w-xl mx-auto z-40 animate-bounce-short">
      <div className="bg-slate-900/95 border-2 border-amber-500/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl flex items-center justify-between">
        
        {/* Left: Spinning Vinyl Icon & Info */}
        <div className="flex items-center space-x-3 truncate">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full vinyl-grooves border-2 border-amber-400 shadow-md animate-spin-slow flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 border border-slate-950"></div>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>

          <div className="truncate">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                REPRODUCIENDO TOCADISCOS
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-100 truncate">{playingVinyl.artist}</h4>
            <p className="text-[11px] font-semibold text-amber-400 truncate">{playingVinyl.title}</p>
          </div>
        </div>

        {/* Right: Sound Equalizer Visualizer & Stop Button */}
        <div className="flex items-center space-x-3 shrink-0">
          
          {/* Animated Equalizer Bars */}
          <div className="hidden sm:flex items-end space-x-1 h-5 px-2">
            <div className="w-1 bg-amber-500 rounded-t animate-pulse h-3"></div>
            <div className="w-1 bg-amber-400 rounded-t animate-pulse h-5 delay-100"></div>
            <div className="w-1 bg-amber-500 rounded-t animate-pulse h-2 delay-200"></div>
            <div className="w-1 bg-amber-300 rounded-t animate-pulse h-4 delay-150"></div>
          </div>

          <button
            onClick={onStop}
            className="p-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center space-x-1 shadow-md transition-transform active:scale-95"
            title="Detener sonido"
          >
            <Square className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Detener</span>
          </button>
        </div>

      </div>
    </div>
  );
}
