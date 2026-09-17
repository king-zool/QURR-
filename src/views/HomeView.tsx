import React from 'react';
import { Play, ArrowRight, ShieldCheck, Sparkles, Heart, Volume2 } from 'lucide-react';
import { Reciter, ActiveView } from '../types';
import { INITIAL_RECITERS } from '../data/reciters';
import { SURAHS } from '../data/surahs';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';

interface HomeViewProps {
  onNavigate: (view: ActiveView, slug?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { playTrack, activeTrack, isPlaying, togglePlayPause } = useAudio();
  const { isFavoriteReciter, toggleFavoriteReciter, continueListening, reciters } = useLibrary();

  const featuredReciters = reciters.filter(r => r.featured).slice(0, 4);

  // Check if there is a continue listening target
  const continueReciter = continueListening 
    ? reciters.find(r => r.id === continueListening.reciterId) 
    : null;
  const continueSurah = continueListening 
    ? SURAHS.find(s => s.number === continueListening.surahNumber) 
    : null;

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F7F5EE] dark:bg-[#0D1612] border-b border-[#E7E3D8] dark:border-[#1E2B25] pt-12 pb-16 sm:py-20 lg:py-24 transition-colors duration-200">
        {/* Subtle architectural background line */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#064E3B_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#064E3B]/10 dark:bg-[#064E3B]/30 border border-[#064E3B]/20 dark:border-[#064E3B]/40 text-[#064E3B] dark:text-[#6EE7B7] text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>The National Digital Qur’anic Archive</span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-[#141A17] dark:text-[#F3EFE6] tracking-tight leading-[1.15]">
                The Voices of the Qur’an, From Nigeria to the World.
              </h1>

              <p className="text-lg sm:text-xl text-[#4A544F] dark:text-[#9DAAA3] font-normal leading-relaxed max-w-2xl">
                Discover, listen to and preserve the voices of Nigeria’s Qur’an reciters. 
                Documenting seven centuries of West African recitation traditions, scholars, and rare audio recordings.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="hero-explore-btn"
                  onClick={() => onNavigate('reciters')}
                  className="px-6 py-3.5 rounded-xl bg-[#064E3B] dark:bg-[#0A664E] text-white font-medium text-sm hover:bg-[#054030] dark:hover:bg-[#0d7d60] shadow-sm transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Explore Reciters</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  id="hero-listen-btn"
                  onClick={() => onNavigate('quran')}
                  className="px-6 py-3.5 rounded-xl bg-white dark:bg-[#16231E] text-[#1E2522] dark:text-[#E2EAE5] border border-[#DDD8CD] dark:border-[#26372F] font-medium text-sm hover:bg-[#F2EFE8] dark:hover:bg-[#1E2D26] transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Play className="w-4 h-4 fill-[#064E3B] dark:fill-[#34D399] text-[#064E3B] dark:text-[#34D399]" />
                  <span>Listen to the Qur’an</span>
                </button>
              </div>

              {/* Continue listening banner if available */}
              {continueReciter && continueSurah && (
                <div className="pt-2">
                  <div className="inline-flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-[#16231E] border border-[#DDD8CD] dark:border-[#26372F] shadow-2xs text-xs text-[#2E3733] dark:text-[#E2EAE5]">
                    <span className="w-2 h-2 rounded-full bg-[#064E3B] dark:bg-[#34D399]" />
                    <span>Continue listening: <strong>Surah {continueSurah.englishName}</strong> by <strong>{continueReciter.name}</strong></span>
                    <button
                      onClick={() => playTrack(continueReciter, continueSurah)}
                      className="text-[#064E3B] dark:text-[#34D399] font-bold hover:underline ml-1 cursor-pointer"
                    >
                      Resume →
                    </button>
                  </div>
                </div>
              )}

              {/* Institutional Key Points */}
              <div className="pt-6 border-t border-[#E3DFC2]/60 dark:border-[#1E2B25] grid grid-cols-3 gap-4 max-w-lg text-xs text-[#5D6762] dark:text-[#8D9B94]">
                <div>
                  <div className="font-editorial text-2xl font-bold text-[#141A17] dark:text-[#F3EFE6]">100%</div>
                  <div className="mt-0.5">Authorised Recitations</div>
                </div>
                <div>
                  <div className="font-editorial text-2xl font-bold text-[#141A17] dark:text-[#F3EFE6]">114</div>
                  <div className="mt-0.5">Complete Surahs Catalogued</div>
                </div>
                <div>
                  <div className="font-editorial text-2xl font-bold text-[#141A17] dark:text-[#F3EFE6]">36+</div>
                  <div className="mt-0.5">States & Traditions</div>
                </div>
              </div>

            </div>

            {/* Right Visual: Tasteful Photographic Documentary Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#D9D4C7] dark:border-[#22332A] bg-[#EFECE3] dark:bg-[#15221D] aspect-4/5 max-w-md mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop"
                  alt="Nigerian Qur'an recitation scholar in contemplation"
                  className="w-full h-full object-cover grayscale-20 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141A17]/95 via-[#141A17]/30 to-transparent" />
                
                {/* Visual Label */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-[#C29B38] text-white uppercase">
                      Archive Spotlight
                    </span>
                    <span className="text-xs text-stone-300">Sheikh Ahmad Sulaiman (Kano)</span>
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-white leading-snug">
                    Warsh ‘an Nāfi‘ Recitation Tradition of Kano
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2">
                    Known across West Africa for its distinctive resonant cadence and adherence to centuries-old Tsangaya oral pedagogy.
                  </p>
                  <button
                    onClick={() => onNavigate('reciter-profile', 'sheikh-ahmad-sulaiman')}
                    className="pt-1 text-xs font-semibold text-[#34D399] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    View Reciter Profile & Audio Library →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED RECITERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#064E3B] dark:text-[#34D399] tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preserved Reciters</span>
            </div>
            <h2 className="font-editorial text-3xl font-bold text-[#141A17] dark:text-[#F3EFE6] mt-1">
              Featured Reciters
            </h2>
            <p className="text-sm text-[#5D6762] dark:text-[#9DAAA3] mt-1 max-w-xl">
              Distinguished scholars and reciters representing the rich breadth of Nigerian Qur'anic transmission.
            </p>
          </div>

          <button
            onClick={() => onNavigate('reciters')}
            id="view-all-reciters-btn"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#064E3B] dark:text-[#34D399] hover:text-[#043326] dark:hover:text-[#6EE7B7] transition-colors group cursor-pointer"
          >
            <span>View All Reciters</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Reciter Grid - Circular Images with Name Only */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 pt-2">
          {featuredReciters.map((reciter) => {
            return (
              <button
                type="button"
                key={reciter.id}
                onClick={() => onNavigate('reciter-profile', reciter.slug)}
                className="flex flex-col items-center text-center group cursor-pointer p-3 rounded-2xl transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.03] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#064E3B]"
              >
                {/* Circular image */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-2 sm:border-3 border-[#D9D3C5] dark:border-[#22332A] group-hover:border-[#064E3B] dark:group-hover:border-[#34D399] shadow-xs group-hover:shadow-md transition-all duration-300 bg-[#EFECE3] dark:bg-[#1A2621]">
                  <img
                    src={reciter.photograph}
                    alt={reciter.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                </div>

                {/* Reciter Name Only */}
                <h3 className="font-editorial text-base sm:text-lg font-bold text-[#141A17] dark:text-[#F3EFE6] group-hover:text-[#064E3B] dark:group-hover:text-[#34D399] transition-colors mt-3 text-center line-clamp-2 leading-snug">
                  {reciter.name}
                </h3>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. PRESERVE A VOICE CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#064E3B] dark:bg-[#073D2F] text-white p-8 sm:p-12 relative overflow-hidden shadow-lg border border-[#043E2E] dark:border-[#0C5944]">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white inline-block">
              Community Preservation Initiative
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight">
              Help Preserve a Nigerian Reciter
            </h2>
            <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
              Know an accomplished Qur’an reciter, elderly Tsangaya Gwani, or possess historical cassette tapes whose voices deserve to be preserved for posterity? 
              Submit their documentation to our verification team.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('submit-reciter')}
                className="px-6 py-3 rounded-xl bg-white text-[#064E3B] dark:text-[#064E3B] font-bold text-sm hover:bg-[#F4F1EA] transition-colors shadow-sm cursor-pointer"
              >
                Submit Reciter Details →
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
