import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { aiService, AICoachResponse } from '../services/aiService';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  Zap,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Compass,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  roadmap?: { step: number; title: string; desc: string }[];
  actionPrompt?: string;
}

export const AICoachPage: React.FC = () => {
  const { user, addXP, setActiveTab } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'coach',
      text: `Hello ${user.name}! I am your SkillReel AI Coach. Your current streak is ${user.streakDays} days and your goal is "${user.careerGoal}". How can I accelerate your learning today?`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response: AICoachResponse = await aiService.askCoach(text, user);
      const coachMsg: ChatMessage = {
        id: `c_${Date.now()}`,
        sender: 'coach',
        text: response.answer,
        roadmap: response.suggestedRoadmap,
        actionPrompt: response.actionPrompt,
      };
      setMessages((prev) => [...prev, coachMsg]);

      if (response.xpBonus) {
        addXP(response.xpBonus, 'Consulted SkillReel AI Coach');
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `c_err_${Date.now()}`,
          sender: 'coach',
          text: 'AI Coach is momentarily calibrating neural models. Please ask another question!',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'How can I become an AI engineer?',
    'What should I learn next?',
    'Test my knowledge.',
    'Give me a portfolio project.',
  ];

  return (
    <div className="flex-1 min-h-screen bg-[#090A0F] text-white flex flex-col p-4 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1E2235]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              SkillReel AI Coach
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Active
              </span>
            </h1>
            <p className="text-xs text-slate-400">Personalized mentor powered by your learning history & goals</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-[#12141F] px-3 py-1.5 rounded-xl border border-[#272B40] text-xs">
          <span className="text-slate-400">Target Role:</span>
          <span className="font-bold text-indigo-400">{user.careerGoal}</span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Ask Coach:
        </span>
        {samplePrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1.5 rounded-xl bg-[#12141F] border border-[#272B40] hover:border-indigo-500/50 text-xs text-slate-300 hover:text-white whitespace-nowrap transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'coach' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-[#12141F] border border-[#272B40] text-slate-200'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Render Structured Roadmap if provided */}
              {msg.roadmap && (
                <div className="mt-4 space-y-2 pt-3 border-t border-[#272B40]">
                  <div className="font-bold text-xs text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" /> Structured Learning Pathway
                  </div>
                  <div className="space-y-1.5">
                    {msg.roadmap.map((step) => (
                      <div
                        key={step.step}
                        className="p-2.5 rounded-xl bg-[#1A1D2E] border border-[#272B40] flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {step.step}
                        </span>
                        <div>
                          <div className="font-bold text-xs text-white">{step.title}</div>
                          <div className="text-[11px] text-slate-400">{step.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveTab('learn')}
                    className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 font-bold text-xs text-white shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <span>Start This Roadmap in Learn Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Action prompt if available */}
              {msg.actionPrompt && !msg.roadmap && (
                <div className="mt-3 pt-2 border-t border-[#272B40] text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> {msg.actionPrompt}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <img
                src={user.avatar}
                alt="user"
                className="w-8 h-8 rounded-xl object-cover flex-shrink-0 mt-1"
              />
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-center text-xs text-slate-400 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <span>SkillReel Coach is synthesizing insights...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder="Ask your coach anything (e.g. 'Explain transformers simply', 'What should I build?')..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="w-full bg-[#12141F] border border-[#272B40] rounded-2xl pl-4 pr-12 py-3.5 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2.5 w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center transition shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
