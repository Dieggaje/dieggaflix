import React from 'react';
import { Compass, Bookmark, Blocks, Settings, Radio, Sparkles, Smartphone } from 'lucide-react';
import { useStremio, NavTab } from '../context/StremioContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, library, addons, settings, openAPKModal } = useStremio();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'discover',
      label: 'Discover',
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: 'library',
      label: 'My Library',
      icon: <Bookmark className="w-5 h-5" />,
      badge: library.length > 0 ? library.length : undefined,
    },
    {
      id: 'addons',
      label: 'Add-ons',
      icon: <Blocks className="w-5 h-5" />,
      badge: addons.filter((a) => a.isInstalled).length,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-20 md:w-64 bg-[#0a0b12] border-r border-[#1c1d2d] flex flex-col shrink-0 select-none transition-all duration-200 z-30">
      {/* Brand Header */}
      <div className="h-16 px-4 md:px-6 flex items-center gap-3 border-b border-[#1c1d2d]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-950/50 shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="hidden md:flex flex-col">
          <span className="font-extrabold text-base tracking-wide text-white flex items-center gap-1">
            DIEGGA<span className="text-violet-400 font-bold text-sm tracking-wider">FLIX</span>
          </span>
          <span className="text-[11px] text-slate-400">Stremio Media Fork</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-2 md:px-3 space-y-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3 md:px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 relative group ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/10 text-white border border-violet-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#131422]'
              }`}
            >
              <div
                className={`transition-colors duration-150 ${
                  isActive ? 'text-violet-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {item.icon}
              </div>

              <span className="hidden md:inline-block whitespace-nowrap">{item.label}</span>

              {item.badge !== undefined && (
                <span
                  className={`hidden md:inline-flex items-center justify-center ml-auto px-2 py-0.5 text-xs font-mono tabular-nums rounded-md ${
                    isActive
                      ? 'bg-violet-600 text-white'
                      : 'bg-[#1b1c2e] text-slate-400 group-hover:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Active Indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-violet-500 rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* APK / Mobile App Install CTA */}
      <div className="p-2 md:p-3">
        <button
          onClick={openAPKModal}
          className="w-full flex items-center justify-center md:justify-start gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet-600/30 to-indigo-600/20 hover:from-violet-600/40 hover:to-indigo-600/30 border border-violet-500/40 text-violet-200 text-xs font-semibold transition-all group"
          title="Instalar APK en Android"
        >
          <Smartphone className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Instalar APK / App</span>
        </button>
      </div>

      {/* Streaming Server Status Indicator */}
      <div className="p-3 md:p-4 border-t border-[#1c1d2d] bg-[#0c0d16]">
        <div className="hidden md:flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-slate-300 font-mono">Engine: 11470</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Ready</span>
        </div>
        <div className="hidden md:block mt-1 text-[11px] text-slate-500 truncate">
          Cache: {settings.cacheSize} · {settings.torrentProfile}
        </div>
      </div>
    </aside>
  );
};
