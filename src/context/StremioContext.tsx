import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  MediaItem,
  MediaType,
  StreamItem,
  AddonManifest,
  LibraryItem,
  StremioSettings,
} from '../types/stremio';
import { MEDIA_CATALOG, INITIAL_ADDONS, DEFAULT_SETTINGS } from '../data/mockData';

export type NavTab = 'discover' | 'library' | 'addons' | 'settings';

interface ActivePlayerState {
  media: MediaItem;
  stream: StreamItem;
  seasonNumber?: number;
  episodeNumber?: number;
  startTime?: number;
}

interface StremioContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedType: MediaType | 'all';
  setSelectedType: (type: MediaType | 'all') => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedSort: 'popular' | 'rating' | 'year' | 'title';
  setSelectedSort: (sort: 'popular' | 'rating' | 'year' | 'title') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  selectedMedia: MediaItem | null;
  openMedia: (media: MediaItem) => void;
  closeMedia: () => void;
  
  activePlayer: ActivePlayerState | null;
  playStream: (
    media: MediaItem,
    stream: StreamItem,
    seasonNumber?: number,
    episodeNumber?: number,
    startTime?: number
  ) => void;
  closePlayer: () => void;
  
  library: LibraryItem[];
  addToLibrary: (media: MediaItem, status?: LibraryItem['status']) => void;
  removeFromLibrary: (mediaId: string) => void;
  updateProgress: (
    mediaId: string,
    progressSeconds: number,
    durationSeconds: number,
    season?: number,
    episode?: number
  ) => void;
  isItemInLibrary: (mediaId: string) => boolean;
  getLibraryItem: (mediaId: string) => LibraryItem | undefined;

  addons: AddonManifest[];
  toggleAddon: (addonId: string) => void;
  installCustomAddon: (manifest: Partial<AddonManifest>) => boolean;
  uninstallAddon: (addonId: string) => void;

  settings: StremioSettings;
  updateSettings: (newSettings: Partial<StremioSettings>) => void;

  isAPKModalOpen: boolean;
  openAPKModal: () => void;
  closeAPKModal: () => void;

  filteredCatalog: MediaItem[];
  genresList: string[];
}

const StremioContext = createContext<StremioContextType | null>(null);

