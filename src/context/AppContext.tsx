import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Reel,
  Post,
  LearningPath,
  SkillProgress,
  Achievement,
  ChatThread,
  NotificationItem,
  Story,
} from '../types';
import {
  INITIAL_USER,
  DEMO_REELS,
  DEMO_POSTS,
  DEMO_LEARNING_PATHS,
  DEMO_SKILLS,
  DEMO_ACHIEVEMENTS,
  DEMO_CHATS,
  DEMO_NOTIFICATIONS,
  DEMO_STORIES,
} from '../data/demoData';
import { rankAndDiversifyFeed } from '../services/recommendationEngine';

interface AppContextType {
  // User & Auth
  user: UserProfile;
  isOnboarded: boolean;
  completeOnboarding: (data: Partial<UserProfile>) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  addXP: (amount: number, reason?: string) => void;

  // Feeds & Content
  reels: Reel[];
  currentReelIndex: number;
  setCurrentReelIndex: (index: number) => void;
  toggleLikeReel: (reelId: string) => void;
  toggleSaveReel: (reelId: string) => void;
  toggleFollowCreator: (creatorId: string) => void;
  addNewReel: (reel: Omit<Reel, 'id' | 'likesCount' | 'commentsCount' | 'savesCount' | 'sharesCount' | 'viewsCount' | 'createdAt'>) => void;

  // Social & Posts
  posts: Post[];
  addNewPost: (post: Omit<Post, 'id' | 'likesCount' | 'commentsCount' | 'savesCount' | 'sharesCount' | 'createdAt'>) => void;
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  votePoll: (postId: string, optionIndex: number) => void;

  // Stories
  stories: Story[];
  markStoryViewed: (storyId: string) => void;

  // Learning & Skills
  skills: SkillProgress[];
  learningPaths: LearningPath[];
  achievements: Achievement[];
  completeLesson: (pathId: string, lessonId: string) => void;

  // Challenges
  completedChallengeIds: Set<string>;
  submitChallengeAnswer: (challengeId: string, selectedIndex: number, correctIndex: number, xp: number) => boolean;

  // Messaging & Calls
  chats: ChatThread[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  sendMessage: (chatId: string, text: string, type?: 'text' | 'reel' | 'image') => void;
  createGroupChat: (name: string) => void;

  // Call state
  isInCall: boolean;
  isStudyCall: boolean;
  startCall: (isStudy?: boolean) => void;
  endCall: () => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Navigation & View Modal
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check local storage for onboarding
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('skillreel_onboarded') === 'true';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('skillreel_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [reels, setReels] = useState<Reel[]>(() => {
    return rankAndDiversifyFeed(DEMO_REELS, user);
  });

  const [currentReelIndex, setCurrentReelIndex] = useState<number>(0);
  const [posts, setPosts] = useState<Post[]>(DEMO_POSTS);
  const [stories, setStories] = useState<Story[]>(DEMO_STORIES);
  const [skills, setSkills] = useState<SkillProgress[]>(DEMO_SKILLS);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(DEMO_LEARNING_PATHS);
  const [achievements, setAchievements] = useState<Achievement[]>(DEMO_ACHIEVEMENTS);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<Set<string>>(new Set());
  const [chats, setChats] = useState<ChatThread[]>(DEMO_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEMO_NOTIFICATIONS);

  // Calls
  const [isInCall, setIsInCall] = useState(false);
  const [isStudyCall, setIsStudyCall] = useState(false);

  // App navigation
  const [activeTab, setActiveTab] = useState<string>('home');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Sync user to storage
  useEffect(() => {
    localStorage.setItem('skillreel_user', JSON.stringify(user));
  }, [user]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    const updated = { ...user, ...data };
    setUser(updated);
    setIsOnboarded(true);
    localStorage.setItem('skillreel_onboarded', 'true');
    // Rerank feed with fresh preferences
    setReels(rankAndDiversifyFeed(DEMO_REELS, updated));
  };

  const addXP = (amount: number, reason?: string) => {
    setUser((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 250) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });

