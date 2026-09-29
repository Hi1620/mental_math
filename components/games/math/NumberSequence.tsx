'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Bot, Brain, Clock, Lightbulb, User, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { GameResults } from '../shared/GameResults'

type Mode = 'single' | 'duel'

interface SequenceQuestion {
  sequence: number[]
  options: number[]
  correct: number
  hint: string
  explanation: string
}

const questions: SequenceQuestion[] = [
  {
    sequence: [2, 4, 6, 8],
    options: [10, 11, 12, 14],
    correct: 0,
    hint: 'Look at the difference between consecutive numbers.',
    explanation: 'The sequence increases by 2 each time.',
  },
  {
    sequence: [3, 6, 12, 24],
    options: [36, 42, 48, 54],
    correct: 2,
    hint: 'The numbers are growing faster than a simple addition pattern.',
    explanation: 'Each number is multiplied by 2.',
  },
  {
    sequence: [1, 4, 9, 16],
    options: [20, 24, 25, 30],
    correct: 2,
    hint: 'Think about square numbers.',
    explanation: 'These are 1², 2², 3² and 4². The next is 5² = 25.',
  },
  {
    sequence: [5, 10, 20, 40],
    options: [60, 70, 80, 90],
    correct: 2,
    hint: 'Each step follows the same multiplication rule.',
    explanation: 'Each number is doubled.',
  },
  {
    sequence: [2, 6, 12, 20],
    options: [28, 30, 32, 36],
    correct: 1,
    hint: 'Look at the differences: 4, 6, 8...',
    explanation: 'The differences increase by 2, so the next difference is 10. 20 + 10 = 30.',
  },
  {
    sequence: [1, 1, 2, 3, 5, 8],
    options: [11, 12, 13, 15],
    correct: 2,
    hint: 'The previous two numbers create the next number.',
    explanation: 'This is the Fibonacci pattern. 5 + 8 = 13.',
  },
  {
    sequence: [100, 90, 81, 73],
    options: [64, 65, 66, 67],
    correct: 1,
    hint: 'The amount being subtracted changes.',
    explanation: 'Subtract 10, then 9, then 8, then 7. 73 - 7 = 66.',
  },
  {
    sequence: [4, 8, 16, 32],
    options: [48, 56, 64, 72],
    correct: 2,
    hint: 'Try multiplication instead of addition.',
    explanation: 'Each number is multiplied by 2. 32 × 2 = 64.',
  },
  {
    sequence: [7, 14, 28, 56],
    options: [84, 98, 112, 120],
    correct: 2,
    hint: 'The pattern is consistent.',
    explanation: 'Every number is doubled. 56 × 2 = 112.',
  },
  {
    sequence: [1, 3, 6, 10, 15],
    options: [18, 20, 21, 24],
    correct: 2,
    hint: 'Look at the increasing differences.',
    explanation: 'Add 2, 3, 4, 5, then 6. 15 + 6 = 21.',
  },
]

