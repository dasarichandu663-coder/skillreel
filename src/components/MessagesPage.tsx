import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Users,
  Search,
  Send,
  Video,
  Image,
  Paperclip,
  Check,
  CheckCheck,
  Plus,
  Zap,
} from 'lucide-react';
import { ChatThread } from '../types';

export const MessagesPage: React.FC = () => {
  const { chats, activeChatId, setActiveChatId, sendMessage, createGroupChat, startCall, user } = useApp();
  const [inputText, setInputText] = useState('');
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');

  const currentChat: ChatThread | undefined =
    chats.find((c) => c.id === activeChatId) || chats[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentChat) return;
    sendMessage(currentChat.id, inputText);
    setInputText('');
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    createGroupChat(groupName.trim());
    setGroupName('');
    setShowNewGroupModal(false);
  };

  return (
    <div className="flex-1 h-screen bg-[#090A0F] text-white flex pb-16 md:pb-0 overflow-hidden">
      {/* LEFT CHATS THREAD LIST */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-[#1E2235] flex flex-col bg-[#090A0F] ${
          activeChatId && 'hidden md:flex'
        }`}
      >
        <div className="p-4 border-b border-[#1E2235] space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold flex items-center gap-2">
              Messages
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold">
                {chats.length}
              </span>
            </h1>
            <button
              onClick={() => setShowNewGroupModal(true)}
              className="p-2 rounded-xl bg-[#12141F] border border-[#272B40] hover:bg-[#1A1D2E] text-slate-300 hover:text-white transition"
              title="Create Study Group"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search conversations & study groups..."
              className="w-full bg-[#12141F] border border-[#272B40] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Chat List Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#1E2235]/60">
          {chats.map((chat) => {
            const isSelected = currentChat?.id === chat.id;
            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition ${
                  isSelected ? 'bg-indigo-600/10 border-l-2 border-indigo-500' : 'hover:bg-[#12141F]'
                }`}
              >
                <div className="relative">
                  <img
                    src={chat.participant.avatar}
                    alt={chat.participant.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-[#272B40]"
                  />
                  {chat.participant.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#090A0F]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                      {chat.isGroup ? chat.groupName : chat.participant.name}
                      {chat.isGroup && (
                        <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-300">
                          Group
                        </span>
                      )}
                    </h3>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                      {chat.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{chat.lastMessage}</p>
                </div>

                {chat.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT ACTIVE CHAT CONVERSATION VIEW */}
      {currentChat ? (
        <div
          className={`flex-1 flex flex-col bg-[#0b0d14] ${
            !activeChatId && 'hidden md:flex'
          }`}
        >
          {/* Active Chat Top Header */}
          <div className="p-3.5 border-b border-[#1E2235] bg-[#090A0F] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveChatId(null)}
                className="md:hidden text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <img
                src={currentChat.participant.avatar}
                alt="user"
                className="w-9 h-9 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-bold text-xs text-white">
                  {currentChat.isGroup ? currentChat.groupName : currentChat.participant.name}
                </h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  ● {currentChat.isGroup ? `${currentChat.members?.length || 3} study peers active` : 'Online'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => startCall(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Start Study Call</span>
              </button>
            </div>
          </div>

          {/* Messages Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentChat.messages.map((m) => {
              const isMine = m.senderId === user.id;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isMine
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-[#12141F] border border-[#272B40] text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {m.text}

                    {/* Reel Embed if attached */}
                    {m.reelAttachment && (
                      <div className="mt-2 p-2 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
                        <img
                          src={m.reelAttachment.thumbnailUrl}
                          alt="reel"
                          className="w-12 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <span className="text-[9px] font-bold text-indigo-400 uppercase">
                            {m.reelAttachment.skillCategory}
                          </span>
                          <div className="font-bold text-xs text-white line-clamp-1">
                            {m.reelAttachment.title}
                          </div>
                          <span className="text-[10px] text-slate-300">Tap to watch Reel</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">
                    {m.createdAt} {isMine && '• Sent'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-[#090A0F] border-t border-[#1E2235] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type message, share Reel code, or ask study group..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#12141F] border border-[#272B40] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center text-slate-500 text-xs">
          Select a chat to begin messaging
        </div>
      )}

      {/* CREATE NEW STUDY GROUP MODAL */}
      {showNewGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141F] border border-[#272B40] rounded-3xl max-w-sm w-full p-5 space-y-4 animate-scale">
            <div className="flex items-center justify-between pb-2 border-b border-[#272B40]">
              <h3 className="font-bold text-sm">Create Learning Study Group</h3>
              <button
                onClick={() => setShowNewGroupModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Group Name</label>
                <input
                  type="text"
                  placeholder="e.g. PyTorch Deep Learning Squad"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-[#1A1D2E] border border-[#272B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="text-xs text-slate-400">
                Peers can share reels, solve micro-challenges together, and initiate instant Study Calls.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewGroupModal(false)}
                  className="w-1/2 py-2 rounded-xl bg-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!groupName.trim()}
                  className="w-1/2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-bold"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
