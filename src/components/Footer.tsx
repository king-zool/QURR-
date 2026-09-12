import React from 'react';
import { ActiveView } from '../types';
import { ShieldCheck, Heart, ArrowUpRight, BookOpen, Music, Archive, Compass } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: ActiveView, slug?: string) => void;
  setCurrentView?: (view: ActiveView) => void;
  onSelectState?: (state: string) => void;
  onSelectRiwayah?: (riwayah: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate, 
  setCurrentView, 
  onSelectState, 
  onSelectRiwayah 
}) => {
  const scrollToTop = (view: ActiveView) => {
    if (onNavigate) {
      onNavigate(view);
    } else if (setCurrentView) {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#181D1B] text-[#E3E8E5] pt-16 pb-28 border-t border-[#29322E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2C3631]">
          
          {/* Institutional Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-[#064E3B] text-white flex items-center justify-center font-editorial font-bold text-xl border border-[#0A664E]">
                ق
              </div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-white">
                QURRĀ’ NIGERIA
              </span>
            </div>
            
            <p className="text-sm text-[#A8B2AC] leading-relaxed max-w-sm">
              An institutional digital archive dedicated to identifying, documenting, digitizing, 
              and preserving the Qur’anic recitation traditions, scholarly biographies, and rare audio recordings across Nigeria.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-[#828F88]">
              <span className="inline-flex items-center gap-1 text-[#C29B38]">
                <ShieldCheck className="w-4 h-4" /> Non-Commercial Cultural Archive
              </span>
              <span>•</span>
              <span>Abuja & Kano</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A8B2AC] mb-4">
              Archive Directory
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => scrollToTop('reciters')} 
                  className="hover:text-white transition-colors text-left"
                >
                  All Nigerian Reciters
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToTop('quran')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Complete 114 Surahs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToTop('heritage')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Qur’anic Heritage
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToTop('submit-reciter')} 
                  className="hover:text-white transition-colors text-left flex items-center gap-1 text-[#34D399]"
                >
                  Submit Reciter for Verification <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Riwāyāt Traditions */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A8B2AC] mb-4">
              Riwāyāt in Nigeria
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A8B2AC]">
              <li>
                <button 
                  onClick={() => {
                    scrollToTop('reciters');
                    if (onSelectRiwayah) onSelectRiwayah("Warsh 'an Nafi'");
                  }} 
                  className="hover:text-white transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>Warsh ‘an Nāfi‘</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#252E2A] text-[#C29B38]">Sahelian</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    scrollToTop('reciters');
                    if (onSelectRiwayah) onSelectRiwayah("Hafs 'an Asim");
                  }} 
                  className="hover:text-white transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>Hafs ‘an ‘Āsim</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#252E2A] text-stone-300">Standard</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    scrollToTop('reciters');
                    if (onSelectRiwayah) onSelectRiwayah("Qalun 'an Nafi'");
                  }} 
                  className="hover:text-white transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>Qālūn ‘an Nāfi‘</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#252E2A] text-stone-300">Scholarly</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    scrollToTop('reciters');
                    if (onSelectRiwayah) onSelectRiwayah("Ad-Duri 'an Abi 'Amr");
                  }} 
                  className="hover:text-white transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>Ad-Dūrī ‘an Abī ‘Amr</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#252E2A] text-stone-300">Historical</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Key State Centers */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A8B2AC] mb-4">
              Regional Centers
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['Kano', 'Kaduna', 'Bauchi', 'Katsina', 'Sokoto', 'Borno', 'Gombe', 'Lagos', 'Abuja / FCT', 'Kwara'].map((state) => (
                <button
                  key={state}
                  onClick={() => {
                    scrollToTop('reciters');
                    if (onSelectState) onSelectState(state);
                  }}
                  className="text-xs px-2.5 py-1 rounded bg-[#222926] hover:bg-[#064E3B] text-[#CCD4D0] hover:text-white transition-colors"
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar & Copyright / Rights Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#7D8B84]">
          <p>
            © {new Date().getFullYear()} QURRĀ’ NIGERIA. Preserving Nigeria’s Qur’anic audio heritage for future generations.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <span className="hover:text-white cursor-pointer" onClick={() => scrollToTop('about')}>
              About & Mission
            </span>
            <span className="hover:text-white cursor-pointer" onClick={() => scrollToTop('heritage')}>
              Ethical Archiving Policy
            </span>
            <span className="hover:text-white cursor-pointer" onClick={() => scrollToTop('submit-reciter')}>
              Rights & Permissions
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
