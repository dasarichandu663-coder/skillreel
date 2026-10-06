import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Trophy,
  Zap,
  Flame,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const ChallengesPage: React.FC = () => {
  const { achievements, reels, user, submitChallengeAnswer, completedChallengeIds } = useApp();
  const [activeCategory, setActiveCategory] = useState<'all' | 'unlocked' | 'locked'>('all');

  const filteredAchievements = achievements.filter((ach) => {
    if (activeCategory === 'unlocked') return ach.isUnlocked;
    if (activeCategory === 'locked') return !ach.isUnlocked;
    return true;
  });

  return (
    <div className="flex-1 min-h-screen bg-[#090A0F] text-white p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24 md:pb-12">
      {/* Gamification Level & Streak Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#12141F] to-indigo-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center font-black text-2xl shadow-xl shadow-amber-500/20">
            Lvl {user.level}
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              XP & Achievements Hub
              <Trophy className="w-5 h-5 text-amber-400" />
            </h1>
            <p className="text-slate-400 text-xs">
              Every completed challenge builds genuine real-world competency.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Learning XP</div>
            <div className="text-xl font-black text-amber-400 flex items-center gap-1 justify-end">
              <Zap className="w-5 h-5 fill-amber-400" />
              {user.xp}
            </div>
          </div>
          <div className="w-[1px] h-10 bg-slate-800" />
          <div className="text-right">
            <div className="text-xs text-slate-400">Unbroken Streak</div>
            <div className="text-xl font-black text-emerald-400 flex items-center gap-1 justify-end">
              <Flame className="w-5 h-5 fill-emerald-400" />
              {user.streakDays} Days
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Quick Reel Micro-Challenges Catalog */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            Active Micro-Challenges ({reels.filter((r) => r.challenge).length})
          </h2>
          <span className="text-xs text-slate-400">
            {completedChallengeIds.size} Solved
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-3.5">
          {reels
            .filter((r) => r.challenge)
            .map((r) => {
              const ch = r.challenge!;
              const isCompleted = completedChallengeIds.has(ch.id);
              return (
                <div
                  key={ch.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition ${
                    isCompleted
                      ? 'bg-[#12141F] border-emerald-500/30'
                      : 'bg-[#161928] border-[#272B40] hover:border-indigo-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                          {ch.skillTag}
                        </span>
                        <span className="text-[10px] text-slate-400">{ch.difficulty}</span>
                      </div>
                      <h3 className="font-bold text-xs md:text-sm text-slate-200 leading-snug">
                        {ch.question}
                      </h3>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-amber-400">+{ch.xpReward} XP</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#272B40]/60">
                    <span className="text-[11px] text-slate-400">Reel: {r.title}</span>
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        isCompleted ? 'text-emerald-400' : 'text-indigo-400'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Solved
                        </>
                      ) : (
                        'Test in Reels Feed ➔'
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* SECTION: Achievements Badges Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Badges & Milestones
          </h2>

          <div className="flex gap-1 bg-[#12141F] p-1 rounded-xl border border-[#272B40] text-xs">
            {(['all', 'unlocked', 'locked'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveCategory(filter)}
                className={`px-3 py-1 rounded-lg capitalize transition ${
                  activeCategory === filter
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredAchievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border flex items-center gap-3.5 transition ${
                ach.isUnlocked
                  ? 'bg-[#12141F] border-amber-500/20 shadow-md'
                  : 'bg-[#0f111a] border-slate-800/80 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  ach.isUnlocked
                    ? 'bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {ach.isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-slate-500" />}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-white truncate">{ach.title}</h3>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                  {ach.description}
                </p>
                <div className="mt-1 text-[10px] font-bold text-amber-400">
                  +{ach.xpAwarded} XP
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
