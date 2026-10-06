export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  isCreator: boolean;
  creatorTitle?: string;
  followersCount: number;
  followingCount: number;
  xp: number;
  streakDays: number;
  level: number;
  learningGoal: string;
  careerGoal: string;
  dailyGoalMinutes: number;
  selectedInterests: string[];
  currentSkillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  isFollowing?: boolean;
}

export interface SkillProgress {
  id: string;
  name: string;
  icon?: string;
  progressPercentage: number;
  level: string;
  xpEarned: number;
  totalLessons: number;
  completedLessons: number;
  category: string;
  nextLessonTitle: string;
}

export interface Challenge {
  id: string;
  reelId?: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  xpReward: number;
  skillTag: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Reel {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  creator: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isCreator: boolean;
    creatorTitle?: string;
  };
  skillCategory: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  sharesCount: number;
  viewsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowingCreator?: boolean;
  challenge?: Challenge;
  durationSeconds: number;
  createdAt: string;
  recommendedScore?: number;
}

export interface Comment {
  id: string;
  reelId?: string;
  postId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  type: 'text' | 'image' | 'learning_tip' | 'question' | 'poll';
  category: 'Educational' | 'Career' | 'Discussion' | 'Project' | 'General';
  content: string;
  images?: string[];
  pollOptions?: { text: string; votes: number }[];
  pollVotedIndex?: number;
  skillTag?: string;
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
}

export interface Story {
  id: string;
  creator: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  type: 'quiz' | 'tip' | 'challenge' | 'photo';
  content: string;
  mediaUrl?: string;
  question?: string;
  options?: string[];
  correctIndex?: number;
  xpReward?: number;
  createdAt: string;
  hasViewed?: boolean;
}

export interface LearningLesson {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  xp: number;
  isCompleted: boolean;
  type: 'reel' | 'quiz' | 'project';
  videoUrl?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  targetRole: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  progressPercentage: number;
  enrolledUsersCount: number;
  lessons: LearningLesson[];
  icon: string;
  bannerImage: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  xpAwarded: number;
  category: 'Streak' | 'Skill' | 'Creator' | 'General';
}

export interface MessageItem {
  id: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  type: 'text' | 'image' | 'reel' | 'challenge' | 'voice';
  reelAttachment?: {
    id: string;
    title: string;
    skillCategory: string;
    thumbnailUrl: string;
  };
  createdAt: string;
  isRead: boolean;
}

export interface ChatThread {
  id: string;
  isGroup: boolean;
  groupName?: string;
  participant: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isOnline: boolean;
  };
  members?: { id: string; name: string; avatar: string }[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isTyping?: boolean;
  messages: MessageItem[];
}

export interface NotificationItem {
  id: string;
  type: 'follower' | 'like' | 'comment' | 'challenge_xp' | 'learning_reminder' | 'path_progress';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  avatar?: string;
  actionUrl?: string;
  xpGain?: number;
}
