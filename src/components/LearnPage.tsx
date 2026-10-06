import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Award,
  CheckCircle,
  Play,
  Lock,
  Flame,
  Zap,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { LearningPath, LearningLesson } from '../types';

export const LearnPage: React.FC = () => {
  const { learningPaths, skills, completeLesson, user, setActiveTab } = useApp();
  const [selectedPath, setSelectedPath] = useState<LearningPath>(learningPaths[0]);
  const [activeLessonModal, setActiveLessonModal] = useState<LearningLesson | null>(null);

  const handleLessonAction = (lesson: LearningLesson) => {
    if (!lesson.isCompleted) {
      completeLesson(selectedPath.id, lesson.id);
    }
    setActiveLessonModal(null);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#090A0F] text-white p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24 md:pb-12">
      {/* Top Banner: User Progress & Daily Goal */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-[#12141F] to-cyan-950/40 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> My Learning Center
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Target: {user.learningGoal}
          </h1>
          <p className="text-slate-300 text-xs md:text-sm">
            You've completed <span className="text-indigo-400 font-semibold">{user.streakDays} consecutive days</span> of learning. Keep your streak alive!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#12141F]/80 p-3 rounded-2xl border border-[#272B40]">
          <div className="text-center px-2">
            <div className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 fill-amber-400" />
              {user.xp}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total XP</div>
          </div>
          <div className="w-[1px] h-8 bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-lg font-black text-emerald-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-emerald-400" />
              {user.streakDays}d
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Streak</div>
          </div>
          <div className="w-[1px] h-8 bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-lg font-black text-cyan-400">
              {user.dailyGoalMinutes}m
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Daily Goal</div>
          </div>
        </div>
      </div>

      {/* SECTION: Selectable Learning Paths */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Select Active Roadmap</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {learningPaths.map((path) => {
            const isSelected = selectedPath.id === path.id;
            return (
              <button
                key={path.id}
                onClick={() => setSelectedPath(path)}
                className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-600/10'
                    : 'bg-[#12141F] border-[#272B40] hover:border-slate-700'
                }`}
              >
                <span className="text-3xl">{path.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-white truncate">{path.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{path.progressPercentage}% done</span>
                    <span>•</span>
                    <span>{path.lessons.length} lessons</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ACTIVE PATH CURRICULUM TIMELINE */}
      <section className="bg-[#12141F] border border-[#272B40] rounded-3xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#272B40]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{selectedPath.icon}</span>
              <h2 className="text-xl font-bold">{selectedPath.title}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                {selectedPath.difficulty}
              </span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm max-w-2xl">{selectedPath.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-300">Curriculum Progress</div>
              <div className="text-sm font-extrabold text-indigo-400">{selectedPath.progressPercentage}% Completed</div>
            </div>
            <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center font-bold text-sm">
              {selectedPath.progressPercentage}%
            </div>
          </div>
        </div>

        {/* Step-by-Step Lessons Timeline */}
        <div className="space-y-3">
          {selectedPath.lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              onClick={() => setActiveLessonModal(lesson)}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition ${
                lesson.isCompleted
                  ? 'bg-[#161928] border-emerald-500/30 hover:border-emerald-500/50'
                  : 'bg-[#1A1D2E] border-[#272B40] hover:border-indigo-500/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    lesson.isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-indigo-600/20 text-indigo-400'
                  }`}
                >
                  {lesson.isCompleted ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : idx + 1}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white">{lesson.title}</h4>
                  <p className="text-xs text-slate-400">{lesson.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {lesson.durationMinutes}m
                </span>
                <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                  +{lesson.xp} XP
                </span>
                <button
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                    lesson.isCompleted
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {lesson.isCompleted ? 'Review' : 'Start'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LESSON MODAL */}
      {activeLessonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141F] border border-[#272B40] rounded-3xl max-w-lg w-full p-6 space-y-5 animate-scale text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#272B40]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base">{activeLessonModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveLessonModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeLessonModal.description}
            </p>

            <div className="bg-[#1A1D2E] p-4 rounded-2xl border border-[#272B40] flex items-center justify-between text-xs">
              <span className="text-slate-400">Duration: {activeLessonModal.durationMinutes} Minutes</span>
              <span className="text-amber-400 font-bold">Reward: +{activeLessonModal.xp} XP</span>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setActiveLessonModal(null)}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleLessonAction(activeLessonModal)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
              >
                <span>{activeLessonModal.isCompleted ? 'Mark as Completed (+0 XP)' : 'Complete & Earn XP'}</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
