declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export type PlayerStateChangeCallback = (state: number) => void;
export type TimeUpdateCallback = (currentTime: number, duration: number) => void;

class YouTubeAudioPlayer {
  private player: any = null;
  private isReady: boolean = false;
  private currentVideoId: string | null = null;
  private pendingVideoId: string | null = null;
  private timeUpdateInterval: any = null;
  private onStateChangeCallback: PlayerStateChangeCallback | null = null;
  private onTimeUpdateCallback: TimeUpdateCallback | null = null;
  private onErrorCallback: ((error: any) => void) | null = null;
  private targetVolume: number = 80;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      this.createPlayer();
    } else {
      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      window.onYouTubeIframeAPIReady = () => {
        this.createPlayer();
      };
    }
  }

  private createPlayer() {
    if (typeof window === 'undefined') return;

    // Ensure container exists with valid dimensions for YouTube Iframe requirements
    let container = document.getElementById('yt-audio-hidden-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'yt-audio-hidden-container';
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '200px';
      container.style.height = '200px';
      container.style.opacity = '0.01';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '-9999';
      document.body.appendChild(container);
    }

    try {
      this.player = new window.YT.Player('yt-audio-hidden-container', {
        height: '200',
        width: '200',
        videoId: this.pendingVideoId || 'b_i_y9F914U',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            console.log('[YouTube IFrame API] Player Ready');
            this.isReady = true;
            if (this.player && this.player.setVolume) {
              this.player.setVolume(this.targetVolume);
            }
            if (this.pendingVideoId) {
              this.loadVideo(this.pendingVideoId, false);
              this.pendingVideoId = null;
            }
            this.startTimeTracking();
          },
          onStateChange: (event: any) => {
            const stateMap: Record<number, string> = {
              [-1]: 'UNSTARTED (-1)',
              0: 'ENDED (0)',
              1: 'PLAYING (1)',
              2: 'PAUSED (2)',
              3: 'BUFFERING (3)',
              5: 'CUED (5)',
            };
            console.log(
              `[YouTube onStateChange] event.data = ${event.data} (${stateMap[event.data] || 'UNKNOWN'}) | VideoId: ${this.currentVideoId}`
            );
            if (this.onStateChangeCallback) {
              this.onStateChangeCallback(event.data);
            }
          },
          onError: (event: any) => {
            const errorMap: Record<number, string> = {
              2: 'Invalid video parameter (2)',
              5: 'HTML5 player playback error (5)',
              100: 'Video not found or removed (100)',
              101: 'Embedding disabled by content owner (101)',
              150: 'Embedding disabled by content owner (150)',
            };
            console.warn(
              `[YouTube onError] event.data = ${event.data} (${errorMap[event.data] || 'UNKNOWN ERROR'}) | VideoId: ${this.currentVideoId}`
            );
            if (this.onErrorCallback) {
              this.onErrorCallback(event.data);
            }
          },
        },
      });
    } catch (e) {
      console.error('Failed to create YouTube player:', e);
    }
  }

  public setCallbacks(
    onStateChange: PlayerStateChangeCallback,
    onTimeUpdate: TimeUpdateCallback,
    onError?: (error: any) => void
  ) {
    this.onStateChangeCallback = onStateChange;
    this.onTimeUpdateCallback = onTimeUpdate;
    if (onError) this.onErrorCallback = onError;
  }

  private startTimeTracking() {
    if (this.timeUpdateInterval) clearInterval(this.timeUpdateInterval);
    this.timeUpdateInterval = setInterval(() => {
      if (this.player && this.isReady && typeof this.player.getCurrentTime === 'function') {
        try {
          const current = this.player.getCurrentTime() || 0;
          const duration = this.player.getDuration() || 0;
          if (this.onTimeUpdateCallback) {
            this.onTimeUpdateCallback(current, duration);
          }
        } catch {
          // ignore transient iframe communication errors
        }
      }
    }, 500);
  }

  public loadVideo(videoId: string, autoplay: boolean = true) {
    this.currentVideoId = videoId;
    if (!this.isReady || !this.player) {
      this.pendingVideoId = videoId;
      return;
    }

    try {
      if (autoplay) {
        this.player.loadVideoById(videoId);
      } else {
        this.player.cueVideoById(videoId);
      }
    } catch (e) {
      console.warn('Error loading video in YT Player:', e);
    }
  }

  public play() {
    if (this.player && this.isReady && typeof this.player.playVideo === 'function') {
      try {
        this.player.playVideo();
      } catch (e) {
        console.warn('Play error:', e);
      }
    }
  }

  public pause() {
    if (this.player && this.isReady && typeof this.player.pauseVideo === 'function') {
      try {
        this.player.pauseVideo();
      } catch (e) {
        console.warn('Pause error:', e);
      }
    }
  }

  public seekTo(seconds: number) {
    if (this.player && this.isReady && typeof this.player.seekTo === 'function') {
      try {
        this.player.seekTo(seconds, true);
      } catch (e) {
        console.warn('Seek error:', e);
      }
    }
  }

  public setVolume(volume: number) {
    this.targetVolume = Math.max(0, Math.min(100, volume));
    if (this.player && this.isReady && typeof this.player.setVolume === 'function') {
      try {
        this.player.setVolume(this.targetVolume);
      } catch (e) {
        console.warn('Set volume error:', e);
      }
    }
  }

  public mute() {
    if (this.player && this.isReady && typeof this.player.mute === 'function') {
      try {
        this.player.mute();
      } catch (e) {
        console.warn('Mute error:', e);
      }
    }
  }

  public unMute() {
    if (this.player && this.isReady && typeof this.player.unMute === 'function') {
      try {
        this.player.unMute();
      } catch (e) {
        console.warn('UnMute error:', e);
      }
    }
  }

  public destroy() {
    if (this.timeUpdateInterval) clearInterval(this.timeUpdateInterval);
    if (this.player && typeof this.player.destroy === 'function') {
      try {
        this.player.destroy();
      } catch {
        // ignore
      }
    }
  }
}

export const youtubeAudioPlayer = new YouTubeAudioPlayer();
