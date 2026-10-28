import { Search, X, Film, Tv, Sparkles, Radio, Smartphone } from 'lucide-react';
import { useStremio } from '../context/StremioContext';
import { MediaType } from '../types/stremio';

export const Header: React.FC = () => {
  const {
    activeTab,
    selectedType,
    setSelectedType,
    searchQuery,
    setSearchQuery,
    openAPKModal,
  } = useStremio();

  const typeTabs: { id: MediaType | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Catalog', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'movie', label: 'Movies', icon: <Film className="w-3.5 h-3.5" /> },
    { id: 'series', label: 'TV Series', icon: <Tv className="w-3.5 h-3.5" /> },
    { id: 'anime', label: 'Anime', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'channel', label: 'Live TV', icon: <Radio className="w-3.5 h-3.5" /> },
  ];

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'discover':
        return 'Cinemeta Catalog';
      case 'library':
        return 'Personal Media Library';
      case 'addons':
        return 'Add-ons Community Engine';
      case 'settings':
        return 'Player & Streaming Preferences';
      default:
        return 'DieggaFlix';
    }
  };

  return (
    <header className="h-16 px-6 bg-[#0c0d14]/90 backdrop-blur-md border-b border-[#1c1d2d] flex items-center justify-between gap-6 sticky top-0 z-20">
      {/* Zone 1: Section Title */}
      <div className="flex items-center gap-3 shrink-0">
        <h1 className="text-base font-bold text-white tracking-tight whitespace-nowrap">
          {getSectionTitle()}
        </h1>
      </div>

      {/* Zone 2: Type Filters (Only visible on Discover and Library) */}
      {(activeTab === 'discover' || activeTab === 'library') && (
        <div className="hidden lg:flex items-center gap-1.5 p-1 bg-[#131422] rounded-xl border border-[#1f2137]">
          {typeTabs.map((tab) => {
            const isSelected = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1c1d30]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Zone 3: Search Bar & APK Install CTA */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative w-40 sm:w-56 md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, actors, genres..."
            className="w-full bg-[#131422] border border-[#1f2137] rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={openAPKModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-violet-950/60 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          title="Instalar APK en Android"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Instalar APK</span>
        </button>
      </div>
    </header>
  );
};
