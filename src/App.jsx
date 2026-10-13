import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import HistoricalNotice from './components/HistoricalNotice';
import VinylCrate from './components/VinylCrate';
import VinylCard from './components/VinylCard';
import VinylModal from './components/VinylModal';
import TurntableBar from './components/TurntableBar';
import vinylsData from './data/vinyls.json';
import { vinylAudioEngine } from './utils/audioSynth';
import { Disc, ExternalLink } from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('artist-asc');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [activeView, setActiveView] = useState('crate'); // 'crate' or 'grid'

  const [selectedVinyl, setSelectedVinyl] = useState(null);
  const [playingVinyl, setPlayingVinyl] = useState(null);

  // Calculate genre counts
  const genresList = [
    "Hard Rock / Heavy Metal",
    "Classic Rock / Soft Rock",
    "Pop / Disco / Funk",
    "Eurodance / House / Club",
    "Tango / Folklore / Rock Nacional",
    "Synth-Pop / New Wave",
    "Blues / Jazz / Soul",
    "Latino / Cumbia / Cuarteto",
    "Pop / Rock General"
  ];

  const genreCounts = useMemo(() => {
    const counts = { all: vinylsData.length };
    vinylsData.forEach(v => {
      counts[v.genre] = (counts[v.genre] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter & Sort Logic
  const filteredVinyls = useMemo(() => {
    let result = [...vinylsData];

    // 1. Genre filter
    if (selectedGenre !== 'all') {
      result = result.filter(v => v.genre === selectedGenre);
    }

    // 2. Condition filter
    if (conditionFilter === 'clean') {
      result = result.filter(v => v.coverCondition === "Ningún defecto visible" && v.vinylCondition === "Ningún defecto visible");
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.artist.toLowerCase().includes(q) ||
        v.title.toLowerCase().includes(q) ||
        v.label.toLowerCase().includes(q) ||
        v.year.toLowerCase().includes(q) ||
        v.sideA.toLowerCase().includes(q) ||
        v.sideB.toLowerCase().includes(q)
      );
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortBy === 'artist-asc') {
        return a.artist.localeCompare(b.artist);
      }
      if (sortBy === 'artist-desc') {
        return b.artist.localeCompare(a.artist);
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'year-desc') {
        const yA = parseInt(a.year) || 0;
        const yB = parseInt(b.year) || 0;
        return yB - yA;
      }
      if (sortBy === 'year-asc') {
        const yA = parseInt(a.year) || 9999;
        const yB = parseInt(b.year) || 9999;
        return yA - yB;
      }
      if (sortBy === 'label-asc') {
        return a.label.localeCompare(b.label);
      }
      return 0;
    });

    return result;
  }, [searchQuery, selectedGenre, sortBy, conditionFilter]);

  // Handle Play Sound (Real Track Audio Preview + Vinyl Crackle)
  const handlePlayVinyl = (vinyl) => {
    if (!vinyl || !vinyl.audioPreview) return;
    if (playingVinyl && playingVinyl.id === vinyl.id) {
      vinylAudioEngine.stopVinylSound();
      setPlayingVinyl(null);
    } else {
      setPlayingVinyl(vinyl);
      vinylAudioEngine.playVinylSound(vinyl.audioPreview, () => {
        setPlayingVinyl(null);
      });
    }
  };

  const handleStopVinyl = () => {
    vinylAudioEngine.stopVinylSound();
    setPlayingVinyl(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* Header */}
      <Header
        totalRecords={vinylsData.length}
        activeView={activeView}
        setActiveView={setActiveView}
        isPlayingAudio={!!playingVinyl}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          sortBy={sortBy}
          setSortBy={setSortBy}
          genresList={genresList}
          genreCounts={genreCounts}
          totalFiltered={filteredVinyls.length}
          conditionFilter={conditionFilter}
          setConditionFilter={setConditionFilter}
        />

        {/* Historical COMFER Context Notice Container */}
        <HistoricalNotice />

        {/* Crate 3D View or Gallery Grid View */}
        {activeView === 'crate' ? (
          <VinylCrate
            vinyls={filteredVinyls}
            onSelectVinyl={setSelectedVinyl}
            onPlayVinyl={handlePlayVinyl}
          />
        ) : (
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400">
                Mostrando {filteredVinyls.length} discos de vinilo
              </span>
            </div>

            {filteredVinyls.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <Disc className="w-16 h-16 mx-auto mb-4 text-slate-600 animate-spin-slow" />
                <p className="text-lg font-semibold">No hay vinilos que coincidan con los filtros.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredVinyls.map((vinyl) => (
                  <VinylCard
                    key={vinyl.id}
                    vinyl={vinyl}
                    onSelect={setSelectedVinyl}
                    onPlay={handlePlayVinyl}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <p className="font-syne font-extrabold text-amber-400 text-sm">
              La rocola de seba • Colección Personal de Vinilos
            </p>
            <p className="text-slate-400 text-[11px]">Catálogo dinámico con 663 discos procesados, listado de temas y estado de conservación</p>
          </div>

          <a
            href="https://www.instagram.com/rocolaseba/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-pink-500/20 transition-transform hover:scale-105 active:scale-95 border border-white/20"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Síguenos en Instagram @rocolaseba</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedVinyl && (
        <VinylModal
          vinyl={selectedVinyl}
          onClose={() => setSelectedVinyl(null)}
          isPlaying={playingVinyl?.id === selectedVinyl.id}
          onTogglePlay={() => handlePlayVinyl(selectedVinyl)}
        />
      )}

      {/* Floating Turntable Bar */}
      <TurntableBar
        playingVinyl={playingVinyl}
        onStop={handleStopVinyl}
      />

    </div>
  );
}
