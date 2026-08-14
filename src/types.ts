export interface Track {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  category: 'রাতের হাইওয়ে' | 'চায়ের ক্লাসিক' | '৯০ দশকের কষ্ট' | 'শুক্রবারের আড্ডা' | 'সব গান';
  duration: number; // in seconds
  thumbnail?: string;
  mood?: string;
  playlistSource?: 'PLZhPOxNEVxpl28_2u4FCF0UDc6bgcXrwj' | 'PLTSBjCUnFORdicw72E4Znio0K3zZg5f2Y';
}

export type CategoryFilter = 'সব গান' | 'রাতের হাইওয়ে' | 'চায়ের ক্লাসিক' | '৯০ দশকের কষ্ট' | 'শুক্রবারের আড্ডা';

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentTrackIndex: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  isBuffering: boolean;
  isLoading: boolean;
}

export interface PresenceState {
  onlineCount: number;
  realActive: number;
  isLive: boolean;
}
