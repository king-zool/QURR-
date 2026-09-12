import React, { createContext, useContext, useState, useEffect } from 'react';
import { Reciter, Surah, ReciterSubmission, ListeningHistoryItem } from '../types';
import { INITIAL_RECITERS } from '../data/reciters';

interface FavoriteSurahItem {
  surahNumber: number;
  reciterId: string;
  reciterName: string;
  surahName: string;
  surahArabicName: string;
  addedAt: string;
}

interface ContinueListeningState {
  reciterId: string;
  surahNumber: number;
  position: number;
  timestamp: number;
}

export interface DownloadedRecordingItem {
  reciterId: string;
  surahNumber: number;
  downloadedAt: string;
}

export interface FavoritesState {
  reciterIds: string[];
  surahs: FavoriteSurahItem[];
}

interface LibraryContextType {
  reciters: Reciter[];
  favorites: FavoritesState;
  favoriteReciterIds: string[];
  favoriteSurahs: FavoriteSurahItem[];
  listeningHistory: ListeningHistoryItem[];
  recentlyPlayed: ListeningHistoryItem[];
  downloadedKeys: string[];
  downloadedRecordings: DownloadedRecordingItem[];
  submissions: ReciterSubmission[];
  continueListening: ContinueListeningState | null;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  curatorEmail: string;
  loginCurator: (email: string, passkey: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>;
  logoutCurator: () => void;
  updateCuratorPasskey: (newPasskey: string) => Promise<void>;
  updateReciter: (id: string, updatedData: Partial<Reciter>) => void;
  addReciter: (newReciter: Reciter) => void;
  deleteReciter: (id: string) => void;
  resetRecitersToDefault: () => void;
  toggleFavoriteReciter: (reciterId: string) => void;
  isFavoriteReciter: (reciterId: string) => boolean;
  toggleFavoriteSurah: (surah: Surah, reciter: Reciter) => void;
  isFavoriteSurah: (surahNumber: number, reciterId: string) => boolean;
  addToHistory: (item: ListeningHistoryItem) => void;
  clearHistory: () => void;
  markAsDownloaded: (reciterId: string, surahNumber: number) => void;
  isDownloaded: (reciterId: string, surahNumber: number) => boolean;
  addSubmission: (submission: Omit<ReciterSubmission, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateSubmissionStatus: (id: string, status: ReciterSubmission['status'], notes?: string) => void;
  deleteSubmission: (id: string) => void;
}

const INITIAL_SUBMISSIONS: ReciterSubmission[] = [
  {
    id: "sub-101",
    reciterName: "Sheikh Malam Ibrahim Bauchi",
    arabicName: "الشيخ إبراهيم باوتشي",
    state: "Bauchi",
    city: "Azare",
    biography: "Notable master of the Warsh riwayah who taught across Katagum emirate in the late 20th century. Renowned for rigorous Tajweed and Tsangaya leadership.",
    riwayah: "Warsh 'an Nafi'",
    qiraah: "Nafi'",
    teachers: "Gwani Adamu Azare, Malam Muhammadu Bello",
    ijazah: "Documented Ijazah in Azare Qur'anic Guild",
    institution: "Markaz Azare Tahfiz",
    audioRecordingsLink: "https://archive.org/details/sheikh-ibrahim-bauchi-archive",
    submittedBy: "Malam Usman Bello",
    submitterEmail: "usman.bello@example.com",
    submitterPhone: "+234 803 456 7890",
    relationshipToReciter: "Former Student & Grandnephew",
    sourceReference: "Bauchi State History & Culture Bureau archives and family tape repository",
    permissionConfirmed: true,
    status: "Pending",
    createdAt: "2024-09-02T14:15:00Z"
  },
  {
    id: "sub-102",
    reciterName: "Qari Hamza Danladi Kano",
    arabicName: "القارئ حمزة دنلادي كانو",
    state: "Kano",
    city: "Kano City",
    biography: "Young recipient of 1st place in the 30-Juz National Musabaqah 2022. Clear and serene Hafs 'an Asim recitation with distinctive Sahelian breath cadence.",
    riwayah: "Hafs 'an Asim",
    qiraah: "'Asim",
    teachers: "Sheikh Dr. Abdullahi Abba Zaria, Sheikh Ahmad Sulaiman",
    ijazah: "Sanad via Tariq Ash-Shatibiyyah (2021)",
    institution: "Bayero University Qur'anic Society",
    audioRecordingsLink: "https://drive.google.com/drive/folders/demo-hamza-recitations",
    submittedBy: "Hamza Danladi (Self)",
    submitterEmail: "hamza.reciter@example.com",
    submitterPhone: "+234 814 111 2233",
    relationshipToReciter: "Self (Original Reciter)",
    sourceReference: "National Musabaqah Sokoto Archives 2022",
    permissionConfirmed: true,
    status: "Approved",
    reviewNotes: "Verified identity and Ijazah with Kano Tajweed Council.",
    createdAt: "2024-08-20T09:30:00Z"
  }
];

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reciters, setReciters] = useState<Reciter[]>(() => {
    try {
      const saved = localStorage.getItem('qurra_reciters');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_RECITERS;
    } catch {
      return INITIAL_RECITERS;
    }
  });

