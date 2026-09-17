import React, { useState } from 'react';
import { ActiveView } from '../types';
import { Search, Volume2, ShieldCheck, Menu, X, BookOpen, Bookmark, UploadCloud } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  currentView?: ActiveView;
  activeView?: ActiveView;
  setCurrentView?: (view: ActiveView) => void;
  onNavigate?: (view: ActiveView, slug?: string) => void;
  openSearch?: () => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  activeView,
  setCurrentView,
  onNavigate,
  openSearch,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isPlaying, activeTrack, togglePlayPause } = useAudio();
  const { submissions, isAdmin, setIsAdmin } = useLibrary();

  const current = activeView || currentView || 'home';
  const triggerSearch = onOpenSearch || openSearch || (() => {});

  const pendingSubmissionsCount = submissions.filter(s => s.status === 'Pending').length;

  const navItems: { view: ActiveView; label: string }[] = [
    { view: 'home', label: 'Home' },
    { view: 'reciters', label: 'Reciters' },
    { view: 'quran', label: 'Qur’an' },
    { view: 'about', label: 'About' },
    { view: 'submit-reciter', label: 'Submit Reciter' },
  ];

  const handleNav = (view: ActiveView) => {
    if (onNavigate) {
      onNavigate(view);
    } else if (setCurrentView) {
      setCurrentView(view);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FCFBF9]/95 dark:bg-[#0D1412]/95 backdrop-blur-md border-b border-[#E6E4DC] dark:border-[#1E2B25] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tagline */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => handleNav('home')}
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 rounded-lg bg-[#064E3B] text-[#FCFBF9] flex items-center justify-center font-bold text-xl tracking-wider shadow-sm group-hover:bg-[#053B2C] transition-colors border border-[#043326]">
              <span className="font-editorial text-2xl font-serif leading-none">ق</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial font-bold text-xl tracking-tight text-[#161A18] dark:text-[#F3EFE6] group-hover:text-[#064E3B] dark:group-hover:text-[#34D399] transition-colors">
                  QURRĀ’ NIGERIA
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-[#064E3B]/10 dark:bg-[#064E3B]/30 text-[#064E3B] dark:text-[#6EE7B7] uppercase">
                  Archive
                </span>
              </div>
              <p className="text-xs text-[#606763] dark:text-[#9AA6A0] font-medium tracking-normal hidden md:block">
                Preserving the Voices of the Qur’an
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map(item => {
              const isActive = current === item.view;
              return (
                <button
                  key={item.view}
                  id={`nav-${item.view}`}
                  onClick={() => handleNav(item.view)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#064E3B] dark:bg-[#0A664E] text-white shadow-xs'
                      : 'text-[#2D3330] dark:text-[#D1D9D4] hover:text-[#064E3B] dark:hover:text-[#34D399] hover:bg-[#F2EFE8] dark:hover:bg-[#16221E]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Global Player Widget */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Active playback mini badge if audio is active */}
            {activeTrack && (
              <button
                onClick={togglePlayPause}
                title={`Currently playing: ${activeTrack.surah.englishName} by ${activeTrack.reciter.name}`}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#064E3B]/10 dark:bg-[#064E3B]/30 border border-[#064E3B]/20 dark:border-[#064E3B]/40 text-xs font-medium text-[#064E3B] dark:text-[#6EE7B7] hover:bg-[#064E3B]/15 dark:hover:bg-[#064E3B]/40 transition-all cursor-pointer"
              >
                <span className="flex h-2 w-2 relative">
                  {isPlaying && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#064E3B] dark:bg-[#10B981] opacity-75"></span>
                  )}
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#064E3B] dark:bg-[#10B981]"></span>
                </span>
                <span className="max-w-[110px] truncate font-medium">
                  {activeTrack.surah.englishName}
                </span>
                <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-[#064E3B] dark:text-[#10B981]' : 'text-stone-400 dark:text-stone-500'}`} />
              </button>
            )}

            {/* Global Search Trigger */}
            <button
              onClick={triggerSearch}
              id="search-trigger-btn"
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#4E5652] dark:text-[#B6C2BC] bg-[#F4F2EB] dark:bg-[#16221E] hover:bg-[#EBE7DD] dark:hover:bg-[#1C2A25] rounded-lg border border-[#E3DFD4] dark:border-[#22332B] transition-colors cursor-pointer"
              title="Search reciters and surahs"
            >
              <Search className="w-4 h-4 text-[#5D6661] dark:text-[#8D9B94]" />
              <span className="hidden sm:inline font-normal text-xs text-[#5D6661] dark:text-[#8D9B94]">Search...</span>
              <kbd className="hidden md:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono text-[#76807B] dark:text-[#919E97] bg-white dark:bg-[#202E27] border border-[#DDD9CE] dark:border-[#2C3E34] rounded shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle (Day / Night Reading & Listening Mode) */}
            <ThemeToggle />

            {/* Curator Session Indicator (Only visible when authenticated) */}
            {isAdmin && (
              <button
                id="admin-dashboard-btn"
                onClick={() => handleNav('curator-portal')}
                className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  current === 'admin' || current === 'curator-portal'
                    ? 'bg-[#064E3B] text-white border-[#064E3B]'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-[#064E3B] dark:text-[#34D399] border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                }`}
                title="Curator Console"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <ShieldCheck className="w-4 h-4 text-[#064E3B] dark:text-[#34D399]" />
                <span className="hidden md:inline">Curator Console</span>
                {pendingSubmissionsCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-[#C29B38] text-white rounded-full">
                    {pendingSubmissionsCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-nav-toggle"
              className="lg:hidden p-2 text-[#2D3330] dark:text-[#D1D9D4] hover:bg-[#F2EFE8] dark:hover:bg-[#16221E] rounded-md transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E6E4DC] dark:border-[#1E2B25] bg-[#FCFBF9] dark:bg-[#0D1412] px-4 pt-3 pb-6 space-y-1.5 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {navItems.map(item => {
            const isActive = current === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNav(item.view)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#064E3B] dark:bg-[#0A664E] text-white'
                    : 'text-[#232926] dark:text-[#E2E8E4] hover:bg-[#F2EFE8] dark:hover:bg-[#16221E]'
                }`}
              >
                <span>{item.label}</span>
                {item.view === 'submit-reciter' && (
                  <UploadCloud className="w-4 h-4 opacity-70" />
                )}
                {item.view === 'quran' && (
                  <BookOpen className="w-4 h-4 opacity-70" />
                )}
              </button>
            );
          })}
          
          {/* Mobile Theme Switcher Row */}
          <div className="pt-3 mt-2 border-t border-[#E6E4DC] dark:border-[#1E2B25] flex items-center justify-between px-2 py-1">
            <span className="text-xs font-medium text-[#5D6661] dark:text-[#9DAAA3]">
              Reading & Listening Mode
            </span>
            <ThemeToggle variant="full" />
          </div>

          {isAdmin && (
            <div className="pt-2 mt-1 border-t border-[#E6E4DC] dark:border-[#1E2B25] flex items-center justify-between px-2 text-xs text-[#5D6661] dark:text-[#9DAAA3]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Curator Active
              </span>
              <button 
                onClick={() => handleNav('curator-portal')}
                className="font-semibold text-[#064E3B] dark:text-[#34D399] hover:underline cursor-pointer"
              >
                Open Console →
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