export const StremioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('discover');
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<'popular' | 'rating' | 'year' | 'title'>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [activePlayer, setActivePlayer] = useState<ActivePlayerState | null>(null);
  const [isAPKModalOpen, setIsAPKModalOpen] = useState(false);

  const openAPKModal = () => setIsAPKModalOpen(true);
  const closeAPKModal = () => setIsAPKModalOpen(false);

  // Persistence in localStorage
  const [library, setLibrary] = useState<LibraryItem[]>(() => {
    try {
      const saved = localStorage.getItem('stremio_library');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default initial Continue Watching item for rich demo feel
    return [
      {
        mediaId: MEDIA_CATALOG[0].id,
        media: MEDIA_CATALOG[0],
        addedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        status: 'watching',
        progressSeconds: 1420,
        durationSeconds: 8280,
        lastWatchedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        mediaId: MEDIA_CATALOG[1].id,
        media: MEDIA_CATALOG[1],
        addedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'watching',
        season: 1,
        episode: 1,
        progressSeconds: 1850,
        durationSeconds: 3480,
        lastWatchedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  });

  const [addons, setAddons] = useState<AddonManifest[]>(() => {
    try {
      const saved = localStorage.getItem('stremio_addons');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ADDONS;
  });

  const [settings, setSettings] = useState<StremioSettings>(() => {
    try {
      const saved = localStorage.getItem('stremio_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('stremio_library', JSON.stringify(library));
    } catch (e) {
      console.error(e);
    }
  }, [library]);

  useEffect(() => {
    try {
      localStorage.setItem('stremio_addons', JSON.stringify(addons));
    } catch (e) {
      console.error(e);
    }
  }, [addons]);

  useEffect(() => {
    try {
      localStorage.setItem('stremio_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  const openMedia = (media: MediaItem) => {
    setSelectedMedia(media);
  };

  const closeMedia = () => {
    setSelectedMedia(null);
  };

  const playStream = (
    media: MediaItem,
    stream: StreamItem,
    seasonNumber?: number,
    episodeNumber?: number,
    startTime?: number
  ) => {
    setActivePlayer({
      media,
      stream,
      seasonNumber,
      episodeNumber,
      startTime: startTime || 0,
    });
  };

  const closePlayer = () => {
    setActivePlayer(null);
  };

  const addToLibrary = (media: MediaItem, status: LibraryItem['status'] = 'watchlist') => {
    setLibrary((prev) => {
      const exists = prev.find((item) => item.mediaId === media.id);
      if (exists) {
        return prev.map((item) =>
          item.mediaId === media.id ? { ...item, status, addedAt: new Date().toISOString() } : item
        );
      }
      return [
        {
          mediaId: media.id,
          media,
          addedAt: new Date().toISOString(),
          status,
        },
        ...prev,
      ];
    });
  };

  const removeFromLibrary = (mediaId: string) => {
    setLibrary((prev) => prev.filter((item) => item.mediaId !== mediaId));
  };

  const updateProgress = (
    mediaId: string,
    progressSeconds: number,
    durationSeconds: number,
    season?: number,
    episode?: number
  ) => {
    setLibrary((prev) => {
      const existing = prev.find((item) => item.mediaId === mediaId);
      const mediaItem = MEDIA_CATALOG.find((m) => m.id === mediaId) || existing?.media;
      if (!mediaItem) return prev;

      const isFinished = progressSeconds > 0 && durationSeconds > 0 && progressSeconds / durationSeconds > 0.92;
      const status: LibraryItem['status'] = isFinished ? 'completed' : 'watching';

      if (existing) {
        return prev.map((item) =>
          item.mediaId === mediaId
            ? {
                ...item,
                progressSeconds,
                durationSeconds,
                season: season ?? item.season,
                episode: episode ?? item.episode,
                status,
                lastWatchedAt: new Date().toISOString(),
              }
            : item
        );
      } else {
        return [
          {
            mediaId,
            media: mediaItem,
            addedAt: new Date().toISOString(),
            status,
            progressSeconds,
            durationSeconds,
            season,
            episode,
            lastWatchedAt: new Date().toISOString(),
          },
          ...prev,
        ];
      }
    });
  };

  const isItemInLibrary = (mediaId: string) => {
    return library.some((item) => item.mediaId === mediaId);
  };

  const getLibraryItem = (mediaId: string) => {
    return library.find((item) => item.mediaId === mediaId);
  };

  const toggleAddon = (addonId: string) => {
    setAddons((prev) =>
      prev.map((addon) =>
        addon.id === addonId ? { ...addon, isInstalled: !addon.isInstalled } : addon
      )
    );
  };

  const installCustomAddon = (manifest: Partial<AddonManifest>): boolean => {
    if (!manifest.id || !manifest.name) return false;
    const newAddon: AddonManifest = {
      id: manifest.id,
      name: manifest.name,
      version: manifest.version || '1.0.0',
      description: manifest.description || 'Custom Stremio Community Add-on',
      author: manifest.author || 'Custom User',
      icon: manifest.icon || '🧩',
      types: manifest.types || ['movie', 'series'],
      catalogs: manifest.catalogs || ['Community Custom'],
      isInstalled: true,
      isOfficial: false,
      manifestUrl: manifest.manifestUrl || `https://${manifest.id}.strem.fun/manifest.json`,
      configurable: true,
    };

    setAddons((prev) => {
      const idx = prev.findIndex((a) => a.id === newAddon.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...newAddon, isInstalled: true };
        return copy;
      }
      return [...prev, newAddon];
    });
    return true;
  };

  const uninstallAddon = (addonId: string) => {
    setAddons((prev) => prev.filter((a) => a.id !== addonId));
  };

  const updateSettings = (newSettings: Partial<StremioSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const genresList = useMemo(() => {
    const set = new Set<string>();
    MEDIA_CATALOG.forEach((item) => item.genres.forEach((g) => set.add(g)));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const filteredCatalog = useMemo(() => {
    let result = [...MEDIA_CATALOG];

    if (selectedType !== 'all') {
      result = result.filter((item) => item.type === selectedType);
    }

    if (selectedGenre !== 'All') {
      result = result.filter((item) => item.genres.includes(selectedGenre));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.originalTitle?.toLowerCase().includes(query) ||
          item.genres.some((g) => g.toLowerCase().includes(query)) ||
          item.cast.some((c) => c.name.toLowerCase().includes(query)) ||
          item.director?.toLowerCase().includes(query)
      );
    }

    if (selectedSort === 'popular') {
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
    } else if (selectedSort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === 'year') {
      result.sort((a, b) => b.year - a.year);
    } else if (selectedSort === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [selectedType, selectedGenre, selectedSort, searchQuery]);

  return (
    <StremioContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedType,
        setSelectedType,
        selectedGenre,
        setSelectedGenre,
        selectedSort,
        setSelectedSort,
        searchQuery,
        setSearchQuery,
        selectedMedia,
        openMedia,
        closeMedia,
        activePlayer,
        playStream,
        closePlayer,
        library,
        addToLibrary,
        removeFromLibrary,
        updateProgress,
        isItemInLibrary,
        getLibraryItem,
        addons,
        toggleAddon,
        installCustomAddon,
        uninstallAddon,
        settings,
        updateSettings,
        isAPKModalOpen,
        openAPKModal,
        closeAPKModal,
        filteredCatalog,
        genresList,
      }}
    >
      {children}
    </StremioContext.Provider>
  );
};

export const useStremio = () => {
  const context = useContext(StremioContext);
  if (!context) {
    throw new Error('useStremio must be used within a StremioProvider');
  }
  return context;
};
