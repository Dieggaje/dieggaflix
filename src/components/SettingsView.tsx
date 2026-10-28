import React, { useState } from 'react';
import {
  Settings,
  Server,
  Subtitles,
  Sliders,
  Download,
  Upload,
  RefreshCw,
  Check,
  Shield,
  Layers,
} from 'lucide-react';
import { useStremio } from '../context/StremioContext';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, library, addons } = useStremio();
  const [saveToast, setSaveToast] = useState(false);

  const showToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      app: 'DieggaFlix',
      exportDate: new Date().toISOString(),
      library,
      addons,
      settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dieggaflix_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1f2136]">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-violet-400" />
            <span>DieggaFlix Application Settings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure streaming server cache, torrent connections, subtitles engine and playback behavior.
          </p>
        </div>

        {saveToast && (
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/30 flex items-center gap-1.5 font-medium animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            Saved
          </span>
        )}
      </div>

      {/* 1. Streaming Server & Torrent Engine */}
      <section className="p-6 rounded-2xl bg-[#121322] border border-[#1f2136] space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Streaming Server & Engine</h3>
              <p className="text-[11px] text-slate-400">P2P caching and streaming engine parameters</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-400 font-mono">127.0.0.1:11470 Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Streaming Server URL
            </label>
            <input
              type="text"
              value={settings.streamingServerUrl}
              onChange={(e) => {
                updateSettings({ streamingServerUrl: e.target.value });
                showToast();
              }}
              className="w-full bg-[#18192a] border border-[#23253d] rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Torrent Cache Storage Limit
            </label>
            <select
              value={settings.cacheSize}
              onChange={(e) => {
                updateSettings({ cacheSize: e.target.value });
                showToast();
              }}
              className="w-full bg-[#18192a] border border-[#23253d] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 font-medium"
            >
              <option value="2GB">2 GB (RAM Cache)</option>
              <option value="5GB">5 GB (Recommended)</option>
              <option value="10GB">10 GB (High Bitrate 4K)</option>
              <option value="Unlimited">Unlimited (Disk Cache)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Torrent Speed Profile
            </label>
            <select
              value={settings.torrentProfile}
              onChange={(e) => {
                updateSettings({ torrentProfile: e.target.value as any });
                showToast();
              }}
              className="w-full bg-[#18192a] border border-[#23253d] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 font-medium"
            >
              <option value="ultra_fast">Ultra Fast (Maximum bandwidth, seed prioritization)</option>
              <option value="balanced">Balanced (Standard buffer)</option>
              <option value="low_memory">Low Memory (Lightweight background)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Max Peer Connections
            </label>
            <select
              value={settings.maxConnections}
              onChange={(e) => {
                updateSettings({ maxConnections: parseInt(e.target.value, 10) });
                showToast();
              }}
              className="w-full bg-[#18192a] border border-[#23253d] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 font-medium"
            >
              <option value={30}>30 peers</option>
              <option value={50}>50 peers (Default)</option>
              <option value={100}>100 peers</option>
              <option value={200}>200 peers (High concurrency)</option>
            </select>
          </div>
        </div>
      </section>

      {/* 2. Subtitles Engine (OpenSubtitles v3) */}
      <section className="p-6 rounded-2xl bg-[#121322] border border-[#1f2136] space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Subtitles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Subtitles Engine</h3>
            <p className="text-[11px] text-slate-400">OpenSubtitles v3 auto-sync and typography settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Default Subtitle Language
            </label>
            <select
              value={settings.subtitleLang}
              onChange={(e) => {
                updateSettings({ subtitleLang: e.target.value });
                showToast();
              }}
              className="w-full bg-[#18192a] border border-[#23253d] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 font-medium"
            >
              <option value="Spanish">Spanish (Castellano / Latino)</option>
              <option value="English">English</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Italian">Italian</option>
              <option value="Portuguese">Portuguese</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Subtitle Font Size
            </label>
            <select
              value={settings.subtitleSize}
              onChange={(e) => {
                updateSettings({ subtitleSize: e.target.value as any });
                showToast();
              }}
              className="w-full bg-[#18192a] border border-[#23253d] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 font-medium"
            >
              <option value="small">Small (75%)</option>
              <option value="medium">Medium (100% - Default)</option>
              <option value="large">Large (125%)</option>
              <option value="extra_large">Extra Large (150%)</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#18192a] border border-[#23253d]">
            <div>
              <span className="font-semibold text-slate-200">Dark Background Scrim</span>
              <p className="text-[11px] text-slate-400">Semi-transparent black box behind text</p>
            </div>
            <input
              type="checkbox"
              checked={settings.subtitleBg}
              onChange={(e) => {
                updateSettings({ subtitleBg: e.target.checked });
                showToast();
              }}
              className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 accent-violet-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#18192a] border border-[#23253d]">
            <div>
              <span className="font-semibold text-slate-200">Hardware Video Acceleration</span>
              <p className="text-[11px] text-slate-400">Direct GPU decoding for 4K 60fps streams</p>
            </div>
            <input
              type="checkbox"
              checked={settings.hardwareAcceleration}
              onChange={(e) => {
                updateSettings({ hardwareAcceleration: e.target.checked });
                showToast();
              }}
              className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 accent-violet-600 cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 3. Backup & Library Export */}
      <section className="p-6 rounded-2xl bg-[#121322] border border-[#1f2136] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Export & Backup Configuration</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Save your watch progress, installed addons and settings to a JSON file.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c1e33] hover:bg-[#252844] text-white text-xs font-semibold border border-[#2e3152] transition-colors"
        >
          <Download className="w-4 h-4 text-violet-400" />
          <span>Export JSON</span>
        </button>
      </section>
    </div>
  );
};