  const [favoriteReciterIds, setFavoriteReciterIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('qurra_fav_reciters');
      return saved ? JSON.parse(saved) : ["reciter-ahmad-sulaiman", "reciter-dahiru-bauchi"];
    } catch {
      return ["reciter-ahmad-sulaiman", "reciter-dahiru-bauchi"];
    }
  });

  const [favoriteSurahs, setFavoriteSurahs] = useState<FavoriteSurahItem[]>(() => {
    try {
      const saved = localStorage.getItem('qurra_fav_surahs');
      return saved ? JSON.parse(saved) : [
        {
          surahNumber: 36,
          reciterId: "reciter-ahmad-sulaiman",
          reciterName: "Sheikh Ahmad Sulaiman",
          surahName: "Ya-Sin",
          surahArabicName: "يس",
          addedAt: new Date().toISOString()
        },
        {
          surahNumber: 67,
          reciterId: "reciter-dahiru-bauchi",
          reciterName: "Sheikh Dahiru Usman Bauchi",
          surahName: "Al-Mulk",
          surahArabicName: "الملك",
          addedAt: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  });

  const [listeningHistory, setListeningHistory] = useState<ListeningHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('qurra_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [downloadedKeys, setDownloadedKeys] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('qurra_downloads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [submissions, setSubmissions] = useState<ReciterSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('qurra_submissions');
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [continueListening, setContinueListening] = useState<ContinueListeningState | null>(() => {
    try {
      const saved = localStorage.getItem('qurra_nigeria_continue_listening');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const session = sessionStorage.getItem('qurra_curator_auth');
      const local = localStorage.getItem('qurra_curator_auth');
      return session === 'true' || local === 'true';
    } catch {
      return false;
    }
  });

  const [curatorEmail, setCuratorEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('qurra_curator_email') || sessionStorage.getItem('qurra_curator_email') || 'curator@qurranigeria.org';
    } catch {
      return 'curator@qurranigeria.org';
    }
  });

  // Cryptographic one-way hashing for secure passkey comparison (never plaintext)
  const hashPasskey = async (rawPasskey: string): Promise<string> => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(rawPasskey.trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch {
      // Fallback simple hash if Web Crypto unavailable
      let hash = 0;
      for (let i = 0; i < rawPasskey.length; i++) {
        hash = (hash << 5) - hash + rawPasskey.charCodeAt(i);
        hash |= 0;
      }
      return hash.toString(16);
    }
  };

  const loginCurator = async (email: string, passkey: string, remember: boolean = true): Promise<{ success: boolean; error?: string }> => {
    const validUsernames = ['curator@qurranigeria.org', 'curator', 'admin@qurranigeria.org', 'admin'];
    const normalizedEmail = email.trim().toLowerCase();
    const isValidUser = validUsernames.includes(normalizedEmail) || normalizedEmail.endsWith('@qurranigeria.org');

    // SHA-256 digests of initial authorized master passkeys (no plaintext stored in code or bundle):
    // 74d6ce49970770a2ae50620efbdfaf4e73864cd94716f0f3cddae6eca280c57b
    // bf28cdc21aeeda8a6e565174903feac5b6fb6e1eafac11c6f50ea2d4bdcee959
    const CANONICAL_HASHES = [
      '74d6ce49970770a2ae50620efbdfaf4e73864cd94716f0f3cddae6eca280c57b',
      'bf28cdc21aeeda8a6e565174903feac5b6fb6e1eafac11c6f50ea2d4bdcee959'
    ];

    let isValidPass = false;
    try {
      const hashedInput = await hashPasskey(passkey);
      const customHash = localStorage.getItem('qurra_curator_passkey_hash');
      if (customHash) {
        isValidPass = hashedInput === customHash;
      } else {
        isValidPass = CANONICAL_HASHES.includes(hashedInput);
      }
    } catch {
      isValidPass = false;
    }

    if (!isValidUser || !isValidPass) {
      return { success: false, error: 'Access denied. Invalid institutional curator credentials.' };
    }

    setIsAdmin(true);
    setCuratorEmail(email.trim());

    try {
      if (remember) {
        localStorage.setItem('qurra_curator_auth', 'true');
        localStorage.setItem('qurra_curator_email', email.trim());
      } else {
        sessionStorage.setItem('qurra_curator_auth', 'true');
        sessionStorage.setItem('qurra_curator_email', email.trim());
      }
    } catch {
      // Ignore storage issues
    }

    return { success: true };
  };

  const logoutCurator = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('qurra_curator_auth');
      sessionStorage.removeItem('qurra_curator_auth');
    } catch {
      // Ignore
    }
  };

  const updateCuratorPasskey = async (newPasskey: string): Promise<void> => {
    try {
      const hashed = await hashPasskey(newPasskey);
      localStorage.setItem('qurra_curator_passkey_hash', hashed);
      // Clean up legacy unhashed keys
      localStorage.removeItem('qurra_curator_custom_passkey');
    } catch {
      // Ignore
    }
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('qurra_reciters', JSON.stringify(reciters));
  }, [reciters]);

  useEffect(() => {
    localStorage.setItem('qurra_fav_reciters', JSON.stringify(favoriteReciterIds));
  }, [favoriteReciterIds]);

  useEffect(() => {
    localStorage.setItem('qurra_fav_surahs', JSON.stringify(favoriteSurahs));
  }, [favoriteSurahs]);

  useEffect(() => {
    localStorage.setItem('qurra_history', JSON.stringify(listeningHistory));
  }, [listeningHistory]);

  useEffect(() => {
    localStorage.setItem('qurra_downloads', JSON.stringify(downloadedKeys));
  }, [downloadedKeys]);

  useEffect(() => {
    localStorage.setItem('qurra_submissions', JSON.stringify(submissions));
  }, [submissions]);

  const toggleFavoriteReciter = (reciterId: string) => {
    setFavoriteReciterIds(prev => 
      prev.includes(reciterId) ? prev.filter(id => id !== reciterId) : [...prev, reciterId]
    );
  };

  const isFavoriteReciter = (reciterId: string) => favoriteReciterIds.includes(reciterId);

  const toggleFavoriteSurah = (surah: Surah, reciter: Reciter) => {
    setFavoriteSurahs(prev => {
      const exists = prev.some(item => item.surahNumber === surah.number && item.reciterId === reciter.id);
      if (exists) {
        return prev.filter(item => !(item.surahNumber === surah.number && item.reciterId === reciter.id));
      } else {
        return [
          {
            surahNumber: surah.number,
            reciterId: reciter.id,
            reciterName: reciter.name,
            surahName: surah.englishName,
            surahArabicName: surah.arabicName,
            addedAt: new Date().toISOString()
          },
          ...prev
        ];
      }
    });
  };

  const isFavoriteSurah = (surahNumber: number, reciterId: string) => {
    return favoriteSurahs.some(item => item.surahNumber === surahNumber && item.reciterId === reciterId);
  };

  const addToHistory = (item: ListeningHistoryItem) => {
    setListeningHistory(prev => {
      const filtered = prev.filter(i => !(i.reciterId === item.reciterId && i.surahNumber === item.surahNumber));
      return [item, ...filtered].slice(0, 30); // keep last 30
    });
  };

  const clearHistory = () => {
    setListeningHistory([]);
    localStorage.removeItem('qurra_history');
    localStorage.removeItem('qurra_nigeria_continue_listening');
    setContinueListening(null);
  };

  const markAsDownloaded = (reciterId: string, surahNumber: number) => {
    const key = `${reciterId}_${surahNumber}`;
    setDownloadedKeys(prev => prev.includes(key) ? prev : [...prev, key]);
  };

  const isDownloaded = (reciterId: string, surahNumber: number) => {
    return downloadedKeys.includes(`${reciterId}_${surahNumber}`);
  };

  const addSubmission = async (data: Omit<ReciterSubmission, 'id' | 'createdAt' | 'status'>) => {
    const newId = `sub-${Date.now()}`;
    const newSubmission: ReciterSubmission = {
      ...data,
      id: newId,
      status: "Pending",
      createdAt: new Date().toISOString()
    };
    setSubmissions(prev => [newSubmission, ...prev]);
    return newId;
  };

  const updateSubmissionStatus = (id: string, status: ReciterSubmission['status'], notes?: string) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          status,
          reviewNotes: notes !== undefined ? notes : sub.reviewNotes
        };
      }
      return sub;
    }));
  };

  const deleteSubmission = (id: string) => {
    setSubmissions(prev => prev.filter(sub => sub.id !== id));
  };

  const updateReciter = (id: string, updatedData: Partial<Reciter>) => {
    setReciters(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          ...updatedData,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));
  };

  const addReciter = (newReciter: Reciter) => {
    setReciters(prev => [newReciter, ...prev]);
  };

  const deleteReciter = (id: string) => {
    setReciters(prev => prev.filter(r => r.id !== id));
  };

  const resetRecitersToDefault = () => {
    setReciters(INITIAL_RECITERS);
    try {
      localStorage.removeItem('qurra_reciters');
    } catch {
      // ignore
    }
  };

  const favorites: FavoritesState = {
    reciterIds: favoriteReciterIds,
    surahs: favoriteSurahs
  };

  const downloadedRecordings: DownloadedRecordingItem[] = downloadedKeys.map(key => {
    const parts = key.split('_');
    return {
      reciterId: parts[0] || '',
      surahNumber: parseInt(parts[1] || '1', 10),
      downloadedAt: new Date().toISOString()
    };
  });

  return (
    <LibraryContext.Provider
      value={{
        reciters,
        favorites,
        favoriteReciterIds,
        favoriteSurahs,
        listeningHistory,
        recentlyPlayed: listeningHistory,
        downloadedKeys,
        downloadedRecordings,
        submissions,
        continueListening,
        isAdmin,
        setIsAdmin,
        curatorEmail,
        loginCurator,
        logoutCurator,
        updateCuratorPasskey,
        updateReciter,
        addReciter,
        deleteReciter,
        resetRecitersToDefault,
        toggleFavoriteReciter,
        isFavoriteReciter,
        toggleFavoriteSurah,
        isFavoriteSurah,
        addToHistory,
        clearHistory,
        markAsDownloaded,
        isDownloaded,
        addSubmission,
        updateSubmissionStatus,
        deleteSubmission
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
