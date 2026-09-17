import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, User, BookOpen, Music, Play } from 'lucide-react';
import { Reciter, Surah } from '../types';
import { INITIAL_RECITERS } from '../data/reciters';
import { SURAHS } from '../data/surahs';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReciter: (slug: string) => void;
  onSelectSurah: (surahNumber: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectReciter,
  onSelectSurah
}) => {
  const [query, setQuery] = useState('');
  const { playTrack } = useAudio();
  const { reciters } = useLibrary();

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const q = query.trim().toLowerCase();

  const matchingReciters = useMemo(() => {
    if (!q) return reciters.slice(0, 4);
    return reciters.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.arabicName.includes(query.trim()) ||
      r.state.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.riwayah.toLowerCase().includes(q) ||
      r.qiraah.toLowerCase().includes(q) ||
      (r.institution && r.institution.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [q, query, reciters]);

  const matchingSurahs = useMemo(() => {
    if (!q) return SURAHS.slice(0, 4);
    return SURAHS.filter(s => 
      s.englishName.toLowerCase().includes(q) ||
      s.englishTranslation.toLowerCase().includes(q) ||
      s.arabicName.includes(query.trim()) ||
      String(s.number) === q
    ).slice(0, 6);
  }, [q, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-12 sm:pt-20 px-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#FCFBF9] dark:bg-[#121B17] rounded-2xl shadow-2xl border border-[#E2DDD3] dark:border-[#22332A] overflow-hidden flex flex-col max-h-[85vh] transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E6E2D8] dark:border-[#203028] flex items-center gap-3 bg-white dark:bg-[#15221D]">
          <Search className="w-5 h-5 text-[#064E3B] dark:text-[#34D399] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reciter (e.g. Abdullahi, Kano, Warsh, Ya-Sin, Borno)..."
            autoFocus
            className="w-full bg-transparent border-none text-base sm:text-lg text-[#191E1C] dark:text-[#F0EDE6] placeholder-[#8A958F] dark:placeholder-[#788880] focus:outline-hidden"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-xs text-[#8A958F] dark:text-[#7A8A83] hover:text-[#191E1C] dark:hover:text-white px-2 py-1 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-[#66726C] dark:text-[#A2AEA7] hover:bg-[#F2EFE8] dark:hover:bg-[#1E2D26] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Sections */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Reciters Category */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#57625D] dark:text-[#9DA9A3] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#064E3B] dark:text-[#34D399]" /> Reciters
              </span>
              <span className="text-xs text-[#8B9690] dark:text-[#7E8D86]">{matchingReciters.length} found</span>
            </div>

            {matchingReciters.length === 0 ? (
              <p className="text-xs text-[#8B9690] dark:text-[#7E8D86] px-3 py-2">No matching Nigerian reciters found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingReciters.map(reciter => (
                  <div
                    key={reciter.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#E9E6DC] dark:border-[#22332B] bg-white dark:bg-[#16231E] hover:border-[#064E3B]/40 dark:hover:border-[#34D399]/40 hover:bg-[#F8F7F2] dark:hover:bg-[#1C2C25] transition-all group"
                  >
                    <div 
                      className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                      onClick={() => {
                        onSelectReciter(reciter.slug);
                        onClose();
                      }}
                    >
                      <img 
                        src={reciter.photograph} 
                        alt={reciter.name} 
                        className="w-10 h-10 rounded-lg object-cover bg-stone-100 dark:bg-stone-800"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#181D1B] dark:text-[#F0EDE6] truncate group-hover:text-[#064E3B] dark:group-hover:text-[#34D399]">
                          {reciter.name}
                        </div>
                        <div className="text-[11px] text-[#69746F] dark:text-[#9AA6A0] truncate flex items-center gap-1">
                          <span>{reciter.state}</span>
                          <span>•</span>
                          <span className="text-[#C29B38] font-medium">{reciter.riwayah}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playTrack(reciter, SURAHS[0]);
                        onClose();
                      }}
                      className="p-2 rounded-lg text-[#064E3B] dark:text-[#34D399] hover:bg-[#064E3B]/10 dark:hover:bg-[#064E3B]/30 shrink-0 cursor-pointer"
                      title="Play Recitation"
                    >
                      <Play className="w-4 h-4 fill-[#064E3B] dark:fill-[#34D399]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Surahs Category */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#57625D] dark:text-[#9DA9A3] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#064E3B] dark:text-[#34D399]" /> Surahs
              </span>
              <span className="text-xs text-[#8B9690] dark:text-[#7E8D86]">{matchingSurahs.length} found</span>
            </div>

            {matchingSurahs.length === 0 ? (
              <p className="text-xs text-[#8B9690] dark:text-[#7E8D86] px-3 py-2">No matching surahs</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingSurahs.map(surah => (
                  <div
                    key={surah.number}
                    onClick={() => {
                      onSelectSurah(surah.number);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#E9E6DC] dark:border-[#22332B] bg-white dark:bg-[#16231E] hover:border-[#064E3B]/40 dark:hover:border-[#34D399]/40 hover:bg-[#F8F7F2] dark:hover:bg-[#1C2C25] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-md bg-[#F2EFE8] dark:bg-[#202E27] text-xs font-mono font-semibold text-[#5A6560] dark:text-[#AAB6AF] flex items-center justify-center group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                        {surah.number}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#181D1B] dark:text-[#F0EDE6] truncate">
                          Surah {surah.englishName}
                        </div>
                        <div className="text-[11px] text-[#69746F] dark:text-[#9AA6A0] truncate">
                          {surah.englishTranslation} • {surah.versesCount} verses
                        </div>
                      </div>
                    </div>

                    <span className="font-arabic text-base text-[#064E3B] dark:text-[#34D399] shrink-0 font-medium">
                      {surah.arabicName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#F4F1EA] dark:bg-[#141F1A] border-t border-[#E6E2D8] dark:border-[#203028] text-center text-xs text-[#727D77] dark:text-[#8D9B94]">
          Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#202E27] border border-[#DDD9CE] dark:border-[#2D3E35] rounded font-mono text-[10px]">ESC</kbd> to exit search
        </div>
      </div>
    </div>
  );
};
