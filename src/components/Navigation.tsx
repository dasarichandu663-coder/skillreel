import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Compass,
  PlusSquare,
  BookOpen,
  User,
  MessageSquare,
  Bell,
  Sparkles,
  Trophy,
  Bookmark,
  Settings,
  Flame,
  Zap,
  Video,
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setShowCreateModal,
    notifications,
    chats,
    user,
    startCall,
  } = useApp();

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const unreadMessages = chats.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <>
      {/* ================= DESKTOP LEFT SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 bg-[#090A0F] border-r border-[#1E2235] px-4 py-6 z-40 select-none justify-between">
        <div className="space-y-6">
          {/* Brand Logo & Tagline */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 px-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/25 group-hover:scale-105 transition">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                SkillReel
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-semibold uppercase tracking-wider">
                  Pro
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Scroll. Learn. Grow.</div>
            </div>
          </div>

          {/* User XP & Streak Widget in Sidebar */}
          <div className="mx-2 p-3.5 rounded-2xl bg-[#12141F] border border-[#272B40] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{user.streakDays} Day Streak</div>
                <div className="text-[10px] text-slate-400">{user.dailyGoalMinutes}m daily goal</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-amber-400 flex items-center gap-1">
                <Zap className="w-3 h-3 fill-amber-400" />
                {user.xp} XP
              </div>
              <div className="text-[10px] text-slate-400">Level {user.level}</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'home', label: 'Home (Reels)', icon: Home },
              { id: 'discover', label: 'Discover & Search', icon: Compass },
              { id: 'learn', label: 'Learn & Paths', icon: BookOpen },
              { id: 'coach', label: 'AI Learning Coach', icon: Sparkles, badge: 'AI' },
              { id: 'challenges', label: 'Challenges & XP', icon: Trophy },
              {
                id: 'messages',
                label: 'Messages',
                icon: MessageSquare,
                count: unreadMessages,
              },
              {
                id: 'notifications',
                label: 'Notifications',
                icon: Bell,
                count: unreadNotifs,
              },
              { id: 'saved', label: 'My Library / Saved', icon: Bookmark },
              { id: 'profile', label: 'Profile & Skills', icon: User },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition group ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#12141F]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition ${
                        isActive
                          ? 'text-indigo-400'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.badge}
                    </span>
                  )}
                  {Boolean(item.count && item.count > 0) && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Create Reel / Start Study Call */}
        <div className="space-y-2 pt-4 border-t border-[#1E2235]">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 group"
          >
            <PlusSquare className="w-4 h-4 group-hover:scale-110 transition" />
            <span>Create Content</span>
          </button>

          <button
            onClick={() => startCall(true)}
            className="w-full py-2.5 rounded-2xl bg-[#12141F] hover:bg-[#1A1D2E] border border-[#272B40] text-xs font-semibold text-slate-300 transition flex items-center justify-center gap-2"
          >
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <span>Start Study Call</span>
          </button>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090A0F]/95 backdrop-blur-xl border-t border-[#1E2235] px-4 py-2 flex items-center justify-between">
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'discover', label: 'Discover', icon: Compass },
          { id: 'create', label: 'Create', icon: PlusSquare, isCreate: true },
          { id: 'learn', label: 'Learn', icon: BookOpen },
          { id: 'profile', label: 'Profile', icon: User },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isCreate) {
            return (
              <button
                key={item.id}
                onClick={() => setShowCreateModal(true)}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 active:scale-95 transition">
                  <PlusSquare className="w-6 h-6" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
