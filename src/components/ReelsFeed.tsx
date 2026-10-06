import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
} from 'lucide-react';
import { Reel } from '../types';

export const ReelsFeed: React.FC = () => {
  const {
    reels,
    currentReelIndex,
    setCurrentReelIndex,
    toggleLikeReel,
    toggleSaveReel,
    toggleFollowCreator,
    submitChallengeAnswer,
    completedChallengeIds,
    user,
    setActiveTab,
  } = useApp();

  const [feedMode, setFeedMode] = useState<'forYou' | 'following' | 'learning'>('forYou');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showChallengeModal, setShowChallengeModal] = useState<boolean>(false);
  const [challengeSelectedOption, setChallengeSelectedOption] = useState<number | null>(null);
  const [challengeResult, setChallengeResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showCommentsModal, setShowCommentsModal] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Filter reels based on top tab
  const filteredReels = reels.filter((r) => {
    if (feedMode === 'following') return r.isFollowingCreator;
    if (feedMode === 'learning') return user.selectedInterests.includes(r.skillCategory);
    return true; // For You
  });

  const activeReel: Reel = filteredReels[currentReelIndex] || filteredReels[0] || reels[0];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Auto-play policy browser mitigation
          setIsPlaying(false);
        });
      }
    }
    // Reset challenge state on reel change
    setShowChallengeModal(false);
    setChallengeSelectedOption(null);
    setChallengeResult(null);
  }, [currentReelIndex, activeReel?.id]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handleNext = () => {
    if (currentReelIndex < filteredReels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
  };

  const handleChallengeOptionClick = (index: number) => {
    if (challengeSelectedOption !== null || !activeReel.challenge) return;
    setChallengeSelectedOption(index);
    const isCorrect = submitChallengeAnswer(
      activeReel.challenge.id,
      index,
      activeReel.challenge.correctOptionIndex,
      activeReel.challenge.xpReward
    );
    setChallengeResult(isCorrect ? 'correct' : 'incorrect');
  };

  if (!activeReel) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        No Reels available in this category yet.
      </div>
    );
  }

  const isChallengeDone = activeReel.challenge && completedChallengeIds.has(activeReel.challenge.id);

  return (
    <div className="relative w-full h-[calc(100vh-60px)] md:h-screen flex items-center justify-center bg-[#090A0F] overflow-hidden select-none">
      {/* ================= REEL CONTAINER (PHONE ASPECT ON DESKTOP) ================= */}
      <div className="relative w-full h-full md:max-w-[420px] lg:max-w-[450px] md:h-[94vh] md:rounded-3xl overflow-hidden bg-black shadow-2xl border border-[#1E2235]">
        
        {/* TOP FEED SELECTOR BAR */}
        <div className="absolute top-0 left-0 right-0 z-30 pt-4 pb-12 px-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-auto">
          {/* Brand mark on mobile */}
          <div className="md:hidden flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
          </div>

          {/* Feed Switcher Tabs */}
          <div className="flex items-center gap-5 text-sm font-bold">
            <button
              onClick={() => { setFeedMode('following'); setCurrentReelIndex(0); }}
              className={`transition relative ${
                feedMode === 'following'
                  ? 'text-white scale-105'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              Following
              {feedMode === 'following' && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => { setFeedMode('forYou'); setCurrentReelIndex(0); }}
              className={`transition relative ${
                feedMode === 'forYou'
                  ? 'text-white scale-105'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              For You
              {feedMode === 'forYou' && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => { setFeedMode('learning'); setCurrentReelIndex(0); }}
              className={`transition relative flex items-center gap-1 ${
                feedMode === 'learning'
                  ? 'text-cyan-400 scale-105'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Learning
              {feedMode === 'learning' && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
          </div>

          {/* Audio toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 hover:bg-black/60 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* ================= BACKGROUND VIDEO / PLAYER ================= */}
        <div
          onClick={togglePlay}
          className="relative w-full h-full cursor-pointer flex items-center justify-center"
        >
          <video
            ref={videoRef}
            src={activeReel.videoUrl}
            poster={activeReel.thumbnailUrl}
            playsInline
            loop
            muted={isMuted}
            autoPlay
            className="w-full h-full object-cover"
          />

          {/* Play/Pause center overlay icon if paused */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white animate-scale">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT-SIDE FLOATING ACTION BAR ================= */}
        <div className="absolute right-3 bottom-24 md:bottom-20 z-30 flex flex-col items-center gap-4 text-white">
          {/* Creator Avatar & Quick Follow badge */}
          <div className="relative mb-2">
            <img
              src={activeReel.creator.avatar}
              alt={activeReel.creator.name}
              className="w-11 h-11 rounded-full border-2 border-indigo-500 object-cover shadow-lg"
            />
            <button
              onClick={() => toggleFollowCreator(activeReel.creator.id)}
              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition ${
                activeReel.isFollowingCreator
                  ? 'bg-emerald-500 text-white'
                  : 'bg-indigo-600 text-white hover:scale-110'
              }`}
            >
              {activeReel.isFollowingCreator ? '✓' : '+'}
            </button>
          </div>

          {/* Like Button */}
          <button
            onClick={() => toggleLikeReel(activeReel.id)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition ${
                activeReel.isLiked
                  ? 'bg-rose-500/30 border-rose-500 text-rose-500'
                  : 'bg-black/40 border-white/10 text-white group-hover:bg-black/60'
              }`}
            >
              <Heart
                className={`w-5 h-5 transition ${
                  activeReel.isLiked ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </div>
            <span className="text-[11px] font-bold">
              {activeReel.likesCount > 1000
                ? `${(activeReel.likesCount / 1000).toFixed(1)}k`
                : activeReel.likesCount}
            </span>
          </button>

          {/* Comments Button */}
          <button
            onClick={() => setShowCommentsModal(true)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition"
          >
            <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-black/60 transition">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold">{activeReel.commentsCount}</span>
          </button>

          {/* Bookmark / Save Button */}
          <button
            onClick={() => toggleSaveReel(activeReel.id)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition ${
                activeReel.isSaved
                  ? 'bg-amber-500/30 border-amber-500 text-amber-400'
                  : 'bg-black/40 border-white/10 text-white group-hover:bg-black/60'
              }`}
            >
              <Bookmark
                className={`w-5 h-5 transition ${
                  activeReel.isSaved ? 'fill-amber-400 text-amber-400' : ''
                }`}
              />
            </div>
            <span className="text-[11px] font-bold">
              {activeReel.savesCount > 1000
                ? `${(activeReel.savesCount / 1000).toFixed(1)}k`
                : activeReel.savesCount}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: activeReel.title,
                  text: `Learn on SkillReel: ${activeReel.title}`,
                  url: window.location.href,
                }).catch(() => {});
              }
            }}
            className="flex flex-col items-center gap-1 group active:scale-90 transition"
          >
            <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-black/60 transition">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold">Share</span>
          </button>
        </div>

        {/* ================= BOTTOM METADATA & EDUCATIONAL CHALLENGE ================= */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 pb-6 md:pb-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
          {/* Skill Tag & Difficulty badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600/90 text-white backdrop-blur-md">
              {activeReel.skillCategory}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/15 text-white/90 backdrop-blur-md border border-white/10">
              {activeReel.difficulty}
            </span>
            {activeReel.recommendedScore && (
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                <Sparkles className="w-3 h-3" /> {activeReel.recommendedScore}% match
              </span>
            )}
          </div>

          {/* Creator name and handle */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm text-white hover:underline cursor-pointer">
              @{activeReel.creator.username}
            </span>
            {activeReel.creator.creatorTitle && (
              <span className="text-[11px] text-slate-300 truncate max-w-[200px]">
                • {activeReel.creator.creatorTitle}
              </span>
            )}
          </div>

          {/* Reel Title & Description */}
          <h3 className="font-bold text-sm text-white mb-1 line-clamp-1">
            {activeReel.title}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-2 mb-2 leading-relaxed">
            {activeReel.description}
          </p>

          {/* Hashtags */}
          <div className="flex gap-1.5 flex-wrap mb-3 text-[11px] font-medium text-indigo-300">
            {activeReel.hashtags.map((tag) => (
              <span key={tag} className="hover:underline cursor-pointer">
                {tag}
              </span>
            ))}
          </div>

          {/* ⚡ TRY CHALLENGE BUTTON (CORE PRODUCT DIFFERENTIATOR) */}
          {activeReel.challenge && (
            <button
              onClick={() => setShowChallengeModal(true)}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-between shadow-lg transition active:scale-98 ${
                isChallengeDone
                  ? 'bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-indigo-600 text-black hover:opacity-95 shadow-amber-500/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 fill-current" />
                <span>
                  {isChallengeDone ? 'CHALLENGE COMPLETED' : '⚡ TEST YOUR KNOWLEDGE (CHALLENGE)'}
                </span>
              </div>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-black/20 text-white">
                +{activeReel.challenge.xpReward} XP
              </span>
            </button>
          )}
        </div>

        {/* ================= DESKTOP UP/DOWN FEED NAVIGATION KEYS ================= */}
        <div className="hidden lg:flex flex-col gap-2 absolute -right-16 top-1/2 -translate-y-1/2 z-40">
          <button
            onClick={handlePrev}
            disabled={currentReelIndex === 0}
            className="w-11 h-11 rounded-full bg-[#12141F] border border-[#272B40] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1A1D2E] disabled:opacity-30 transition shadow-lg"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentReelIndex === filteredReels.length - 1}
            className="w-11 h-11 rounded-full bg-[#12141F] border border-[#272B40] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1A1D2E] disabled:opacity-30 transition shadow-lg"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* ================= MODAL: MICRO-CHALLENGE / QUIZ ================= */}
        {showChallengeModal && activeReel.challenge && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md p-6 flex flex-col justify-center animate-fadeIn text-white">
            <div className="space-y-4 max-w-sm mx-auto w-full">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Zap className="w-4 h-4 fill-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Micro-Challenge</h4>
                    <p className="text-[10px] text-slate-400">{activeReel.skillCategory} • +{activeReel.challenge.xpReward} XP</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChallengeModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Question Text */}
              <div className="bg-[#12141F] p-4 rounded-2xl border border-[#272B40]">
                <p className="text-sm font-semibold leading-relaxed">
                  {activeReel.challenge.question}
                </p>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2">
                {activeReel.challenge.options.map((option, idx) => {
                  const isSelected = challengeSelectedOption === idx;
                  const isCorrect = idx === activeReel.challenge!.correctOptionIndex;

                  let btnStyle = 'bg-[#12141F] border-[#272B40] text-slate-200 hover:border-slate-600';
                  if (challengeSelectedOption !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={challengeSelectedOption !== null}
                      onClick={() => handleChallengeOptionClick(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {challengeSelectedOption !== null && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                      {challengeSelectedOption !== null && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Alert */}
              {challengeResult && (
                <div
                  className={`p-3.5 rounded-xl text-xs space-y-1 animate-scale ${
                    challengeResult === 'correct'
                      ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/70 border border-rose-500/50 text-rose-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {challengeResult === 'correct' ? '🎉 Excellent! +10 XP' : '💡 Review & Retry'}
                  </div>
                  <p className="text-[11px] opacity-90 leading-relaxed">
                    {activeReel.challenge.explanation}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setShowChallengeModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition"
                >
                  Close & Continue
                </button>
                {challengeResult === 'correct' && (
                  <button
                    onClick={() => {
                      setShowChallengeModal(false);
                      handleNext();
                    }}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
                  >
                    Next Reel ➔
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= MODAL: COMMENTS SHEET ================= */}
        {showCommentsModal && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fadeIn">
            <div className="bg-[#12141F] rounded-t-3xl border-t border-[#272B40] max-h-[75%] flex flex-col p-4 text-white">
              <div className="flex items-center justify-between pb-3 border-b border-[#272B40]">
                <h4 className="font-bold text-sm">Comments ({activeReel.commentsCount})</h4>
                <button
                  onClick={() => setShowCommentsModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Sample Comments list */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
                <div className="flex gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="user"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-slate-300">David Chen</div>
                    <p className="text-slate-400">Great explanation! Really helped solidify how loops tie into iterator protocol.</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="user"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-slate-300">Alex Rivera (You)</div>
                    <p className="text-slate-400">Passed the challenge in 1 try! +10 XP earned.</p>
                  </div>
                </div>
              </div>

              {/* Add Comment input */}
              <div className="pt-2 flex gap-2 border-t border-[#272B40]">
                <input
                  type="text"
                  placeholder="Share a thought or learning question..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-[#1A1D2E] border border-[#272B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  disabled={!newComment.trim()}
                  onClick={() => setNewComment('')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-bold rounded-xl"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
