import React from 'react';
import { Search, Filter, ArrowUpDown, Disc, X } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
  sortBy,
  setSortBy,
  genresList,
  genreCounts,
  totalFiltered,
  conditionFilter,
  setConditionFilter
}) {
  return (
    <div className="bg-[#11131c]/80 border-y border-slate-800/80 backdrop-blur-md py-4 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Top Controls: Search Bar & Sort Selector */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar artista, disco, tema o sello..."
              className="w-full bg-slate-950/90 border border-slate-800 focus:border-amber-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown & Condition Filters */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Condition Filter */}
            <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setConditionFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  conditionFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setConditionFilter('clean')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  conditionFilter === 'clean'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Impecables
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-4 h-4 text-amber-500 mr-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-200 font-semibold outline-none cursor-pointer pr-2"
              >
                <option value="artist-asc" className="bg-slate-900 text-slate-200">Artista (A - Z)</option>
                <option value="artist-desc" className="bg-slate-900 text-slate-200">Artista (Z - A)</option>
                <option value="title-asc" className="bg-slate-900 text-slate-200">Título Vinilo (A - Z)</option>
                <option value="year-desc" className="bg-slate-900 text-slate-200">Año (Más Reciente)</option>
                <option value="year-asc" className="bg-slate-900 text-slate-200">Año (Más Antiguo)</option>
                <option value="label-asc" className="bg-slate-900 text-slate-200">Sello Discográfico</option>
              </select>
            </div>

          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            onClick={() => setSelectedGenre('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center ${
              selectedGenre === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                : 'bg-slate-900/90 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Disc className="w-3.5 h-3.5 mr-1.5" />
            Todos los Géneros ({genreCounts['all'] || totalFiltered})
          </button>

          {genresList.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedGenre === genre
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {genre} ({genreCounts[genre] || 0})
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
