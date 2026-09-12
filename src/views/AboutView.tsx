import React from 'react';
import { ShieldCheck, BookOpen, Award, CheckCircle2, Heart, Radio, Database } from 'lucide-react';

interface AboutViewProps {
  onNavigateToSubmit: () => void;
  onNavigateToReciters: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateToSubmit, onNavigateToReciters }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-28">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Institutional Mandate & Mission</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[#141A17] tracking-tight">
          About Qurrā’ Nigeria
        </h1>

        <p className="text-lg text-[#4B5852] leading-relaxed">
          The national digital repository dedicated to discovering, listening to, documenting, 
          and preserving the voices and Qur’anic recitation heritage of Nigeria.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-[#E2DDD3] p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#064E3B]/10 text-[#064E3B] flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="font-editorial text-lg font-bold text-[#141A17]">
            Nigeria-First Heritage
          </h3>
          <p className="text-xs text-[#526059] leading-relaxed">
            Prioritizing the historical West African transmission—from Warsh ‘an Nāfi‘ to classical Kanuri and Hausa Tsangaya oral pedagogy.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2DDD3] p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#064E3B]/10 text-[#064E3B] flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="font-editorial text-lg font-bold text-[#141A17]">
            Scholarly Authenticity
          </h3>
          <p className="text-xs text-[#526059] leading-relaxed">
            Every recorded reciter profile documents their canonical riwāyah, verified teachers, marks of ijazah, and regional institutional affiliation.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2DDD3] p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#064E3B]/10 text-[#064E3B] flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-editorial text-lg font-bold text-[#141A17]">
            Bandwidth Optimized
          </h3>
          <p className="text-xs text-[#526059] leading-relaxed">
            Engineered specifically for Nigerian network conditions with resilient global CDN streaming, offline download options, and ultra-lightweight pages.
          </p>
        </div>
      </div>

      {/* Copyright, Rights & Ethical Sourcing Statement */}
      <section className="bg-white rounded-3xl border border-[#E2DDD3] p-8 sm:p-10 space-y-6 shadow-xs">
        <h2 className="font-editorial text-2xl font-bold text-[#141A17] flex items-center gap-2">
          <Award className="w-5 h-5 text-[#C29B38]" />
          <span>Ethics, Licensing & Preservation Policy</span>
        </h2>

        <div className="text-sm text-[#44514B] space-y-4 leading-relaxed">
          <p>
            Qurrā’ Nigeria does not scrape or automatically copy recordings from YouTube, Facebook, Telegram, or other third-party websites without proper attribution and verification.
          </p>
          <p>
            Our repository is curated around <strong>authorized community submissions, archival digitization partnerships, family estate consents</strong>, and public domain historical broadcasts preserved for cultural posterity and educational study.
          </p>
          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E3D8] space-y-2">
            <h4 className="font-bold text-[#141A17] text-xs uppercase tracking-wider">
              Audio Rights Governance
            </h4>
            <ul className="text-xs space-y-1.5 text-[#526059]">
              <li>• <strong>Streaming Permitted:</strong> Live global listening with embedded attribution.</li>
              <li>• <strong>Download Permitted:</strong> Free offline access granted for personal and educational devotion.</li>
              <li>• <strong>Institutional Waqf:</strong> Preserved strictly as non-profit cultural waqf for the Islamic heritage of Nigeria.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-8 rounded-3xl bg-[#064E3B] text-white">
        <div>
          <h3 className="font-editorial text-xl font-bold">Contribute to the Archive</h3>
          <p className="text-xs text-stone-200 mt-1">Help us document forgotten reciters, audio cassettes, or regional masters.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNavigateToSubmit}
            className="px-5 py-2.5 rounded-xl bg-white text-[#064E3B] font-bold text-xs hover:bg-[#FAF8F3] transition-colors cursor-pointer"
          >
            Submit a Reciter
          </button>
          <button
            onClick={onNavigateToReciters}
            className="px-5 py-2.5 rounded-xl border border-white/30 text-white font-medium text-xs hover:bg-white/10 transition-colors cursor-pointer"
          >
            Browse Reciters
          </button>
        </div>
      </div>

    </div>
  );
};
