import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Zap,
  Flame,
  Award,
  BookOpen,
  Film,
  FileText,
  Bookmark,
  Edit3,
  Settings,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, reels, posts, skills, achievements, setActiveTab } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'reels' | 'posts' | 'skills' | 'achievements'>('skills');

  const myReels = reels.filter((r) => r.creator.id === user.id || r.creator.username === user.username);
  const myPosts = posts.filter((p) => p.author.id === user.id || p.author.username === user.username);

  return (
    <div className="flex-1 min-h-screen bg-[#090A0F] text-white p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* Profile Header Card */}
      <div className="bg-[#12141F] border border-[#272B40] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover border-2 border-indigo-500 shadow-xl"
              />
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-[10px] font-black uppercase text-white shadow-md">
                Lvl {user.level}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold text-white">{user.name}</h1>
                <span className="text-xs text-indigo-400 font-bold">@{user.username}</span>
              </div>
              <p className="text-xs text-slate-300 max-w-md leading-relaxed">{user.bio}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span>
                  <strong className="text-white">{user.followersCount}</strong> Followers
                </span>
                <span>
                  <strong className="text-white">{user.followingCount}</strong> Following
                </span>
                <span className="text-indigo-400 font-semibold">• Goal: {user.careerGoal}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('settings')}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-[#1A1D2E] hover:bg-[#252940] border border-[#272B40] text-xs font-bold text-slate-300 transition flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>Edit Settings</span>
            </button>
          </div>
        </div>

        {/* Gamified Skill & Streak Metric Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#272B40]">
          <div className="p-3 rounded-2xl bg-[#1A1D2E]/60 border border-[#272B40] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="text-sm font-black text-white">{user.xp}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total XP</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#1A1D2E]/60 border border-[#272B40] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5 fill-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-black text-white">{user.streakDays} Days</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Learning Streak</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#1A1D2E]/60 border border-[#272B40] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white">{skills.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Tracked Skills</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#1A1D2E]/60 border border-[#272B40] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white">
                {achievements.filter((a) => a.isUnlocked).length} / {achievements.length}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Badges Earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#272B40] space-x-6">
        {[
          { id: 'skills', label: 'My Skills & Mastery', icon: Sparkles },
          { id: 'reels', label: 'Uploaded Reels', icon: Film },
          { id: 'posts', label: 'Discussions & Posts', icon: FileText },
          { id: 'achievements', label: 'Badges', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`pb-3 text-xs md:text-sm font-bold flex items-center gap-2 transition border-b-2 ${
                isActive
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: SKILLS & MASTERY */}
      {activeSubTab === 'skills' && (
        <div className="grid md:grid-cols-2 gap-4">
          {skills.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-[#12141F] border border-[#272B40] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm text-white">{s.name}</h3>
                    <span className="text-[10px] text-slate-400">{s.category} • Level: {s.level}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-indigo-400">{s.progressPercentage}%</span>
              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                  style={{ width: `${s.progressPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{s.completedLessons} of {s.totalLessons} lessons mastered</span>
                <span className="text-amber-400 font-bold">+{s.xpEarned} XP</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#1A1D2E] text-[11px] text-slate-300 flex items-center justify-between">
                <span className="truncate">Next: {s.nextLessonTitle}</span>
                <span className="text-indigo-400 font-bold whitespace-nowrap ml-2 cursor-pointer hover:underline">
                  Continue ➔
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: REELS */}
      {activeSubTab === 'reels' && (
        <div>
          {myReels.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-[#12141F] rounded-2xl border border-[#272B40]">
              No uploaded Reels yet. Tap "Create Content" to publish your first 30-second skill video!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {myReels.map((reel) => (
                <div
                  key={reel.id}
                  className="rounded-2xl overflow-hidden aspect-[9/15] bg-[#12141F] border border-[#272B40] relative"
                >
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                    <span className="text-xs font-bold text-white line-clamp-1">{reel.title}</span>
                    <span className="text-[10px] text-slate-400">{reel.viewsCount} views</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: POSTS */}
      {activeSubTab === 'posts' && (
        <div className="space-y-3">
          {myPosts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-[#12141F] rounded-2xl border border-[#272B40]">
              No posts published yet. Share a tip or question with the community.
            </div>
          ) : (
            myPosts.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-[#12141F] border border-[#272B40] space-y-2 text-xs"
              >
                <div className="flex justify-between items-center text-slate-400">
                  <span className="font-bold text-indigo-400">{p.category}</span>
                  <span>{p.createdAt}</span>
                </div>
                <p className="text-slate-200 whitespace-pre-line">{p.content}</p>
                <div className="text-[11px] text-slate-400 flex gap-4 pt-2">
                  <span>{p.likesCount} Likes</span>
                  <span>{p.commentsCount} Comments</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: ACHIEVEMENTS */}
      {activeSubTab === 'achievements' && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`p-4 rounded-2xl border flex items-center gap-3 ${
                a.isUnlocked
                  ? 'bg-[#12141F] border-amber-500/20'
                  : 'bg-[#0f111a] border-slate-800 opacity-50'
              }`}
            >
              <span className="text-2xl">{a.icon}</span>
              <div>
                <h4 className="font-bold text-xs text-white">{a.title}</h4>
                <p className="text-[10px] text-slate-400">{a.description}</p>
                <span className="text-[10px] font-bold text-amber-400">+{a.xpAwarded} XP</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
