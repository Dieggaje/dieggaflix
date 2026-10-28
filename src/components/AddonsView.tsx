import React, { useState } from 'react';
import { Blocks, Plus, Check, Download, Trash2, ExternalLink, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useStremio } from '../context/StremioContext';
import { AddonManifest } from '../types/stremio';

export const AddonsView: React.FC = () => {
  const { addons, toggleAddon, installCustomAddon, uninstallAddon } = useStremio();
  const [tab, setTab] = useState<'all' | 'official' | 'community'>('all');
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [manifestUrlInput, setManifestUrlInput] = useState('');
  const [addonNameInput, setAddonNameInput] = useState('');
  const [modalError, setModalError] = useState('');

  const filteredAddons = addons.filter((addon) => {
    if (tab === 'official') return addon.isOfficial;
    if (tab === 'community') return !addon.isOfficial;
    return true;
  });

  const handleInstallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manifestUrlInput.trim()) {
      setModalError('Please enter a valid Add-on manifest URL or identifier');
      return;
    }

    try {
      const url = manifestUrlInput.trim();
      const id = url.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().slice(0, 30);
      const name = addonNameInput.trim() || `Custom Addon (${id.slice(0, 8)})`;

      const success = installCustomAddon({
        id,
        name,
        version: '1.0.0',
        description: `User installed custom addon from ${url}`,
        author: 'Community Scraper',
        icon: '⚡',
        manifestUrl: url,
        types: ['movie', 'series'],
        catalogs: ['Custom Scraping'],
        isInstalled: true,
      });

      if (success) {
        setShowInstallModal(false);
        setManifestUrlInput('');
        setAddonNameInput('');
        setModalError('');
      }
    } catch (err: any) {
      setModalError('Failed to parse manifest URL: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#121322] via-[#16172d] to-[#121322] border border-[#23253f]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Blocks className="w-5 h-5 text-violet-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              DieggaFlix Add-on Ecosystem
            </h2>
            <span className="text-[10px] bg-violet-600/30 text-violet-300 px-2 py-0.5 rounded-full font-mono border border-violet-500/30">
              v3 PROTOCOL
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Stremio addons provide catalogs, stream resolvers, and subtitles. Enable or disable scrapers like Torrentio, Cinemeta, and OpenSubtitles.
          </p>
        </div>

        <button
          onClick={() => setShowInstallModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-950/60 transition-all shrink-0 hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Install Add-on URL</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[#1f2136] pb-3">
        <div className="flex items-center gap-2">
          {(['all', 'official', 'community'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                tab === t
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161726]'
              }`}
            >
              {t === 'all'
                ? `All Add-ons (${addons.length})`
                : t === 'official'
                ? 'Official Add-ons'
                : 'Community Add-ons'}
            </button>
          ))}
        </div>
      </div>

      {/* Addons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAddons.map((addon) => (
          <div
            key={addon.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              addon.isInstalled
                ? 'bg-[#131424] border-[#22243d] shadow-sm'
                : 'bg-[#0f101b] border-[#18192a] opacity-80'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1c1d30] border border-[#292b45] flex items-center justify-center text-2xl shadow-inner shrink-0">
                    {addon.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>{addon.name}</span>
                      {addon.isOfficial && (
                        <span title="Official Stremio Add-on">
                          <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span>v{addon.version}</span>
                      <span>·</span>
                      <span className="text-slate-400">{addon.author}</span>
                    </div>
                  </div>
                </div>

                {addon.isInstalled ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    INSTALLED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    AVAILABLE
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {addon.description}
              </p>

              {/* Supported types & catalogs */}
              <div className="flex flex-wrap gap-1 pt-1">
                {addon.types.map((type) => (
                  <span
                    key={type}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#1c1e33] text-slate-300 font-medium capitalize"
                  >
                    {type}
                  </span>
                ))}
                {addon.catalogs.map((cat) => (
                  <span
                    key={cat}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#1c1e33] text-violet-300 font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#1e2034]">
              <span className="text-[11px] text-slate-500 font-mono truncate max-w-[160px]">
                {addon.manifestUrl.replace('https://', '')}
              </span>

              <div className="flex items-center gap-2">
                {!addon.isOfficial && (
                  <button
                    onClick={() => uninstallAddon(addon.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title="Uninstall custom addon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => toggleAddon(addon.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    addon.isInstalled
                      ? 'bg-[#1e2034] text-slate-300 hover:bg-rose-950/40 hover:text-rose-300 hover:border hover:border-rose-500/40'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-950/50'
                  }`}
                >
                  {addon.isInstalled ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Disable</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Install</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Install Add-on by URL Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111220] border border-[#23253d] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-violet-400" />
                <span>Install Add-on Manifest</span>
              </h3>
              <button
                onClick={() => setShowInstallModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInstallSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Manifest URL or Identifier
                </label>
                <input
                  type="text"
                  value={manifestUrlInput}
                  onChange={(e) => setManifestUrlInput(e.target.value)}
                  placeholder="https://torrentio.strem.fun/manifest.json"
                  className="w-full bg-[#18192a] border border-[#23253d] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 font-mono text-xs"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Supports any Stremio v3 manifest URL (e.g. Torrentio, CyberFlix, Kitsu, OpenSubtitles).
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Custom Name (Optional)
                </label>
                <input
                  type="text"
                  value={addonNameInput}
                  onChange={(e) => setAddonNameInput(e.target.value)}
                  placeholder="My Custom Scraper"
                  className="w-full bg-[#18192a] border border-[#23253d] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              {modalError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInstallModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1a1c30]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-md"
                >
                  Install Add-on
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
