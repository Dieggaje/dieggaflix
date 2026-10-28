import React from 'react';
import { StremioProvider, useStremio } from './context/StremioContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DiscoverView } from './components/DiscoverView';
import { LibraryView } from './components/LibraryView';
import { AddonsView } from './components/AddonsView';
import { SettingsView } from './components/SettingsView';
import { MediaDetailModal } from './components/MediaDetailModal';
import { StremioPlayer } from './components/StremioPlayer';
import { APKInstallModal } from './components/APKInstallModal';

const MainContent: React.FC = () => {
  const { activeTab, selectedMedia, closeMedia, activePlayer, isAPKModalOpen, closeAPKModal } = useStremio();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0c0d14] text-[#e2e8f0]">
      {/* Stremio Left Navigation Sidebar */}
      <Sidebar />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header */}
        <Header />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pt-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'discover' && <DiscoverView />}
            {activeTab === 'library' && <LibraryView />}
            {activeTab === 'addons' && <AddonsView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Cinemeta Media Detail Modal */}
      {selectedMedia && (
        <MediaDetailModal media={selectedMedia} onClose={closeMedia} />
      )}

      {/* Stremio In-App Cinematic Video Player */}
      {activePlayer && <StremioPlayer />}

      {/* APK & Android Installation Modal */}
      <APKInstallModal isOpen={isAPKModalOpen} onClose={closeAPKModal} />
    </div>
  );
};

export default function App() {
  return (
    <StremioProvider>
      <MainContent />
    </StremioProvider>
  );
}
