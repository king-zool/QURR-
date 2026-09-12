import React from 'react';
import { Play, ArrowRight, ShieldCheck, Compass, Sparkles, BookOpen, Clock, Heart, Volume2 } from 'lucide-react';
import { Reciter, ActiveView } from '../types';
import { INITIAL_RECITERS } from '../data/reciters';
import { SURAHS } from '../data/surahs';
import { HERITAGE_TOPICS } from '../data/heritage';
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
      <section className="relative overflow-hidden bg-[#F7F5EE] border-b border-[#E7E3D8] pt-12 pb-16 sm:py-20 lg:py-24">
        {/* Subtle architectural background line */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#064E3B_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#064E3B]/10 border border-[#064E3B]/20 text-[#064E3B] text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>The National Digital Qur’anic Archive</span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-[#141A17] tracking-tight leading-[1.15]">
                The Voices of the Qur’an, From Nigeria to the World.
              </h1>

              <p className="text-lg sm:text-xl text-[#4A544F] font-normal leading-relaxed max-w-2xl">
                Discover, listen to and preserve the voices of Nigeria’s Qur’an reciters. 
                Documenting seven centuries of West African recitation traditions, scholars, and rare audio recordings.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="hero-explore-btn"
                  onClick={() => onNavigate('reciters')}
                  className="px-6 py-3.5 rounded-xl bg-[#064E3B] text-white font-medium text-sm hover:bg-[#054030] shadow-sm transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Explore Reciters</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  id="hero-listen-btn"
                  onClick={() => onNavigate('quran')}
                  className="px-6 py-3.5 rounded-xl bg-white text-[#1E2522] border border-[#DDD8CD] font-medium text-sm hover:bg-[#F2EFE8] transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Play className="w-4 h-4 fill-[#064E3B] text-[#064E3B]" />
                  <span>Listen to the Qur’an</span>
                </button>
              </div>

              {/* Continue listening banner if available */}
              {continueReciter && continueSurah && (
                <div className="pt-2">
                  <div className="inline-flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#DDD8CD] shadow-2xs text-xs text-[#2E3733]">
                    <span className="w-2 h-2 rounded-full bg-[#064E3B]" />
                    <span>Continue listening: <strong>Surah {continueSurah.englishName}</strong> by <strong>{continueReciter.name}</strong></span>
                    <button
                      onClick={() => playTrack(continueReciter, continueSurah)}
                      className="text-[#064E3B] font-bold hover:underline ml-1"
                    >
                      Resume →
                    </button>
                  </div>
                </div>
              )}

              {/* Institutional Key Points */}
              <div className="pt-6 border-t border-[#E3DFC2]/60 grid grid-cols-3 gap-4 max-w-lg text-xs text-[#5D6762]">
                <div>
                  <div className="font-editorial text-2xl font-bold text-[#141A17]">100%</div>
                  <div className="mt-0.5">Authorised Recitations</div>
                </div>
                <div>
                  <div className="font-editorial text-2xl font-bold text-[#141A17]">114</div>
                  <div className="mt-0.5">Complete Surahs Catalogued</div>
                </div>
                <div>
                  <div className="font-editorial text-2xl font-bold text-[#141A17]">36+</div>
                  <div className="mt-0.5">States & Traditions</div>
                </div>
              </div>

            </div>

            {/* Right Visual: Tasteful Photographic Documentary Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#D9D4C7] bg-[#EFECE3] aspect-4/5 max-w-md mx-auto">
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
                    className="pt-1 text-xs font-semibold text-[#34D399] hover:text-white transition-colors flex items-center gap-1"
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
            <div className="flex items-center gap-2 text-xs font-semibold text-[#064E3B] tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preserved Reciters</span>
            </div>
            <h2 className="font-editorial text-3xl font-bold text-[#141A17] mt-1">
              Featured Reciters
            </h2>
            <p className="text-sm text-[#5D6762] mt-1 max-w-xl">
              Distinguished scholars and reciters representing the rich breadth of Nigerian Qur'anic transmission.
            </p>
          </div>

          <button
            onClick={() => onNavigate('reciters')}
            id="view-all-reciters-btn"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#064E3B] hover:text-[#043326] transition-colors group cursor-pointer"
          >
            <span>View All Reciters</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Reciter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredReciters.map((reciter) => {
            const isFav = isFavoriteReciter(reciter.id);
            const isThisReciterActive = activeTrack?.reciter.id === reciter.id;

            return (
              <div
                key={reciter.id}
                className="bg-white rounded-2xl border border-[#E2DDD3] shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group hover:border-[#064E3B]/30"
              >
                {/* Photograph Header */}
                <div 
                  className="relative aspect-4/3 bg-[#F0EDE4] overflow-hidden cursor-pointer"
                  onClick={() => onNavigate('reciter-profile', reciter.slug)}
                >
                  <img
                    src={reciter.photograph}
                    alt={reciter.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {/* Verification Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-xs text-[#064E3B] border border-white">
                      <ShieldCheck className="w-3 h-3 text-[#064E3B]" /> Verified
                    </span>
                  </div>

                  {/* Riwayah Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#181E1C]/80 text-[#C29B38] border border-[#C29B38]/30 backdrop-blur-xs">
                      {reciter.riwayah}
                    </span>
                  </div>

                  {/* Favorite Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteReciter(reciter.id);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-xs"
                    title={isFav ? "Favorite reciter" : "Add to favorites"}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 
                        onClick={() => onNavigate('reciter-profile', reciter.slug)}
                        className="font-editorial text-lg font-bold text-[#141A17] hover:text-[#064E3B] cursor-pointer transition-colors"
                      >
                        {reciter.name}
                      </h3>
                    </div>

                    <div className="font-arabic text-base text-[#064E3B] mt-0.5 font-medium">
                      {reciter.arabicName}
                    </div>

                    <p className="text-xs text-[#6C7872] mt-1 font-medium">
                      {reciter.city}, {reciter.state} State
                    </p>

                    <p className="text-xs text-[#4C5551] mt-2.5 line-clamp-2 leading-relaxed">
                      {reciter.biography}
                    </p>
                  </div>

                  {/* Play / View Profile Buttons */}
                  <div className="pt-2 border-t border-[#EFECE3] flex items-center justify-between gap-2">
                    <button
                      onClick={() => onNavigate('reciter-profile', reciter.slug)}
                      className="text-xs font-semibold text-[#54615B] hover:text-[#064E3B] transition-colors"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => {
                        if (isThisReciterActive && isPlaying) {
                          togglePlayPause();
                        } else {
                          playTrack(reciter, SURAHS[0]);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#064E3B] text-white text-xs font-semibold hover:bg-[#053D2E] transition-colors flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>{isThisReciterActive && isPlaying ? 'Pause' : 'Play Surah 1'}</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. NIGERIAN QUR’ANIC HERITAGE SECTION */}
      <section className="bg-[#F6F4ED] border-y border-[#E6E1D4] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold text-[#064E3B] tracking-wider uppercase flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Cultural Memory
              </span>
              <h2 className="font-editorial text-3xl font-bold text-[#141A17] mt-1">
                Preserving Nigerian Qur’anic Heritage
              </h2>
              <p className="text-sm text-[#5D6762] mt-1 max-w-2xl">
                From ancient Borno manuscripts to 20th-century radio cassette tapes, explore the history of recitation in West Africa.
              </p>
            </div>

            <button
              onClick={() => onNavigate('heritage')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#064E3B] hover:text-[#043326] transition-colors group cursor-pointer"
            >
              <span>Explore Heritage Archive</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HERITAGE_TOPICS.slice(0, 3).map(topic => (
              <div
                key={topic.id}
                onClick={() => onNavigate('heritage')}
                className="bg-white rounded-2xl border border-[#E2DDD3] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="h-44 bg-[#EDE9DE] overflow-hidden relative">
                  <img
                    src={topic.image}
                    alt={topic.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1B211E]/80 text-[#C29B38] backdrop-blur-xs uppercase tracking-wide">
                      {topic.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-[#141A17] group-hover:text-[#064E3B] transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-[#525E58] mt-2 line-clamp-3 leading-relaxed">
                      {topic.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F2EFE8] flex items-center justify-between text-xs text-[#7B8781]">
                    <span>{topic.historicalPeriod}</span>
                    <span className="text-[#064E3B] font-semibold group-hover:underline flex items-center gap-1">
                      Read Archive →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRESERVE A VOICE CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#064E3B] text-white p-8 sm:p-12 relative overflow-hidden shadow-lg border border-[#043E2E]">
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
                className="px-6 py-3 rounded-xl bg-white text-[#064E3B] font-bold text-sm hover:bg-[#F4F1EA] transition-colors shadow-sm cursor-pointer"
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
