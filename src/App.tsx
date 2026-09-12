import React, { useState, useEffect } from 'react';
import { AudioProvider } from './context/AudioContext';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GlobalAudioPlayer } from './components/GlobalAudioPlayer';
import { SearchModal } from './components/SearchModal';
import { ShareModal } from './components/ShareModal';

import { HomeView } from './views/HomeView';
import { RecitersView } from './views/RecitersView';
import { ReciterProfileView } from './views/ReciterProfileView';
import { QuranView } from './views/QuranView';
import { HeritageView } from './views/HeritageView';
import { SubmitReciterView } from './views/SubmitReciterView';
import { AdminView } from './views/AdminView';
import { CuratorLoginView } from './views/CuratorLoginView';
import { AboutView } from './views/AboutView';

import { ActiveView } from './types';

function AppContent() {
  const { reciters, isAdmin } = useLibrary();
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedReciterSlug, setSelectedReciterSlug] = useState<string | null>(null);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [shareModalData, setShareModalData] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    url: string;
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    url: ''
  });

  // Handle URL hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      const parts = hash.split('/').filter(Boolean);

      if (parts.length === 0) {
        setActiveView('home');
        setSelectedReciterSlug(null);
      } else if (parts[0] === 'reciters') {
        if (parts[1]) {
          setActiveView('reciter-profile');
          setSelectedReciterSlug(parts[1]);
        } else {
          setActiveView('reciters');
          setSelectedReciterSlug(null);
        }
      } else if (parts[0] === 'quran') {
        setActiveView('quran');
      } else if (parts[0] === 'heritage') {
        setActiveView('heritage');
      } else if (parts[0] === 'submit-reciter') {
        setActiveView('submit-reciter');
      } else if (parts[0] === 'curator-portal' || parts[0] === 'curator' || parts[0] === 'curator-gateway') {
        setActiveView('curator-portal');
      } else if (parts[0] === 'admin') {
        // Disguise public /admin access: if not authenticated, redirect to home silently
        if (isAdmin) {
          setActiveView('curator-portal');
          window.location.hash = '#/curator-portal';
        } else {
          setActiveView('home');
          window.location.hash = '#/';
        }
      } else if (parts[0] === 'about') {
        setActiveView('about');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on initial mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdmin]);

  // Sync state changes with window.location.hash
  const navigateTo = (view: ActiveView, slug?: string) => {
    setActiveView(view);
    if (view === 'home') {
      window.location.hash = '#/';
      setSelectedReciterSlug(null);
    } else if (view === 'reciters') {
      window.location.hash = '#/reciters';
      setSelectedReciterSlug(null);
    } else if (view === 'reciter-profile' && slug) {
      setSelectedReciterSlug(slug);
      window.location.hash = `#/reciters/${slug}`;
    } else if (view === 'quran') {
      window.location.hash = '#/quran';
    } else if (view === 'heritage') {
      window.location.hash = '#/heritage';
    } else if (view === 'submit-reciter') {
      window.location.hash = '#/submit-reciter';
    } else if (view === 'curator-portal') {
      window.location.hash = '#/curator-portal';
    } else if (view === 'admin') {
      if (isAdmin) {
        window.location.hash = '#/curator-portal';
      } else {
        window.location.hash = '#/';
      }
    } else if (view === 'about') {
      window.location.hash = '#/about';
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenShareModal = (title: string, subtitle: string, url: string) => {
    setShareModalData({
      isOpen: true,
      title,
      subtitle,
      url
    });
  };

  const handleCloseShareModal = () => {
    setShareModalData(prev => ({ ...prev, isOpen: false }));
  };

  // Find active reciter dynamically from library state
  const currentReciter = selectedReciterSlug
    ? reciters.find(r => r.slug === selectedReciterSlug) || reciters[0]
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#191E1C]">
      
      {/* Institutional Navbar */}
      <Navbar
        activeView={activeView}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'home' && (
          <HomeView
            onNavigate={navigateTo}
          />
        )}

        {activeView === 'reciters' && (
          <RecitersView
            onSelectReciter={(slug) => navigateTo('reciter-profile', slug)}
          />
        )}

        {activeView === 'reciter-profile' && currentReciter && (
          <ReciterProfileView
            reciter={currentReciter}
            onBack={() => navigateTo('reciters')}
            onOpenShareModal={handleOpenShareModal}
          />
        )}

        {activeView === 'quran' && (
          <QuranView
            onOpenShareModal={handleOpenShareModal}
            onNavigateToReciter={(slug) => navigateTo('reciter-profile', slug)}
          />
        )}

        {activeView === 'heritage' && (
          <HeritageView
            onSelectReciter={(slug) => navigateTo('reciter-profile', slug)}
          />
        )}

        {activeView === 'submit-reciter' && (
          <SubmitReciterView />
        )}

        {(activeView === 'admin' || activeView === 'curator-portal') && (
          isAdmin ? (
            <AdminView onExit={() => navigateTo('home')} />
          ) : (
            <CuratorLoginView
              onLoginSuccess={() => {
                setActiveView('curator-portal');
                window.location.hash = '#/curator-portal';
              }}
              onBackToHome={() => navigateTo('home')}
            />
          )
        )}

        {activeView === 'about' && (
          <AboutView
            onNavigateToSubmit={() => navigateTo('submit-reciter')}
            onNavigateToReciters={() => navigateTo('reciters')}
          />
        )}
      </main>

      {/* Global Audio Player Bar (Persistent) */}
      <GlobalAudioPlayer
        onOpenShareModal={handleOpenShareModal}
        onNavigateToReciter={(slug) => navigateTo('reciter-profile', slug)}
      />

      {/* Institutional Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectReciter={(slug) => navigateTo('reciter-profile', slug)}
        onSelectSurah={(surahNumber) => {
          navigateTo('quran');
        }}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalData.isOpen}
        onClose={handleCloseShareModal}
        title={shareModalData.title}
        subtitle={shareModalData.subtitle}
        url={shareModalData.url}
      />

    </div>
  );
}

export default function App() {
  return (
    <LibraryProvider>
      <AudioProvider>
        <AppContent />
      </AudioProvider>
    </LibraryProvider>
  );
}
