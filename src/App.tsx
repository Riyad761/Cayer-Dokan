import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StickyHeroHeader } from './components/StickyHeroHeader';
import { TeaStallStory } from './components/TeaStallStory';
import { PlaylistRotations } from './components/PlaylistRotations';
import { SongList } from './components/SongList';
import { ProfileCredit } from './components/ProfileCredit';
import { MusicPlayerCard } from './components/MusicPlayerCard';
import { QueueModal } from './components/QueueModal';
import { TEA_STALL_TRACKS } from './data/songs';
import { Track, CategoryFilter, PlayerState } from './types';
import { youtubeAudioPlayer } from './lib/youtubePlayer';
import { usePresence } from './hooks/usePresence';

export default function App() {
  const presence = usePresence();
  const playlistSectionRef = useRef<HTMLDivElement>(null);

  const [tracks] = useState<Track[]>(TEA_STALL_TRACKS);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('সব গান');
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  // Player State
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    currentTrackIndex: 0,
    volume: 85,
    isMuted: false,
    isShuffle: false,
    isRepeat: false,
    isBuffering: false,
    isLoading: false,
  });

  const currentTrack = tracks[playerState.currentTrackIndex] || tracks[0];

  const playerStateRef = useRef(playerState);
  playerStateRef.current = playerState;

  const lastSkipTimestampRef = useRef<number>(0);
  const consecutiveErrorCountRef = useRef<number>(0);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilter, number> = {
      'সব গান': tracks.length,
      'রাতের হাইওয়ে': 0,
      'চায়ের ক্লাসিক': 0,
      '৯০ দশকের কষ্ট': 0,
      'শুক্রবারের আড্ডা': 0,
    };
    tracks.forEach((t) => {
      if (counts[t.category] !== undefined) {
        counts[t.category] += 1;
      }
    });
    return counts;
  }, [tracks]);

  // Filtered tracks for the list
  const filteredTracks = useMemo(() => {
    if (selectedCategory === 'সব গান') return tracks;
    return tracks.filter((t) => t.category === selectedCategory);
  }, [tracks, selectedCategory]);

  // Safe Track Advance Function
  const advanceToTrack = (index: number, autoPlay: boolean = true) => {
    const now = Date.now();
    // Throttle track advances to at least 1.5 seconds apart to prevent rapid loop
    if (now - lastSkipTimestampRef.current < 1500) {
      console.warn('[YouTube Player] Skipping advanceToTrack to prevent rapid loop');
      return;
    }
    lastSkipTimestampRef.current = now;

    const safeIndex = Math.max(0, Math.min(tracks.length - 1, index));
    const targetTrack = tracks[safeIndex];

    console.log(`[YouTube Player] Switching to track #${safeIndex + 1}: ${targetTrack.title} (${targetTrack.youtubeId})`);

    setPlayerState((prev) => ({
      ...prev,
      currentTrackIndex: safeIndex,
      isPlaying: autoPlay,
      currentTime: 0,
      isBuffering: autoPlay,
    }));

    youtubeAudioPlayer.loadVideo(targetTrack.youtubeId, autoPlay);
    if (autoPlay) {
      youtubeAudioPlayer.play();
    }
  };

  const handleNextTrack = (isAutoEnded: boolean = false) => {
    const current = playerStateRef.current;
    if (current.isRepeat && isAutoEnded) {
      console.log('[YouTube Player] Repeat mode: restarting track');
      youtubeAudioPlayer.seekTo(0);
      youtubeAudioPlayer.play();
      return;
    }

    let nextIndex = 0;
    if (current.isShuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (current.currentTrackIndex + 1) % tracks.length;
    }

    advanceToTrack(nextIndex, current.isPlaying || isAutoEnded);
  };

  const handlePrevTrack = () => {
    const current = playerStateRef.current;
    if (current.currentTime > 3) {
      youtubeAudioPlayer.seekTo(0);
      return;
    }

    let prevIndex = 0;
    if (current.isShuffle) {
      prevIndex = Math.floor(Math.random() * tracks.length);
    } else {
      prevIndex = (current.currentTrackIndex - 1 + tracks.length) % tracks.length;
    }

    advanceToTrack(prevIndex, current.isPlaying);
  };

  // YouTube Player Callbacks & Initialization
  useEffect(() => {
    youtubeAudioPlayer.setCallbacks(
      (stateNumber) => {
        // YT.PlayerState: -1 (UNSTARTED), 0 (ENDED), 1 (PLAYING), 2 (PAUSED), 3 (BUFFERING), 5 (CUED)
        const stateLabels: Record<number, string> = {
          [-1]: 'UNSTARTED',
          0: 'ENDED',
          1: 'PLAYING',
          2: 'PAUSED',
          3: 'BUFFERING',
          5: 'CUED',
        };
        console.log(`[App.tsx onStateChange] State: ${stateNumber} (${stateLabels[stateNumber] || 'UNKNOWN'})`);

        if (stateNumber === 1) {
          // Track is successfully playing
          consecutiveErrorCountRef.current = 0;
          setPlayerState((prev) => ({ ...prev, isPlaying: true, isBuffering: false }));
        } else if (stateNumber === 2) {
          // Track is paused
          setPlayerState((prev) => ({ ...prev, isPlaying: false, isBuffering: false }));
        } else if (stateNumber === 3) {
          // Track is buffering
          setPlayerState((prev) => ({ ...prev, isBuffering: true }));
        } else if (stateNumber === 5) {
          // Track is cued/ready
          setPlayerState((prev) => ({ ...prev, isBuffering: false }));
        } else if (stateNumber === 0) {
          // Track ENDED: verify that track actually played before auto-advancing
          console.log('[App.tsx onStateChange] Track reached ENDED state (0). Advancing to next track.');
          handleNextTrack(true);
        } else if (stateNumber === -1) {
          // UNSTARTED: Video is loading or waiting for user gesture
          console.log('[App.tsx onStateChange] UNSTARTED (-1) - waiting for user or ready');
        }
      },
      (currentTime, duration) => {
        setPlayerState((prev) => ({
          ...prev,
          currentTime,
          duration: duration > 0 ? duration : prev.duration,
        }));
      },
      (errorCode) => {
        consecutiveErrorCountRef.current += 1;
        console.warn(
          `[App.tsx onError] YouTube Player error event code: ${errorCode}. Consecutive errors: ${consecutiveErrorCountRef.current}`
        );

        // If autoplay blocked by browser or too many consecutive errors, STOP auto-skipping loop
        if (consecutiveErrorCountRef.current > 2) {
          console.warn('[App.tsx onError] Pausing playback to prevent auto-skip loop.');
          setPlayerState((prev) => ({ ...prev, isPlaying: false, isBuffering: false }));
          consecutiveErrorCountRef.current = 0;
          return;
        }

        // Only attempt single graceful skip on actual video loading errors
        const timer = setTimeout(() => {
          if (playerStateRef.current.isPlaying) {
            handleNextTrack(false);
          }
        }, 1200);
        return () => clearTimeout(timer);
      }
    );
  }, [tracks]);

  // Play / Pause Handlers
  const handlePlayPause = () => {
    if (playerState.isPlaying) {
      youtubeAudioPlayer.pause();
      setPlayerState((prev) => ({ ...prev, isPlaying: false, isBuffering: false }));
    } else {
      console.log('[App] Play triggered by user gesture');
      consecutiveErrorCountRef.current = 0;
      youtubeAudioPlayer.loadVideo(currentTrack.youtubeId, true);
      youtubeAudioPlayer.play();
      setPlayerState((prev) => ({ ...prev, isPlaying: true, isBuffering: true }));
    }
  };

  const handleSelectTrack = (index: number) => {
    if (index >= 0 && index < tracks.length) {
      consecutiveErrorCountRef.current = 0;
      advanceToTrack(index, true);
    }
  };

  const handleSeek = (seconds: number) => {
    youtubeAudioPlayer.seekTo(seconds);
    setPlayerState((prev) => ({ ...prev, currentTime: seconds }));
  };

  const handleToggleShuffle = () => {
    setPlayerState((prev) => ({ ...prev, isShuffle: !prev.isShuffle }));
  };

  const handleToggleRepeat = () => {
    setPlayerState((prev) => ({ ...prev, isRepeat: !prev.isRepeat }));
  };

  const handleToggleMute = () => {
    if (playerState.isMuted) {
      youtubeAudioPlayer.unMute();
      setPlayerState((prev) => ({ ...prev, isMuted: false }));
    } else {
      youtubeAudioPlayer.mute();
      setPlayerState((prev) => ({ ...prev, isMuted: true }));
    }
  };

  const handleVolumeChange = (vol: number) => {
    youtubeAudioPlayer.setVolume(vol);
    setPlayerState((prev) => ({ ...prev, volume: vol, isMuted: vol === 0 }));
  };

  const handleScrollToPlaylist = () => {
    playlistSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleShowAllSongs = () => {
    setSelectedCategory('সব গান');
    playlistSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#120703] text-[#f7efe6] flex flex-col justify-between selection:bg-amber-600 selection:text-white pb-36">
      {/* 1. STICKY TWO-STATE MORPHING HERO & TOP BAR */}
      <StickyHeroHeader
        presence={presence}
        isPlaying={playerState.isPlaying}
        onTogglePlay={handlePlayPause}
        onScrollToPlaylist={handleScrollToPlaylist}
        onShowAllSongs={handleShowAllSongs}
      />

      {/* 2. TEA STALL STORY & ATMOSPHERIC NARRATIVE */}
      <div className="w-full relative z-20 -mt-6">
        <TeaStallStory />
      </div>

      {/* 3. PLAYLIST ROTATIONS & INTERACTIVE SONG LIST */}
      <section
        ref={playlistSectionRef}
        id="playlist-section"
        className="relative py-8 px-4 sm:px-6 max-w-4xl mx-auto w-full z-20 space-y-6"
      >
        {/* Rotations Filter Row */}
        <PlaylistRotations
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />

        {/* Song List Component */}
        <SongList
          tracks={filteredTracks}
          currentTrackIndex={playerState.currentTrackIndex}
          isPlaying={playerState.isPlaying}
          onSelectTrack={(indexInFiltered) => {
            const chosenTrack = filteredTracks[indexInFiltered];
            const originalIndex = tracks.findIndex((t) => t.id === chosenTrack.id);
            handleSelectTrack(originalIndex);
          }}
        />
      </section>

      {/* 4. CREATOR PROFILE & COPYRIGHT / TAKEDOWN BLOCK */}
      <div className="w-full relative z-20">
        <ProfileCredit />
      </div>

      {/* 5. STICKY HIGHWAY RADIO MUSIC PLAYER CARD */}
      <MusicPlayerCard
        track={currentTrack}
        playerState={playerState}
        onPlayPause={handlePlayPause}
        onPrevTrack={handlePrevTrack}
        onNextTrack={handleNextTrack}
        onSeek={handleSeek}
        onToggleShuffle={handleToggleShuffle}
        onToggleRepeat={handleToggleRepeat}
        onToggleMute={handleToggleMute}
        onVolumeChange={handleVolumeChange}
        onOpenQueue={() => setIsQueueOpen(true)}
      />

      {/* 6. QUEUE DRAWER MODAL */}
      <QueueModal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        tracks={tracks}
        currentTrackIndex={playerState.currentTrackIndex}
        isPlaying={playerState.isPlaying}
        onSelectTrack={(idx) => {
          handleSelectTrack(idx);
          setIsQueueOpen(false);
        }}
      />
    </div>
  );
}
