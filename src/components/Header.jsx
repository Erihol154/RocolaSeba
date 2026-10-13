import React from 'react';
import { Disc, Box, Grid, Sparkles, ExternalLink } from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Header({ totalRecords, activeView, setActiveView, isPlayingAudio }) {
  return (
    <header className="sticky top-0 z-40 bg-[#090a0f]/90 backdrop-blur-xl border-b border-amber-500/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Logo & Title */}
        <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer truncate mr-2">
          <div className="relative shrink-0">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full vinyl-grooves flex items-center justify-center border-2 border-amber-500/60 shadow-lg group-hover:scale-105 transition-transform duration-300 vinyl-shine">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-amber-500 flex items-center justify-center">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-950"></div>
              </div>
            </div>
            {isPlayingAudio && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-amber-500"></span>
              </span>
            )}
          </div>

          <div className="truncate">
            <div className="flex items-center space-x-1.5 truncate">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-black font-syne tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent truncate">
                La rocola de seba
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-3 h-3 mr-1" />
                COLECCIÓN
              </span>
            </div>
          </div>
        </div>

        {/* View Controls, Counter & Official Instagram Link */}
        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          
          {/* Instagram Official Button */}
          <a
            href="https://www.instagram.com/rocolaseba/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-[11px] sm:text-xs shadow-lg shadow-pink-500/20 transition-all active:scale-95 border border-white/20"
            title="Ver Instagram Oficial @rocolaseba"
          >
            <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">@rocolaseba</span>
            <ExternalLink className="w-3 h-3 opacity-80 hidden sm:inline" />
          </a>

          {/* Total Badge */}
          <div className="hidden md:flex items-center px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300">
            <Disc className="w-4 h-4 text-amber-500 mr-2 animate-spin-slow" />
            <span>{totalRecords} Discos</span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 sm:p-1 bg-slate-900/90 rounded-xl sm:rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveView('crate')}
              className={`flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 ${
                activeView === 'crate'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Caja 3D</span>
            </button>

            <button
              onClick={() => setActiveView('grid')}
              className={`flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 ${
                activeView === 'grid'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Galería</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
