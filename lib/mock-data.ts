import { GamePerformance } from './ai-service'

export interface MockUserData {
  userId: string
  userName: string
  totalXP: number
  currentStreak: number
  gameHistory: GamePerformance[]
  stats: {
    mathAvgAccuracy: number
    memoryAvgAccuracy: number
    puzzleAvgAccuracy: number
    logicAvgAccuracy: number
    totalGamesPlayed: number
    favoriteGame: string
  }
}

export function generateMockUserData(): MockUserData {
  const today = new Date()
  const gameHistory: GamePerformance[] = []

  // Generate 4 weeks of mock gameplay data
  for (let i = 28; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    // 1-3 games per day
    const gamesPerDay = Math.floor(Math.random() * 3) + 1
    const gameTypes: Array<'math' | 'memory' | 'puzzle' | 'logic'> = [
      'math',
      'memory',
      'puzzle',
      'logic',
    ]
    const difficulties = ['Easy', 'Medium', 'Hard']

    for (let j = 0; j < gamesPerDay; j++) {
      const gameType = gameTypes[Math.floor(Math.random() * gameTypes.length)]
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)]

      let accuracy = 0
      // Simulate improvement over time
      const progressMultiplier = 1 + i / 100
      if (gameType === 'math') {
        accuracy = Math.max(40, Math.min(95, 65 + Math.random() * 30 - progressMultiplier * 5))
      } else if (gameType === 'memory') {
        accuracy = Math.max(35, Math.min(90, 60 + Math.random() * 25 - progressMultiplier * 4))
      } else if (gameType === 'puzzle') {
        accuracy = Math.max(50, Math.min(98, 70 + Math.random() * 25 - progressMultiplier * 5))
      } else {
        accuracy = Math.max(45, Math.min(92, 62 + Math.random() * 28 - progressMultiplier * 4))
      }

      gameHistory.push({
        gameType,
        score: Math.floor(accuracy * 10),
        accuracy: Math.round(accuracy),
        timeSpent: Math.floor(30 + Math.random() * 120),
        totalTime: difficulty === 'Easy' ? 180 : difficulty === 'Medium' ? 240 : 300,
        difficulty,
        date: dateStr,
      })
    }
  }

  const mathGames = gameHistory.filter((g) => g.gameType === 'math')
  const memoryGames = gameHistory.filter((g) => g.gameType === 'memory')
  const puzzleGames = gameHistory.filter((g) => g.gameType === 'puzzle')
  const logicGames = gameHistory.filter((g) => g.gameType === 'logic')

  const calculateAverage = (games: GamePerformance[]) =>
    games.length > 0 ? Math.round(games.reduce((a, b) => a + b.accuracy, 0) / games.length) : 0

  const mathAvg = calculateAverage(mathGames)
  const memoryAvg = calculateAverage(memoryGames)
  const puzzleAvg = calculateAverage(puzzleGames)
  const logicAvg = calculateAverage(logicGames)

  const gameTypeAvgs = [
    { type: 'math', avg: mathAvg },
    { type: 'memory', avg: memoryAvg },
    { type: 'puzzle', avg: puzzleAvg },
    { type: 'logic', avg: logicAvg },
  ]
  const favoriteGame = gameTypeAvgs.reduce((a, b) => (a.avg > b.avg ? a : b)).type

  return {
    userId: 'user_12345',
    userName: 'Pro Player',
    totalXP: gameHistory.length * 50 + Math.floor(Math.random() * 1000),
    currentStreak: Math.floor(Math.random() * 20) + 3,
    gameHistory,
    stats: {
      mathAvgAccuracy: mathAvg,
      memoryAvgAccuracy: memoryAvg,
      puzzleAvgAccuracy: puzzleAvg,
      logicAvgAccuracy: logicAvg,
      totalGamesPlayed: gameHistory.length,
      favoriteGame,
    },
  }
}

export function getTodayGames(userData: MockUserData): GamePerformance[] {
  const today = new Date().toISOString().split('T')[0]
  return userData.gameHistory.filter((g) => g.date === today)
}

export function getWeekGames(userData: MockUserData): GamePerformance[] {
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  return userData.gameHistory.filter((g) => {
    const gameDate = new Date(g.date)
    return gameDate >= weekAgo && gameDate <= today
  })
}

export function getRecentAccuracies(
  userData: MockUserData,
  gameType: string,
  limit: number = 5
): number[] {
  return userData.gameHistory
    .filter((g) => g.gameType === gameType)
    .slice(-limit)
    .map((g) => g.accuracy)
}
