import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Check, Award, Compass, Clock, Zap } from 'lucide-react';

const INTEREST_OPTIONS = [
  { id: 'Coding', label: 'Coding & Development', icon: '💻' },
  { id: 'Artificial Intelligence', label: 'Artificial Intelligence', icon: '🤖' },
  { id: 'Data Science', label: 'Data Science & Analytics', icon: '📊' },
  { id: 'Business', label: 'Business & Startups', icon: '💼' },
  { id: 'Finance', label: 'Finance & Investing', icon: '📈' },
  { id: 'Design', label: 'UI/UX & Product Design', icon: '🎨' },
  { id: 'Photography', label: 'Photography & Visuals', icon: '📷' },
  { id: 'Video Editing', label: 'Video Editing & Motion', icon: '🎬' },
  { id: 'Communication', label: 'Communication & Speaking', icon: '🎙️' },
  { id: 'Science', label: 'Science & Physics', icon: '🔬' },
  { id: 'Technology', label: 'Cloud & DevOps', icon: '☁️' },
  { id: 'Career', label: 'Career & Interview Prep', icon: '🎯' },
  { id: 'Personal Development', label: 'Personal Development', icon: '⚡' },
  { id: 'Practical Skills', label: 'Practical Skills', icon: '🛠️' },
];

const CAREER_OPTIONS = [
  'Software Developer',
  'AI Engineer',
  'Data Scientist',
  'Product Designer',
  'Tech Entrepreneur',
  'Content Creator',
  'Digital Marketer',
  'Researcher',
  'Student / Lifelong Learner',
];

const TIME_OPTIONS = [
  { min: 5, label: '5 minutes / day', desc: 'Micro-habits & quick daily tips' },
  { min: 15, label: '15 minutes / day', desc: 'Balanced, consistent skill growth' },
  { min: 30, label: '30 minutes / day', desc: 'Fast-track career advancement' },
  { min: 60, label: '60+ minutes / day', desc: 'Deep mastery & intensive roadmaps' },
];

export const Onboarding: React.FC = () => {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState<number>(1);

  // Form states
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Coding',
    'Artificial Intelligence',
  ]);
  const [careerGoal, setCareerGoal] = useState<string>('AI Engineer');
  const [currentLevel, setCurrentLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(30);
  const [name, setName] = useState<string>('Alex Rivera');
  const [username, setUsername] = useState<string>('alex_codes');

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    completeOnboarding({
      name,
      username,
      selectedInterests,
      careerGoal,
      currentSkillLevel: currentLevel,
      dailyGoalMinutes,
      learningGoal: `Master ${careerGoal}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090A0F] text-white flex flex-col justify-between overflow-y-auto">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Progress */}
      <header className="relative z-10 p-6 flex items-center justify-between max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            SkillReel
          </span>
        </div>
        {step > 1 && step < 6 && (
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-indigo-300">
            Step {step} of 6
          </div>
        )}
      </header>

      {/* Main Content Card Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full">
        {/* SCREEN 1: Welcome Splash */}
        {step === 1 && (
          <div className="text-center space-y-6 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" /> A NEW ERA OF SOCIAL LEARNING
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Scroll. Learn. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Grow Your Future.
              </span>
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-md mx-auto">
              Your social feed for real skills, interactive micro-challenges, and verified knowledge. No endless brainrot — every swipe moves you forward.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-xs mx-auto">
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 font-semibold shadow-xl shadow-indigo-600/25 transition flex items-center justify-center gap-2 group"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800/80 font-medium text-slate-300 transition"
              >
                LOG IN
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: What do you want to learn? */}
        {step === 2 && (
          <div className="w-full space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">What do you want to learn?</h2>
              <p className="text-slate-400 text-sm">Choose topics to calibrate your recommendation algorithm.</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {INTEREST_OPTIONS.map((item) => {
                const selected = selectedInterests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleInterest(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-sm font-medium transition ${
                      selected
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {selected && <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            <button
              disabled={selectedInterests.length === 0}
              onClick={() => setStep(3)}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-semibold shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SCREEN 3: What do you want to become? */}
        {step === 3 && (
          <div className="w-full space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">What do you want to become?</h2>
              <p className="text-slate-400 text-sm">Your primary career or creative ambition.</p>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {CAREER_OPTIONS.map((role) => {
                const isSelected = careerGoal === role;
                return (
                  <button
                    key={role}
                    onClick={() => setCareerGoal(role)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium transition ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span>{role}</span>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-semibold shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 4: Current skill level */}
        {step === 4 && (
          <div className="w-full space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">What is your current level?</h2>
              <p className="text-slate-400 text-sm">We tune challenge difficulty and lesson pacing accordingly.</p>
            </div>

            <div className="grid gap-3">
              {[
                { id: 'Beginner', title: 'Beginner', desc: 'Starting fresh. I want fundamentals and intuitive mental models.' },
                { id: 'Intermediate', title: 'Intermediate', desc: 'Comfortable with basics. Looking to build real production apps.' },
                { id: 'Advanced', title: 'Advanced', desc: 'Experienced. Seeking advanced architectures, internals and cutting edge.' },
              ].map((lvl) => {
                const isSelected = currentLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => setCurrentLevel(lvl.id as any)}
                    className={`p-4 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-600/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-base text-white">{lvl.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{lvl.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="py-3 px-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-semibold shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 5: Daily learning commitment */}
        {step === 5 && (
          <div className="w-full space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">How much time per day?</h2>
              <p className="text-slate-400 text-sm">Consistent daily learning beats weekend marathons.</p>
            </div>

            <div className="grid gap-3">
              {TIME_OPTIONS.map((opt) => {
                const isSelected = dailyGoalMinutes === opt.min;
                return (
                  <button
                    key={opt.min}
                    onClick={() => setDailyGoalMinutes(opt.min)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{opt.label}</div>
                      <div className="text-xs text-slate-400">{opt.desc}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(4)}
                className="py-3 px-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(6)}
                className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-semibold shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
              >
                <span>Generate SkillReel Feed</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 6: Ready to start! */}
        {step === 6 && (
          <div className="text-center space-y-6 animate-fadeIn max-w-md">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-indigo-600 flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/30 animate-bounce">
              <Award className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-white">Your SkillReel is Ready!</h2>
              <p className="text-slate-300 text-sm">
                Your personalized feed is calibrated around <span className="text-indigo-400 font-semibold">{careerGoal}</span> and your selected interests.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Target Career:</span>
                <span className="text-slate-200 font-semibold">{careerGoal}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Skill Level:</span>
                <span className="text-slate-200 font-semibold">{currentLevel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Daily Goal:</span>
                <span className="text-emerald-400 font-semibold">{dailyGoalMinutes} mins / day</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Starting Bonus:</span>
                <span className="text-amber-400 font-bold">+50 XP Welcome Gift ⚡</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 font-bold text-base shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 group"
            >
              <span>START LEARNING</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
          </div>
        )}
      </main>

      {/* Footer reassurance */}
      <footer className="relative z-10 p-4 text-center text-xs text-slate-500">
        SkillReel • Scroll. Learn. Grow. • Dark Mode Enabled
      </footer>
    </div>
  );
};
