import React, { useState } from 'react';
import { Play, Trash2, Clock, CheckCircle2, Bookmark, Compass } from 'lucide-react';
import { useStremio } from '../context/StremioContext';
import { LibraryItem } from '../types/stremio';

export const LibraryView: React.FC = () => {
  const { library, removeFromLibrary, playStream, openMedia, setActiveTab } = useStremio();
  const [filter, setFilter] = useState<'all' | 'watching' | 'watchlist' | 'completed'>('all');

  const filteredItems = library.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const continueWatchingItems = library.filter((item) => item.status === 'watching');

  const handleResume = (item: LibraryItem) => {
    const media = item.media;
    if (media.type === 'series') {
      const seasonNum = item.season || 1;
      const epNum = item.episode || 1;
      const targetSeason = media.seasons?.find((s) => s.seasonNumber === seasonNum);
      const targetEp = targetSeason?.episodes.find((e) => e.episodeNumber === epNum) || targetSeason?.episodes[0];
      if (targetEp?.streams?.[0]) {
        playStream(media, targetEp.streams[0], seasonNum, epNum, item.progressSeconds);
        return;
      }
    }

    if (media.streams?.[0]) {
      playStream(media, media.streams[0], undefined, undefined, item.progressSeconds);
    } else {
      openMedia(media);
    }
  };

  const formatSeconds = (sec?: number) => {
    if (!sec) return '00:00';
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Continue Watching Section */}
      {continueWatchingItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" />
              <span>Continue Watching</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {continueWatchingItems.length} in progress
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {continueWatchingItems.map((item) => {
              const progressPct =
                item.progressSeconds && item.durationSeconds
                  ? Math.min(100, Math.round((item.progressSeconds / item.durationSeconds) * 100))
                  : 0;

              return (
                <div
                  key={item.mediaId}
                  className="group relative rounded-xl overflow-hidden bg-[#131422] border border-[#1f2136] hover:border-violet-500/60 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                    <img
                      src={item.media.backdrop || item.media.poster}
                      alt={item.media.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    {/* Resume Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => handleResume(item)}
                        className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-950/80 hover:bg-violet-500 hover:scale-110 transition-all"
                        title="Resume playback"
                      >
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/60">
                      <div
                        className="h-full bg-violet-500 transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <h3
                        onClick={() => openMedia(item.media)}
                        className="text-xs font-bold text-white hover:text-violet-300 transition-colors cursor-pointer truncate"
                      >
                        {item.media.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 font-mono">
                        {item.season && item.episode ? (
                          <span>S{item.season} E{item.episode} · </span>
                        ) : null}
                        <span>{formatSeconds(item.progressSeconds)}</span>
                        <span>/</span>
                        <span>{formatSeconds(item.durationSeconds)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromLibrary(item.mediaId)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded transition-colors"
                      title="Remove from history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Library Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#1f2136] pb-3">
        <div className="flex items-center gap-2">
          {(['all', 'watching', 'watchlist', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === tab
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161726]'
              }`}
            >
              {tab === 'all'
                ? 'All Items'
                : tab === 'watching'
                ? 'In Progress'
                : tab === 'watchlist'
                ? 'Saved Watchlist'
                : 'Finished'}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-mono tabular-nums">
          {filteredItems.length} saved
        </span>
      </div>

      {/* Library Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#121320] border border-[#1e2034] space-y-3">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Your library is empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Bookmark movies or series from the Discover catalog, or start playing any stream to save your watch progress automatically.
          </p>
          <button
            onClick={() => setActiveTab('discover')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Catalog</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredItems.map((item) => (
            <div key={item.mediaId} className="relative group">
              <div
                onClick={() => openMedia(item.media)}
                className="cursor-pointer rounded-xl overflow-hidden bg-[#131422] border border-[#1e2034] hover:border-violet-500/60 transition-all hover:-translate-y-1"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
                  <img
                    src={item.media.poster}
                    alt={item.media.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    {item.status === 'completed' ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/80 text-white text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm">
                        <CheckCircle2 className="w-3 h-3" /> Watched
                      </span>
                    ) : item.status === 'watching' ? (
                      <span className="px-1.5 py-0.5 rounded bg-violet-600/80 text-white text-[10px] font-bold backdrop-blur-sm">
                        In Progress
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="p-2.5">
                  <h4 className="text-xs font-semibold text-slate-100 truncate group-hover:text-violet-300">
                    {item.media.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span className="font-mono">{item.media.year}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromLibrary(item.mediaId);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
