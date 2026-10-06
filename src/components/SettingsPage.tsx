import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Shield,
  Bell,
  Moon,
  Sparkles,
  CreditCard,
  LogOut,
  HelpCircle,
  Save,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useApp();
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [careerGoal, setCareerGoal] = useState(user.careerGoal);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user.dailyGoalMinutes);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      username,
      bio,
      careerGoal,
      dailyGoalMinutes,
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#090A0F] text-white p-4 md:p-8 max-w-3xl mx-auto space-y-6 pb-24 md:pb-12">
      <div className="pb-4 border-b border-[#1E2235]">
        <h1 className="text-xl md:text-2xl font-bold">Account & Learning Settings</h1>
        <p className="text-xs text-slate-400">Configure personal goals, privacy, and notifications</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Details */}
        <div className="p-5 rounded-3xl bg-[#12141F] border border-[#272B40] space-y-4">
          <h2 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
            <User className="w-4 h-4" /> Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1A1D2E] border border-[#272B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#1A1D2E] border border-[#272B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#1A1D2E] border border-[#272B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="p-5 rounded-3xl bg-[#12141F] border border-[#272B40] space-y-4">
          <h2 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Learning & Career Alignment
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Career Ambition</label>
              <input
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full bg-[#1A1D2E] border border-[#272B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Daily Study Target</label>
              <select
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                className="w-full bg-[#1A1D2E] border border-[#272B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={5}>5 minutes / day</option>
                <option value={15}>15 minutes / day</option>
                <option value={30}>30 minutes / day</option>
                <option value={60}>60+ minutes / day</option>
              </select>
            </div>
          </div>
        </div>

        {/* Monetization / Subscription Tier Placeholder */}
        <div className="p-5 rounded-3xl bg-[#12141F] border border-[#272B40] flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">SkillReel Membership</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold">
                Plus Free Tier
              </span>
            </div>
            <p className="text-xs text-slate-400">Unlock unlimited AI Coach tokens, verified capstones and certifications.</p>
          </div>
          <button
            type="button"
            onClick={() => alert('SkillReel Plus upgrade module ready for Stripe integration!')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/20"
          >
            Upgrade Plan
          </button>
        </div>

        {/* Save feedback button */}
        <div className="flex items-center justify-between pt-2">
          {isSavedNotice && (
            <span className="text-xs font-bold text-emerald-400 animate-fadeIn">
              ✓ Preferences saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
