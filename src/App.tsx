import React from 'react';
import { useApp } from './context/AppContext';
import { Onboarding } from './components/Onboarding';
import { Navigation } from './components/Navigation';
import { ReelsFeed } from './components/ReelsFeed';
import { DiscoverPage } from './components/DiscoverPage';
import { LearnPage } from './components/LearnPage';
import { AICoachPage } from './components/AICoachPage';
import { ChallengesPage } from './components/ChallengesPage';
import { MessagesPage } from './components/MessagesPage';
import { ProfilePage } from './components/ProfilePage';
import { NotificationsPage } from './components/NotificationsPage';
import { SavedPage } from './components/SavedPage';
import { SettingsPage } from './components/SettingsPage';
import { CreateModal } from './components/CreateModal';
import { StudyVideoCallModal } from './components/StudyVideoCallModal';

export const AppContent: React.FC = () => {
  const { isOnboarded, activeTab } = useApp();

  if (!isOnboarded) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-indigo-500 selection:text-white">
      {/* Navigation (Sidebar on Desktop, Bottom Bar on Mobile) */}
      <Navigation />

      {/* Main Dynamic View Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {activeTab === 'home' && <ReelsFeed />}
        {activeTab === 'discover' && <DiscoverPage />}
        {activeTab === 'learn' && <LearnPage />}
        {activeTab === 'coach' && <AICoachPage />}
        {activeTab === 'challenges' && <ChallengesPage />}
        {activeTab === 'messages' && <MessagesPage />}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'notifications' && <NotificationsPage />}
        {activeTab === 'saved' && <SavedPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>

      {/* Universal Floating Modals */}
      <CreateModal />
      <StudyVideoCallModal />
    </div>
  );
};
