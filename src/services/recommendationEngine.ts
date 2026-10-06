import { Reel, UserProfile } from '../types';

export interface RecommendationWeights {
  interestWeight: number; // 35%
  careerGoalWeight: number; // 25%
  completionRateWeight: number; // 20%
  difficultyMatchWeight: number; // 10%
  trendingWeight: number; // 10%
}

export const DEFAULT_WEIGHTS: RecommendationWeights = {
  interestWeight: 0.35,
  careerGoalWeight: 0.25,
  completionRateWeight: 0.20,
  difficultyMatchWeight: 0.10,
  trendingWeight: 0.10,
};

/**
 * Calculates a personalized relevance score for a Reel given user preferences,
 * learning goals, and watch history signals.
 */
export function calculateReelRelevanceScore(
  reel: Reel,
  user: UserProfile,
  weights: RecommendationWeights = DEFAULT_WEIGHTS
): number {
  let score = 0;

  // 1. Direct interest match
  const matchesInterest = user.selectedInterests.some(
    (interest) =>
      reel.skillCategory.toLowerCase().includes(interest.toLowerCase()) ||
      reel.hashtags.some((tag) => tag.toLowerCase().includes(interest.toLowerCase()))
  );
  if (matchesInterest) {
    score += 100 * weights.interestWeight;
  }

  // 2. Career Goal alignment
  const careerKeywords = user.careerGoal.toLowerCase().split(' ');
  const matchesCareer = careerKeywords.some(
    (kw) =>
      kw.length > 2 &&
      (reel.title.toLowerCase().includes(kw) ||
        reel.skillCategory.toLowerCase().includes(kw) ||
        reel.description.toLowerCase().includes(kw))
  );
  if (matchesCareer) {
    score += 100 * weights.careerGoalWeight;
  }

  // 3. Difficulty Level Match (progressive challenge)
  if (reel.difficulty === user.currentSkillLevel) {
    score += 100 * weights.difficultyMatchWeight;
  } else if (
    (user.currentSkillLevel === 'Beginner' && reel.difficulty === 'Intermediate') ||
    (user.currentSkillLevel === 'Intermediate' && reel.difficulty === 'Advanced')
  ) {
    // Progressive step up
    score += 75 * weights.difficultyMatchWeight;
  }

  // 4. Content Engagement & Quality (Likes/Views ratio + saves)
  const saveRate = reel.viewsCount > 0 ? (reel.savesCount / reel.viewsCount) * 1000 : 50;
  const engagementNormalized = Math.min(100, saveRate * 2.5);
  score += engagementNormalized * weights.completionRateWeight;

  // 5. Trending / Freshness
  const trendBonus = Math.min(100, (reel.likesCount / 500));
  score += trendBonus * weights.trendingWeight;

  return Math.round(score);
}

/**
 * Sorts and diversifies the Reels feed so that the user gets high relevance
 * without seeing the exact same skill category repeatedly.
 */
export function rankAndDiversifyFeed(reels: Reel[], user: UserProfile): Reel[] {
  const scored = reels.map((reel) => ({
    ...reel,
    recommendedScore: calculateReelRelevanceScore(reel, user),
  }));

  // Sort descending by score
  scored.sort((a, b) => (b.recommendedScore || 0) - (a.recommendedScore || 0));

  // Progressive diversification: avoid 2 consecutive reels with identical skillCategory
  const diversified: Reel[] = [];
  const remaining = [...scored];

  while (remaining.length > 0) {
    if (diversified.length === 0) {
      diversified.push(remaining.shift()!);
      continue;
    }

    const lastCategory = diversified[diversified.length - 1].skillCategory;
    const diffCategoryIndex = remaining.findIndex((r) => r.skillCategory !== lastCategory);

    if (diffCategoryIndex !== -1 && diffCategoryIndex < 3) {
      // Pick the next best non-consecutive category
      const [chosen] = remaining.splice(diffCategoryIndex, 1);
      diversified.push(chosen);
    } else {
      diversified.push(remaining.shift()!);
    }
  }

  return diversified;
}
