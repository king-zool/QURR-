import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Reciter } from '../types';
import { NIGERIAN_STATES } from '../data/surahs';
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

  const { reciters } = useLibrary();

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
  }, [searchQuery, selectedState, selectedRiwayah, verifiedOnly, sortBy, reciters]);

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
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064E3B] dark:text-[#34D399] uppercase tracking-wider">
          <span>Official National Directory</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141A17] dark:text-[#F3EFE6] tracking-tight">
          Nigerian Qur’an Reciters
        </h1>
        <p className="text-base sm:text-lg text-[#525E58] dark:text-[#9DAAA3] leading-relaxed">
          Select any reciter to open their profile and explore their complete Qur’anic library.
        </p>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-white dark:bg-[#111A16] p-5 rounded-2xl border border-[#E3DDD1] dark:border-[#1E2C25] shadow-xs space-y-4">
        
        {/* Top Row: Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#79857F] dark:text-[#8D9B94]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reciter name, state (e.g. Kano, Bauchi, Lagos), riwāyah, or institution..."
            className="w-full pl-11 pr-4 py-3 bg-[#FAF8F3] dark:bg-[#16231E] rounded-xl border border-[#E1DBD0] dark:border-[#22332B] text-sm text-[#1A201D] dark:text-[#F3EFE6] placeholder-[#79857F] dark:placeholder-[#76847E] focus:outline-hidden focus:border-[#064E3B] dark:focus:border-[#34D399] focus:bg-white dark:focus:bg-[#16231E] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#79857F] hover:text-[#1A201D] dark:text-[#8D9B94] dark:hover:text-white cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Badges / Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          
          {/* State Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#66726C] dark:text-[#8D9B94] uppercase tracking-wider mb-1">
              State of Origin / Residence
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F3] dark:bg-[#16231E] border border-[#E1DBD0] dark:border-[#22332B] rounded-lg text-xs font-medium text-[#222A26] dark:text-[#E2EAE5] focus:outline-hidden focus:border-[#064E3B] dark:focus:border-[#34D399]"
            >
              <option value="">All Nigerian States (36 + FCT)</option>
              {NIGERIAN_STATES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Riwayah Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#66726C] dark:text-[#8D9B94] uppercase tracking-wider mb-1">
              Canonical Riwāyah
            </label>
            <select
              value={selectedRiwayah}
              onChange={(e) => setSelectedRiwayah(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F3] dark:bg-[#16231E] border border-[#E1DBD0] dark:border-[#22332B] rounded-lg text-xs font-medium text-[#222A26] dark:text-[#E2EAE5] focus:outline-hidden focus:border-[#064E3B] dark:focus:border-[#34D399]"
            >
              {riwayahOptions.map(rw => (
                <option key={rw} value={rw === "All Riwāyāt" ? "" : rw}>{rw}</option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-[#66726C] dark:text-[#8D9B94] uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F3] dark:bg-[#16231E] border border-[#E1DBD0] dark:border-[#22332B] rounded-lg text-xs font-medium text-[#222A26] dark:text-[#E2EAE5] focus:outline-hidden focus:border-[#064E3B] dark:focus:border-[#34D399]"
            >
              <option value="featured">Featured First</option>
              <option value="listens">Most Listened</option>
              <option value="az">Alphabetical (A-Z)</option>
              <option value="recent">Recently Added to Archive</option>
            </select>
          </div>

          {/* Verification toggle & Reset */}
          <div className="flex items-end justify-between gap-2">
            <label className="flex items-center gap-2 cursor-pointer pb-2 text-xs font-medium text-[#303B35] dark:text-[#C4D0CA]">
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
                className="pb-2 text-xs font-semibold text-[#064E3B] dark:text-[#34D399] hover:underline whitespace-nowrap cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Reciters Result Count */}
      <div className="flex items-center justify-between text-xs text-[#63706A] dark:text-[#8D9B94] px-1">
        <span>Showing <strong>{filteredReciters.length}</strong> Nigerian reciters</span>
        {selectedState && (
          <span className="px-2 py-0.5 rounded bg-[#064E3B]/10 dark:bg-[#064E3B]/30 text-[#064E3B] dark:text-[#6EE7B7] font-medium">
            Filtered by State: {selectedState}
          </span>
        )}
      </div>

      {/* Reciters Grid - Name and Image Only and in a Circle */}
      {filteredReciters.length === 0 ? (
        <div className="bg-white dark:bg-[#111A16] rounded-2xl border border-[#E4DEC3] dark:border-[#1E2C25] p-12 text-center space-y-3">
          <p className="text-base font-semibold text-[#181E1C] dark:text-[#F3EFE6]">No reciters found matching your criteria</p>
          <p className="text-xs text-[#6B7872] dark:text-[#9AA6A0] max-w-md mx-auto">
            Try resetting your search query or state/riwayah filter. If you know a reciter who should be documented, please submit them for preservation.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg bg-[#064E3B] text-white text-xs font-medium cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8 pt-2">
          {filteredReciters.map((reciter) => {
            return (
              <button
                type="button"
                key={reciter.id}
                onClick={() => onSelectReciter(reciter.slug)}
                className="flex flex-col items-center text-center group cursor-pointer p-3 rounded-2xl transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.03] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#064E3B]"
              >
                {/* Circular image */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-2 sm:border-3 border-[#D9D3C5] dark:border-[#22332A] group-hover:border-[#064E3B] dark:group-hover:border-[#34D399] shadow-xs group-hover:shadow-md transition-all duration-300 bg-[#EFECE3] dark:bg-[#1A2621]">
                  <img
                    src={reciter.photograph}
                    alt={reciter.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                </div>

                {/* Reciter name only */}
                <h3 className="font-editorial text-base sm:text-lg font-bold text-[#141A17] dark:text-[#F3EFE6] group-hover:text-[#064E3B] dark:group-hover:text-[#34D399] transition-colors mt-3 text-center line-clamp-2 leading-snug">
                  {reciter.name}
                </h3>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
};
