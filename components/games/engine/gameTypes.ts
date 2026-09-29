export type GameType =
    | 'math'
    | 'memory'
    | 'logic'
    | 'puzzle'

export type Difficulty =
    | 'easy'
    | 'medium'
    | 'hard'
    | 'expert'
    | 'adaptive'

export interface GameMetrics {
    score: number
    accuracy: number
    timeSpent: number
    totalTime: number
    questionsAnswered: number
    correctAnswers: number
    streak: number
    bestStreak: number
    difficulty: Difficulty
}

export interface GameResult extends GameMetrics {
    gameName: string
    gameType: GameType
    xpEarned: number
    rank: string
}