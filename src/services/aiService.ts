import { UserProfile, Challenge } from '../types';

export interface AIReelAssistance {
  title: string;
  caption: string;
  hashtags: string[];
  detectedSkill: string;
  detectedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  generatedChallenge: Challenge;
}

export interface AICoachResponse {
  answer: string;
  suggestedRoadmap?: { step: number; title: string; desc: string }[];
  actionPrompt?: string;
  xpBonus?: number;
}

/**
 * Service to handle AI generation for creators and learners.
 * Supports configurable API endpoint or intelligent fallback simulation.
 */
class AIService {
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = import.meta.env.VITE_AI_API_KEY || null;
  }

  public setApiKey(key: string) {
    this.apiKey = key;
  }

  public hasApiKey(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Generates instant caption, hashtags, detected skill, difficulty, and quiz
   * for video creators uploading a new Reel.
   */
  public async generateReelAssistance(topicHint: string): Promise<AIReelAssistance> {
    // Artificial latency for realistic async interaction
    await new Promise((resolve) => setTimeout(resolve, 800));

    const topicLower = topicHint.toLowerCase();

    if (topicLower.includes('python') || topicLower.includes('variable') || topicLower.includes('loop')) {
      return {
        title: 'Python Essentials in 30 Seconds ⚡',
        caption: 'Master core Python variable assignment, scope rules, and mutable vs immutable types in under 30 seconds! #LearnPython #CodeQuick',
        hashtags: ['#Python', '#Coding', '#SoftwareEngineering', '#100DaysOfCode'],
        detectedSkill: 'Python',
        detectedDifficulty: 'Beginner',
        summary: 'Demystifies Python memory allocation and variable pointer mechanics with a visual comparison.',
        generatedChallenge: {
          id: `gen_ch_${Date.now()}`,
          question: 'In Python, which of the following data types is immutable?',
          options: ['List []', 'Dictionary {}', 'Tuple ()', 'Set set()'],
          correctOptionIndex: 2,
          explanation: 'Tuples are immutable sequences in Python; their elements cannot be reassigned after creation.',
          xpReward: 15,
          skillTag: 'Python',
          difficulty: 'Beginner',
        },
      };
    }

    if (topicLower.includes('ai') || topicLower.includes('neural') || topicLower.includes('machine learning')) {
      return {
        title: 'Neural Networks: Backprop Explained 🧠',
        caption: 'How do neural networks actually learn from mistakes? The chain rule of calculus visualized in 45 seconds!',
        hashtags: ['#ArtificialIntelligence', '#MachineLearning', '#DeepLearning', '#MathForAI'],
        detectedSkill: 'Artificial Intelligence',
        detectedDifficulty: 'Intermediate',
        summary: 'Breaks down gradient calculation via backpropagation and weight updates with SGD.',
        generatedChallenge: {
          id: `gen_ch_${Date.now()}`,
          question: 'What mathematical rule is the bedrock foundation of the backpropagation algorithm?',
          options: ['Bayes Theorem', 'Chain Rule of Calculus', 'Pythagorean Theorem', 'L’Hopital’s Rule'],
          correctOptionIndex: 1,
          explanation: 'Backpropagation iteratively computes gradients of the loss function with respect to each weight using the Chain Rule.',
          xpReward: 20,
          skillTag: 'Artificial Intelligence',
          difficulty: 'Intermediate',
        },
      };
    }

    // Default dynamic fallback
    return {
      title: `${topicHint || 'Mastery'} in 60 Seconds 🚀`,
      caption: `Level up your skills with this concise breakdown of ${topicHint || 'the core concept'}! Tag a friend who needs this.`,
      hashtags: ['#TechSkills', '#SkillReel', '#GrowthMindset', '#Productivity'],
      detectedSkill: topicHint ? topicHint.split(' ')[0] : 'Technology',
      detectedDifficulty: 'Intermediate',
      summary: `High-yield synthesis of key techniques and practical application for modern professionals.`,
      generatedChallenge: {
        id: `gen_ch_${Date.now()}`,
        question: `What is the primary best-practice takeaway from this ${topicHint || 'skill'} breakdown?`,
        options: [
          'Optimize for maintainability and clear architecture first',
          'Avoid testing before pushing to production',
          'Memorize syntax without understanding core principles',
          'Ignore documentation and community style guides',
        ],
        correctOptionIndex: 0,
        explanation: 'Writing clean, maintainable code with solid architecture yields the highest long-term engineering leverage.',
        xpReward: 15,
        skillTag: topicHint || 'General Tech',
        difficulty: 'Intermediate',
      },
    };
  }

  /**
   * Chat interactions with the SkillReel AI Coach
   */
  public async askCoach(userMessage: string, user: UserProfile): Promise<AICoachResponse> {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const query = userMessage.toLowerCase();

    if (query.includes('ai engineer') || query.includes('roadmap') || query.includes('what should i learn next')) {
      return {
        answer: `Great question, ${user.name}! Based on your current level (${user.currentSkillLevel}) and your goal of becoming an ${user.careerGoal}, here is your hyper-personalized 8-step roadmap to mastery. Focus on high-yield building over passive tutorial consumption:`,
        suggestedRoadmap: [
          { step: 1, title: 'Python & NumPy Vectorization', desc: 'Master broadcasting, vectorized tensor ops without slow loops.' },
          { step: 2, title: 'PyTorch Neural Foundations', desc: 'Autograd, Tensor creation, and building your first Multi-Layer Perceptron.' },
          { step: 3, title: 'Transformer Architectures', desc: 'Self-Attention math, QKV projections, LayerNorm, and RoPE positional embeddings.' },
          { step: 4, title: 'RAG Systems (Retrieval-Augmented Gen)', desc: 'Chunking strategies, embedding vectors, Pinecone/pgvector indexing.' },
          { step: 5, title: 'Fine-Tuning & Quantization (PEFT/LoRA)', desc: 'LoRA adapters, 4-bit QLoRA on open-weights like Llama-3.' },
          { step: 6, title: 'Autonomous Multi-Agent Frameworks', desc: 'Tool calling, memory management, and structured JSON output guards.' },
          { step: 7, title: 'Production Latency & vLLM Serving', desc: 'KV cache paging, Speculative Decoding, and continuous batching.' },
          { step: 8, title: 'End-to-End Capstone Project', desc: 'Deploy an agent that reads codebase PRs and autonomously drafts unit tests.' },
        ],
        actionPrompt: 'Enroll in "Become an AI Engineer" Learning Path',
        xpBonus: 25,
      };
    }

    if (query.includes('test my knowledge') || query.includes('quiz')) {
      return {
        answer: `Let's test your mental model! Here is a challenge on modern scalable architecture:\n\n**Question:** You have a read-heavy web feed (like SkillReel) with 50,000 requests/second. What caching pattern prevents the "Thundering Herd" cache stampede when an item key expires?\n\n**Options:**\n1. Cache-Aside with probabilistic early expiration (XFetch)\n2. Immediate synchronous DB read on every miss\n3. Disabling Redis TTL completely\n4. Polling SQL every 5ms`,
        suggestedRoadmap: undefined,
        actionPrompt: 'Option 1 is correct! Probabilistic early recalculation prevents all 50k requests hitting the DB simultaneously.',
        xpBonus: 15,
      };
    }

    if (query.includes('project') || query.includes('give me a project')) {
      return {
        answer: `Here is a high-impact portfolio project that impresses senior hiring managers:\n\n**Project: AI-Powered Code Review Reel Generator**\n• Takes a GitHub Pull Request diff\n• Uses an LLM to find subtle performance regressions\n• Formats the finding into a 30-second bulleted video summary with a live challenge quiz!\n\nThis demonstrates TypeScript, OpenAI/Gemini SDK, AST parsing, and social sharing capabilities!`,
        actionPrompt: 'Save Project Idea to My Library',
        xpBonus: 20,
      };
    }

    return {
      answer: `Hello ${user.name}! I am your SkillReel AI Coach. Your current streak is **${user.streakDays} days** and you have amassed **${user.xp} XP**.\n\nI can help you build custom roadmaps, explain complex algorithms simply with analogies, generate coding challenges, or recommend the highest-impact Reels for your goals. What skill do you want to accelerate right now?`,
    };
  }
}

export const aiService = new AIService();
