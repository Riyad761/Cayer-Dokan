import React, { useRef } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  ListMusic,
  Disc3,
  Radio,
} from 'lucide-react';
import { Track, PlayerState } from '../types';

interface MusicPlayerCardProps {
  track: Track;
  playerState: PlayerState;
  onPlayPause: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onSeek: (seconds: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onOpenQueue: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const MusicPlayerCard: React.FC<MusicPlayerCardProps> = ({
  track,
  playerState,
  onPlayPause,
  onPrevTrack,
  onNextTrack,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
  onToggleMute,
  onVolumeChange,
  onOpenQueue,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const duration = playerState.duration > 0 ? playerState.duration : track.duration || 180;
  const progressPercent = Math.min(100, Math.max(0, (playerState.currentTime / duration) * 100));

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const ratio = Math.max(0, Math.min(1, clickX / width));
    onSeek(ratio * duration);
  };

  return (
    <div
      id="highway-radio-player-wrapper"
      className="fixed bottom-3 sm:bottom-6 left-0 right-0 z-40 px-3 sm:px-4 max-w-xl mx-auto pointer-events-none"
    >
      <motion.div
        id="highway-radio-player-card"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
        className="pointer-events-auto relative w-full rounded-[28px] bg-gradient-to-r from-[#2c1307]/95 via-[#3d1a0a]/95 to-[#240e05]/95 backdrop-blur-2xl border border-amber-500/30 p-3.5 sm:p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85)]"
      >
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        {/* TOP ROW: Album Artwork + Song Title / Artist + Frequency Status */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-3 min-w-0">
            {/* Circular Rotating Album Thumbnail */}
            <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-stone-900 border-2 border-amber-500/50 shadow-md flex items-center justify-center shrink-0 overflow-hidden p-0.5">
              {track.thumbnail ? (
                <img
                  src={track.thumbnail}
                  alt={track.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover rounded-full ${
                    playerState.isPlaying ? 'animate-spin-slow' : ''
                  }`}
                />
              ) : (
                <Disc3
                  className={`w-6 h-6 text-amber-400 ${
                    playerState.isPlaying ? 'animate-spin-slow' : ''
                  }`}
                />
              )}
              {/* Center Vinyl Spindle Hole */}
              <div className="absolute w-3 h-3 rounded-full bg-stone-950 border border-amber-400/80 shadow-inner" />
            </div>

            {/* Title and Artist Stack */}
            <div className="flex flex-col min-w-0 pr-1">
              <div className="flex items-center gap-2">
                <span className="font-bold font-anek text-sm sm:text-base text-amber-100 truncate leading-tight">
                  {track.title}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-siliguri text-amber-300/80 truncate">
                  {track.artist}
                </span>
                <span className="text-[10px] text-amber-500/70 font-mono px-1.5 py-0.2 rounded bg-black/40 border border-amber-900/40 shrink-0 hidden xs:inline">
                  {track.category}
                </span>
              </div>
            </div>
          </div>

          {/* Radio Signal / Volume Mini Control */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="player-mute-toggle-btn"
              onClick={onToggleMute}
              aria-label="শব্দ বন্ধ/চালু"
              className="p-2 rounded-full hover:bg-white/10 text-amber-300/80 hover:text-amber-200 transition-all duration-150 active:scale-90 cursor-pointer"
            >
              {playerState.isMuted || playerState.volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <div className="hidden sm:flex items-center w-16">
              <input
                id="player-volume-slider"
                type="range"
                min="0"
                max="100"
                value={playerState.isMuted ? 0 : playerState.volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-full h-1 bg-amber-950/80 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        </div>

        {/* MIDDLE: Thin Horizontal Seekable Progress Bar with Time Labels */}
        <div className="w-full space-y-1 mb-2.5">
          <div
            ref={progressBarRef}
            id="player-progress-track"
            onClick={handleProgressClick}
            className="group relative w-full h-2 rounded-full bg-black/50 cursor-pointer flex items-center py-1 overflow-visible"
          >
            <div className="w-full h-1.5 rounded-full bg-[#1b0a04] overflow-hidden">
              <div
                id="player-progress-fill"
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 transition-[width] duration-150 rounded-full relative"
              />
            </div>
            {/* Seek Thumb */}
            <div
              style={{ left: `${progressPercent}%` }}
              className="absolute -translate-x-1/2 w-3 h-3 rounded-full bg-amber-200 border-2 border-amber-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 px-0.5">
            <span>{formatTime(playerState.currentTime)}</span>
            <div className="flex items-center gap-1">
              {playerState.isBuffering && (
                <span className="text-amber-400 text-[10px] animate-pulse">বাফারিং...</span>
              )}
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Playback Control Buttons */}
        <div className="flex items-center justify-between pt-1">
          {/* Shuffle Toggle */}
          <button
            id="player-shuffle-btn"
            onClick={onToggleShuffle}
            aria-label="শাফল"
            className={`p-2 rounded-full transition-all duration-200 active:scale-90 cursor-pointer ${
              playerState.isShuffle
                ? 'text-amber-300 bg-amber-500/20 ring-1 ring-amber-400/50'
                : 'text-stone-400 hover:text-amber-200 hover:bg-white/5'
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Previous Track */}
          <button
            id="player-prev-track-btn"
            onClick={onPrevTrack}
            aria-label="পূর্ববর্তী গান"
            className="p-2 sm:p-2.5 rounded-full text-stone-200 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90 cursor-pointer"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Main Large Solid White Circular Play/Pause Button with Black Icon */}
          <button
            id="player-main-play-pause-btn"
            onClick={onPlayPause}
            aria-label={playerState.isPlaying ? 'বিরতি' : 'বাজান'}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white hover:bg-amber-100 text-stone-950 flex items-center justify-center shadow-xl shadow-amber-950/70 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            {playerState.isPlaying ? (
              <Pause className="w-6 h-6 fill-stone-950 text-stone-950" />
            ) : (
              <Play className="w-6 h-6 fill-stone-950 text-stone-950 ml-1" />
            )}
          </button>

          {/* Next Track */}
          <button
            id="player-next-track-btn"
            onClick={onNextTrack}
            aria-label="পরবর্তী গান"
            className="p-2 sm:p-2.5 rounded-full text-stone-200 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90 cursor-pointer"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Queue / Playlist Drawer Trigger */}
          <div className="flex items-center gap-1">
            <button
              id="player-repeat-btn"
              onClick={onToggleRepeat}
              aria-label="রিপিট"
              className={`p-2 rounded-full transition-all duration-200 active:scale-90 cursor-pointer hidden xs:block ${
                playerState.isRepeat
                  ? 'text-amber-300 bg-amber-500/20 ring-1 ring-amber-400/50'
                  : 'text-stone-400 hover:text-amber-200 hover:bg-white/5'
              }`}
            >
              <Repeat className="w-4 h-4" />
            </button>

            <button
              id="player-queue-toggle-btn"
              onClick={onOpenQueue}
              aria-label="গানের সারি"
              className="p-2 rounded-full text-stone-300 hover:text-amber-200 hover:bg-white/10 transition-all duration-200 active:scale-90 cursor-pointer"
            >
              <ListMusic className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
