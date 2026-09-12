import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Heart, Share2, Search, User, BookOpen, Bookmark, Check } from 'lucide-react';
import { Reciter, Surah } from '../types';
import { INITIAL_RECITERS } from '../data/reciters';
import { SURAHS } from '../data/surahs';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';

interface QuranViewProps {
  onOpenShareModal: (title: string, subtitle: string, url: string) => void;
  onNavigateToReciter: (slug: string) => void;
}

export const QuranView: React.FC<QuranViewProps> = ({ onOpenShareModal, onNavigateToReciter }) => {
  const { 
    activeTrack, 
    isPlaying, 
    togglePlayPause, 
    playTrack, 
    nextTrack, 
    previousTrack, 
    repeatMode, 
    setRepeatMode 
  } = useAudio();

  const { isFavoriteSurah, toggleFavoriteSurah, reciters } = useLibrary();

  // Selected Reciter & Surah for interface state
  const [selectedReciterId, setSelectedReciterId] = useState<string>(
    activeTrack?.reciter.id || (reciters.length > 0 ? reciters[0].id : INITIAL_RECITERS[0].id)
  );
  const [surahFilter, setSurahFilter] = useState('');
  const [bookmarkedSurahNumber, setBookmarkedSurahNumber] = useState<number | null>(null);
  const [bookmarkToast, setBookmarkToast] = useState(false);

  const currentSelectedReciter = reciters.find(r => r.id === selectedReciterId) || reciters[0] || INITIAL_RECITERS[0];
  const activeSurahNumber = activeTrack?.surah.number || 1;
  const currentSurah = SURAHS.find(s => s.number === activeSurahNumber) || SURAHS[0];

  const isCurrentSurahFav = isFavoriteSurah(currentSurah.number, currentSelectedReciter.id);

  const filteredSurahs = SURAHS.filter(s => {
    if (!surahFilter.trim()) return true;
    const q = surahFilter.toLowerCase().trim();
    return (
      s.englishName.toLowerCase().includes(q) ||
      s.englishTranslation.toLowerCase().includes(q) ||
      s.arabicName.includes(surahFilter.trim()) ||
      String(s.number) === q
    );
  });

  const handleBookmark = (surahNumber: number) => {
    setBookmarkedSurahNumber(surahNumber);
    setBookmarkToast(true);
    setTimeout(() => setBookmarkToast(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-28">
      
      {/* View Title */}
      <div className="space-y-2">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141A17]">
          The Holy Qur’an
        </h1>
        <p className="text-sm text-[#5A6761]">
          Listen to the complete 114 Surahs recited by prominent Nigerian reciters in authentic canonical riwāyāt.
        </p>
      </div>

      {/* Main Qur'an Player Stage */}
      <div className="bg-white rounded-3xl border border-[#E3DDD1] shadow-xs overflow-hidden p-6 sm:p-10 space-y-8">
        
        {/* Reciter Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#F9F7F1] border border-[#E9E4D9]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-200 border border-[#DDD8CD] shrink-0">
              <img 
                src={currentSelectedReciter.photograph} 
                alt={currentSelectedReciter.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs text-[#63706A] uppercase font-semibold">Active Reciter</div>
              <div className="text-sm sm:text-base font-bold text-[#171D1A]">
                {currentSelectedReciter.name}
              </div>
              <div className="text-xs text-[#064E3B] font-medium">
                {currentSelectedReciter.riwayah} • {currentSelectedReciter.state}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-[#63706A] whitespace-nowrap">Switch Reciter:</label>
            <select
              value={selectedReciterId}
              onChange={(e) => setSelectedReciterId(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-[#DCD7CA] text-[#1E2522] focus:outline-hidden focus:border-[#064E3B]"
            >
              {reciters.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.state}) — {r.riwayah}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Surah Highlight Header */}
        <div className="text-center py-6 border-b border-[#EFECE3] space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#064E3B]/10 text-[#064E3B]">
            Surah {currentSurah.number} of 114
          </div>

          <div className="font-arabic text-4xl sm:text-5xl font-bold text-[#064E3B] pt-2">
            سورة {currentSurah.arabicName}
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#181E1C]">
            Surah {currentSurah.englishName}
          </h2>

          <p className="text-sm text-[#66726C]">
            "{currentSurah.englishTranslation}" • {currentSurah.versesCount} Ayahs • {currentSurah.revelationType} Revelation
          </p>

          {/* Core Surah Control Buttons */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={previousTrack}
              className="p-3 rounded-xl border border-[#DDD8CD] bg-white hover:bg-[#F2EFE8] text-[#29322E] transition-colors"
              title="Previous Surah"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                if (activeTrack?.surah.number === currentSurah.number && activeTrack?.reciter.id === currentSelectedReciter.id) {
                  togglePlayPause();
                } else {
                  playTrack(currentSelectedReciter, currentSurah);
                }
              }}
              className="px-8 py-3.5 rounded-xl bg-[#064E3B] text-white font-bold text-sm hover:bg-[#054131] transition-all shadow-md flex items-center gap-2"
            >
              {isPlaying && activeTrack?.surah.number === currentSurah.number ? (
                <>
                  <Pause className="w-5 h-5 fill-white" />
                  <span>Pause Recitation</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white translate-x-0.5" />
                  <span>Play Surah {currentSurah.englishName}</span>
                </>
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-3 rounded-xl border border-[#DDD8CD] bg-white hover:bg-[#F2EFE8] text-[#29322E] transition-colors"
              title="Next Surah"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Secondary Controls: Favorite, Bookmark, Repeat, Share */}
          <div className="pt-4 flex items-center justify-center gap-4 text-xs text-[#5D6B64]">
            <button
              onClick={() => toggleFavoriteSurah(currentSurah, currentSelectedReciter)}
              className="flex items-center gap-1.5 hover:text-rose-600 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isCurrentSurahFav ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{isCurrentSurahFav ? 'Favorited' : 'Favourite'}</span>
            </button>

            <span>•</span>

            <button
              onClick={() => handleBookmark(currentSurah.number)}
              className="flex items-center gap-1.5 hover:text-[#064E3B] transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedSurahNumber === currentSurah.number ? 'fill-[#064E3B] text-[#064E3B]' : ''}`} />
              <span>{bookmarkedSurahNumber === currentSurah.number ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <span>•</span>

            <button
              onClick={() => setRepeatMode(repeatMode === 'track' ? 'off' : 'track')}
              className={`flex items-center gap-1.5 transition-colors ${repeatMode === 'track' ? 'text-[#064E3B] font-bold' : 'hover:text-[#181E1C]'}`}
            >
              <Repeat className="w-4 h-4" />
              <span>Repeat Surah</span>
            </button>

            <span>•</span>

            <button
              onClick={() => onOpenShareModal(`Surah ${currentSurah.englishName}`, currentSelectedReciter.name, window.location.href)}
              className="flex items-center gap-1.5 hover:text-[#181E1C] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          {bookmarkToast && (
            <div className="text-xs text-[#064E3B] font-semibold animate-in fade-in">
              ✓ Surah {currentSurah.englishName} bookmarked for quick access
            </div>
          )}

        </div>

        {/* Complete Surahs Grid for Direct Navigation */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-editorial text-xl font-bold text-[#141A17]">
              Browse All 114 Surahs
            </h3>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7C8882]" />
              <input
                type="text"
                value={surahFilter}
                onChange={(e) => setSurahFilter(e.target.value)}
                placeholder="Search surah..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E1DBD0] rounded-xl focus:outline-hidden text-[#1E2522]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredSurahs.map(surah => {
              const isSelected = surah.number === currentSurah.number;
              return (
                <div
                  key={surah.number}
                  onClick={() => playTrack(currentSelectedReciter, surah)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                    isSelected 
                      ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs' 
                      : 'bg-[#FAF8F3] hover:bg-white border-[#E9E4D9] text-[#1E2522] hover:border-[#064E3B]/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-6 h-6 rounded-md text-xs font-mono flex items-center justify-center font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#EAE5D8] text-[#55615B]'
                    }`}>
                      {surah.number}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">
                        {surah.englishName}
                      </div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-stone-200' : 'text-[#6C7872]'}`}>
                        {surah.versesCount} Ayahs • {surah.revelationType}
                      </div>
                    </div>
                  </div>

                  <span className={`font-arabic text-base shrink-0 font-medium ${
                    isSelected ? 'text-white' : 'text-[#064E3B]'
                  }`}>
                    {surah.arabicName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
