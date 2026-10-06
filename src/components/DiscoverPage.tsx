import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Sparkles,
  TrendingUp,
  UserCheck,
  Play,
  Zap,
  Bookmark,
  Filter,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Programming',
  'Artificial Intelligence',
  'Data Science',
  'Design',
  'Business',
  'Finance',
  'Career',
  'Communication',
  'Technology',
];

export const DiscoverPage: React.FC = () => {
  const { reels, posts, skills, learningPaths, setCurrentReelIndex, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter items based on query and category
  const filteredReels = reels.filter((r) => {
    const matchesCat =
      selectedCategory === 'All' ||
      r.skillCategory.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesQuery =
      searchQuery === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.skillCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hashtags.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex-1 min-h-screen bg-[#090A0F] text-white p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24 md:pb-12">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Discover Knowledge</h1>
          <p className="text-slate-400 text-sm">Explore trending skills, verified mentors, and curated pathways.</p>
        </div>

        {/* Global Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills, creators, hashtags (#Python), or careers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12141F] border border-[#272B40] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-[#12141F] border border-[#272B40] text-slate-300 hover:bg-[#1A1D2E]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: Trending Skills Row */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Trending Skills This Week
          </h2>
          <span className="text-xs text-indigo-400 font-semibold cursor-pointer hover:underline">
            View All Skills
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="p-3.5 rounded-2xl bg-[#12141F] border border-[#272B40] hover:border-indigo-500/50 transition cursor-pointer group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition">{skill.icon}</div>
              <div className="font-bold text-xs text-slate-200 line-clamp-1">{skill.name}</div>
              <div className="text-[10px] text-slate-400">{skill.completedLessons}/{skill.totalLessons} Lessons</div>
              <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                  style={{ width: `${skill.progressPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Recommended Reels Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Top Recommended Reels ({filteredReels.length})
          </h2>
        </div>

        {filteredReels.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-[#12141F] rounded-2xl border border-[#272B40]">
            No Reels found matching your search. Try adjusting filters.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {filteredReels.map((reel, idx) => (
              <div
                key={reel.id}
                onClick={() => {
                  setCurrentReelIndex(idx);
                  setActiveTab('home');
                }}
                className="relative group rounded-2xl overflow-hidden aspect-[9/15] bg-[#12141F] border border-[#272B40] cursor-pointer shadow-md"
              >
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-3">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-600/90 text-white">
                      {reel.skillCategory}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-slate-300">
                      {reel.durationSeconds}s
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white line-clamp-2 mb-1 group-hover:text-indigo-300 transition">
                      {reel.title}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <img
                        src={reel.creator.avatar}
                        alt={reel.creator.name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="text-[10px] text-slate-300 truncate">
                        @{reel.creator.username}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 3: Featured Learning Pathways */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            Curated Career Roadmaps
          </h2>
          <span
            onClick={() => setActiveTab('learn')}
            className="text-xs text-indigo-400 font-semibold cursor-pointer hover:underline"
          >
            Explore Paths ➔
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {learningPaths.map((path) => (
            <div
              key={path.id}
              onClick={() => setActiveTab('learn')}
              className="rounded-2xl bg-[#12141F] border border-[#272B40] overflow-hidden hover:border-indigo-500/50 transition cursor-pointer group flex flex-col justify-between"
            >
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{path.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-indigo-400 transition">
                      {path.title}
                    </h3>
                    <p className="text-[11px] text-slate-400">{path.estimatedHours} hrs • {path.difficulty}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {path.description}
                </p>
              </div>

              <div className="p-4 bg-[#161928] border-t border-[#272B40]/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">{path.enrolledUsersCount.toLocaleString()} learners</span>
                <span className="text-indigo-400 font-bold group-hover:translate-x-1 transition">
                  Start Roadmap ➔
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
