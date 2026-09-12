import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Reciter, Surah, Recording } from '../types';
import { SURAHS } from '../data/surahs';
import { getReciterSurahAudioUrl } from '../data/reciters';

export interface ActiveTrack {
  reciter: Reciter;
  surah: Surah;
  audioUrl: string;
  customRecording?: Recording;
}

interface AudioContextType {
  activeTrack: ActiveTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  repeatMode: 'off' | 'track' | 'all';
  isShuffle: boolean;
  queue: ActiveTrack[];
  queueIndex: number;
  isLoading: boolean;
  hasError: boolean;
  isQueueOpen: boolean;
  setIsQueueOpen: (open: boolean) => void;
  playTrack: (reciter: Reciter, surah: Surah, customAudioUrl?: string) => void;
  playRecording: (recording: Recording, reciter: Reciter) => void;
  togglePlayPause: () => void;
  pauseTrack: () => void;
  seekTo: (seconds: number) => void;
  skipTime: (seconds: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  setRepeatMode: (mode: 'off' | 'track' | 'all') => void;
  toggleShuffle: () => void;
  playReciterCompleteQuran: (reciter: Reciter, startSurahNumber?: number) => void;
  addToQueue: (reciter: Reciter, surah: Surah) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTrack, setActiveTrack] = useState<ActiveTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [repeatMode, setRepeatMode] = useState<'off' | 'track' | 'all'>('off');
  const [isShuffle, setIsShuffle] = useState(false);
  const [queue, setQueue] = useState<ActiveTrack[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize HTML Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
      setHasError(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Save continue listening state to local storage
      if (activeTrack && audio.currentTime > 2) {
        try {
          const continueState = {
            reciterId: activeTrack.reciter.id,
            surahNumber: activeTrack.surah.number,
            position: audio.currentTime,
            timestamp: Date.now()
          };
          localStorage.setItem('qurra_nigeria_continue_listening', JSON.stringify(continueState));
        } catch {
          // ignore storage errors
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (repeatMode === 'track') {
        audio.currentTime = 0;
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        // advance next
        handleNextTrack();
      }
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Update volume & rate when audio changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);

  const playTrack = (reciter: Reciter, surah: Surah, customAudioUrl?: string) => {
    const audioUrl = customAudioUrl || getReciterSurahAudioUrl(reciter, surah.number);
    const track: ActiveTrack = {
      reciter,
      surah,
      audioUrl
    };

    setActiveTrack(track);
    setHasError(false);
    setIsLoading(true);

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.warn('Playback error or user gesture required:', err);
          setIsPlaying(false);
          setIsLoading(false);
        });
    }

    // Set queue if empty or single
    setQueue([track]);
    setQueueIndex(0);
  };

  const playRecording = (recording: Recording, reciter: Reciter) => {
    const surah = SURAHS.find(s => s.number === recording.surahId) || SURAHS[0];
    const track: ActiveTrack = {
      reciter,
      surah,
      audioUrl: recording.audioUrl,
      customRecording: recording
    };

    setActiveTrack(track);
    setHasError(false);
    setIsLoading(true);

    if (audioRef.current) {
      audioRef.current.src = recording.audioUrl;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
          setIsLoading(false);
        });
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !activeTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Play error:', err);
          setIsPlaying(false);
        });
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seekTo = (seconds: number) => {
    if (audioRef.current) {
      const clamped = Math.max(0, Math.min(seconds, duration || 0));
      audioRef.current.currentTime = clamped;
      setCurrentTime(clamped);
    }
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      const target = audioRef.current.currentTime + seconds;
      seekTo(target);
    }
  };

  const handleNextTrack = () => {
    if (queue.length === 0) return;
    let nextIdx = queueIndex + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      if (repeatMode === 'all') {
        nextIdx = 0;
      } else {
        return; // reached end of queue
      }
    }

    const nextTrackItem = queue[nextIdx];
    if (nextTrackItem) {
      setQueueIndex(nextIdx);
      setActiveTrack(nextTrackItem);
      if (audioRef.current) {
        audioRef.current.src = nextTrackItem.audioUrl;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  };

  const nextTrack = () => {
    handleNextTrack();
  };

  const previousTrack = () => {
    if (queue.length === 0) return;
    // If past 4 seconds, restart current track
    if (currentTime > 4 && audioRef.current) {
      seekTo(0);
      return;
    }

    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = repeatMode === 'all' ? queue.length - 1 : 0;
    }

    const prevTrackItem = queue[prevIdx];
    if (prevTrackItem) {
      setQueueIndex(prevIdx);
      setActiveTrack(prevTrackItem);
      if (audioRef.current) {
        audioRef.current.src = prevTrackItem.audioUrl;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : volume;
    }
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const playReciterCompleteQuran = (reciter: Reciter, startSurahNumber: number = 1) => {
    const fullQueue: ActiveTrack[] = SURAHS.map(surah => ({
      reciter,
      surah,
      audioUrl: getReciterSurahAudioUrl(reciter, surah.number)
    }));

    const startIndex = Math.max(0, startSurahNumber - 1);
    setQueue(fullQueue);
    setQueueIndex(startIndex);

    const initial = fullQueue[startIndex];
    setActiveTrack(initial);
    setIsLoading(true);

    if (audioRef.current) {
      audioRef.current.src = initial.audioUrl;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setIsLoading(false);
        });
    }
  };

  const addToQueue = (reciter: Reciter, surah: Surah) => {
    const track: ActiveTrack = {
      reciter,
      surah,
      audioUrl: getReciterSurahAudioUrl(reciter, surah.number)
    };
    setQueue(prev => [...prev, track]);
  };

  const removeFromQueue = (idx: number) => {
    setQueue(prev => prev.filter((_, i) => i !== idx));
    if (idx < queueIndex) {
      setQueueIndex(prev => prev - 1);
    }
  };

  const clearQueue = () => {
    if (activeTrack) {
      setQueue([activeTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(-1);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        activeTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playbackRate,
        repeatMode,
        isShuffle,
        queue,
        queueIndex,
        isLoading,
        hasError,
        isQueueOpen,
        setIsQueueOpen,
        playTrack,
        playRecording,
        togglePlayPause,
        pauseTrack,
        seekTo,
        skipTime,
        nextTrack,
        previousTrack,
        setVolume,
        toggleMute,
        setPlaybackRate,
        setRepeatMode,
        toggleShuffle,
        playReciterCompleteQuran,
        addToQueue,
        removeFromQueue,
        clearQueue
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
