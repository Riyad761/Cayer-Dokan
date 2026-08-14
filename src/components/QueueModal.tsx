import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Disc3, Play, ListMusic, Sparkles } from 'lucide-react';
import { Track } from '../types';

interface QueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onSelectTrack: (index: number) => void;
}

export const QueueModal: React.FC<QueueModalProps> = ({
  isOpen,
  onClose,
  tracks,
  currentTrackIndex,
  isPlaying,
  onSelectTrack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTracks = tracks.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="queue-modal-overlay" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="relative w-full max-w-lg max-h-[85vh] bg-[#1a0c06] border border-amber-800/60 rounded-t-[32px] sm:rounded-[32px] p-5 sm:p-6 shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/40">
              <div className="flex items-center gap-2">
                <ListMusic className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold font-anek text-amber-100">
                  চলতি গানের সারি ({tracks.length} টি গান)
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="বন্ধ করুন"
                className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative my-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="গান বা শিল্পীর নাম দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-amber-900/40 text-stone-100 text-sm font-siliguri placeholder:text-stone-500 focus:outline-none focus:border-amber-500/80"
              />
            </div>

            {/* Track List */}
            <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 py-1">
              {filteredTracks.map((track, idx) => {
                const originalIndex = tracks.findIndex((t) => t.id === track.id);
                const isCurrent = originalIndex === currentTrackIndex;

                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      onSelectTrack(originalIndex);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-950/80 border border-amber-500/60 text-amber-200'
                        : 'bg-black/20 hover:bg-black/40 border border-transparent text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-lg bg-[#271207] flex items-center justify-center shrink-0 border border-amber-800/40">
                        {isCurrent && isPlaying ? (
                          <div className="flex items-end gap-0.5 h-3">
                            <span className="w-0.5 bg-amber-400 rounded-full eq-bar-1" />
                            <span className="w-0.5 bg-amber-300 rounded-full eq-bar-2" />
                            <span className="w-0.5 bg-amber-400 rounded-full eq-bar-3" />
                          </div>
                        ) : (
                          <Disc3 className="w-4 h-4 text-stone-400" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold font-anek truncate">
                          {track.title}
                        </span>
                        <span className="text-xs text-stone-400 font-siliguri truncate">
                          {track.artist}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isCurrent && (
                        <span className="text-[10px] font-mono text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/20">
                          বর্তমান
                        </span>
                      )}
                      <span className="text-xs text-stone-400 font-mono">
                        {Math.floor(track.duration / 60)}:
                        {(track.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
