export type GameCategory = 'math' | 'memory' | 'puzzle' | 'logic'
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard'

export interface GameDefinition {
  id: string
  name: string
  description: string
  category: GameCategory
  path: string
  difficulty: DifficultyLevel
  estimatedTime: number // in minutes
  icon?: string
  component: string // component name for type checking
}

export const GAMES: GameDefinition[] = [
  // MATH GAMES
  {
    id: 'math-challenge',
    name: 'Math Challenge',
    description: 'Test your calculation accuracy and mathematical reasoning.',
    category: 'math',
    path: '/games/math/basic',
    difficulty: 'Medium',
    estimatedTime: 3,
    icon: '🔢',
    component: 'MathGame',
  },
  {
    id: 'equation-master',
    name: 'Equation Master',
    description: 'Solve equations under time pressure and maintain your accuracy streak.',
    category: 'math',
    path: '/games/math/equation-master',
    difficulty: 'Medium',
    estimatedTime: 3,
    icon: '📐',
    component: 'EquationMaster',
  },
  {
    id: 'mental-math-sprint',
    name: 'Mental Math Sprint',
    description: 'Perform rapid calculations and improve your mental arithmetic speed.',
    category: 'math',
    path: '/games/math/mental-math-sprint',
    difficulty: 'Hard',
    estimatedTime: 3,
    icon: '⚡',
    component: 'MentalMathSprint',
  },
  {
    id: 'number-sequence',
    name: 'Number Sequence',
    description: 'Identify numerical patterns and predict what comes next.',
    category: 'math',
    path: '/games/math/number-sequence',
    difficulty: 'Medium',
    estimatedTime: 3,
    icon: '🔗',
    component: 'NumberSequence',
  },

  // MEMORY GAMES
  {
    id: 'memory-game',
    name: 'Memory Match',
    description: 'Match pairs and test your memory skills.',
    category: 'memory',
    path: '/games/memory/game',
    difficulty: 'Easy',
    estimatedTime: 3,
    icon: '🧠',
    component: 'MemoryGame',
  },
  {
    id: 'memory-matrix',
    name: 'Memory Matrix',
    description: 'Remember the pattern of highlighted cells.',
    category: 'memory',
    path: '/games/memory/matrix',
    difficulty: 'Medium',
    estimatedTime: 3,
    icon: '📊',
    component: 'MemoryMatrix',
  },
  {
    id: 'memory-sequence',
    name: 'Memory Sequence',
    description: 'Recall and reproduce the sequence you just saw.',
    category: 'memory',
    path: '/games/memory/memory-sequence',
    difficulty: 'Medium',
    estimatedTime: 3,
    icon: '🎯',
    component: 'MemorySequence',
  },
  {
    id: 'sequence-recall',
    name: 'Sequence Recall',
    description: 'Memorize and recall patterns of increasing difficulty.',
    category: 'memory',
    path: '/games/memory/sequence-recall',
    difficulty: 'Hard',
    estimatedTime: 3,
    icon: '🔄',
    component: 'SequenceRecall',
  },

  // PUZZLE GAMES
  {
    id: 'sliding-puzzle',
    name: 'Sliding Puzzle',
    description: 'Arrange tiles in the correct order to complete the puzzle.',
    category: 'puzzle',
    path: '/games/puzzle/sliding',
    difficulty: 'Hard',
    estimatedTime: 5,
    icon: '🧩',
    component: 'PuzzleGame',
  },
  {
    id: 'arrow-flow-maze',
    name: 'Arrow Flow Maze',
    description: 'Navigate through the maze following the arrow directions.',
    category: 'puzzle',
    path: '/games/puzzle/arrow-flow',
    difficulty: 'Hard',
    estimatedTime: 5,
    icon: '↗️',
    component: 'ArrowFlowMaze',
  },

  // LOGIC GAMES
  {
    id: 'logic-game',
    name: 'Logic Puzzle',
    description: 'Solve logic and pattern recognition puzzles.',
    category: 'logic',
    path: '/games/logic/game',
    difficulty: 'Medium',
    estimatedTime: 3,
    icon: '⚡',
    component: 'LogicGame',
  },
  {
    id: 'deduction-grid',
    name: 'Deduction Grid',
    description: 'Use logical deduction to solve the grid.',
    category: 'logic',
    path: '/games/logic/deduction-grid',
    difficulty: 'Hard',
    estimatedTime: 5,
    icon: '🔍',
    component: 'DeductionGrid',
  },
  {
    id: 'rule-breaker',
    name: 'Rule Breaker',
    description: 'Identify the rules and break the pattern.',
    category: 'logic',
    path: '/games/logic/rule-breaker',
    difficulty: 'Hard',
    estimatedTime: 5,
    icon: '🚫',
    component: 'RuleBreaker',
  },
  {
    id: 'sequence-master',
    name: 'Sequence Master',
    description: 'Master complex sequences and logical progressions.',
    category: 'logic',
    path: '/games/logic/sequence-master',
    difficulty: 'Hard',
    estimatedTime: 5,
    icon: '📈',
    component: 'SequenceMaster',
  },
]

/**
 * Get all games in a specific category
 */
export function getGamesByCategory(category: GameCategory): GameDefinition[] {
  return GAMES.filter(game => game.category === category)
}

/**
 * Get a single game by ID
 */
export function getGameById(id: string): GameDefinition | undefined {
  return GAMES.find(game => game.id === id)
}

/**
 * Get all games
 */
export function getAllGames(): GameDefinition[] {
  return GAMES
}

/**
 * Get category info
 */
export const CATEGORY_INFO: Record<GameCategory, { label: string; description: string; emoji: string }> = {
  math: {
    label: 'Mathematics',
    description: 'Challenge your calculation speed and numerical reasoning',
    emoji: '🔢',
  },
  memory: {
    label: 'Memory',
    description: 'Test and enhance your memory and recall abilities',
    emoji: '🧠',
  },
  puzzle: {
    label: 'Puzzle',
    description: 'Solve spatial and logical puzzles',
    emoji: '🧩',
  },
  logic: {
    label: 'Logic',
    description: 'Master pattern recognition and logical thinking',
    emoji: '⚡',
  },
}
