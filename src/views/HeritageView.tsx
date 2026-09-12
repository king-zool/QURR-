import React, { useState } from 'react';
import { BookOpen, MapPin, Calendar, Users, X, ArrowRight, ShieldCheck, Bookmark, History, Archive } from 'lucide-react';
import { HERITAGE_TOPICS } from '../data/heritage';
import { HeritageTopic } from '../types';

interface HeritageViewProps {
  onSelectReciter: (slug: string) => void;
}

export const HeritageView: React.FC<HeritageViewProps> = ({ onSelectReciter }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTopic, setActiveTopic] = useState<HeritageTopic | null>(null);

  const categories = [
    'All',
    'Historical Reciters',
    'Nigerian Qur’anic Scholars',
    'Qur’anic Schools',
    'Qirā’āt & Riwāyāt',
    'Historic Recordings',
    'Qur’anic Manuscripts',
    'Qur’anic Competitions'
  ];

  const filteredTopics = selectedCategory === 'All'
    ? HERITAGE_TOPICS
    : HERITAGE_TOPICS.filter(t => t.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-28">
      
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#064E3B] tracking-wider uppercase">
          <Archive className="w-3.5 h-3.5" />
          <span>National Documentary Archive</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[#141A17] tracking-tight">
          Nigerian Qur’anic Heritage
        </h1>

        <p className="text-base sm:text-lg text-[#4E5954] leading-relaxed">
          Documenting the living memory, centuries-old manuscripts, traditional Tsangaya schools, and oral recitation traditions of Nigeria.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-white border border-[#DDD8CC] text-[#333D39] hover:bg-[#F5F2EB]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTopics.map(topic => (
          <div
            key={topic.id}
            onClick={() => setActiveTopic(topic)}
            className="bg-white rounded-3xl border border-[#E2DDD3] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="relative aspect-16/10 bg-[#EDEAE2] overflow-hidden">
              <img
                src={topic.image}
                alt={topic.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#141A17]/85 text-[#C29B38] border border-[#C29B38]/30 backdrop-blur-xs uppercase tracking-wide">
                  {topic.category}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-200">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#34D399]" /> {topic.region.split(',')[0]}
                </span>
                <span className="font-mono text-[11px]">{topic.historicalPeriod}</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                {topic.arabicTitle && (
                  <div className="font-arabic text-sm text-[#064E3B] mb-1 font-medium">
                    {topic.arabicTitle}
                  </div>
                )}
                <h3 className="font-editorial text-xl font-bold text-[#141A17] group-hover:text-[#064E3B] transition-colors leading-snug">
                  {topic.title}
                </h3>
                <p className="text-xs text-[#525F58] mt-2.5 line-clamp-3 leading-relaxed">
                  {topic.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0ECE3] flex items-center justify-between text-xs text-[#064E3B] font-semibold">
                <span>View Historical Record</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Heritage Topic Modal Reader */}
      {activeTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            className="w-full max-w-3xl bg-[#FCFBF9] rounded-3xl shadow-2xl border border-[#E2DDD3] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Hero Cover */}
            <div className="relative aspect-16/7 w-full bg-stone-900 overflow-hidden">
              <img
                src={activeTopic.image}
                alt={activeTopic.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A201D] via-[#1A201D]/40 to-transparent" />
              
              <button
                onClick={() => setActiveTopic(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#C29B38] text-white uppercase tracking-wider">
                  {activeTopic.category}
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                  {activeTopic.title}
                </h2>
                {activeTopic.arabicTitle && (
                  <div className="font-arabic text-xl text-[#34D399]">
                    {activeTopic.arabicTitle}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Metadata strip */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#5D6B64] p-3 rounded-xl bg-[#F6F4ED] border border-[#E5E0D4]">
                <div>
                  <strong>Region:</strong> {activeTopic.region}
                </div>
                <div>•</div>
                <div>
                  <strong>Era:</strong> {activeTopic.historicalPeriod}
                </div>
              </div>

              {/* Scholarly Text */}
              <div className="text-sm sm:text-base text-[#2E3733] leading-relaxed space-y-4">
                <p>{activeTopic.fullDescription}</p>
              </div>

              {/* Key Highlights */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#141A17]">
                  Preservation Highlights
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#46534D]">
                  {activeTopic.keyHighlights.map((hl, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#064E3B] font-bold">✓</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Figures */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#141A17] mb-2">
                  Historical Figures & Lineage
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeTopic.keyFigures.map(fig => (
                    <span key={fig} className="px-3 py-1 rounded-lg bg-white border border-[#DDD8CD] text-xs font-medium text-[#29342F]">
                      {fig}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-6 border-t border-[#EFECE3] flex items-center justify-between">
                <span className="text-xs text-[#7A8781]">
                  Preserved in the Qurrā’ Nigeria Digital Repository
                </span>
                <button
                  onClick={() => setActiveTopic(null)}
                  className="px-4 py-2 rounded-xl bg-[#064E3B] text-white text-xs font-semibold hover:bg-[#054131]"
                >
                  Close Record
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
