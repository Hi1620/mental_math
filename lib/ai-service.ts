export interface GamePerformance {
  gameType: 'math' | 'memory' | 'puzzle' | 'logic'
  score: number
  accuracy: number
  timeSpent: number
  totalTime: number
  difficulty: string
  date: string
}

export interface CoachPrediction {
  brainScore: number
  predictedScore: number
  strongestSkill: string
  weakestSkill: string
  trend: 'upward' | 'steady' | 'downward'
  confidence: number
}

export interface CoachInsight {
  motivation: string
  explanation: string
  dailyPlan: string[]
  recommendedGames: string[]
  estimatedImprovement: string
  personalizedTips: string[]
}

export interface CoachPayload extends CoachPrediction, CoachInsight {}

export interface PerformanceAnalysis {
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  nextSteps: string[]
  motivationalMessage: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_AI_API_URL ?? 'http://127.0.0.1:8000'

function buildFallbackCoachPayload(userId: string): CoachPayload {
  return {
    brainScore: 84,
    predictedScore: 88,
    strongestSkill: 'Logic',
    weakestSkill: 'Memory',
    trend: 'upward',
    confidence: 0.9,
    motivation: `Your next session is shaping up well, ${userId}. Keep the pace steady and let the momentum build.`,
    explanation: 'Your model highlights strong logical reasoning and a clear opportunity to sharpen memory-focused recall.',
    dailyPlan: ['Complete one focused session today', 'Practice memory drills for 10 minutes', 'Finish with a short reflection on your progress'],
    recommendedGames: ['Memory Forest', 'Logic Arena', 'Math Sprint'],
    estimatedImprovement: '+6% this week',
    personalizedTips: ['Use short bursts of practice instead of long marathons.', 'Prioritize accuracy before speed.', 'Review one weak area after each session.'],
  }
}

export async function fetchCoachPayload(userId: string = 'demo-user'): Promise<CoachPayload> {
  try {
    const [predictionResponse, coachResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      }),
      fetch(`${API_BASE_URL}/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      }),
    ])

    if (!predictionResponse.ok || !coachResponse.ok) {
      return buildFallbackCoachPayload(userId)
    }

    const prediction = (await predictionResponse.json()) as CoachPrediction
    const insight = (await coachResponse.json()) as CoachInsight

    return {
      ...prediction,
      ...insight,
    }
  } catch {
    return buildFallbackCoachPayload(userId)
  }
}

export async function analyzeGamePerformance(performance: GamePerformance): Promise<PerformanceAnalysis> {
  return {
    strengths: [
      `Consistent performance in ${performance.gameType} challenges`,
      `Strong execution under ${performance.difficulty.toLowerCase()} conditions`,
    ],
    weaknesses: ['Focus on accuracy before speed', 'Reduce hint dependency during harder rounds'],
    recommendations: ['Practice a short session daily', 'Try a slightly harder difficulty next round'],
    nextSteps: ['Complete one extra round today', 'Review your weakest area tomorrow'],
    motivationalMessage: 'You are building real momentum. Keep the streak alive.',
  }
}

export async function generateDailyInsight(performances: GamePerformance[]): Promise<string> {
  const summary = performances
    .map((performance) => `${performance.gameType}: ${performance.accuracy}% accuracy`)
    .join(' • ')

  return `Your recent sessions show ${summary}. Keep the rhythm going and your brain score will rise.`
}

export async function suggestAdaptiveDifficulty(
  gameType: string,
  recentAccuracies: number[]
): Promise<{ suggestedDifficulty: string; reason: string }> {
  const avgAccuracy = recentAccuracies.reduce((a, b) => a + b, 0) / recentAccuracies.length
  return {
    suggestedDifficulty: avgAccuracy > 80 ? 'Hard' : avgAccuracy > 60 ? 'Medium' : 'Easy',
    reason: `Based on your recent ${gameType} performance`,
  }
}
