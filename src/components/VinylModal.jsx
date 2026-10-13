import React, { useState, useEffect } from 'react';
import { X, Play, Square, Disc, ShieldCheck, Calendar, Tag, Music } from 'lucide-react';
import { generateFallbackCoverSVG } from '../utils/coverGenerator';

export default function VinylModal({ vinyl, onClose, isPlaying, onTogglePlay }) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  // Body Scroll Lock on Mount (Prevents main page background scrolling on mobile)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!vinyl) return null;

  const photosList = vinyl.photos && vinyl.photos.length > 0 ? vinyl.photos : [];
  const hasDrivePhoto = vinyl.primaryPhoto && !imgError;
  const activePhoto = photosList[activePhotoIdx] || vinyl.primaryPhoto;

  // PRIORITY: Real photo from Google Drive > Official web cover > Generated fallback
  const coverSrc = activePhoto && !imgError
    ? activePhoto
    : (vinyl.officialCover || generateFallbackCoverSVG(vinyl.artist, vinyl.title, vinyl.genre, vinyl.year));

  const formatTracklist = (trackStr) => {
    if (!trackStr) return ["No especificado"];
    return trackStr.split(/;/g).map(t => t.strip ? t.strip() : t).filter(Boolean);
  };

  const sideATracks = formatTracklist(vinyl.sideA);
  const sideBTracks = formatTracklist(vinyl.sideB);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn overflow-hidden"
    >
      {/* Modal Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#0e1017] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col pb-16 sm:pb-0"
      >
        {/* Sticky Mobile Header with Always-Visible Close Button */}
        <div className="sticky top-0 z-40 bg-[#0e1017]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 truncate">
            <Disc className="w-4 h-4 text-amber-400 shrink-0 animate-spin-slow" />
            <span className="text-xs font-bold font-syne text-slate-200 truncate">
              {vinyl.artist} • {vinyl.title}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition-all border border-slate-700 shrink-0 ml-2 shadow-md active:scale-95"
            title="Cerrar (Esc)"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto flex-1 overscroll-contain pb-8 sm:pb-0" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            
            {/* Left Column: Artwork & Virtual Turntable Player */}
            <div className="md:col-span-5 bg-slate-950/90 p-4 sm:p-6 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between">
              
              <div className="space-y-3 sm:space-y-4">
                
                {/* Sleeve & Vinyl Disc Animation Container */}
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800 group max-w-xs mx-auto md:max-w-none">
                  
                  {/* Artwork */}
                  <img
                    src={coverSrc}
                    alt={`${vinyl.artist} - ${vinyl.title}`}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                  />

                  {/* Real Photo Tag */}
                  {hasDrivePhoto && (
                    <div className="absolute bottom-2 left-2 z-20">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-slate-950 shadow-md">
                        📷 Foto Real de Colección
                      </span>
                    </div>
                  )}

                  {/* Spinning Vinyl overlay when playing */}
                  <div className={`absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="w-4/5 h-4/5 rounded-full vinyl-grooves vinyl-shine border-4 border-amber-500/80 shadow-2xl animate-spin-slow flex items-center justify-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-500 flex items-center justify-center border-2 border-slate-950">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-950"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photos Gallery Thumbnails if multiple photos */}
                {photosList.length > 1 && (
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                    {photosList.map((photo, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => {
                          setActivePhotoIdx(pIdx);
                          setImgError(false);
                        }}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                          activePhotoIdx === pIdx ? 'border-amber-500 scale-105' : 'border-slate-800 opacity-60'
                        }`}
                      >
                        <img src={photo} alt="Foto vinilo" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Turntable Player Playback Button */}
                {vinyl.audioPreview && (
                  <div className="pt-1 sm:pt-2">
                    <button
                      onClick={onTogglePlay}
                      className={`w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-xl ${
                        isPlaying
                          ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Square className="w-4 h-4 fill-current" />
                          <span>Detener Tocadiscos</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                          <span>Reproducir en Tocadiscos</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>

              {/* Catalog Info Badge */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Código Catálogo:</span>
                <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {vinyl.id}
                </span>
              </div>

            </div>

            {/* Right Column: Album Specs, Conservation Details, Tracklists */}
            <div className="md:col-span-7 p-4 sm:p-6 md:p-8 flex flex-col justify-between space-y-4 sm:space-y-6">
              
              {/* Header Info */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {vinyl.genre}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    {vinyl.year}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-syne text-slate-100 leading-tight">
                  {vinyl.artist}
                </h2>
                <p className="text-base sm:text-lg font-bold text-amber-400 mt-0.5">
                  {vinyl.title}
                </p>
                <p className="text-xs font-semibold text-slate-400 mt-1 flex items-center">
                  <Tag className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Sello Discográfico: <span className="text-slate-200 ml-1">{vinyl.label}</span>
                </p>
              </div>

              {/* Estado de Conservación Section */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2.5 shadow-inner">
                <h4 className="text-[11px] sm:text-xs font-black font-syne uppercase tracking-wider text-amber-400 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  Estado de Conservación
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  
                  {/* Cover Condition */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-semibold mb-0.5">Estado de Tapa</div>
                    <div className="font-bold text-slate-200 flex items-start space-x-1.5 text-xs">
                      {vinyl.coverCondition === "Ningún defecto visible" ? (
                        <span className="text-emerald-400">✓ Ningún defecto visible (Excelente)</span>
                      ) : (
                        <span className="text-amber-400">⚠️ {vinyl.coverCondition}</span>
                      )}
                    </div>
                  </div>

                  {/* Vinyl Condition */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-semibold mb-0.5">Estado del Disco Vinilo</div>
                    <div className="font-bold text-slate-200 flex items-start space-x-1.5 text-xs">
                      {vinyl.vinylCondition === "Ningún defecto visible" ? (
                        <span className="text-emerald-400">✓ Ningún defecto visible (Excelente)</span>
                      ) : (
                        <span className="text-amber-400">⚠️ {vinyl.vinylCondition}</span>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Tracklist Section (Lado A & Lado B) */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-[11px] sm:text-xs font-black font-syne uppercase tracking-wider text-amber-400 flex items-center">
                  <Music className="w-4 h-4 mr-1.5" />
                  Lista de Temas (Tracklist)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* Side A */}
                  <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
                    <div className="font-black text-amber-400 border-b border-slate-800 pb-1 mb-2 flex items-center justify-between text-xs">
                      <span>LADO A</span>
                      <Disc className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <ul className="space-y-1.5 text-slate-300">
                      {sideATracks.map((track, i) => (
                        <li key={i} className="leading-snug flex items-start">
                          <span className="text-amber-500 font-bold mr-1.5 text-[10px]">•</span>
                          <span>{track}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Side B */}
                  <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
                    <div className="font-black text-amber-400 border-b border-slate-800 pb-1 mb-2 flex items-center justify-between text-xs">
                      <span>LADO B</span>
                      <Disc className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <ul className="space-y-1.5 text-slate-300">
                      {sideBTracks.map((track, i) => (
                        <li key={i} className="leading-snug flex items-start">
                          <span className="text-amber-500 font-bold mr-1.5 text-[10px]">•</span>
                          <span>{track}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>

              {vinyl.notes && (
                <div className="text-xs text-slate-400 italic bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                  Notas adicionales: {vinyl.notes}
                </div>
              )}

            </div>

          </div>
        </div>

      </div>

      {/* Floating Pill Close Button for Mobile (Elevated above iPhone Home Indicator Safe Area) */}
      <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none sm:hidden px-4 mb-[env(safe-area-inset-bottom,0px)]">
        <button
          onClick={onClose}
          className="pointer-events-auto px-6 py-3 rounded-full bg-slate-900/95 hover:bg-slate-800 text-slate-100 border-2 border-amber-500/80 shadow-2xl backdrop-blur-xl font-syne font-extrabold text-xs flex items-center justify-center space-x-2 transition-transform active:scale-95"
        >
          <X className="w-4 h-4 text-amber-400" />
          <span className="text-slate-100 font-extrabold">Cerrar Ventana</span>
        </button>
      </div>

    </div>
  );
}
