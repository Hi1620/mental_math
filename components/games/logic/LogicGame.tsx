'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Brain, Flame, Target } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { GameHeader } from '../shared/GameHeader'
import { GameResults } from '../shared/GameResults'

interface LogicQuestion {
  id: number
  difficulty: number
  category: string
  question: string
  options: string[]
  correct: number
}

const questionBank: LogicQuestion[] = [
  {
    id: 1,
    difficulty: 1,
    category: 'Deduction',
    question: 'All roses are flowers. All flowers need water. Therefore, roses need water.',
    options: ['True', 'False'],
    correct: 0,
  },
  {
    id: 2,
    difficulty: 1,
    category: 'Sequence',
    question: 'Complete: 2, 4, 8, 16, ?',
    options: ['24', '32', '40', '48'],
    correct: 1,
  },
  {
    id: 3,
    difficulty: 1,
    category: 'Pattern',
    question: 'What comes next? A, C, E, G, ?',
    options: ['H', 'I', 'J', 'K'],
    correct: 1,
  },
  {
    id: 4,
    difficulty: 2,
    category: 'Sequence',
    question: 'What comes next? 1, 4, 9, 16, ?',
    options: ['20', '24', '25', '30'],
    correct: 2,
  },
  {
    id: 5,
    difficulty: 2,
    category: 'Classification',
    question: 'Which does not belong?',
    options: ['Circle', 'Triangle', 'Rectangle', 'Sphere'],
    correct: 3,
  },
  {
    id: 6,
    difficulty: 2,
    category: 'Deduction',
    question: 'All dogs are animals. Some animals are pets. Are all dogs definitely pets?',
    options: ['Yes', 'No', 'Cannot determine', 'Always'],
    correct: 2,
  },
  {
    id: 7,
    difficulty: 3,
    category: 'Sequence',
    question: 'What comes next? 1, 1, 2, 3, 5, 8, ?',
    options: ['11', '12', '13', '14'],
    correct: 2,
  },
  {
    id: 8,
    difficulty: 3,
    category: 'Calendar',
    question: 'If today is Wednesday, what day is it 100 days later?',
    options: ['Monday', 'Wednesday', 'Friday', 'Thursday'],
    correct: 2,
  },
  {
    id: 9,
    difficulty: 4,
    category: 'Deduction',
    question: 'Some A are B. All B are C. Which statement must be true?',
    options: [
      'Some A are C',
      'All A are C',
      'No A are C',
      'All C are A',
    ],
    correct: 0,
  },
  {
    id: 10,
    difficulty: 4,
    category: 'Pattern',
    question: 'Find the next number: 2, 6, 12, 20, 30, ?',
    options: ['36', '40', '42', '44'],
    correct: 2,
  },
  {
    id: 11,
    difficulty: 5,
    category: 'Reasoning',
    question: 'If every blue object is heavy and some boxes are blue, what can be concluded?',
    options: [
      'Some boxes are heavy',
      'All boxes are heavy',
      'No boxes are heavy',
      'Nothing',
    ],
    correct: 0,
  },
  {
    id: 12,
    difficulty: 5,
    category: 'Logic',
    question: 'If A implies B and B implies C, what follows when A is true?',
    options: ['C is true', 'C is false', 'B is false', 'Nothing'],
    correct: 0,
  },
]

export function LogicGame() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [difficulty, setDifficulty] = useState(2)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const question = useMemo(() => {
    const available = questionBank.filter(q => q.difficulty <= difficulty)
    return available[currentIndex % available.length]
  }, [currentIndex, difficulty])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowResults(true)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAnswer = (index: number) => {
    if (answered) return

    const correct = index === question.correct

    setSelectedAnswer(index)
    setAnswered(true)
    setQuestionsAnswered(prev => prev + 1)

    if (correct) {
      setCorrectAnswers(prev => prev + 1)

      setScore(prev => prev + 10 + difficulty * 3)

      setStreak(prev => prev + 1)

      if (difficulty < 5) {
        setDifficulty(prev => prev + 1)
      }
    } else {
      setStreak(0)

      if (difficulty > 1) {
        setDifficulty(prev => prev - 1)
      }
    }
  }

  const nextQuestion = () => {
    if (questionsAnswered >= 10) {
      setShowResults(true)
      return
    }

    setCurrentIndex(prev => prev + 1)
    setSelectedAnswer(null)
    setAnswered(false)
  }

  if (showResults) {
    const accuracy =
      questionsAnswered > 0
        ? Math.round((correctAnswers / questionsAnswered) * 100)
        : 0

    return (
      <GameResults
        gameName="Adaptive Logic"
        gameType="logic"
        score={score}
        maxScore={250}
        accuracy={accuracy}
        timeSpent={180 - timeLeft}
        totalTime={180}
        difficulty={`Adaptive · Level ${difficulty}`}
        xpEarned={score * 2}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-5">
      <div className="mx-auto max-w-4xl">

        <GameHeader
          title="Adaptive Logic"
          timeLeft={timeLeft}
          score={score}
          onQuit={() => setShowResults(true)}
        />

        <div className="mb-6 grid grid-cols-3 gap-3">

          <div className="gaming-card p-3 text-center">
            <Brain size={17} className="mx-auto mb-1 text-neon" />
            <p className="text-xs text-gray-400">Level</p>
            <p className="text-lg font-bold text-neon">
              {difficulty}
            </p>
          </div>

          <div className="gaming-card p-3 text-center">
            <Target size={17} className="mx-auto mb-1 text-blue-400" />
            <p className="text-xs text-gray-400">Accuracy</p>
            <p className="text-lg font-bold text-blue-400">
              {questionsAnswered
                ? Math.round((correctAnswers / questionsAnswered) * 100)
                : 0}%
            </p>
          </div>

          <div className="gaming-card p-3 text-center">
            <Flame size={17} className="mx-auto mb-1 text-orange-400" />
            <p className="text-xs text-gray-400">Streak</p>
            <p className="text-lg font-bold text-orange-400">
              {streak}
            </p>
          </div>

        </div>

        <div className="mb-6">
          <div className="mb-2 flex justify-between text-xs">
            <span>Question {questionsAnswered + 1}/10</span>
            <span className="text-gray-400">
              Adaptive challenge
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              animate={{
                width: `${Math.min((questionsAnswered / 10) * 100, 100)}%`,
              }}
              className="h-full bg-neon"
            />
          </div>
        </div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="gaming-card p-6"
        >

          <div className="mb-5 flex items-center justify-between">
            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-400">
              {question.category}
            </span>

            <span className="text-xs text-gray-500">
              Difficulty {question.difficulty}/5
            </span>
          </div>

          <h2 className="mb-7 text-center text-lg font-semibold leading-relaxed md:text-xl">
            {question.question}
          </h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

            {question.options.map((option, index) => (
              <button
                key={index}
                disabled={answered}
                onClick={() => handleAnswer(index)}
                className={`rounded-xl border p-4 text-sm font-medium transition-all ${
                  !answered
                    ? 'border-white/10 bg-white/[0.03] hover:border-neon/50 hover:bg-white/5'
                    : index === question.correct
                      ? 'border-green-500/60 bg-green-500/10 text-green-400'
                      : index === selectedAnswer
                        ? 'border-red-500/60 bg-red-500/10 text-red-400'
                        : 'border-white/5 opacity-40'
                }`}
              >
                {option}
              </button>
            ))}

          </div>

          {answered && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={nextQuestion}
                className="gaming-button flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-black"
              >
                {questionsAnswered >= 10 ? 'View Results' : 'Next'}
                <ArrowRight size={16} />
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  )
}