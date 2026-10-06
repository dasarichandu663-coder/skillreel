import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Share2,
  Users,
  Sparkles,
  BookOpen,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const StudyVideoCallModal: React.FC = () => {
  const { isInCall, isStudyCall, endCall, user } = useApp();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [studyNotes, setStudyNotes] = useState(
    'Key Discussion Points:\n• Attention is All You Need paper recap\n• Query, Key, Value matrix shapes: (Batch, Seq_len, d_k)\n• Softmax scaling factor 1/sqrt(d_k) prevents vanishing gradients'
  );

  if (!isInCall) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-between p-4 md:p-6 text-white animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-sm flex items-center gap-2">
              {isStudyCall ? '⚡ Live Study Call: Transformers & LLMs' : 'Direct Call'}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Encrypted WebRTC Channel
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">2 Participants active • Simulated WebRTC Production Interface</p>
          </div>
        </div>

        <button
          onClick={() => setShowNotes(!showNotes)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
            showNotes
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-white/10 border-white/15 text-slate-300 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Shared Study Whiteboard</span>
        </button>
      </div>

      {/* Main Video Stage */}
      <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4 py-4 min-h-0">
        {/* Remote Participant Video Feed */}
        <div className="relative rounded-3xl overflow-hidden bg-[#12141F] border border-[#272B40] flex items-center justify-center shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
            alt="David Chen"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Dr. David Chen (Speaker)
          </div>
        </div>

        {/* Local Participant Video Feed (Or Split with Notes) */}
        {showNotes ? (
          <div className="rounded-3xl bg-[#12141F] border border-[#272B40] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#272B40]">
                <h3 className="font-bold text-xs text-indigo-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4" /> Live Collaborative Study Notes
                </h3>
                <span className="text-[10px] text-slate-400">Auto-saved to Library</span>
              </div>
              <textarea
                value={studyNotes}
                onChange={(e) => setStudyNotes(e.target.value)}
                className="w-full h-48 bg-transparent text-xs text-slate-200 resize-none focus:outline-none pt-3 leading-relaxed font-mono"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-[#272B40] text-[11px] text-slate-400">
              💡 Tip: Review these notes right before taking the Transformer Capstone Challenge.
            </div>
          </div>
        ) : (
          <div className="relative rounded-3xl overflow-hidden bg-[#12141F] border border-[#272B40] flex items-center justify-center shadow-2xl">
            {isVideoOff ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full border-2 border-indigo-500 object-cover"
                />
                <span className="text-xs text-slate-400 font-medium">Camera Off</span>
              </div>
            ) : (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-1.5">
              <span>{user.name} (You)</span>
              {isMuted && <MicOff className="w-3.5 h-3.5 text-rose-400" />}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Call Controls */}
      <div className="flex items-center justify-center gap-4 py-3">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-lg ${
            isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-lg ${
            isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title={isVideoOff ? 'Turn on video' : 'Turn off video'}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-lg ${
            isScreenSharing ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title="Share Screen"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {/* End Call button */}
        <button
          onClick={endCall}
          className="px-6 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-rose-600/30 transition"
        >
          <PhoneOff className="w-5 h-5" />
          <span>Leave Call</span>
        </button>
      </div>
    </div>
  );
};
