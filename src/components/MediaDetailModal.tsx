import React, { useState } from 'react';
import {
  X,
  Play,
  Star,
  Bookmark,
  Check,
  Clock,
  Film,
  Sparkles,
  Download,
  Share2,
  SlidersHorizontal,
  Layers,
  Zap,
} from 'lucide-react';
import { MediaItem, StreamItem, Episode } from '../types/stremio';
import { useStremio } from '../context/StremioContext';

interface MediaDetailModalProps {
  media: MediaItem;
  onClose: () => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({ media, onClose }) => {
  const { playStream, addToLibrary, removeFromLibrary, isItemInLibrary, addons } = useStremio();

  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(
    media.type === 'series' && media.seasons?.[0]?.episodes?.[0]
      ? media.seasons[0].episodes[0]
      : null
  );
  const [showTrailer, setShowTrailer] = useState(false);
  const [streamAddonFilter, setStreamAddonFilter] = useState<string>('all');

  const inLibrary = isItemInLibrary(media.id);

  // Determine current streams to display (either episode streams or media streams)
  const availableStreams: StreamItem[] =
    media.type === 'series'
      ? selectedEpisode?.streams || []
      : media.streams || [];

  // Filter streams by installed addons
  const installedAddonIds = new Set(addons.filter((a) => a.isInstalled).map((a) => a.id));
  const activeStreams = availableStreams.filter(
    (s) => installedAddonIds.has(s.addonId) || s.addonId === 'cinemeta'
  );

  const filteredStreams =
    streamAddonFilter === 'all'
      ? activeStreams
      : activeStreams.filter((s) => s.addonId === streamAddonFilter);

  const handleStartPlay = (stream: StreamItem) => {
    if (media.type === 'series' && selectedEpisode) {
      playStream(media, stream, selectedEpisode.seasonNumber, selectedEpisode.episodeNumber);
    } else {
      playStream(media, stream);
    }
  };

  const handleLibraryToggle = () => {
    if (inLibrary) {
      removeFromLibrary(media.id);
    } else {
      addToLibrary(media, 'watchlist');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex justify-center p-0 md:p-6 lg:p-10 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#0e0f19] border border-[#212338] rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop & Primary Info */}
        <div className="relative min-h-[380px] lg:min-h-[460px] flex items-end p-6 md:p-10 bg-[#0c0d16]">
          {/* Backdrop Image */}
          <img
            src={media.backdrop}
            alt={media.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />

          {/* Gradients to blend smoothly */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f19] via-[#0e0f19]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e0f19] via-[#0e0f19]/80 to-transparent" />

          {/* Foreground details split */}
          <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end w-full">
            {/* Poster */}
            <div className="w-36 sm:w-44 md:w-52 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/90 border border-white/10 shrink-0 bg-[#161726]">
              <img
                src={media.poster}
                alt={media.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Metadata */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-violet-400 uppercase tracking-wider">
                  {media.type}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{media.year}</span>
                {media.runtime && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {media.runtime}
                    </span>
                  </>
                )}
                {media.ageRating && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 font-mono">
                      {media.ageRating}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {media.title}
              </h1>

              {media.originalTitle && media.originalTitle !== media.title && (
                <p className="text-xs text-slate-400 italic">{media.originalTitle}</p>
              )}

              {/* Rating & Genres */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="tabular-nums">{media.rating.toFixed(1)} / 10</span>
                </div>

                <div className="text-xs text-slate-300 flex items-center gap-2">
                  {media.genres.map((g, idx) => (
                    <span key={g}>
                      {g}
                      {idx < media.genres.length - 1 && <span className="ml-2 text-slate-600">·</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {filteredStreams[0] && (
                  <button
                    onClick={() => handleStartPlay(filteredStreams[0])}
                    className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-900/50 transition-all hover:scale-105 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>
                      {media.type === 'series' && selectedEpisode
                        ? `Play S${selectedEpisode.seasonNumber}E${selectedEpisode.episodeNumber}`
                        : 'Stream Now'}
                    </span>
                  </button>
                )}

                <button
                  onClick={handleLibraryToggle}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    inLibrary
                      ? 'bg-violet-600/20 text-violet-300 border-violet-500/40 hover:bg-violet-600/30'
                      : 'bg-[#18192a] text-slate-200 border-[#2b2d47] hover:bg-[#202238]'
                  }`}
                >
                  {inLibrary ? <Check className="w-4 h-4 text-violet-400" /> : <Bookmark className="w-4 h-4" />}
                  <span>{inLibrary ? 'In Library' : 'Add to Library'}</span>
                </button>

                <button
                  onClick={() => setShowTrailer(!showTrailer)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#18192a] text-slate-200 border border-[#2b2d47] hover:bg-[#202238] transition-colors"
                >
                  <Film className="w-4 h-4 text-slate-400" />
                  <span>{showTrailer ? 'Hide Trailer' : 'Trailer'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trailer Video Expandable (if requested) */}
        {showTrailer && (
          <div className="px-6 md:px-10 py-4 bg-[#0a0b12] border-y border-[#1f2136]">
            <div className="relative aspect-video max-h-[380px] mx-auto rounded-xl overflow-hidden bg-black border border-white/10">
              <video
                src={filteredStreams[0]?.sourceUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Content Body: Two Columns (Overview & Episodes vs Streams List) */}
        <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Synopsis, Cast, Seasons / Episodes (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">
                Synopsis
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {media.synopsis}
              </p>
            </div>

            {/* Cast & Crew */}
            {media.cast && media.cast.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Cast & Crew
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {media.cast.map((actor) => (
                    <div
                      key={actor.name}
                      className="p-2.5 rounded-lg bg-[#141524] border border-[#1e2035] flex flex-col justify-center"
                    >
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {actor.name}
                      </span>
                      {actor.character && (
                        <span className="text-[11px] text-slate-400 truncate mt-0.5">
                          {actor.character}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Series Seasons & Episodes Explorer */}
            {media.type === 'series' && media.seasons && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-[#212338] pb-3">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-violet-400" />
                    <span>Episodes Guide</span>
                  </h2>

                  {/* Season Selector Tabs */}
                  <div className="flex items-center gap-1.5">
                    {media.seasons.map((season, idx) => (
                      <button
                        key={season.seasonNumber}
                        onClick={() => {
                          setSelectedSeasonIndex(idx);
                          setSelectedEpisode(season.episodes[0] || null);
                        }}
                        className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                          selectedSeasonIndex === idx
                            ? 'bg-violet-600 text-white'
                            : 'bg-[#161726] text-slate-400 hover:text-white'
                        }`}
                      >
                        Season {season.seasonNumber}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Episodes List */}
                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {media.seasons[selectedSeasonIndex]?.episodes.map((ep) => {
                    const isCurrent =
                      selectedEpisode?.episodeNumber === ep.episodeNumber &&
                      selectedEpisode?.seasonNumber === ep.seasonNumber;
                    return (
                      <div
                        key={ep.episodeNumber}
                        onClick={() => setSelectedEpisode(ep)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isCurrent
                            ? 'bg-[#1b1d30] border-violet-500/80 shadow-md shadow-violet-950/30'
                            : 'bg-[#131422] border-[#1f2136] hover:bg-[#18192a] text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-[#22243d] flex items-center justify-center font-mono text-xs font-bold text-violet-300 shrink-0">
                            {ep.episodeNumber}
                          </span>
                          <div className="min-w-0">
                            <h4
                              className={`text-xs font-semibold truncate ${
                                isCurrent ? 'text-white' : 'text-slate-200'
                              }`}
                            >
                              {ep.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {ep.synopsis}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[11px] text-slate-400 font-mono">
                            {ep.duration}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (ep.streams?.[0]) {
                                playStream(media, ep.streams[0], ep.seasonNumber, ep.episodeNumber);
                              }
                            }}
                            className="w-8 h-8 rounded-full bg-violet-600/30 hover:bg-violet-600 text-violet-300 hover:text-white flex items-center justify-center transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Stremio Addon Streams Resolver (5 cols) */}
          <div className="lg:col-span-5 bg-[#121320] border border-[#202236] rounded-xl p-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#212338]">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-400" />
                  <span>Streams Available</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {media.type === 'series' && selectedEpisode
                    ? `Resolved for S${selectedEpisode.seasonNumber}E${selectedEpisode.episodeNumber}`
                    : 'Resolved by installed add-ons'}
                </p>
              </div>

              {/* Add-on filter */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setStreamAddonFilter('all')}
                  className={`px-2 py-1 text-[11px] rounded ${
                    streamAddonFilter === 'all'
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStreamAddonFilter('torrentio-rd')}
                  className={`px-2 py-1 text-[11px] rounded ${
                    streamAddonFilter === 'torrentio-rd'
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Torrentio
                </button>
              </div>
            </div>

            {/* Streams List */}
            <div className="space-y-2.5 mt-4 flex-1 overflow-y-auto max-h-[420px] pr-1">
              {filteredStreams.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400 space-y-2">
                  <p>No streams found from enabled add-ons for this title.</p>
                  <p className="text-[11px] text-violet-400">
                    Try checking the Add-ons tab to enable Torrentio or Public Domain streams.
                  </p>
                </div>
              ) : (
                filteredStreams.map((stream) => (
                  <div
                    key={stream.id}
                    onClick={() => handleStartPlay(stream)}
                    className="p-3 rounded-xl bg-[#171829] border border-[#24263f] hover:border-violet-500/70 hover:bg-[#1d1f34] transition-all cursor-pointer group flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-violet-400">
                          {stream.addonName}
                        </span>
                        {stream.isDebrid && (
                          <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                            RD+ CACHED
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-bold text-white bg-violet-600/30 text-violet-300 px-2 py-0.5 rounded border border-violet-500/30">
                        {stream.quality}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 font-mono truncate group-hover:text-white transition-colors">
                      {stream.title}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        {stream.size && <span>💾 {stream.size}</span>}
                        {stream.seeds !== undefined && <span>👤 {stream.seeds} seeds</span>}
                      </div>

                      <div className="flex items-center gap-2 text-violet-400 group-hover:text-violet-300 font-semibold">
                        <span>Stream</span>
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
