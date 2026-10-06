import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { aiService, AIReelAssistance } from '../services/aiService';
import {
  Film,
  FileText,
  HelpCircle,
  Radio,
  Sparkles,
  Upload,
  X,
  Zap,
  CheckCircle,
} from 'lucide-react';

export const CreateModal: React.FC = () => {
  const { showCreateModal, setShowCreateModal, addNewReel, addNewPost, user } = useApp();
  const [activeTab, setActiveTab] = useState<'reel' | 'post' | 'story' | 'live'>('reel');

  // Reel Form States
  const [reelTitle, setReelTitle] = useState('');
  const [reelDescription, setReelDescription] = useState('');
  const [skillCategory, setSkillCategory] = useState('Python');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [hashtags, setHashtags] = useState('#Python #LearnCode #SkillReel');
  const [hasQuiz, setHasQuiz] = useState(true);
  const [quizQuestion, setQuizQuestion] = useState('What does range(5) yield in Python?');
  const [quizOptions, setQuizOptions] = useState('0 to 4, 1 to 5, 0 to 5, None');
  const [correctOptionIdx, setCorrectOptionIdx] = useState(0);

  // AI Assistant State
  const [aiTopicInput, setAiTopicInput] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Post Form States
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<'Educational' | 'Career' | 'Discussion' | 'Project' | 'General'>('Educational');

  if (!showCreateModal) return null;

  const handleAiAssistance = async () => {
    if (!aiTopicInput.trim() && !reelTitle.trim()) return;
    setIsAiGenerating(true);
    try {
      const topic = aiTopicInput || reelTitle;
      const res: AIReelAssistance = await aiService.generateReelAssistance(topic);
      setReelTitle(res.title);
      setReelDescription(res.caption);
      setSkillCategory(res.detectedSkill);
      setDifficulty(res.detectedDifficulty);
      setHashtags(res.hashtags.join(' '));
      setHasQuiz(true);
      setQuizQuestion(res.generatedChallenge.question);
      setQuizOptions(res.generatedChallenge.options.join(', '));
      setCorrectOptionIdx(res.generatedChallenge.correctOptionIndex);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSubmitReel = (e: React.FormEvent) => {
    e.preventDefault();
    const opts = quizOptions.split(',').map((o) => o.trim());

    addNewReel({
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41551-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      title: reelTitle || 'Fast Coding Tip',
      description: reelDescription || 'Learn in 30 seconds!',
      creator: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        isCreator: true,
        creatorTitle: user.careerGoal,
      },
      skillCategory,
      difficulty,
      hashtags: hashtags.split(' ').filter(Boolean),
      durationSeconds: 30,
      challenge: hasQuiz
        ? {
            id: `ch_new_${Date.now()}`,
            question: quizQuestion,
            options: opts.length > 0 ? opts : ['Option A', 'Option B', 'Option C'],
            correctOptionIndex: correctOptionIdx,
            explanation: 'Verified micro-quiz answer provided by creator.',
            xpReward: 15,
            skillTag: skillCategory,
            difficulty,
          }
        : undefined,
    });

    setShowCreateModal(false);
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    addNewPost({
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      },
      type: 'text',
      category: postCategory,
      content: postContent,
      skillTag: skillCategory,
    });

    setShowCreateModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 text-white animate-fadeIn">
      <div className="bg-[#12141F] border border-[#272B40] rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-[#272B40] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base">Creator Studio • Studio Hub</span>
          </div>
          <button
            onClick={() => setShowCreateModal(false)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Create Mode Switcher */}
        <div className="flex border-b border-[#272B40] bg-[#0d0f17]">
          {[
            { id: 'reel', label: 'Create Reel', icon: Film },
            { id: 'post', label: 'Community Post', icon: FileText },
            { id: 'live', label: 'Go Live / Study', icon: Radio },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition border-b-2 ${
                  isActive
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'reel' && (
            <form onSubmit={handleSubmitReel} className="space-y-4">
              {/* AI Assistance Box */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-cyan-900/40 border border-indigo-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    AI Creator Co-Pilot
                  </div>
                  <span className="text-[10px] text-slate-400">Auto-generate title, hashtags & challenge quiz</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter topic (e.g. 'Python variables', 'Docker networking')..."
                    value={aiTopicInput}
                    onChange={(e) => setAiTopicInput(e.target.value)}
                    className="flex-1 bg-[#12141F] border border-[#272B40] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    disabled={isAiGenerating}
                    onClick={handleAiAssistance}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-600/30"
                  >
                    {isAiGenerating ? 'Synthesizing...' : 'Generate ⚡'}
                  </button>
                </div>
              </div>

              {/* Title & Caption */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Reel Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Python Variables in 30 Seconds"
                    value={reelTitle}
                    onChange={(e) => setReelTitle(e.target.value)}
                    required
                    className="w-full bg-[#1A1D2E] border border-[#272B40] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Description & Key Takeaways</label>
                  <textarea
                    rows={2}
                    placeholder="Explain what the learner will discover..."
                    value={reelDescription}
                    onChange={(e) => setReelDescription(e.target.value)}
                    className="w-full bg-[#1A1D2E] border border-[#272B40] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Skill Category</label>
                    <select
                      value={skillCategory}
                      onChange={(e) => setSkillCategory(e.target.value)}
                      className="w-full bg-[#1A1D2E] border border-[#272B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Python">Python</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Coding">Coding / Web Dev</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Career">Career & Hiring</option>
                      <option value="Design">UI/UX Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full bg-[#1A1D2E] border border-[#272B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Micro Challenge / Quiz Setup */}
                <div className="p-3 rounded-2xl bg-[#161928] border border-[#272B40] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-amber-400" />
                      Attach Micro-Challenge Quiz (+15 XP for viewers)
                    </span>
                    <input
                      type="checkbox"
                      checked={hasQuiz}
                      onChange={(e) => setHasQuiz(e.target.checked)}
                      className="accent-indigo-600 rounded"
                    />
                  </div>

                  {hasQuiz && (
                    <div className="space-y-2 pt-1 text-xs">
                      <input
                        type="text"
                        placeholder="Quiz Question..."
                        value={quizQuestion}
                        onChange={(e) => setQuizQuestion(e.target.value)}
                        className="w-full bg-[#12141F] border border-[#272B40] rounded-lg px-3 py-1.5 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Comma-separated options: Option 1, Option 2, Option 3"
                        value={quizOptions}
                        onChange={(e) => setQuizOptions(e.target.value)}
                        className="w-full bg-[#12141F] border border-[#272B40] rounded-lg px-3 py-1.5 text-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 font-bold text-xs uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30 hover:opacity-95 transition"
              >
                Publish Reel & Reward Viewers (+25 XP)
              </button>
            </form>
          )}

          {activeTab === 'post' && (
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Post Category</label>
                <div className="flex gap-2">
                  {(['Educational', 'Career', 'Discussion', 'Project'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPostCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        postCategory === cat
                          ? 'bg-indigo-600 text-white'
                          : 'bg-[#1A1D2E] text-slate-400 border border-[#272B40]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Post Content & Code Snippet</label>
                <textarea
                  rows={5}
                  placeholder="Share a quick tip, design insight, or ask a question to the community..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  required
                  className="w-full bg-[#1A1D2E] border border-[#272B40] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg shadow-indigo-600/30 transition"
              >
                Publish Community Post (+15 XP)
              </button>
            </form>
          )}

          {activeTab === 'live' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
                <Radio className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-base">SkillReel Live Broadcast</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Stream live code-alongs and interactive study halls with your followers. Real-time Q&A and instant challenges supported.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  alert('Live Stream Session Initialized! Broadcaster key assigned.');
                }}
                className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30"
              >
                Launch Live Stream
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
