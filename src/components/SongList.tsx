import React from 'react';
import { Track } from '../types';
import { Play, Pause, Disc3, Sparkles } from 'lucide-react';

interface SongListProps {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onSelectTrack: (index: number) => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const SongList: React.FC<SongListProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  onSelectTrack,
}) => {
  return (
    <div id="song-list-container" className="w-full space-y-2">
      {tracks.map((track, idx) => {
        const isCurrent = idx === currentTrackIndex;
        const isCurrentlyPlaying = isCurrent && isPlaying;

        return (
          <div
            key={track.id}
            id={`song-row-${track.id}`}
            onClick={() => onSelectTrack(idx)}
            className={`group relative flex items-center justify-between p-3 sm:p-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
              isCurrent
                ? 'bg-gradient-to-r from-amber-950/90 via-[#36170a]/90 to-amber-950/80 border border-amber-500/50 shadow-lg shadow-black/40 scale-[1.01]'
                : 'bg-[#1a0c06]/60 hover:bg-[#251108]/90 border border-amber-950/50 hover:border-amber-800/40'
            }`}
          >
            {/* Left: Index / Play Icon + Album Cover + Metadata */}
            <div className="flex items-center gap-3 min-w-0 pr-2">
              {/* Play State Button */}
              <div className="relative w-10 h-10 rounded-xl bg-[#2a1308] border border-amber-700/30 flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:border-amber-500/50 transition-colors">
                {track.thumbnail ? (
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover opacity-80 ${isCurrentlyPlaying ? 'animate-spin-slow' : ''}`}
                  />
                ) : (
                  <Disc3 className="w-5 h-5 text-amber-500/70" />
                )}

                <div
                  className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
                    isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {isCurrentlyPlaying ? (
                    <div className="flex items-end gap-0.5 h-4">
                      <span className="w-1 bg-amber-400 rounded-full eq-bar-1" />
                      <span className="w-1 bg-amber-300 rounded-full eq-bar-2" />
                      <span className="w-1 bg-amber-400 rounded-full eq-bar-3" />
                      <span className="w-1 bg-amber-200 rounded-full eq-bar-4" />
                    </div>
                  ) : (
                    <Play className="w-4 h-4 text-amber-100 fill-amber-100 ml-0.5" />
                  )}
                </div>
              </div>

              {/* Title & Artist */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold font-anek text-sm sm:text-base truncate ${
                      isCurrent ? 'text-amber-300' : 'text-stone-100 group-hover:text-amber-200'
                    }`}
                  >
                    {track.title}
                  </span>
                  {isCurrent && (
                    <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                      <Sparkles className="w-2.5 h-2.5" />
                      বাজছে
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                  <span className="font-siliguri truncate">{track.artist}</span>
                  <span className="text-stone-600">•</span>
                  <span className="text-[11px] text-amber-500/80 font-siliguri hidden sm:inline truncate">
                    {track.mood}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Category Chip & Duration */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <span className="hidden md:inline-block text-[11px] font-siliguri px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300/80 border border-amber-800/30">
                {track.category}
              </span>

              <span className="text-xs font-mono text-stone-400 w-10 text-right">
                {formatDuration(track.duration)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
