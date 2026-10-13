import React, { useState } from 'react';
import { Play, Info, ShieldCheck, AlertCircle } from 'lucide-react';
import { generateFallbackCoverSVG } from '../utils/coverGenerator';

export default function VinylCard({ vinyl, onSelect, onPlay }) {
  const [imgError, setImgError] = useState(false);

  // PRIORITY: Real photo from Google Drive > Official web cover > Generated fallback
  const hasDrivePhoto = vinyl.primaryPhoto && !imgError;
  const coverSrc = hasDrivePhoto
    ? vinyl.primaryPhoto
    : (vinyl.officialCover || generateFallbackCoverSVG(vinyl.artist, vinyl.title, vinyl.genre, vinyl.year));

  const hasCoverDefect = vinyl.coverCondition && vinyl.coverCondition !== "Ningún defecto visible";
  const hasVinylDefect = vinyl.vinylCondition && vinyl.vinylCondition !== "Ningún defecto visible";

  return (
    <div
      onClick={() => onSelect(vinyl)}
      className="group relative glass-panel glass-panel-hover rounded-xl sm:rounded-2xl p-2.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer flex flex-col justify-between overflow-hidden shadow-xl"
    >
      
      {/* Vinyl Sleeve & Pull-out Record Preview */}
      <div className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-slate-950 mb-2 sm:mb-3 shadow-inner">
        
        {/* Cover Art */}
        <img
          src={coverSrc}
          alt={`${vinyl.artist} - ${vinyl.title}`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover rounded-lg sm:rounded-xl transition-transform duration-500 group-hover:scale-105"
        />

        {/* Real Photo Indicator Badge */}
        {hasDrivePhoto && (
          <div className="absolute bottom-1.5 left-1.5 z-20">
            <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase bg-emerald-500/90 text-slate-950 shadow-md">
              📷 Foto Real
            </span>
          </div>
        )}

        {/* Vinyl Disc Slide Out on Hover */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4/5 h-4/5 rounded-full vinyl-grooves vinyl-shine border-2 sm:border-4 border-slate-900 shadow-2xl vinyl-disc-pullout pointer-events-none opacity-90 transition-transform duration-500">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-amber-500/90 border border-slate-950 flex flex-col items-center justify-center text-center p-0.5">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-950"></div>
            </div>
          </div>
        </div>

        {/* Genre Pill */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-black uppercase bg-slate-950/80 text-amber-400 border border-amber-500/30 backdrop-blur-md shadow-md">
            {vinyl.genre}
          </span>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2 sm:space-x-3 z-20">
          {vinyl.audioPreview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(vinyl);
              }}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 transition-transform hover:scale-110 active:scale-95"
              title="Probar sonido"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950 ml-0.5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(vinyl);
            }}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 border border-slate-700"
            title="Ver detalles"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

      </div>

      {/* Album & Artist Details */}
      <div className="space-y-0.5">
        <h3 className="text-xs sm:text-base font-extrabold font-syne text-slate-100 truncate group-hover:text-amber-400 transition-colors">
          {vinyl.artist}
        </h3>
        <p className="text-[11px] sm:text-xs font-semibold text-slate-300 truncate">
          {vinyl.title}
        </p>

        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80 mt-1.5">
          <span className="truncate max-w-[90px] sm:max-w-none">{vinyl.label}</span>
          <span className="font-bold text-amber-500 shrink-0 ml-1">{vinyl.year}</span>
        </div>
      </div>

      {/* Conservation State Indicator Badges */}
      <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9px] sm:text-[10px]">
        <div className="flex items-center space-x-1 truncate" title={`Estado Tapa: ${vinyl.coverCondition}`}>
          {hasCoverDefect ? (
            <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
          )}
          <span className="text-slate-400 truncate max-w-[60px] sm:max-w-[80px]">
            Tapa: {vinyl.coverCondition || "Mint"}
          </span>
        </div>

        <div className="flex items-center space-x-1 truncate" title={`Estado Vinilo: ${vinyl.vinylCondition}`}>
          {hasVinylDefect ? (
            <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
          )}
          <span className="text-slate-400 truncate max-w-[60px] sm:max-w-[80px]">
            Disco: {vinyl.vinylCondition || "Mint"}
          </span>
        </div>
      </div>

    </div>
  );
}
