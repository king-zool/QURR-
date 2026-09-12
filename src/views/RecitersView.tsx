import React, { useState, useMemo } from 'react';
import { Search, Filter, ShieldCheck, Heart, Play, ChevronDown, Check, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Reciter, RiwayahType } from '../types';
import { INITIAL_RECITERS } from '../data/reciters';
import { SURAHS, NIGERIAN_STATES } from '../data/surahs';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';

interface RecitersViewProps {
  onSelectReciter: (slug: string) => void;
  initialStateFilter?: string;
  initialRiwayahFilter?: string;
}

export const RecitersView: React.FC<RecitersViewProps> = ({ 
  onSelectReciter, 
  initialStateFilter = '', 
  initialRiwayahFilter = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>(initialStateFilter);
  const [selectedRiwayah, setSelectedRiwayah] = useState<string>(initialRiwayahFilter);
  const [sortBy, setSortBy] = useState<'featured' | 'listens' | 'az' | 'recent'>('featured');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const { playTrack, activeTrack, isPlaying, togglePlayPause } = useAudio();
  const { toggleFavoriteReciter, isFavoriteReciter, reciters } = useLibrary();

  const riwayahOptions = [
    "All Riwāyāt",
    "Warsh 'an Nafi'",
    "Hafs 'an Asim",
    "Qalun 'an Nafi'",
    "Ad-Duri 'an Abi 'Amr",
    "Khalaf 'an Hamzah",
    "Shu'bah 'an Asim"
  ];

  const filteredReciters = useMemo(() => {
    let result = [...reciters];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) ||
        r.arabicName.includes(searchQuery.trim()) ||
        r.state.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.riwayah.toLowerCase().includes(q) ||
        r.qiraah.toLowerCase().includes(q) ||
        (r.institution && r.institution.toLowerCase().includes(q)) ||
        (r.specialisation && r.specialisation.toLowerCase().includes(q))
      );
    }

    // Filter by State
    if (selectedState) {
      result = result.filter(r => r.state.toLowerCase() === selectedState.toLowerCase());
    }

    // Filter by Riwayah
    if (selectedRiwayah && selectedRiwayah !== "All Riwāyāt") {
      result = result.filter(r => r.riwayah.toLowerCase().includes(selectedRiwayah.toLowerCase()));
    }

    // Verified only filter
    if (verifiedOnly) {
      result = result.filter(r => r.verified);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.totalListens || 0) - (a.totalListens || 0);
      }
      if (sortBy === 'listens') {
        return (b.totalListens || 0) - (a.totalListens || 0);
      }
      if (sortBy === 'az') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return result;
  }, [searchQuery, selectedState, selectedRiwayah, verifiedOnly, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedState('');
    setSelectedRiwayah('');
    setVerifiedOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      
      {/* Page Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
          <span>Official National Directory</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141A17] tracking-tight">
          Nigerian Qur’an Reciters
        </h1>
        <p className="text-base sm:text-lg text-[#525E58] leading-relaxed">
          Explore reciters from across Nigeria and discover their recordings, biographies and Qur’anic traditions.
        </p>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-white p-5 rounded-2xl border border-[#E3DDD1] shadow-xs space-y-4">
        
        {/* Top Row: Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#79857F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reciter name, Arabic name, state (e.g. Kano, Bauchi, Lagos), riwāyah, or institution..."
            className="w-full pl-11 pr-4 py-3 bg-[#FAF8F3] rounded-xl border border-[#E1DBD0] text-sm text-[#1A201D] placeholder-[#79857F] focus:outline-hidden focus:border-[#064E3B] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#79857F] hover:text-[#1A201D]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Badges / Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          
          {/* State Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#66726C] uppercase tracking-wider mb-1">
              State of Origin / Residence
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E1DBD0] rounded-lg text-xs font-medium text-[#222A26] focus:outline-hidden focus:border-[#064E3B]"
            >
              <option value="">All Nigerian States (36 + FCT)</option>
              {NIGERIAN_STATES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Riwayah Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#66726C] uppercase tracking-wider mb-1">
              Canonical Riwāyah
            </label>
            <select
              value={selectedRiwayah}
              onChange={(e) => setSelectedRiwayah(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E1DBD0] rounded-lg text-xs font-medium text-[#222A26] focus:outline-hidden focus:border-[#064E3B]"
            >
              {riwayahOptions.map(rw => (
                <option key={rw} value={rw === "All Riwāyāt" ? "" : rw}>{rw}</option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-[#66726C] uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#E1DBD0] rounded-lg text-xs font-medium text-[#222A26] focus:outline-hidden focus:border-[#064E3B]"
            >
              <option value="featured">Featured First</option>
              <option value="listens">Most Listened</option>
              <option value="az">Alphabetical (A-Z)</option>
              <option value="recent">Recently Added to Archive</option>
            </select>
          </div>

          {/* Verification toggle & Reset */}
          <div className="flex items-end justify-between gap-2">
            <label className="flex items-center gap-2 cursor-pointer pb-2 text-xs font-medium text-[#303B35]">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#064E3B] accent-[#064E3B] focus:ring-0"
              />
              <span>Verified Scholars Only</span>
            </label>

            {(selectedState || selectedRiwayah || searchQuery || verifiedOnly) && (
              <button
                onClick={resetFilters}
                className="pb-2 text-xs font-semibold text-[#064E3B] hover:underline whitespace-nowrap"
              >
                Reset Filters
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Reciters Result Count */}
      <div className="flex items-center justify-between text-xs text-[#63706A] px-1">
        <span>Showing <strong>{filteredReciters.length}</strong> Nigerian reciters</span>
        {selectedState && (
          <span className="px-2 py-0.5 rounded bg-[#064E3B]/10 text-[#064E3B] font-medium">
            Filtered by State: {selectedState}
          </span>
        )}
      </div>

      {/* Reciter Profiles Grid */}
      {filteredReciters.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E4DEC3] p-12 text-center space-y-3">
          <p className="text-base font-semibold text-[#181E1C]">No reciters found matching your criteria</p>
          <p className="text-xs text-[#6B7872] max-w-md mx-auto">
            Try resetting your search query or state/riwayah filter. If you know a reciter who should be documented, please submit them for preservation.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg bg-[#064E3B] text-white text-xs font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReciters.map((reciter) => {
            const isFav = isFavoriteReciter(reciter.id);
            const isThisReciterActive = activeTrack?.reciter.id === reciter.id;

            return (
              <div
                key={reciter.id}
                className="bg-white rounded-2xl border border-[#E2DDD3] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-[#064E3B]/40"
              >
                {/* Photo & Badge header */}
                <div className="relative aspect-16/10 bg-[#EFECE3] overflow-hidden">
                  <img
                    src={reciter.photograph}
                    alt={reciter.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {reciter.verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-[#064E3B]">
                        <ShieldCheck className="w-3 h-3 text-[#064E3B]" /> Verified
                      </span>
                    )}
                    {reciter.completeQuranAvailable && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#064E3B] text-white">
                        Full Qur’an (114)
                      </span>
                    )}
                  </div>

                  {/* Favorite button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteReciter(reciter.id);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>

                  {/* Riwayah tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-black/50 backdrop-blur-xs text-[#C29B38] border border-[#C29B38]/30">
                      {reciter.riwayah}
                    </span>
                    <span className="text-xs text-stone-200">
                      {reciter.city}, {reciter.state}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 
                        onClick={() => onSelectReciter(reciter.slug)}
                        className="font-editorial text-xl font-bold text-[#141A17] hover:text-[#064E3B] cursor-pointer transition-colors"
                      >
                        {reciter.name}
                      </h3>
                    </div>

                    <div className="font-arabic text-base text-[#064E3B] mt-0.5 font-medium">
                      {reciter.arabicName}
                    </div>

                    {reciter.institution && (
                      <p className="text-xs text-[#6C7872] mt-1.5 font-medium line-clamp-1">
                        🏛️ {reciter.institution}
                      </p>
                    )}

                    <p className="text-xs text-[#4C5551] mt-2.5 line-clamp-3 leading-relaxed">
                      {reciter.biography}
                    </p>
                  </div>

                  {/* Action row */}
                  <div className="pt-3 border-t border-[#EFECE3] flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectReciter(reciter.slug)}
                      className="text-xs font-bold text-[#44514B] hover:text-[#064E3B] transition-colors"
                    >
                      View Profile & All Surahs →
                    </button>

                    <button
                      onClick={() => {
                        if (isThisReciterActive && isPlaying) {
                          togglePlayPause();
                        } else {
                          playTrack(reciter, SURAHS[0]);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#064E3B] text-white text-xs font-semibold hover:bg-[#053F30] transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{isThisReciterActive && isPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
