import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Disc, Play, Info, Music, ArrowUpRight, Sparkles } from 'lucide-react';
import { generateFallbackCoverSVG } from '../utils/coverGenerator';

export default function VinylCrate({ vinyls, onSelectVinyl, onPlayVinyl }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [extractingId, setExtractingId] = useState(null);
  const [imgErrorMap, setImgErrorMap] = useState({});
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  const containerRef = useRef(null);
  const lastWheelTime = useRef(0);

  // Track window width for dynamic 3D perspective spacing on mobile
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset index if vinyl list changes (e.g. after filter)
  useEffect(() => {
    setCurrentIndex(0);
  }, [vinyls.length]);

  const currentVinyl = vinyls[currentIndex];

  const handleNext = () => {
    if (currentIndex < vinyls.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrev();
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (currentVinyl) handleExtractVinyl(currentVinyl);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, vinyls, currentVinyl]);

  // Mouse Wheel / Touchpad Scroll Navigation (Non-passive with e.preventDefault())
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime.current < 120) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 8) {
        lastWheelTime.current = now;
        if (delta > 0) {
          if (currentIndex < vinyls.length - 1) setCurrentIndex(prev => prev + 1);
        } else {
          if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [currentIndex, vinyls.length]);

  const handleExtractVinyl = (item) => {
    setExtractingId(item.id);
    setTimeout(() => {
      onSelectVinyl(item);
      setExtractingId(null);
    }, 450);
  };

  if (!vinyls || vinyls.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400">
        <Disc className="w-14 h-14 mx-auto mb-4 text-slate-600 animate-spin-slow" />
        <p className="text-base font-semibold">No se encontraron vinilos en esta búsqueda.</p>
        <p className="text-xs text-slate-500">Prueba cambiando el género o los términos de búsqueda.</p>
      </div>
    );
  }

  // Calculate 3D Cover Flow visible items (-2, -1, 0, +1, +2)
  const range = 2;
  const visibleIndices = [];
  for (let i = -range; i <= range; i++) {
    const idx = currentIndex + i;
    if (idx >= 0 && idx < vinyls.length) {
      visibleIndices.push({ idx, offset: i });
    }
  }

  // Sort depth order: outer cards first, center last
  const sortedRenderIndices = [...visibleIndices].sort((a, b) => Math.abs(b.offset) - Math.abs(a.offset));

  // Dynamic responsive spacing calculation for 3D Cover Flow
  // Mobile (<640px): 105px offset, Tablet (<768px): 150px, Desktop: 210px
  const spacingMultiplier = windowWidth < 640 ? 105 : windowWidth < 768 ? 150 : 210;

  return (
    <div
      ref={containerRef}
      className="py-4 px-1 sm:px-4 max-w-6xl mx-auto select-none overflow-hidden focus:outline-none"
    >
      
      {/* Top Deck Info Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-8 bg-slate-900/70 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-3 sm:p-4 sm:px-6 shadow-xl gap-2 sm:gap-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm sm:text-lg font-bold font-syne text-slate-100 flex items-center">
              Recorre nuestra selección
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Aprieta el disco para más detalles
            </p>
          </div>
        </div>

        {/* Counter & Controls */}
        <div className="flex items-center justify-between w-full sm:w-auto space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <div className="text-[11px] sm:text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl shadow-sm">
            Disco {currentIndex + 1} de {vinyls.length}
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-slate-400 text-slate-200 transition-all shadow-md active:scale-95"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === vinyls.length - 1}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-slate-400 text-slate-200 transition-all shadow-md active:scale-95"
              title="Siguiente"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Flow Carousel & Wooden Crate Container */}
      <div className="crate-perspective relative py-4 sm:py-8 flex flex-col justify-center min-h-[380px] sm:min-h-[500px] items-center">
        
        {/* Wooden Vinyl Crate Container */}
        <div className="relative w-full max-w-4xl h-64 sm:h-80 md:h-88 crate-box flex justify-center items-end pb-3 sm:pb-4">
          
          {/* Wooden Box Rear Wall */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#1a130b] to-[#0a0704] border-2 border-[#473220] shadow-2xl overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-4 sm:h-5 bg-[#422e1e]/60 border-b border-[#5a3f29]"></div>
          </div>

          {/* 3D Cover Flow Vinyl Sleeve Carousel (Sorted Depth Order) */}
          <div className="relative w-full h-56 sm:h-72 md:h-80 flex justify-center items-center">
            {sortedRenderIndices.map(({ idx, offset }) => {
              const item = vinyls[idx];
              const isCenter = offset === 0;
              const isHovered = idx === hoveredIdx;
              const isExtracting = item.id === extractingId;

              // Responsive Spacing & Scaling
              const translateX = offset * spacingMultiplier;
              const translateZ = isCenter ? (windowWidth < 640 ? 30 : 60) : -Math.abs(offset) * (windowWidth < 640 ? 40 : 60);
              let translateY = isCenter ? (windowWidth < 640 ? -25 : -45) : 0;
              
              if (isExtracting) {
                translateY = windowWidth < 640 ? -90 : -140;
              } else if (isHovered) {
                translateY = isCenter ? (windowWidth < 640 ? -45 : -75) : -30;
              }

              const rotateY = offset === 0 ? 0 : offset < 0 ? 25 : -25;
              const scale = isCenter ? 1.05 : (isHovered ? 0.92 : 0.78);

              const zIndex = isHovered ? 100 : (isCenter ? 50 : 40 - Math.abs(offset));
              const opacity = Math.abs(offset) > 2 ? 0.2 : (windowWidth < 640 && Math.abs(offset) > 1 ? 0.4 : 1);

              const hasDrivePhoto = item.primaryPhoto && !imgErrorMap[item.id];
              const coverSrc = hasDrivePhoto
                ? item.primaryPhoto
                : (item.officialCover || generateFallbackCoverSVG(item.artist, item.title, item.genre, item.year));

              return (
                <div
                  key={item.id + '_' + idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isCenter) {
                      handleExtractVinyl(item);
                    } else {
                      setCurrentIndex(idx);
                    }
                  }}
                  className={`absolute top-2 sm:top-4 w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-xl sm:rounded-2xl cursor-pointer shadow-2xl transition-all duration-300 ease-out group ${
                    isCenter
                      ? 'ring-3 sm:ring-4 ring-amber-400 shadow-amber-500/40'
                      : isHovered
                      ? 'ring-2 sm:ring-4 ring-amber-300 shadow-amber-400/30'
                      : 'hover:brightness-110'
                  }`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) translateY(${translateY}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex: zIndex,
                    opacity: opacity
                  }}
                >
                  {/* Floating Tooltip Tag on Hover or Center */}
                  {(isHovered || isCenter) && (
                    <div className="absolute -top-10 sm:-top-14 inset-x-0 z-50 flex justify-center animate-fadeIn pointer-events-none px-1">
                      <div className="bg-slate-950/95 border border-amber-400/80 text-slate-100 px-2.5 py-1 rounded-xl shadow-2xl backdrop-blur-md flex items-center space-x-1.5 text-[10px] sm:text-xs font-bold truncate max-w-full">
                        <Music className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="text-amber-400 font-extrabold truncate">{item.title}</span>
                        <span className="text-slate-400 truncate">• {item.artist}</span>
                      </div>
                    </div>
                  )}

                  {/* Sleeve Cover Container */}
                  <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/60 shadow-2xl flex flex-col justify-between">
                    
                    {/* Cover Art Image */}
                    <img
                      src={coverSrc}
                      alt={`${item.artist} - ${item.title}`}
                      onError={() => setImgErrorMap(prev => ({ ...prev, [item.id]: true }))}
                      className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                    />

                    {/* Pull-out Vinyl Disc Simulation */}
                    <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-36 h-36 sm:w-52 sm:h-52 rounded-full vinyl-grooves vinyl-shine border-2 sm:border-4 border-slate-900 shadow-2xl vinyl-disc-pullout pointer-events-none opacity-90 transition-transform duration-500 ${
                      isExtracting ? 'translate-x-[70%] rotate-[360deg]' : (isCenter || isHovered) ? 'group-hover:translate-x-[45%]' : 'translate-x-0'
                    }`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-amber-500/90 border border-slate-950 flex flex-col items-center justify-center text-center p-0.5">
                          <span className="text-[6px] sm:text-[7px] font-black text-slate-950 truncate max-w-[40px] sm:max-w-[50px]">{item.artist}</span>
                          <div className="w-1 h-1 rounded-full bg-slate-950 my-0.5"></div>
                          <span className="text-[5px] sm:text-[6px] font-bold text-slate-900">{item.year}</span>
                        </div>
                      </div>
                    </div>

                    {/* Genre Badge Ribbon */}
                    <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col space-y-1 z-20">
                      <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black bg-slate-950/85 text-amber-400 border border-amber-500/40 backdrop-blur-md shadow-md">
                        {item.genre}
                      </span>
                    </div>

                    {/* Bottom Vinyl Info Strip */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-2 sm:p-3 pt-4 sm:pt-6 z-20 rounded-b-xl sm:rounded-b-2xl">
                      <h3 className="text-xs sm:text-sm font-bold font-syne text-slate-100 truncate">{item.artist}</h3>
                      <p className="text-[11px] sm:text-xs font-semibold text-amber-400 truncate">{item.title}</p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct Prev / Next Click Zones on Crate Sides */}
          <div
            onClick={handlePrev}
            className="absolute left-1 sm:left-2 top-8 bottom-16 w-14 sm:w-28 z-40 cursor-pointer flex items-center justify-start group"
            title="Disco Anterior"
          >
            <div className="p-2 sm:p-3 rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-400 opacity-60 sm:opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-xl">
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div
            onClick={handleNext}
            className="absolute right-1 sm:right-2 top-8 bottom-16 w-14 sm:w-28 z-40 cursor-pointer flex items-center justify-end group"
            title="Disco Siguiente"
          >
            <div className="p-2 sm:p-3 rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-400 opacity-60 sm:opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-xl">
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Front Wooden Crate Frame Guard */}
          <div className="absolute bottom-0 inset-x-0 h-16 sm:h-24 crate-wall-front rounded-b-2xl sm:rounded-b-3xl border-t-2 border-[#523722] z-50 pointer-events-none flex items-center justify-between px-3 sm:px-6 shadow-2xl">
            {/* Left Brass Guard */}
            <div className="w-6 h-6 sm:w-8 sm:h-8 crate-corner-metal rounded-tl-lg sm:rounded-tl-xl shadow-lg border border-amber-400/40 flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-200"></div>
            </div>

            {/* Crate Brass Label Plate */}
            <div className="px-3 sm:px-6 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 border border-amber-300 shadow-md text-slate-950 font-syne font-extrabold text-[10px] sm:text-xs tracking-wider uppercase flex items-center space-x-1.5 truncate max-w-[70%] justify-center">
              <Disc className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin-slow shrink-0" />
              <span className="truncate">La rocola de seba • Colección</span>
            </div>

            {/* Right Brass Guard */}
            <div className="w-6 h-6 sm:w-8 sm:h-8 crate-corner-metal rounded-tr-lg sm:rounded-tr-xl shadow-lg border border-amber-400/40 flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-200"></div>
            </div>
          </div>

        </div>

      </div>

      {/* Active Selected Vinyl Quick Panel */}
      {currentVinyl && (
        <div className="mt-3 sm:mt-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-950 border border-amber-500/30 shrink-0">
              <img
                src={(currentVinyl.primaryPhoto && !imgErrorMap[currentVinyl.id])
                  ? currentVinyl.primaryPhoto
                  : (currentVinyl.officialCover || generateFallbackCoverSVG(currentVinyl.artist, currentVinyl.title, currentVinyl.genre, currentVinyl.year))}
                alt={currentVinyl.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-1.5">
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 truncate">
                  {currentVinyl.genre}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400 truncate">{currentVinyl.year} • {currentVinyl.label}</span>
              </div>
              <h3 className="text-sm sm:text-lg font-extrabold font-syne text-slate-100 truncate">{currentVinyl.artist}</h3>
              <p className="text-xs sm:text-sm font-semibold text-amber-400 truncate">{currentVinyl.title}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {currentVinyl.audioPreview && (
              <button
                onClick={() => onPlayVinyl(currentVinyl)}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Probar Tocadiscos</span>
              </button>
            )}

            <button
              onClick={() => handleExtractVinyl(currentVinyl)}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all border border-slate-700"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver detalles</span>
            </button>
          </div>
        </div>
      )}

      {/* Jump Slider bar */}
      <div className="mt-4 sm:mt-6 flex items-center space-x-3 px-2">
        <span className="text-[11px] font-semibold text-slate-500">1</span>
        <input
          type="range"
          min={0}
          max={vinyls.length - 1}
          value={currentIndex}
          onChange={(e) => setCurrentIndex(Number(e.target.value))}
          className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
        <span className="text-[11px] font-semibold text-slate-500">{vinyls.length}</span>
      </div>

    </div>
  );
}
