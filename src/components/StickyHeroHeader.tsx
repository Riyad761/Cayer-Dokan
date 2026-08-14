import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Radio, Play, Pause, Music, Sparkles, Coffee } from 'lucide-react';
import { PresenceState } from '../types';
import { TEA_STALL_QUOTES } from '../data/songs';

interface StickyHeroHeaderProps {
  presence: PresenceState;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onScrollToPlaylist: () => void;
  onShowAllSongs: () => void;
}

export const StickyHeroHeader: React.FC<StickyHeroHeaderProps> = ({
  presence,
  isPlaying,
  onTogglePlay,
  onScrollToPlaylist,
  onShowAllSongs,
}) => {
  const { scrollY } = useScroll();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isSteamBoiling, setIsSteamBoiling] = useState(false);

  // Scroll interpolation values (0px to 280px)
  // Sticky bar background opacity
  const headerBgOpacity = useTransform(scrollY, [0, 160], [0, 0.95]);
  const headerBorderOpacity = useTransform(scrollY, [0, 160], [0, 0.4]);

  // Center Hero Wordmark transforms
  const heroWordmarkScale = useTransform(scrollY, [0, 240], [1, 0.55]);
  const heroWordmarkY = useTransform(scrollY, [0, 240], [0, -180]);
  const heroWordmarkOpacity = useTransform(scrollY, [140, 260], [1, 0]);

  // Tagline opacity
  const taglineOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const taglineY = useTransform(scrollY, [0, 120], [0, -20]);

  // Floating quote pill opacity
  const quoteBubbleOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const quoteBubbleY = useTransform(scrollY, [0, 100], [0, 20]);

  // Compact Header elements fade in as user scrolls down
  const compactTitleOpacity = useTransform(scrollY, [160, 240], [0, 1]);
  const compactTitleX = useTransform(scrollY, [160, 240], [-20, 0]);
  const compactButtonsOpacity = useTransform(scrollY, [180, 260], [0, 1]);
  const compactButtonsScale = useTransform(scrollY, [180, 260], [0.85, 1]);

  // Top Initial Bar buttons fade out into compact mode
  const initialTopBarPlayOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  // Cycle tea quote on click or timer
  const handleQuoteClick = () => {
    setIsSteamBoiling(true);
    setTimeout(() => setIsSteamBoiling(false), 900);
    setQuoteIndex((prev) => (prev + 1) % TEA_STALL_QUOTES.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % TEA_STALL_QUOTES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* PERSISTENT STICKY TOP BAR CONTAINER */}
      <motion.header
        id="sticky-top-header"
        style={{
          backgroundColor: useTransform(headerBgOpacity, (v) => `rgba(20, 9, 4, ${v})`),
          borderColor: useTransform(headerBorderOpacity, (v) => `rgba(180, 83, 9, ${v})`),
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-colors backdrop-blur-md border-b px-4 sm:px-6 py-3.5 flex items-center justify-between"
      >
        {/* Left Side: Live Online Presence Chip */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            id="online-counter-chip"
            className="flex items-center gap-2 bg-[#2a1308]/80 hover:bg-[#381a0b] border border-amber-500/30 text-amber-200/95 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide shadow-sm shadow-black/40 transition-all duration-300 select-none cursor-default"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">
              {presence.onlineCount.toLocaleString('bn-BD')}
            </span>
            <span className="text-amber-100/80">আড্ডায়</span>
            {presence.isLive && (
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-amber-400/70 border-l border-amber-700/50 pl-1.5 ml-0.5 tracking-wider">
                LIVE
              </span>
            )}
          </div>

          {/* Morphing Compact Logo & Wordmark (Revealed on Scroll) */}
          <motion.div
            id="compact-header-brand"
            style={{
              opacity: compactTitleOpacity,
              x: compactTitleX,
            }}
            className="flex items-center gap-2 pl-1 pointer-events-auto"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center text-amber-100 shadow-sm border border-amber-400/30">
              <Radio className="w-4 h-4 text-amber-200" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg font-anek text-amber-100 tracking-tight leading-none drop-shadow">
                চায়ের দোকান
              </span>
              <span className="text-[10px] text-amber-400/80 font-mono leading-none mt-0.5 hidden xs:inline">
                buswala.online
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Initial Play Button OR Compact Morph Buttons */}
        <div className="flex items-center gap-2">
          {/* Morphing Navigation Pills (Fade in on scroll) */}
          <motion.div
            id="compact-nav-pills"
            style={{
              opacity: compactButtonsOpacity,
              scale: compactButtonsScale,
            }}
            className="flex items-center gap-1.5 sm:gap-2"
          >
            <button
              id="header-nav-playlist-btn"
              onClick={onScrollToPlaylist}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 border border-amber-600/40 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Music className="w-3.5 h-3.5 text-amber-400" />
              <span>প্লেলিস্ট</span>
            </button>

            <button
              id="header-nav-all-songs-btn"
              onClick={onShowAllSongs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-600/30 hover:bg-amber-600/50 text-amber-100 border border-amber-500/40 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">সব গান</span>
              <span className="sm:hidden">গান</span>
            </button>
          </motion.div>

          {/* Initial Play/Pause Icon Button (Top view state) */}
          <motion.div
            id="initial-top-play-wrapper"
            style={{ opacity: initialTopBarPlayOpacity }}
            className="pointer-events-auto"
          >
            <button
              id="top-bar-play-toggle-btn"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'বিরতি নিন' : 'গান শুনুন'}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-950/60 border border-amber-300/40 transition-transform duration-200 active:scale-90 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-stone-950" />
              ) : (
                <Play className="w-4 h-4 fill-stone-950 ml-0.5" />
              )}
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* FULL-BLEED TWO-STATE HERO STAGE */}
      <section
        id="hero-stall-stage"
        className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-between items-center px-4 pt-24 pb-14 overflow-hidden"
      >
        {/* Full-Bleed Responsive Background Artwork with Warm Amber/Rust Wash */}
        <div className="absolute inset-0 z-0 hero-bg-responsive">
          {/* Dual Multi-Layer Warm Vintage Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#110703] via-[#1a0c06]/55 to-[#1a0c06]/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/60 via-transparent to-[#110703]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-[#110703]/90" />
        </div>

        {/* Ambient Floating Radio Wave Lines */}
        <div className="absolute top-1/4 left-0 right-0 flex justify-center pointer-events-none opacity-25 z-0">
          <div className="w-[600px] h-[300px] rounded-full border border-amber-400/20 blur-[1px] animate-pulse" />
        </div>

        {/* TOP SPACER */}
        <div className="h-6 sm:h-12" />

        {/* CENTER HERO WORDMARK & TAGLINE (Morphs on Scroll) */}
        <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center justify-center my-auto px-4">
          <motion.div
            id="center-hero-wordmark-container"
            style={{
              scale: heroWordmarkScale,
              y: heroWordmarkY,
              opacity: heroWordmarkOpacity,
            }}
            className="flex flex-col items-center"
          >
            {/* Ambient Radio Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-600/30 text-amber-300 text-xs font-mono uppercase tracking-widest mb-3 backdrop-blur-md shadow-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>24/7 HIGHWAY TONG RADIO</span>
            </div>

            {/* Giant Bengali Wordmark */}
            <h1
              id="hero-bengali-wordmark"
              className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-extrabold font-anek text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-500 tracking-tight leading-none drop-shadow-[0_8px_30px_rgba(0,0,0,0.85)] filter"
            >
              চায়ের দোকান
            </h1>

            {/* Sub-Tagline */}
            <motion.p
              id="hero-bengali-tagline"
              style={{
                opacity: taglineOpacity,
                y: taglineY,
              }}
              className="mt-3 sm:mt-4 text-lg sm:text-2xl font-siliguri text-amber-200/90 font-medium tracking-wide drop-shadow-md max-w-md"
            >
              যেই আড্ডা কখনো থামে না
            </motion.p>
          </motion.div>
        </div>

        {/* FLOATING CAPTION BUBBLE PILL OVER ARTWORK (Bottom of Hero) */}
        <motion.div
          id="hero-floating-caption-pill"
          style={{
            opacity: quoteBubbleOpacity,
            y: quoteBubbleY,
          }}
          className="relative z-10 w-full max-w-md mx-auto flex justify-center px-4"
        >
          <button
            id="tea-quote-bubble-interactive"
            onClick={handleQuoteClick}
            className="group flex items-center gap-2.5 bg-stone-900/85 hover:bg-stone-900 backdrop-blur-xl border border-amber-500/40 text-amber-100 px-4 sm:px-5 py-2.5 rounded-full shadow-2xl shadow-black/80 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-left"
          >
            <div className="relative w-7 h-7 rounded-full bg-amber-600/30 flex items-center justify-center text-amber-300 shrink-0 group-hover:bg-amber-600/50 transition-colors">
              <Coffee className={`w-4 h-4 ${isSteamBoiling ? 'animate-bounce text-amber-200' : ''}`} />
              <span className="absolute -top-1 right-0 text-[10px] animate-steam opacity-75">♨</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-semibold font-siliguri text-amber-100 group-hover:text-amber-200 transition-colors">
                {TEA_STALL_QUOTES[quoteIndex]}
              </span>
              <span className="text-[10px] text-amber-400/70 font-mono">
                ট্যাপ করে আরেক লাইন নিন • চা প্রস্তুত
              </span>
            </div>
          </button>
        </motion.div>
      </section>
    </>
  );
};