    if (reason) {
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        type: 'challenge_xp',
        title: 'XP Earned! ⚡',
        message: `${reason}: +${amount} XP`,
        createdAt: 'Just now',
        isRead: false,
        xpGain: amount,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const toggleLikeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likesCount: isLiked ? r.likesCount + 1 : r.likesCount - 1,
          };
        }
        return r;
      })
    );
  };

  const toggleSaveReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const isSaved = !r.isSaved;
          return {
            ...r,
            isSaved,
            savesCount: isSaved ? r.savesCount + 1 : r.savesCount - 1,
          };
        }
        return r;
      })
    );
  };

  const toggleFollowCreator = (creatorId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.creator.id === creatorId) {
          return { ...r, isFollowingCreator: !r.isFollowingCreator };
        }
        return r;
      })
    );
  };

  const addNewReel = (reelData: any) => {
    const newReel: Reel = {
      ...reelData,
      id: `reel_${Date.now()}`,
      likesCount: 0,
      commentsCount: 0,
      savesCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      createdAt: 'Just now',
      isLiked: false,
      isSaved: false,
    };
    setReels((prev) => [newReel, ...prev]);
    addXP(25, 'Published Educational Reel');
  };

  const addNewPost = (postData: any) => {
    const newPost: Post = {
      ...postData,
      id: `post_${Date.now()}`,
      likesCount: 0,
      commentsCount: 0,
      savesCount: 0,
      sharesCount: 0,
      createdAt: 'Just now',
      isLiked: false,
      isSaved: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    addXP(15, 'Created Community Post');
  };

  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  const toggleSavePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isSaved = !p.isSaved;
          return {
            ...p,
            isSaved,
            savesCount: isSaved ? p.savesCount + 1 : p.savesCount - 1,
          };
        }
        return p;
      })
    );
  };

  const votePoll = (postId: string, optionIndex: number) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.pollOptions && p.pollVotedIndex === undefined) {
          const updatedOptions = p.pollOptions.map((opt, i) =>
            i === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return { ...p, pollOptions: updatedOptions, pollVotedIndex: optionIndex };
        }
        return p;
      })
    );
    addXP(5, 'Participated in Learning Poll');
  };

  const markStoryViewed = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, hasViewed: true } : s))
    );
  };

  const completeLesson = (pathId: string, lessonId: string) => {
    setLearningPaths((prev) =>
      prev.map((path) => {
        if (path.id === pathId) {
          const updatedLessons = path.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson
          );
          const completedCount = updatedLessons.filter((l) => l.isCompleted).length;
          const progressPercentage = Math.round((completedCount / updatedLessons.length) * 100);
          return { ...path, lessons: updatedLessons, progressPercentage };
        }
        return path;
      })
    );
    addXP(20, 'Completed Learning Lesson');
  };

  const submitChallengeAnswer = (
    challengeId: string,
    selectedIndex: number,
    correctIndex: number,
    xpReward: number
  ): boolean => {
    const isCorrect = selectedIndex === correctIndex;
    if (isCorrect && !completedChallengeIds.has(challengeId)) {
      setCompletedChallengeIds((prev) => new Set(prev).add(challengeId));
      addXP(xpReward, 'Solved Reel Micro-Challenge');
    }
    return isCorrect;
  };

  const sendMessage = (chatId: string, text: string, type: 'text' | 'reel' | 'image' = 'text') => {
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      text,
      type,
      createdAt: 'Just now',
      isRead: true,
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              lastMessage: text,
              lastMessageTime: 'Just now',
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );
  };

  const createGroupChat = (name: string) => {
    const newChat: ChatThread = {
      id: `chat_grp_${Date.now()}`,
      isGroup: true,
      groupName: name,
      participant: {
        id: `grp_${Date.now()}`,
        name,
        username: name.toLowerCase().replace(/\s+/g, '_'),
        avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
        isOnline: true,
      },
      members: [
        { id: user.id, name: user.name, avatar: user.avatar },
        { id: 'creator_priya', name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
      ],
      lastMessage: 'Group created. Start your study session!',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `msg_init_${Date.now()}`,
          senderId: user.id,
          text: `Welcome to ${name}! Let's study and build together.`,
          type: 'text',
          createdAt: 'Just now',
          isRead: true,
        },
      ],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const startCall = (studyMode = false) => {
    setIsStudyCall(studyMode);
    setIsInCall(true);
  };

  const endCall = () => {
    setIsInCall(false);
    setIsStudyCall(false);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isOnboarded,
        completeOnboarding,
        updateUser,
        addXP,
        reels,
        currentReelIndex,
        setCurrentReelIndex,
        toggleLikeReel,
        toggleSaveReel,
        toggleFollowCreator,
        addNewReel,
        posts,
        addNewPost,
        toggleLikePost,
        toggleSavePost,
        votePoll,
        stories,
        markStoryViewed,
        skills,
        learningPaths,
        achievements,
        completeLesson,
        completedChallengeIds,
        submitChallengeAnswer,
        chats,
        activeChatId,
        setActiveChatId,
        sendMessage,
        createGroupChat,
        isInCall,
        isStudyCall,
        startCall,
        endCall,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        activeTab,
        setActiveTab,
        showCreateModal,
        setShowCreateModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
