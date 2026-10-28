export type MediaType = 'movie' | 'series' | 'anime' | 'channel';

export interface StreamItem {
  id: string;
  addonId: string;
  addonName: string;
  addonIcon?: string;
  title: string;
  quality: '4K HDR' | '1080p BluRay' | '1080p WEB-DL' | '720p HD' | 'Live 1080p';
  size?: string;
  seeds?: number;
  peers?: number;
  audio: string;
  sourceUrl: string;
  isDebrid?: boolean;
  format?: string;
  codec?: string;
}

export interface Episode {
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  synopsis: string;
  duration: string;
  thumbnail?: string;
  releaseDate?: string;
  streams: StreamItem[];
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface CastMember {
  name: string;
  character?: string;
  avatar?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  originalTitle?: string;
  type: MediaType;
  year: number;
  rating: number; // 0 - 10
  genres: string[];
  runtime?: string;
  ageRating?: string;
  synopsis: string;
  poster: string;
  backdrop: string;
  director?: string;
  cast: CastMember[];
  trailerUrl?: string;
  isFeatured?: boolean;
  seasons?: Season[];
  streams?: StreamItem[]; // for movies or channels
}

export interface AddonManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  icon: string;
  types: MediaType[];
  catalogs: string[];
  isInstalled: boolean;
  isOfficial: boolean;
  manifestUrl: string;
  configurable?: boolean;
}

export interface LibraryItem {
  mediaId: string;
  media: MediaItem;
  addedAt: string;
  status: 'watching' | 'watchlist' | 'completed' | 'favorite';
  progressSeconds?: number;
  durationSeconds?: number;
  season?: number;
  episode?: number;
  lastWatchedAt?: string;
}

export interface StremioSettings {
  streamingServerUrl: string;
  streamingServerConnected: boolean;
  cacheSize: string; // "2GB", "5GB", "10GB", "Unlimited"
  maxConnections: number;
  torrentProfile: 'ultra_fast' | 'balanced' | 'low_memory';
  subtitleLang: string;
  subtitleSize: 'small' | 'medium' | 'large' | 'extra_large';
  subtitleBg: boolean;
  subtitleOffsetMs: number;
  autoPlayNext: boolean;
  hardwareAcceleration: boolean;
  interfaceTheme: 'obsidian' | 'midnight_purple' | 'oled_black';
}
