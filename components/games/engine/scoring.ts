export interface ScoreInput {
  correct: boolean
  timeTaken: number
  timeLimit: number
  difficulty: number
  streak: number
}

export function calculateAnswerScore({
  correct,
  timeTaken,
  timeLimit,
  difficulty,
  streak,
}: ScoreInput) {
  if (!correct) return 0

  const baseScore = 100

  const speedRatio = Math.max(
    0,
    Math.min(1, 1 - timeTaken / timeLimit)
  )

  const speedBonus = Math.round(speedRatio * 50)

  const difficultyBonus = difficulty * 10

  const streakBonus = Math.min(streak * 5, 50)

  return (
    baseScore +
    speedBonus +
    difficultyBonus +
    streakBonus
  )
}

export function calculateAccuracy(
  correct: number,
  total: number
) {
  if (total === 0) return 0

  return Math.round((correct / total) * 100)
}

export function getPerformanceRank(accuracy: number) {
  if (accuracy >= 95) {
    return {
      rank: 'S',
      label: 'Exceptional',
    }
  }

  if (accuracy >= 85) {
    return {
      rank: 'A',
      label: 'Excellent',
    }
  }

  if (accuracy >= 75) {
    return {
      rank: 'B',
      label: 'Strong',
    }
  }

  if (accuracy >= 60) {
    return {
      rank: 'C',
      label: 'Developing',
    }
  }

  return {
    rank: 'D',
    label: 'Needs Practice',
  }
}