import React from 'react';
import { Play, Star, Bookmark, Check } from 'lucide-react';
import { MediaItem } from '../types/stremio';
import { useStremio } from '../context/StremioContext';

interface MediaCardProps {
  media: MediaItem;
}

export const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
  const { openMedia, playStream, addToLibrary, removeFromLibrary, isItemInLibrary, getLibraryItem } =
    useStremio();

  const inLibrary = isItemInLibrary(media.id);
  const libraryItem = getLibraryItem(media.id);

  // Compute progress if watching
  const hasProgress =
    libraryItem?.progressSeconds &&
    libraryItem?.durationSeconds &&
    libraryItem.durationSeconds > 0;
  const progressPercent = hasProgress
    ? Math.min(100, Math.round((libraryItem.progressSeconds! / libraryItem.durationSeconds!) * 100))
    : 0;

  const handleQuickPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (media.type === 'series' && media.seasons?.[0]?.episodes?.[0]) {
      const ep = media.seasons[0].episodes[0];
      if (ep.streams?.[0]) {
        playStream(media, ep.streams[0], 1, 1);
        return;
      }
    }
    if (media.streams?.[0]) {
      playStream(media, media.streams[0]);
    } else {
      openMedia(media);
    }
  };

  const handleLibraryToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inLibrary) {
      removeFromLibrary(media.id);
    } else {
      addToLibrary(media, 'watchlist');
    }
  };

  return (
    <div
      onClick={() => openMedia(media)}
      className="group relative cursor-pointer flex flex-col rounded-xl overflow-hidden bg-[#131422] border border-[#1d1f33] hover:border-violet-500/60 transition-all duration-200 hover:shadow-xl hover:shadow-purple-950/20 hover:-translate-y-1"
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0d0e17]">
        <img
          src={media.poster}
          alt={media.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Subtle Dark Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-semibold text-amber-300 tabular-nums border border-white/10">
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
            <span>{media.rating.toFixed(1)}</span>
          </div>

          <button
            onClick={handleLibraryToggle}
            title={inLibrary ? 'Remove from library' : 'Save to library'}
            className={`p-1.5 rounded-md backdrop-blur-md border transition-colors ${
              inLibrary
                ? 'bg-violet-600 text-white border-violet-500'
                : 'bg-black/60 text-slate-300 border-white/10 hover:text-white hover:bg-black/80'
            }`}
          >
            {inLibrary ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Hover Quick Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30 backdrop-blur-[2px]">
          <button
            onClick={handleQuickPlay}
            className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-950/80 hover:bg-violet-500 hover:scale-110 transition-transform active:scale-95"
            title="Stream immediately"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>

        {/* Watched Progress Bar */}
        {hasProgress && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-black/60">
            <div
              className="h-full bg-violet-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Info Block */}
      <div className="p-3 flex flex-col flex-1 justify-between bg-[#111220]">
        <div>
          <h3 className="font-semibold text-sm text-slate-100 truncate group-hover:text-violet-300 transition-colors">
            {media.title}
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
            <span className="font-mono tabular-nums">{media.year}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{media.type}</span>
            {media.runtime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{media.runtime}</span>
              </>
            )}
          </div>
        </div>

        {/* Genres */}
        <div className="text-[11px] text-slate-500 truncate mt-2">
          {media.genres.join(', ')}
        </div>
      </div>
    </div>
  );
};
