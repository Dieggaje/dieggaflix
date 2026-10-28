import React from 'react';
import { Play, Bookmark, Check, Star, Filter, ArrowUpDown } from 'lucide-react';
import { useStremio } from '../context/StremioContext';
import { MediaCard } from './MediaCard';

export const DiscoverView: React.FC = () => {
  const {
    filteredCatalog,
    selectedGenre,
    setSelectedGenre,
    selectedSort,
    setSelectedSort,
    genresList,
    openMedia,
    playStream,
    addToLibrary,
    removeFromLibrary,
    isItemInLibrary,
  } = useStremio();

  // Featured Item (Void Protocol)
  const featured = filteredCatalog.find((m) => m.isFeatured) || filteredCatalog[0];
  const inLibrary = featured ? isItemInLibrary(featured.id) : false;

  const handleFeaturedPlay = () => {
    if (!featured) return;
    if (featured.streams?.[0]) {
      playStream(featured, featured.streams[0]);
    } else {
      openMedia(featured);
    }
  };

  const handleFeaturedLibrary = () => {
    if (!featured) return;
    if (inLibrary) {
      removeFromLibrary(featured.id);
    } else {
      addToLibrary(featured, 'watchlist');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Featured Billboard */}
      {featured && (
        <div className="relative rounded-2xl overflow-hidden min-h-[380px] md:min-h-[460px] flex items-end p-6 md:p-10 border border-[#212338] shadow-2xl bg-[#0c0d15]">
          {/* Backdrop Image */}
          <img
            src={featured.backdrop}
            alt={featured.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 hover:scale-102"
          />

          {/* Scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b12] via-[#0a0b12]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b12] via-[#0a0b12]/70 to-transparent" />

          {/* Billboard Content */}
          <div className="relative z-10 max-w-2xl space-y-3.5">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="font-bold text-violet-400 uppercase tracking-widest text-[11px]">
                FEATURED SPOTLIGHT
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{featured.year}</span>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1 text-amber-300 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span className="tabular-nums">{featured.rating.toFixed(1)}</span>
              </div>
              {featured.runtime && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{featured.runtime}</span>
                </>
              )}
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {featured.title}
            </h2>

            <p className="text-xs md:text-sm text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
              {featured.synopsis}
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <span>{featured.genres.join(' · ')}</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={handleFeaturedPlay}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-900/60 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Stream Now</span>
              </button>

              <button
                onClick={() => openMedia(featured)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-md border border-white/10 transition-colors"
              >
                Details & Streams
              </button>

              <button
                onClick={handleFeaturedLibrary}
                className={`p-2.5 rounded-xl border backdrop-blur-md transition-colors ${
                  inLibrary
                    ? 'bg-violet-600/30 text-violet-300 border-violet-500/50'
                    : 'bg-black/40 text-slate-300 border-white/10 hover:text-white'
                }`}
                title={inLibrary ? 'In Library' : 'Add to Watchlist'}
              >
                {inLibrary ? <Check className="w-4 h-4 text-violet-400" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#121320] border border-[#1e2034]">
        {/* Genre Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-violet-400" />
            Genre:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {genresList.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedGenre === genre
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-[#18192a] text-slate-400 hover:text-slate-200 hover:bg-[#1f2136]'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value as any)}
            className="bg-[#18192a] border border-[#23253d] text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-violet-500 font-medium"
          >
            <option value="popular">Popularity & Rating</option>
            <option value="rating">Highest Rated</option>
            <option value="year">Newest Release</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
          <span className="text-xs text-slate-400 font-mono tabular-nums ml-2">
            ({filteredCatalog.length} titles)
          </span>
        </div>
      </div>

      {/* Catalog Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white tracking-tight">
            Cinemeta Streaming Catalog
          </h3>
          <span className="text-xs text-slate-400">
            Powered by Cinemeta, Torrentio & Public Domain
          </span>
        </div>

        {filteredCatalog.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#121320] border border-[#1e2034] text-slate-400 space-y-2">
            <p className="text-sm font-medium">No titles match your filter criteria.</p>
            <p className="text-xs">Try selecting 'All' genres or clearing the search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredCatalog.map((media) => (
              <MediaCard key={media.id} media={media} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
