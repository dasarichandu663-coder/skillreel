import React from 'react';
import { useApp } from '../context/AppContext';
import { Bookmark, Film, Play, Zap } from 'lucide-react';

export const SavedPage: React.FC = () => {
  const { reels, setCurrentReelIndex, setActiveTab } = useApp();
  const savedReels = reels.filter((r) => r.isSaved);

  return (
    <div className="flex-1 min-h-screen bg-[#090A0F] text-white p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-24 md:pb-12">
      <div className="pb-4 border-b border-[#1E2235]">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          My Library & Saved Reels
          <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
        </h1>
        <p className="text-xs text-slate-400">High-yield educational videos saved for fast reference</p>
      </div>

      {savedReels.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-[#12141F] rounded-3xl border border-[#272B40]">
          No saved reels yet. Tap the bookmark icon on any Reel to keep it in your permanent study collection!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {savedReels.map((reel, idx) => (
            <div
              key={reel.id}
              onClick={() => {
                const globalIndex = reels.findIndex((r) => r.id === reel.id);
                setCurrentReelIndex(globalIndex >= 0 ? globalIndex : 0);
                setActiveTab('home');
              }}
              className="rounded-2xl overflow-hidden aspect-[9/15] bg-[#12141F] border border-[#272B40] relative group cursor-pointer shadow-md"
            >
              <img
                src={reel.thumbnailUrl}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-3.5">
                <span className="text-[10px] font-bold text-indigo-400 uppercase">{reel.skillCategory}</span>
                <h3 className="text-xs font-bold text-white line-clamp-2">{reel.title}</h3>
                <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current" /> Watch Reel
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