export function NumberSequence() {
  const [mode, setMode] = useState<Mode | null>(null)
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showHelper, setShowHelper] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)
  const [aiLastAnswer, setAiLastAnswer] = useState<boolean | null>(null)

  const question = questions[current]

  const progress = ((current + 1) / questions.length) * 100

  /*
   * AI difficulty is intentionally imperfect.
   *
   * The AI has different accuracy depending on the question.
   * This prevents it from getting 100% every game.
   */
  const aiAccuracy = useMemo(() => {
    const values = [0.62, 0.72, 0.84, 0.68, 0.76, 0.9, 0.64, 0.8, 0.7, 0.86]
    return values[current] ?? 0.75
  }, [current])

  useEffect(() => {
    if (!mode || showResults) return

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
  }, [mode, showResults])

  /*
   * AI plays after the player answers.
   */
  useEffect(() => {
    if (mode !== 'duel' || !answered || showResults) return

    setAiThinking(true)

    const delay = 700 + Math.random() * 1000

    const timer = setTimeout(() => {
      const correct = Math.random() < aiAccuracy

      setAiLastAnswer(correct)

      if (correct) {
        setAiScore(prev => prev + 10)
      }

      setAiThinking(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [answered, current, mode, showResults, aiAccuracy])

  const startGame = (selectedMode: Mode) => {
    setMode(selectedMode)
    setCurrent(0)
    setScore(0)
    setAiScore(0)
    setTimeLeft(120)
    setSelected(null)
    setAnswered(false)
    setShowResults(false)
    setShowHelper(false)
    setAiLastAnswer(null)
  }

  const handleAnswer = (index: number) => {
    if (answered) return

    setSelected(index)
    setAnswered(true)

    if (index === question.correct) {
      setScore(prev => prev + 10)
    }
  }

  const nextQuestion = () => {
    if (current >= questions.length - 1) {
      setShowResults(true)
      return
    }

    setCurrent(prev => prev + 1)
    setSelected(null)
    setAnswered(false)
    setShowHelper(false)
    setAiLastAnswer(null)
  }

  if (!mode) {
    return (
      <div className="min-h-screen bg-background px-5 py-6">
        <div className="mx-auto flex min-h-[85vh] max-w-5xl flex-col">

          <button
            onClick={() => window.history.back()}
            className="flex w-fit items-center gap-2 text-sm text-gray-400 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="mt-16 max-w-2xl">

            <div className="flex gap-2">
              <span className="rounded-md bg-yellow-400 px-3 py-1 text-xs font-bold text-black">
                MATH
              </span>

              <span className="rounded-md bg-white/10 px-3 py-1 text-xs font-bold">
                1 MIN DUEL
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-6xl font-black uppercase leading-[0.9] sm:text-8xl"
            >
              NUMBER
              <br />
              SEQUENCE
            </motion.h1>

            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Find the hidden pattern before the clock runs out
            </p>

          </div>

          <div className="mt-auto grid gap-4 pb-8 md:grid-cols-2">

            <button
              onClick={() => startGame('duel')}
              className="rounded-2xl border border-yellow-400 bg-yellow-400 px-6 py-5 text-lg font-black text-black shadow-[0_6px_0_#a88a00] transition hover:brightness-110 active:translate-y-1 active:shadow-none"
            >
              PLAY DUEL
            </button>

            <button
              onClick={() => startGame('single')}
              className="rounded-2xl border border-white/20 bg-white/[0.06] px-6 py-5 text-lg font-black transition hover:border-neon/50 hover:bg-white/10"
            >
              PLAY SOLO
            </button>

          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <Brain size={15} />
            AI helper available during Solo mode
          </div>

        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <GameResults
        gameName="Number Sequence"
        gameType="math"
        score={score}
        maxScore={100}
        accuracy={score}
        timeSpent={120 - timeLeft}
        totalTime={120}
        difficulty="Adaptive"
        xpEarned={score * 2}
      />
    )
  }

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="gaming-card p-4 mb-6">

          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="text-xs text-neon font-semibold">
                {mode === 'duel' ? 'AI DUEL' : 'SINGLE PLAYER'}
              </p>

              <h1 className="text-lg sm:text-xl font-bold">
                Number Sequence
              </h1>
            </div>

            <div className="flex items-center gap-3">

              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <Clock size={16} className="text-neon" />

                <span className="text-sm font-mono font-semibold">
                  {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <Zap size={16} className="text-neon" />

                <span className="text-sm font-semibold">
                  {score}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* DUEL SCOREBOARD */}

        {mode === 'duel' && (
          <div className="grid grid-cols-2 gap-3 mb-5">

            <div className="gaming-card p-3">
              <div className="flex items-center gap-2">
                <User size={16} className="text-neon" />
                <span className="text-xs text-gray-400">
                  YOU
                </span>
              </div>

              <p className="text-xl font-bold text-neon mt-1">
                {score}
              </p>
            </div>

            <div className="gaming-card p-3">
              <div className="flex items-center gap-2">
                <Bot size={16} className="text-purple-400" />
                <span className="text-xs text-gray-400">
                  AI
                </span>
              </div>

              <p className="text-xl font-bold text-purple-400 mt-1">
                {aiScore}
              </p>
            </div>

          </div>
        )}

        {/* PROGRESS */}

        <div className="mb-6">

          <div className="flex justify-between mb-2">
            <span className="text-xs font-semibold">
              Question {current + 1}/{questions.length}
            </span>

            <span className="text-xs text-gray-500">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full bg-neon"
            />
          </div>

        </div>

        {/* QUESTION */}

        <motion.div
          key={current}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="gaming-card p-5 sm:p-7"
        >

          <div className="text-center mb-7">

            <p className="text-xs text-gray-500 mb-4">
              FIND THE NEXT NUMBER
            </p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {question.sequence.map((number, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="min-w-[55px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-lg font-semibold"
                >
                  {number}
                </motion.div>
              ))}

              <div className="min-w-[55px] px-4 py-3 rounded-xl bg-neon/10 border border-neon/40 text-lg font-bold text-neon">
                ?
              </div>
            </div>

          </div>

          {/* OPTIONS */}

          <div className="grid grid-cols-2 gap-3">

            {question.options.map((option, index) => {

              const isCorrect = index === question.correct
              const isSelected = selected === index

              let classes =
                'border-white/15 bg-white/[0.03] hover:border-neon/50'

              if (answered) {
                if (isCorrect) {
                  classes =
                    'border-green-500/70 bg-green-500/10 text-green-400'
                } else if (isSelected) {
                  classes =
                    'border-red-500/70 bg-red-500/10 text-red-400'
                } else {
                  classes =
                    'border-white/10 bg-white/[0.02] opacity-50'
                }
              }

              return (
                <motion.button
                  key={index}
                  whileHover={!answered ? { scale: 1.02 } : {}}
                  whileTap={!answered ? { scale: 0.98 } : {}}
                  disabled={answered}
                  onClick={() => handleAnswer(index)}
                  className={`p-4 rounded-xl border transition-all text-sm font-semibold ${classes}`}
                >
                  {option}
                </motion.button>
              )
            })}

          </div>

          {/* HELPER */}

          <div className="mt-5">

            <button
              onClick={() => setShowHelper(prev => !prev)}
              className="flex items-center gap-2 text-xs text-yellow-400 hover:text-yellow-300"
            >
              <Lightbulb size={15} />
              AI Helper
            </button>

            {showHelper && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
              >
                <p className="text-xs text-yellow-300 font-semibold mb-1">
                  HINT
                </p>

                <p className="text-sm text-gray-300">
                  {question.hint}
                </p>
              </motion.div>
            )}

          </div>

          {/* ANSWER FEEDBACK */}

          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5"
            >

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">

                <p className="text-xs font-semibold text-gray-400 mb-1">
                  {selected === question.correct
                    ? 'CORRECT'
                    : 'NOT QUITE'}
                </p>

                <p className="text-sm text-gray-300">
                  {question.explanation}
                </p>

              </div>

              <div className="flex justify-end mt-4">

                <button
                  onClick={nextQuestion}
                  className="gaming-button px-5 py-2.5 text-sm font-semibold text-black"
                >
                  {current >= questions.length - 1
                    ? 'FINISH GAME'
                    : 'NEXT QUESTION'}
                </button>

              </div>

            </motion.div>
          )}

        </motion.div>

        {/* AI PLAYER */}

        {mode === 'duel' && (
          <div className="gaming-card mt-5 p-4">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Bot size={18} className="text-purple-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    AI Opponent
                  </p>

                  <p className="text-xs text-gray-500">
                    {aiThinking
                      ? 'Analyzing sequence...'
                      : aiLastAnswer === null
                        ? 'Waiting for your answer'
                        : aiLastAnswer
                          ? 'Solved correctly'
                          : 'Made a mistake'}
                  </p>
                </div>

              </div>

              {aiThinking && (
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </main>
  )
}