import React, { useState, useMemo } from 'react';
import { 
  Play, Pause, Heart, Share2, Download, ShieldCheck, 
  Search, ArrowLeft, BookOpen, User, Award, School, Sparkles, Check, CheckCircle2, Edit3 
} from 'lucide-react';
import { Reciter, Surah } from '../types';
import { SURAHS } from '../data/surahs';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';
import { EditReciterModal } from '../components/EditReciterModal';

interface ReciterProfileViewProps {
  reciter: Reciter;
  onBack: () => void;
  onOpenShareModal: (title: string, subtitle: string, url: string) => void;
}

export const ReciterProfileView: React.FC<ReciterProfileViewProps> = ({
  reciter,
  onBack,
  onOpenShareModal
}) => {
  const { playTrack, playReciterCompleteQuran, activeTrack, isPlaying, togglePlayPause } = useAudio();
  const { 
    isFavoriteReciter, 
    toggleFavoriteReciter, 
    isFavoriteSurah, 
    toggleFavoriteSurah,
    markAsDownloaded,
    isDownloaded,
    updateReciter
  } = useLibrary();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSuccessAlert, setEditSuccessAlert] = useState(false);
  const [surahFilter, setSurahFilter] = useState('');
  const [downloadSuccessMap, setDownloadSuccessMap] = useState<Record<number, boolean>>({});

  const isFavReciter = isFavoriteReciter(reciter.id);

  const handleSaveProfile = (updated: Reciter) => {
    updateReciter(updated.id, updated);
    setEditSuccessAlert(true);
    if (updated.slug !== reciter.slug) {
      window.location.hash = `#/reciters/${updated.slug}`;
    }
    setTimeout(() => {
      setEditSuccessAlert(false);
    }, 4000);
  };

  // Filter surahs
  const filteredSurahs = useMemo(() => {
    if (!surahFilter.trim()) return SURAHS;
    const q = surahFilter.toLowerCase().trim();
    return SURAHS.filter(s => 
      s.englishName.toLowerCase().includes(q) ||
      s.englishTranslation.toLowerCase().includes(q) ||
      s.arabicName.includes(surahFilter.trim()) ||
      String(s.number) === q
    );
  }, [surahFilter]);

  const handleDownload = (surah: Surah) => {
    markAsDownloaded(reciter.id, surah.number);
    setDownloadSuccessMap(prev => ({ ...prev, [surah.number]: true }));
    setTimeout(() => {
      setDownloadSuccessMap(prev => ({ ...prev, [surah.number]: false }));
    }, 2500);

    const padded = String(surah.number).padStart(3, '0');
    const audioUrl = reciter.audioBaseUrl ? `${reciter.audioBaseUrl}${padded}.mp3` : `https://server8.mp3quran.net/afs/${padded}.mp3`;

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `Qurra_Nigeria_${reciter.slug}_Surah_${padded}.mp3`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      
      {/* Back to Reciters Button */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#57645E] hover:text-[#064E3B] transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to All Nigerian Reciters</span>
        </button>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#064E3B]/30 bg-[#064E3B]/5 hover:bg-[#064E3B]/10 text-xs font-semibold text-[#064E3B] transition-colors cursor-pointer"
          title="Edit profile data"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Success banner after saving changes */}
      {editSuccessAlert && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Profile updated successfully!</span> All biographical records, riwāyah details, and metadata have been synchronized.
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <section className="bg-white dark:bg-[#111A16] rounded-3xl border border-[#E3DDD1] dark:border-[#1E2C25] shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
          
          {/* Circular Photograph */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-[#064E3B]/20 dark:border-[#34D399]/30 shadow-md bg-[#ECE8DE] dark:bg-[#1A2621]">
              <img
                src={reciter.photograph}
                alt={reciter.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop';
                }}
              />
            </div>
            {reciter.verified && (
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#064E3B]/10 dark:bg-[#34D399]/15 text-[#064E3B] dark:text-[#34D399] border border-[#064E3B]/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#064E3B] dark:text-[#34D399]" /> Verified Scholar
                </span>
              </div>
            )}
          </div>

          {/* Reciter Metadata & Callouts */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="space-y-2 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#064E3B]/10 dark:bg-[#064E3B]/30 text-[#064E3B] dark:text-[#6EE7B7] border border-[#064E3B]/20">
                  {reciter.riwayah}
                </span>
                <span className="text-xs text-[#63706A] dark:text-[#8D9B94]">
                  Qirā’ah: <strong className="text-[#1E2522] dark:text-[#E2EAE5]">{reciter.qiraah}</strong>
                </span>
                {reciter.yearBornOrEra && (
                  <span className="text-xs text-[#8C9892]">
                    • Era: {reciter.yearBornOrEra}
                  </span>
                )}
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141A17] dark:text-[#F3EFE6] tracking-tight">
                {reciter.name}
              </h1>

              <div className="font-arabic text-2xl sm:text-3xl text-[#064E3B] dark:text-[#34D399] font-medium pt-1">
                {reciter.arabicName}
              </div>

              <p className="text-sm font-medium text-[#5D6B64] dark:text-[#9AA6A0]">
                📍 {reciter.city}, {reciter.state} State, Nigeria
              </p>
            </div>

            {/* Actions: Play Complete Quran & Favorite & Share & Jump to About */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                id="play-complete-quran-btn"
                onClick={() => playReciterCompleteQuran(reciter, 1)}
                className="px-6 py-3 rounded-xl bg-[#064E3B] dark:bg-[#0A664E] text-white text-sm font-semibold hover:bg-[#053D2E] dark:hover:bg-[#0c7a5e] transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Complete Qur’an (Surah 1 – 114)</span>
              </button>

              <a
                href="#about-reciter-section"
                className="px-4 py-3 rounded-xl border border-[#DDD8CD] dark:border-[#22332A] bg-white dark:bg-[#16231E] hover:bg-[#F5F2EB] dark:hover:bg-[#1E2E27] text-sm font-semibold text-[#37443E] dark:text-[#E2EAE5] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#064E3B] dark:text-[#34D399]" />
                <span>About Reciter ↓</span>
              </a>

              <button
                id="edit-profile-btn"
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-3 rounded-xl border border-[#064E3B]/30 bg-[#064E3B]/5 hover:bg-[#064E3B]/10 text-[#064E3B] dark:text-[#34D399] text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                title="Edit Reciter Profile Details"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => toggleFavoriteReciter(reciter.id)}
                className={`px-4 py-3 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                  isFavReciter 
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400' 
                    : 'bg-white dark:bg-[#16231E] border-[#DDD8CD] dark:border-[#22332A] text-[#29322E] dark:text-[#E2EAE5] hover:bg-[#F5F2EB] dark:hover:bg-[#1E2E27]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavReciter ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>{isFavReciter ? 'Favorited' : 'Save Reciter'}</span>
              </button>

              <button
                onClick={() => onOpenShareModal(reciter.name, `${reciter.city}, ${reciter.state}`, window.location.href)}
                className="p-3 rounded-xl border border-[#DDD8CD] dark:border-[#22332A] bg-white dark:bg-[#16231E] hover:bg-[#F5F2EB] dark:hover:bg-[#1E2E27] text-[#4F5B55] dark:text-[#C4D0CA] transition-colors cursor-pointer"
                title="Share Reciter Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* COMPLETE QUR'AN AUDIO LIBRARY TABLE (ALL 114 SURAHS) */}
      <section className="bg-white dark:bg-[#111A16] rounded-3xl border border-[#E3DDD1] dark:border-[#1E2C25] p-6 sm:p-10 space-y-6">
        
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141A17] dark:text-[#F3EFE6]">
              Complete Qur’an Audio Library
            </h2>
            <p className="text-xs sm:text-sm text-[#66736D] dark:text-[#9AA6A0] mt-1">
              All 114 Surahs catalogued under the Riwāyah of {reciter.riwayah}. Authorised high-speed streaming.
            </p>
          </div>

          {/* Quick Search within Reciter's Surahs */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7C8882] dark:text-[#8D9B94]" />
            <input
              type="text"
              value={surahFilter}
              onChange={(e) => setSurahFilter(e.target.value)}
              placeholder="Search surah name or number..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F3] dark:bg-[#16231E] border border-[#E1DBD0] dark:border-[#22332B] rounded-xl focus:outline-hidden focus:border-[#064E3B] dark:focus:border-[#34D399] text-[#1E2522] dark:text-[#F3EFE6]"
            />
            {surahFilter && (
              <button
                onClick={() => setSurahFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#7C8882] hover:text-[#1E2522] dark:text-[#8D9B94] dark:hover:text-white cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Surahs Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#EAE6DD] dark:border-[#1E2C25]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F3] dark:bg-[#16231E] border-b border-[#EAE6DD] dark:border-[#1E2C25] text-[11px] font-semibold uppercase tracking-wider text-[#63706A] dark:text-[#8D9B94]">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Surah</th>
                <th className="py-3 px-4 text-right">Arabic</th>
                <th className="py-3 px-4 text-center">Verses</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE3] dark:divide-[#1E2C25] text-sm">
              {filteredSurahs.map((surah) => {
                const isCurrentlyPlayingThisSurah = 
                  activeTrack?.reciter.id === reciter.id && 
                  activeTrack?.surah.number === surah.number;
                const isFav = isFavoriteSurah(surah.number, reciter.id);
                const downloaded = isDownloaded(reciter.id, surah.number) || downloadSuccessMap[surah.number];

                return (
                  <tr
                    key={surah.number}
                    className={`hover:bg-[#F9F7F1] dark:hover:bg-[#16231E]/60 transition-colors ${
                      isCurrentlyPlayingThisSurah ? 'bg-[#064E3B]/5 dark:bg-[#34D399]/10' : ''
                    }`}
                  >
                    {/* Number */}
                    <td className="py-3 px-4 text-center font-mono text-xs text-[#7A8781] dark:text-[#8D9B94]">
                      {surah.number}
                    </td>

                    {/* English Name & Revelation */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#181E1C] dark:text-[#F3EFE6]">
                        {surah.englishName}
                      </div>
                      <div className="text-xs text-[#6B7771] dark:text-[#9AA6A0]">
                        {surah.englishTranslation} • <span className="text-[11px] font-medium">{surah.revelationType}</span>
                      </div>
                    </td>

                    {/* Arabic Script */}
                    <td className="py-3 px-4 text-right">
                      <span className="font-arabic text-lg font-bold text-[#064E3B] dark:text-[#34D399]">
                        {surah.arabicName}
                      </span>
                    </td>

                    {/* Verse Count */}
                    <td className="py-3 px-4 text-center text-xs text-[#63706A] dark:text-[#8D9B94]">
                      {surah.versesCount}
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4 font-mono text-xs text-[#63706A] dark:text-[#8D9B94]">
                      {surah.standardDuration}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        
                        {/* Play/Pause Surah */}
                        <button
                          onClick={() => {
                            if (isCurrentlyPlayingThisSurah) {
                              togglePlayPause();
                            } else {
                              playTrack(reciter, surah);
                            }
                          }}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            isCurrentlyPlayingThisSurah && isPlaying
                              ? 'bg-[#064E3B] text-white'
                              : 'bg-[#F2EFE8] dark:bg-[#1E2C25] hover:bg-[#064E3B] dark:hover:bg-[#064E3B] text-[#1E2522] dark:text-[#E2EAE5] hover:text-white'
                          }`}
                          title={isCurrentlyPlayingThisSurah && isPlaying ? "Pause" : `Play Surah ${surah.englishName}`}
                        >
                          {isCurrentlyPlayingThisSurah && isPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                          )}
                        </button>

                        {/* Favorite Surah */}
                        <button
                          onClick={() => toggleFavoriteSurah(surah, reciter)}
                          className="p-2 text-[#7C8882] hover:text-rose-600 transition-colors cursor-pointer"
                          title={isFav ? "Favorited" : "Add to favorites"}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
                        </button>

                        {/* Download button */}
                        <button
                          onClick={() => handleDownload(surah)}
                          className="p-2 text-[#7C8882] hover:text-[#064E3B] dark:hover:text-[#34D399] transition-colors cursor-pointer"
                          title={downloaded ? "Downloaded" : "Download MP3"}
                        >
                          {downloaded ? (
                            <Check className="w-3.5 h-3.5 text-[#064E3B] dark:text-[#34D399]" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Share */}
                        <button
                          onClick={() => onOpenShareModal(`Surah ${surah.englishName}`, reciter.name, window.location.href)}
                          className="p-2 text-[#7C8882] hover:text-[#1E2522] dark:hover:text-white transition-colors cursor-pointer"
                          title="Share Surah link"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </section>

      {/* BIOGRAPHY & ABOUT SECTION (AT THE BOTTOM OF THE PAGE) */}
      <section 
        id="about-reciter-section"
        className="bg-white dark:bg-[#111A16] rounded-3xl border border-[#E3DDD1] dark:border-[#1E2C25] p-6 sm:p-10 space-y-6 scroll-mt-24 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFECE3] dark:border-[#1E2C25] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#064E3B] dark:text-[#34D399] uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Biographical Record</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141A17] dark:text-[#F3EFE6] mt-1">
              About the Reciter
            </h2>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl border border-[#D5CFBF] dark:border-[#22332B] hover:bg-[#FAF8F3] dark:hover:bg-[#16231E] text-xs font-semibold text-[#3D4B44] dark:text-[#C4D0CA] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#064E3B] dark:text-[#34D399]" />
            <span>Edit Bio & Background</span>
          </button>
        </div>

        {/* Structured Verified Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {reciter.institution && (
            <div className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#16231E] border border-[#E9E4D9] dark:border-[#22332B]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#69756F] dark:text-[#8D9B94] flex items-center gap-1.5 mb-1">
                <School className="w-3.5 h-3.5 text-[#064E3B] dark:text-[#34D399]" /> Institution / Markaz
              </span>
              <p className="text-[#202724] dark:text-[#E2EAE5] font-medium">{reciter.institution}</p>
            </div>
          )}

          {reciter.ijazah && (
            <div className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#16231E] border border-[#E9E4D9] dark:border-[#22332B]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#69756F] dark:text-[#8D9B94] flex items-center gap-1.5 mb-1">
                <Award className="w-3.5 h-3.5 text-[#C29B38]" /> Verified Ijazah & Sanad
              </span>
              <p className="text-[#202724] dark:text-[#E2EAE5] font-medium">{reciter.ijazah}</p>
            </div>
          )}

          {reciter.teachers && reciter.teachers.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#16231E] border border-[#E9E4D9] dark:border-[#22332B]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#69756F] dark:text-[#8D9B94] flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-[#064E3B] dark:text-[#34D399]" /> Notable Teachers & Shuyukh
              </span>
              <p className="text-[#202724] dark:text-[#E2EAE5] font-medium">{reciter.teachers.join(', ')}</p>
            </div>
          )}

          {reciter.specialisation && (
            <div className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#16231E] border border-[#E9E4D9] dark:border-[#22332B]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#69756F] dark:text-[#8D9B94] flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#064E3B] dark:text-[#34D399]" /> Specialisation
              </span>
              <p className="text-[#202724] dark:text-[#E2EAE5] font-medium">{reciter.specialisation}</p>
            </div>
          )}
        </div>

        {/* Reciter Full Biography */}
        <div className="prose prose-stone dark:prose-invert max-w-none text-sm sm:text-base text-[#38423E] dark:text-[#C4D0CA] leading-relaxed pt-2">
          <p className="whitespace-pre-line">{reciter.biography}</p>
        </div>
      </section>

      {/* Edit Reciter Profile Modal */}
      <EditReciterModal
        isOpen={isEditModalOpen}
        reciter={reciter}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />

    </div>
  );
};
