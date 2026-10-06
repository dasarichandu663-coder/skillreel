import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCircle,
  Zap,
  BookOpen,
  UserCheck,
  Heart,
  MessageCircle,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, clearAllNotifications } = useApp();

  return (
    <div className="flex-1 min-h-screen bg-[#090A0F] text-white p-4 md:p-8 max-w-3xl mx-auto space-y-6 pb-24 md:pb-12">
      <div className="flex items-center justify-between pb-4 border-b border-[#1E2235]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            Notifications
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold">
              {notifications.filter((n) => !n.isRead).length} new
            </span>
          </h1>
          <p className="text-xs text-slate-400">Updates on challenges, peers, and learning progress</p>
        </div>

        <button
          onClick={clearAllNotifications}
          className="text-xs text-indigo-400 hover:underline font-semibold"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => {
          return (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition ${
                notif.isRead
                  ? 'bg-[#12141F] border-[#272B40] text-slate-300'
                  : 'bg-[#161928] border-indigo-500/40 text-white shadow-md'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                {notif.type === 'challenge_xp' && <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />}
                {notif.type === 'path_progress' && <BookOpen className="w-5 h-5 text-cyan-400" />}
                {notif.type === 'follower' && <UserCheck className="w-5 h-5 text-emerald-400" />}
                {notif.type === 'like' && <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />}
                {notif.type === 'learning_reminder' && <Bell className="w-5 h-5 text-amber-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-xs text-white">{notif.title}</h3>
                  <span className="text-[10px] text-slate-500">{notif.createdAt}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                {notif.xpGain && (
                  <span className="inline-block mt-1 text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    +{notif.xpGain} XP Added
                  </span>
                )}
              </div>

              {!notif.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 self-center" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
