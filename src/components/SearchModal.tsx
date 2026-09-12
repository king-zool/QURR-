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
        className="w-full max-w-2xl bg-[#FCFBF9] rounded-2xl shadow-2xl border border-[#E2DDD3] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E6E2D8] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#064E3B] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reciter (e.g. Abdullahi, Kano, Warsh, Ya-Sin, Borno)..."
            autoFocus
            className="w-full bg-transparent border-none text-base sm:text-lg text-[#191E1C] placeholder-[#8A958F] focus:outline-hidden"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-xs text-[#8A958F] hover:text-[#191E1C] px-2 py-1 rounded"
            >
              Clear
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-[#66726C] hover:bg-[#F2EFE8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Sections */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Reciters Category */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#57625D] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#064E3B]" /> Reciters
              </span>
              <span className="text-xs text-[#8B9690]">{matchingReciters.length} found</span>
            </div>

            {matchingReciters.length === 0 ? (
              <p className="text-xs text-[#8B9690] px-3 py-2">No matching Nigerian reciters found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingReciters.map(reciter => (
                  <div
                    key={reciter.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#E9E6DC] bg-white hover:border-[#064E3B]/40 hover:bg-[#F8F7F2] transition-all group"
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
                        className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#181D1B] truncate group-hover:text-[#064E3B]">
                          {reciter.name}
                        </div>
                        <div className="text-[11px] text-[#69746F] truncate flex items-center gap-1">
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
                      className="p-2 rounded-lg text-[#064E3B] hover:bg-[#064E3B]/10 shrink-0"
                      title="Play Recitation"
                    >
                      <Play className="w-4 h-4 fill-[#064E3B]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Surahs Category */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#57625D] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#064E3B]" /> Surahs
              </span>
              <span className="text-xs text-[#8B9690]">{matchingSurahs.length} found</span>
            </div>

            {matchingSurahs.length === 0 ? (
              <p className="text-xs text-[#8B9690] px-3 py-2">No matching surahs</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingSurahs.map(surah => (
                  <div
                    key={surah.number}
                    onClick={() => {
                      onSelectSurah(surah.number);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#E9E6DC] bg-white hover:border-[#064E3B]/40 hover:bg-[#F8F7F2] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-md bg-[#F2EFE8] text-xs font-mono font-semibold text-[#5A6560] flex items-center justify-center group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                        {surah.number}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#181D1B] truncate">
                          Surah {surah.englishName}
                        </div>
                        <div className="text-[11px] text-[#69746F] truncate">
                          {surah.englishTranslation} • {surah.versesCount} verses
                        </div>
                      </div>
                    </div>

                    <span className="font-arabic text-base text-[#064E3B] shrink-0 font-medium">
                      {surah.arabicName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#F4F1EA] border-t border-[#E6E2D8] text-center text-xs text-[#727D77]">
          Press <kbd className="px-1.5 py-0.5 bg-white border border-[#DDD9CE] rounded font-mono text-[10px]">ESC</kbd> to exit search
        </div>
      </div>
    </div>
  );
};
