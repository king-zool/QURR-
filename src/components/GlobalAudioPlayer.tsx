import React, { useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw, 
  Volume2, VolumeX, Repeat, Shuffle, ListMusic, Heart, Share2, 
  Download, ChevronUp, ChevronDown, Check, Loader2
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';

interface GlobalAudioPlayerProps {
  onOpenShareModal: (surahName: string, reciterName: string, url: string) => void;
  onNavigateToReciter: (slug: string) => void;
}

export const GlobalAudioPlayer: React.FC<GlobalAudioPlayerProps> = ({ 
  onOpenShareModal, 
  onNavigateToReciter 
}) => {
  const { 
    activeTrack, 
    isPlaying, 
    currentTime, 
    duration, 
    volume, 
    isMuted, 
    playbackRate, 
    repeatMode, 
    isShuffle, 
    isLoading,
    queue,
    queueIndex,
    isQueueOpen,
    setIsQueueOpen,
    togglePlayPause, 
    seekTo, 
    skipTime, 
    nextTrack, 
    previousTrack, 
    setVolume, 
    toggleMute, 
    setPlaybackRate, 
    setRepeatMode, 
    toggleShuffle,
    removeFromQueue,
    playTrack
  } = useAudio();

  const { toggleFavoriteSurah, isFavoriteSurah, markAsDownloaded } = useLibrary();
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!activeTrack) {
    return null;
  }

  const { reciter, surah, audioUrl } = activeTrack;
  const isFav = isFavoriteSurah(surah.number, reciter.id);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "00:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seekTo(val);
  };

  const cycleRepeatMode = () => {
    if (repeatMode === 'off') setRepeatMode('track');
    else if (repeatMode === 'track') setRepeatMode('all');
    else setRepeatMode('off');
  };

  const handleDownload = () => {
    markAsDownloaded(reciter.id, surah.number);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);

    // Trigger download anchor
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `Qurra_Nigeria_${reciter.slug}_Surah_${String(surah.number).padStart(3, '0')}.mp3`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Queue Drawer Modal */}
      {isQueueOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#FCFBF9] h-full shadow-2xl flex flex-col border-l border-[#E2DDD3]">
            <div className="p-4 border-b border-[#E8E4DA] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1E2421]">Listening Queue</h3>
                <p className="text-xs text-[#6B7570]">{queue.length} recitations lined up</p>
              </div>
              <button 
                onClick={() => setIsQueueOpen(false)}
                className="p-1.5 rounded-md hover:bg-[#EFECE3] text-[#555E59]"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#EFECE3]">
              {queue.map((track, idx) => {
                const isCurrent = idx === queueIndex;
                return (
                  <div 
                    key={`${track.surah.number}-${idx}`}
                    className={`py-3 px-2 flex items-center justify-between rounded-lg transition-colors ${
                      isCurrent ? 'bg-[#064E3B]/10' : 'hover:bg-[#F5F2EA]'
                    }`}
                  >
                    <div 
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      onClick={() => playTrack(track.reciter, track.surah, track.audioUrl)}
                    >
                      <span className={`text-xs font-mono w-6 text-center ${isCurrent ? 'text-[#064E3B] font-bold' : 'text-[#87928C]'}`}>
                        {track.surah.number}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#1A1F1D] truncate flex items-center gap-1.5">
                          {track.surah.englishName}
                          <span className="font-arabic text-sm text-[#064E3B]">{track.surah.arabicName}</span>
                        </div>
                        <p className="text-xs text-[#6B7570] truncate">{track.reciter.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-bold text-[#064E3B] px-1.5 py-0.5 rounded bg-white border border-[#064E3B]/20">
                          Now
                        </span>
                      )}
                      <button
                        onClick={() => removeFromQueue(idx)}
                        className="text-xs text-[#9DA8A2] hover:text-red-600 px-1"
                        title="Remove from queue"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Global Player Dock */}
      <div 
        id="global-audio-player"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#161C19] text-[#F3F6F4] border-t border-[#29342F] shadow-2xl"
      >
        {/* Seek Progress Bar at the absolute top edge of the player */}
        <div className="relative w-full h-1.5 group bg-[#26312B] cursor-pointer">
          <div 
            className="h-full bg-[#34D399] relative transition-all duration-75"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.5"
            value={currentTime}
            onChange={handleSeekChange}
            aria-label="Seek track"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            
            {/* Left: Track Information */}
            <div className="flex items-center gap-3 min-w-0 max-w-[200px] sm:max-w-xs md:max-w-sm">
              <div 
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-[#242F29] shrink-0 cursor-pointer border border-[#313E36]"
                onClick={() => onNavigateToReciter(reciter.slug)}
              >
                <img 
                  src={reciter.photograph} 
                  alt={reciter.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-semibold text-white truncate">
                    Surah {surah.englishName}
                  </h4>
                  <span className="font-arabic text-sm text-[#34D399] shrink-0">
                    {surah.arabicName}
                  </span>
                </div>
                
                <p 
                  className="text-xs text-[#9EABA3] hover:text-white truncate cursor-pointer transition-colors"
                  onClick={() => onNavigateToReciter(reciter.slug)}
                >
                  {reciter.name} • <span className="text-[#C29B38]">{reciter.riwayah}</span>
                </p>
              </div>

              {/* Quick favorite icon for this surah */}
              <button
                onClick={() => toggleFavoriteSurah(surah, reciter)}
                className="hidden sm:block p-1 text-[#8E9B93] hover:text-[#E11D48] transition-colors"
                title={isFav ? "Remove from favourites" : "Add to favourites"}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-[#E11D48] text-[#E11D48]' : ''}`} />
              </button>
            </div>

            {/* Center: Playback Controls */}
            <div className="flex flex-col items-center gap-1 flex-1 max-w-lg">
              <div className="flex items-center gap-1.5 sm:gap-3">
                
                {/* Shuffle */}
                <button
                  onClick={toggleShuffle}
                  className={`hidden sm:block p-1.5 rounded-full transition-colors ${
                    isShuffle ? 'text-[#34D399] bg-[#24312A]' : 'text-[#8E9B93] hover:text-white'
                  }`}
                  title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                {/* 10s Rewind */}
                <button
                  onClick={() => skipTime(-10)}
                  className="p-1.5 text-[#A5B3AC] hover:text-white transition-colors"
                  title="Rewind 10 seconds"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Previous */}
                <button
                  onClick={previousTrack}
                  className="p-1.5 text-[#A5B3AC] hover:text-white transition-colors"
                  title="Previous Surah"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Main Play/Pause Button */}
                <button
                  id="global-play-pause-btn"
                  onClick={togglePlayPause}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#064E3B] text-white flex items-center justify-center hover:bg-[#055B44] transition-transform active:scale-95 shadow-md border border-[#086E53]"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5 fill-white text-white" />
                  ) : (
                    <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                  )}
                </button>

                {/* Next */}
                <button
                  onClick={nextTrack}
                  className="p-1.5 text-[#A5B3AC] hover:text-white transition-colors"
                  title="Next Surah"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* 10s Forward */}
                <button
                  onClick={() => skipTime(10)}
                  className="p-1.5 text-[#A5B3AC] hover:text-white transition-colors"
                  title="Forward 10 seconds"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Repeat Mode */}
                <button
                  onClick={cycleRepeatMode}
                  className={`hidden sm:flex items-center justify-center p-1.5 rounded-full transition-colors relative ${
                    repeatMode !== 'off' ? 'text-[#34D399] bg-[#24312A]' : 'text-[#8E9B93] hover:text-white'
                  }`}
                  title={`Repeat: ${repeatMode}`}
                >
                  <Repeat className="w-4 h-4" />
                  {repeatMode === 'track' && (
                    <span className="absolute -top-1 -right-1 text-[9px] font-bold text-[#34D399]">1</span>
                  )}
                </button>
              </div>

              {/* Time display */}
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#8E9B93] font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right: Volume, Speed, Queue, Share, Download */}
            <div className="flex items-center gap-1 sm:gap-2">
              
              {/* Playback Speed Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                  className="hidden md:flex items-center justify-center px-2 py-1 text-xs font-mono font-medium rounded bg-[#25302A] hover:bg-[#303E36] text-[#CDD7D1] transition-colors"
                  title="Playback Speed"
                >
                  {playbackRate}x
                </button>

                {isSpeedMenuOpen && (
                  <div className="absolute bottom-full mb-2 right-0 bg-[#1E2522] border border-[#313E36] rounded-lg shadow-xl p-1 text-xs z-50 flex flex-col min-w-[70px]">
                    {[0.75, 1, 1.25, 1.5, 1.75].map(rate => (
                      <button
                        key={rate}
                        onClick={() => {
                          setPlaybackRate(rate);
                          setIsSpeedMenuOpen(false);
                        }}
                        className={`px-2.5 py-1 text-left rounded font-mono ${
                          playbackRate === rate ? 'bg-[#064E3B] text-white font-bold' : 'text-[#CDD7D1] hover:bg-[#28342D]'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Volume Slider (Desktop) */}
              <div className="hidden lg:flex items-center gap-2 px-1">
                <button 
                  onClick={toggleMute}
                  className="text-[#9EABA3] hover:text-white"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  aria-label="Volume slider"
                  className="w-16 h-1 bg-[#324037] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
                />
              </div>

              {/* Queue Button */}
              <button
                onClick={() => setIsQueueOpen(!isQueueOpen)}
                className={`p-2 rounded-md hover:bg-[#25302A] text-[#9EABA3] hover:text-white transition-colors relative ${
                  isQueueOpen ? 'text-[#34D399] bg-[#25302A]' : ''
                }`}
                title="Queue"
              >
                <ListMusic className="w-4 h-4" />
                {queue.length > 1 && (
                  <span className="absolute 1 top-1 right-1 w-2 h-2 rounded-full bg-[#34D399]" />
                )}
              </button>

              {/* Share Button */}
              <button
                onClick={() => onOpenShareModal(surah.englishName, reciter.name, window.location.href)}
                className="p-2 rounded-md hover:bg-[#25302A] text-[#9EABA3] hover:text-white transition-colors"
                title="Share Recitation"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="p-2 rounded-md hover:bg-[#25302A] text-[#9EABA3] hover:text-white transition-colors"
                title={downloadSuccess ? "Downloaded!" : "Download MP3 (Permission Granted)"}
              >
                {downloadSuccess ? <Check className="w-4 h-4 text-[#34D399]" /> : <Download className="w-4 h-4" />}
              </button>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};
