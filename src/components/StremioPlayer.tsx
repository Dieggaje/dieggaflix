import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ArrowLeft,
  Settings,
  MessageSquare,
  Activity,
  SkipForward,
  Check,
  FastForward,
} from 'lucide-react';
import { useStremio } from '../context/StremioContext';

export const StremioPlayer: React.FC = () => {
  const { activePlayer, closePlayer, updateProgress, settings } = useStremio();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedSubtitle, setSelectedSubtitle] = useState<'off' | 'es' | 'en' | 'fr'>('es');
  const [subDelayMs, setSubDelayMs] = useState(0);

  // Live simulated streaming telemetry
  const [downloadSpeed, setDownloadSpeed] = useState(24.5);
  const [bufferedBytes, setBufferedBytes] = useState(380);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!activePlayer) return null;

  const { media, stream, seasonNumber, episodeNumber } = activePlayer;

  // Auto-hide controls timer on mouse move
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSubtitleMenu(false);
        setShowSpeedMenu(false);
      }
    }, 3500);
  };

  // Video time update & progress scrobbling
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(curr);
    setDuration(dur);

    // Scrobble progress every 5 seconds
    if (Math.floor(curr) % 5 === 0 && dur > 0) {
      updateProgress(media.id, Math.floor(curr), Math.floor(dur), seasonNumber, episodeNumber);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
    if (activePlayer.startTime && activePlayer.startTime > 0) {
      videoRef.current.currentTime = activePlayer.startTime;
    }
    videoRef.current.play().catch(() => setIsPlaying(false));
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    videoRef.current.muted = next;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  // Format time (hh:mm:ss or mm:ss)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulated live fluctuating telemetry for Stremio Torrent/Debrid engine
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloadSpeed((prev) => {
        const delta = (Math.random() - 0.48) * 2;
        return Math.max(12.4, Math.min(48.2, Number((prev + delta).toFixed(1))));
      });
      setBufferedBytes((prev) => (prev < 900 ? prev + 12 : 900));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        e.preventDefault();
        skipTime(10);
      } else if (e.key === 'ArrowLeft' || e.key === 'j') {
        e.preventDefault();
        skipTime(-10);
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'Escape') {
        if (!document.fullscreenElement) {
          closePlayer();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, duration]);

  // Current subtitle text simulator based on timestamps
  const getSubtitlesText = () => {
    if (selectedSubtitle === 'off') return null;
    const sec = Math.floor(currentTime);

    const spanishSubs: Record<number, string> = {
      2: 'Sistemas cuánticos en línea...',
      4: 'Detectando fluctuación en la frecuencia gravitacional.',
      7: 'Comandante, la señal proviene del cuadrante Kepler.',
      10: 'No es una transmisión humana. Preparad el protocolo de enlace.',
      14: 'Iniciando escaneo de dispersión taquiónica...',
      18: 'Monolito asegurado. Mantengan posición.',
      22: 'El horizonte de sucesos está respondiendo.',
      26: 'Iniciando desacople de propulsores iónicos.',
      30: 'Todos los sectores verificados. Acceso concedido.',
    };

    const englishSubs: Record<number, string> = {
      2: 'Quantum core online...',
      4: 'Gravitational frequency anomaly detected.',
      7: 'Commander, the transmission originates from Kepler quadrant.',
      10: 'This is non-human signature. Initiate handshake protocol.',
      14: 'Starting tachyon dispersion scan...',
      18: 'Monolith secured. Hold defensive positions.',
      22: 'Event horizon resonance confirmed.',
      26: 'Disengaging ion thrusters now.',
      30: 'All sectors verified. Clearance granted.',
    };

    const dict = selectedSubtitle === 'es' ? spanishSubs : englishSubs;
    // Find closest subtitle active in this second
    for (let i = 0; i < 4; i++) {
      if (dict[sec - i]) {
        return dict[sec - i];
      }
    }
    return null;
  };

  const subText = getSubtitlesText();

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={stream.sourceUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          updateProgress(media.id, Math.floor(duration), Math.floor(duration), seasonNumber, episodeNumber);
        }}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
      />

      {/* Subtitles Overlay */}
      {subText && (
        <div
          className="absolute bottom-24 inset-x-0 flex justify-center pointer-events-none px-6 text-center z-20"
          style={{ transform: `translateY(${subDelayMs / 50}px)` }}
        >
          <span
            className={`px-4 py-1.5 rounded-lg font-medium text-white shadow-lg tracking-wide ${
              settings.subtitleBg ? 'bg-black/75 backdrop-blur-sm' : 'text-shadow-md'
            } ${
              settings.subtitleSize === 'large'
                ? 'text-2xl'
                : settings.subtitleSize === 'extra_large'
                ? 'text-3xl font-bold'
                : 'text-xl'
            }`}
          >
            {subText}
          </span>
        </div>
      )}

      {/* Torrent Streaming Engine Stats Overlay (Stremio Stats) */}
      {showStats && (
        <div className="absolute top-20 left-6 z-30 p-4 rounded-xl bg-black/85 border border-violet-500/40 text-xs font-mono text-slate-200 backdrop-blur-md shadow-2xl space-y-2 max-w-sm pointer-events-auto">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-bold text-violet-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-violet-400" />
              DIEGGAFLIX ENGINE STATS
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
              OPTIMAL
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Stream Add-on:</span>
              <span className="text-white font-semibold">{stream.addonName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Stream Quality:</span>
              <span className="text-violet-300 font-bold">{stream.quality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Download Speed:</span>
              <span className="text-emerald-400 font-bold tabular-nums">
                {downloadSpeed} MB/s
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Buffer Health:</span>
              <span className="text-white tabular-nums">100% ({bufferedBytes} MB)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Seeders / Peers:</span>
              <span className="text-white tabular-nums">{stream.seeds || 128} connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Audio Track:</span>
              <span className="text-slate-300">{stream.audio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Codec Profile:</span>
              <span className="text-slate-300">{stream.codec || 'H.265 Main10 / AAC'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div
        className={`absolute top-0 inset-x-0 p-4 md:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between z-30 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (videoRef.current) {
                updateProgress(
                  media.id,
                  Math.floor(videoRef.current.currentTime),
                  Math.floor(videoRef.current.duration || 0),
                  seasonNumber,
                  episodeNumber
                );
              }
              closePlayer();
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Back to DieggaFlix"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              <span>{media.title}</span>
              {seasonNumber !== undefined && episodeNumber !== undefined && (
                <span className="text-violet-400 font-mono text-xs md:text-sm font-semibold">
                  · S{seasonNumber} E{episodeNumber}
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
              <span className="text-violet-300 font-medium">{stream.quality}</span>
              <span>·</span>
              <span>{stream.addonName}</span>
              {stream.audio && (
                <>
                  <span>·</span>
                  <span>{stream.audio}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Top Right Controls: Stats, Speed, Subtitles */}
        <div className="flex items-center gap-2">
          {/* Stats Button */}
          <button
            onClick={() => setShowStats(!showStats)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
              showStats
                ? 'bg-violet-600 text-white'
                : 'bg-black/60 text-slate-300 hover:text-white border border-white/10'
            }`}
            title="Toggle Engine Statistics"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Stats</span>
          </button>

          {/* Subtitles Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSubtitleMenu(!showSubtitleMenu);
                setShowSpeedMenu(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                selectedSubtitle !== 'off'
                  ? 'bg-violet-600/30 text-violet-300 border border-violet-500/50'
                  : 'bg-black/60 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="uppercase">{selectedSubtitle}</span>
            </button>

            {showSubtitleMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 p-3 bg-[#111220] border border-[#23253d] rounded-xl shadow-2xl text-xs space-y-2.5 z-40">
                <div className="font-bold text-white border-b border-white/10 pb-1.5">
                  Subtitles (OpenSubtitles v3)
                </div>
                {(['off', 'es', 'en', 'fr'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedSubtitle(lang);
                      setShowSubtitleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                      selectedSubtitle === lang
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-300 hover:bg-[#1a1c30]'
                    }`}
                  >
                    <span>
                      {lang === 'off'
                        ? 'Disabled'
                        : lang === 'es'
                        ? 'Spanish (Latino/Castellano)'
                        : lang === 'en'
                        ? 'English (Full)'
                        : 'French (VF)'}
                    </span>
                    {selectedSubtitle === lang && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}

                <div className="pt-2 border-t border-white/10">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Sync Delay</span>
                    <span>{subDelayMs} ms</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSubDelayMs((d) => d - 250)}
                      className="flex-1 py-1 bg-[#1a1c30] hover:bg-[#23253d] rounded text-[10px]"
                    >
                      -250ms
                    </button>
                    <button
                      onClick={() => setSubDelayMs(0)}
                      className="px-2 py-1 bg-[#1a1c30] hover:bg-[#23253d] rounded text-[10px]"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setSubDelayMs((d) => d + 250)}
                      className="flex-1 py-1 bg-[#1a1c30] hover:bg-[#23253d] rounded text-[10px]"
                    >
                      +250ms
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Speed Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSpeedMenu(!showSpeedMenu);
                setShowSubtitleMenu(false);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-black/60 text-slate-300 hover:text-white border border-white/10"
            >
              {playbackSpeed}x
            </button>

            {showSpeedMenu && (
              <div className="absolute right-0 top-full mt-2 w-32 p-1.5 bg-[#111220] border border-[#23253d] rounded-xl shadow-2xl text-xs space-y-1 z-40">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => changeSpeed(spd)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors font-mono ${
                      playbackSpeed === spd
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-300 hover:bg-[#1a1c30]'
                    }`}
                  >
                    <span>{spd}x</span>
                    {playbackSpeed === spd && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 p-4 md:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-3 z-30 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Timeline Slider with Hover Preview */}
        <div className="w-full flex items-center gap-3">
          <span className="text-xs font-mono tabular-nums text-slate-300 w-12 text-right">
            {formatTime(currentTime)}
          </span>

          <div className="relative flex-1 group flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer focus:outline-none accent-violet-500 hover:h-2.5 transition-all"
            />
          </div>

          <span className="text-xs font-mono tabular-nums text-slate-400 w-12">
            {formatTime(duration)}
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white text-black hover:bg-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Skip -10s */}
            <button
              onClick={() => skipTime(-10)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Rewind 10s"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Skip +10s */}
            <button
              onClick={() => skipTime(10)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Forward 10s"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Volume control */}
            <div className="flex items-center gap-2 group ml-2">
              <button
                onClick={toggleMute}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer focus:outline-none accent-violet-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
