'use client'

import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  Clock,
  Flame,
  Lightbulb,
  Loader2,
  Swords,
  Target,
  Trophy,
  User,
  XCircle,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { GameResults } from '../shared/GameResults'

interface MathQuestion {
  id: number
  difficulty: number
  category: string
  question: string
  options: string[]
  correct: number
}

type GameMode = 'landing' | 'searching' | 'playing' | 'results'
type PlayType = 'single' | 'duel'

const questionBank: MathQuestion[] = [
  {
    id: 1,
    difficulty: 1,
    category: 'Arithmetic',
    question: 'What is 15 × 8?',
    options: ['110', '120', '130', '140'],
    correct: 1,
  },
  {
    id: 2,
    difficulty: 1,
    category: 'Percentage',
    question: 'What is 25% of 200?',
    options: ['25', '50', '75', '100'],
    correct: 1,
  },
  {
    id: 3,
    difficulty: 1,
    category: 'Square Root',
    question: 'What is √144?',
    options: ['10', '11', '12', '14'],
    correct: 2,
  },
  {
    id: 4,
    difficulty: 2,
    category: 'Algebra',
    question: 'Solve: 3x + 5 = 20',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
    correct: 2,
  },
  {
    id: 5,
    difficulty: 2,
    category: 'Powers',
    question: 'What is 2¹⁰?',
    options: ['512', '1024', '2048', '4096'],
    correct: 1,
  },
  {
    id: 6,
    difficulty: 2,
    category: 'Fractions',
    question: 'Simplify 12/18.',
    options: ['1/2', '2/3', '3/4', '4/5'],
    correct: 1,
  },
  {
    id: 7,
    difficulty: 3,
    category: 'Arithmetic',
    question: 'What is 45²?',
    options: ['1825', '2025', '2125', '2225'],
    correct: 1,
  },
  {
    id: 8,
    difficulty: 3,
    category: 'Arithmetic',
    question: 'Calculate 99 × 11.',
    options: ['1089', '1079', '1099', '1109'],
    correct: 0,
  },
  {
    id: 9,
    difficulty: 3,
    category: 'Number Theory',
    question: 'What is the GCD of 48 and 36?',
    options: ['6', '8', '10', '12'],
    correct: 3,
  },
  {
    id: 10,
    difficulty: 4,
    category: 'Algebra',
    question: 'If 2x - 7 = 15, what is x?',
    options: ['9', '10', '11', '12'],
    correct: 2,
  },
  {
    id: 11,
    difficulty: 4,
    category: 'Percentage',
    question: 'A ₹500 item increases by 20%. What is the new price?',
    options: ['₹550', '₹580', '₹600', '₹620'],
    correct: 2,
  },
  {
    id: 12,
    difficulty: 4,
    category: 'Sequence',
    question: 'What comes next: 3, 6, 12, 24, ?',
    options: ['36', '42', '48', '54'],
    correct: 2,
  },
  {
    id: 13,
    difficulty: 5,
    category: 'Algebra',
    question: 'If x + y = 12 and x - y = 4, what is x?',
    options: ['6', '8', '10', '12'],
    correct: 1,
  },
  {
    id: 14,
    difficulty: 5,
    category: 'Probability',
    question:
      'A fair coin is tossed twice. What is the probability of getting two heads?',
    options: ['1/2', '1/3', '1/4', '1/8'],
    correct: 2,
  },
]

const TOTAL_QUESTIONS = 10
const SINGLE_TIME = 60
const DUEL_TIME = 60

export function MathGame() {
  const [mode, setMode] = useState<GameMode>('landing')
  const [playType, setPlayType] = useState<PlayType>('single')

  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const [botScore, setBotScore] = useState(0)
  const [botCorrect, setBotCorrect] = useState(0)
  const [botQuestion, setBotQuestion] = useState(0)

  const [timeLeft, setTimeLeft] = useState(SINGLE_TIME)

  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const [showHint, setShowHint] = useState(false)
  const [searchText, setSearchText] = useState('Finding an opponent...')

  const question = useMemo(() => {
    return questionBank[currentIndex % questionBank.length]
  }, [currentIndex])

  /*
   * START SINGLE PLAYER
   */
  const startSinglePlayer = () => {
    resetGame('single')
  }

  /*
   * START DUEL
   */
  const startDuel = () => {
    setPlayType('duel')
    setMode('searching')
    setSearchText('Finding an opponent...')

    // Simulated matchmaking.
    // Later replace this section with your real WebSocket/API matchmaking.
    setTimeout(() => {
      setSearchText('Opponent found!')
    }, 1200)

    setTimeout(() => {
      resetGame('duel')
    }, 2200)
  }

  /*
   * RESET GAME
   */
  const resetGame = (type: PlayType) => {
    setPlayType(type)
    setCurrentIndex(0)
    setScore(0)
    setCorrectAnswers(0)
    setBotScore(0)
    setBotCorrect(0)
    setBotQuestion(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setStreak(0)
    setBestStreak(0)
    setShowHint(false)
    setTimeLeft(type === 'duel' ? DUEL_TIME : SINGLE_TIME)
    setMode('playing')
  }

  /*
   * GAME TIMER
   */
  useEffect(() => {
    if (mode !== 'playing') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setMode('results')
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [mode])

  /*
   * BOT PLAY
   *
   * This is currently a local AI opponent.
   * Later you can replace it with another real player through WebSocket.
   */
  useEffect(() => {
    if (mode !== 'playing' || playType !== 'duel') return

    const botTimer = setInterval(() => {
      setBotQuestion((prev) => {
        if (prev >= TOTAL_QUESTIONS) return prev

        const botCorrectChance = 0.65

        const isCorrect = Math.random() < botCorrectChance

        if (isCorrect) {
          setBotCorrect((value) => value + 1)
          setBotScore((value) => value + 10)
        }

        return prev + 1
      })
    }, 4200)

    return () => clearInterval(botTimer)
  }, [mode, playType])

  /*
   * ANSWER QUESTION
   */
  const handleAnswer = (index: number) => {
    if (answered || mode !== 'playing') return

    setSelectedAnswer(index)
    setAnswered(true)

    const isCorrect = index === question.correct

    if (isCorrect) {
      const points = 10 + question.difficulty * 2

      setScore((prev) => prev + points)
      setCorrectAnswers((prev) => prev + 1)

      setStreak((prev) => {
        const next = prev + 1
        setBestStreak((best) => Math.max(best, next))
        return next
      })
    } else {
      setStreak(0)
    }
  }

  /*
   * NEXT QUESTION
   */
  const nextQuestion = () => {
    if (!answered) return

    if (currentIndex >= TOTAL_QUESTIONS - 1) {
      setMode('results')
      return
    }

    setCurrentIndex((prev) => prev + 1)
    setAnswered(false)
    setSelectedAnswer(null)
    setShowHint(false)
  }

  /*
   * AI HELPER
   */
  const getHint = () => {
    setShowHint(true)
  }

  const getHintText = () => {
    switch (question.category) {
      case 'Arithmetic':
        return 'Break the calculation into smaller steps. Calculate the easier part first.'

      case 'Percentage':
        return 'Convert the percentage into a fraction of 100, then multiply it by the original number.'

      case 'Square Root':
        return 'Think of the number that multiplies by itself to produce the given value.'

      case 'Algebra':
        return 'Move the constant to the other side first, then isolate the variable.'

      case 'Powers':
        return 'Remember that powers represent repeated multiplication.'

      case 'Fractions':
        return 'Find the greatest common factor and divide both numerator and denominator.'

      case 'Number Theory':
        return 'List the factors shared by both numbers and select the greatest one.'

      case 'Sequence':
        return 'Look for the mathematical operation connecting each number to the next.'

      case 'Probability':
        return 'Count the total possible outcomes and the outcomes that satisfy the condition.'

      default:
        return 'Break the problem into smaller mathematical steps.'
    }
  }

  /*
   * RESULTS
   */
  if (mode === 'results') {
    const accuracy =
      correctAnswers > 0
        ? Math.round((correctAnswers / Math.max(currentIndex + 1, 1)) * 100)
        : 0

    if (playType === 'duel') {
      const playerWon = score > botScore
      const draw = score === botScore

      return (
        <div className="min-h-screen bg-background px-4 py-6">
          <div className="mx-auto max-w-4xl">

            <button
              onClick={() => setMode('landing')}
              className="mb-8 flex items-center gap-2 text-sm text-gray-400 hover:text-neon"
            >
              <ArrowLeft size={17} />
              Back to Math Arena
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="gaming-card p-8 text-center"
            >
              <Trophy
                size={52}
                className="mx-auto mb-4 text-yellow-400"
              />

              <h1 className="text-3xl font-bold">
                {draw
                  ? 'DRAW!'
                  : playerWon
                    ? 'YOU WIN!'
                    : 'BOT WINS!'}
              </h1>

              <p className="mt-2 text-gray-400">
                Duel completed. Here is the final comparison.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">

                <div
                  className={`rounded-2xl border p-6 ${
                    playerWon
                      ? 'border-neon bg-neon/10'
                      : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <User
                    size={32}
                    className="mx-auto mb-3 text-neon"
                  />

                  <p className="text-sm text-gray-400">
                    YOU
                  </p>

                  <p className="mt-2 text-4xl font-bold">
                    {score}
                  </p>

                  <p className="mt-2 text-sm text-gray-400">
                    {correctAnswers} correct
                  </p>
                </div>

                <div
                  className={`rounded-2xl border p-6 ${
                    !playerWon && !draw
                      ? 'border-red-500/50 bg-red-500/10'
                      : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <Bot
                    size={32}
                    className="mx-auto mb-3 text-purple-400"
                  />

                  <p className="text-sm text-gray-400">
                    AI OPPONENT
                  </p>

                  <p className="mt-2 text-4xl font-bold">
                    {botScore}
                  </p>

                  <p className="mt-2 text-sm text-gray-400">
                    {botCorrect} correct
                  </p>
                </div>

              </div>

              <button
                onClick={() => resetGame('duel')}
                className="gaming-button mt-8 w-full py-3 font-semibold text-black"
              >
                PLAY AGAIN
              </button>

            </motion.div>
          </div>
        </div>
      )
    }

    return (
      <GameResults
        gameName="Math Sprint"
        gameType="math"
        score={score}
        maxScore={150}
        accuracy={accuracy}
        timeSpent={SINGLE_TIME - timeLeft}
        totalTime={SINGLE_TIME}
        difficulty="Adaptive"
        xpEarned={score * 2}
      />
    )
  }

  /*
   * MATCHMAKING SCREEN
   */
  if (mode === 'searching') {
    return (
      <div className="min-h-screen bg-background px-4 py-6">
        <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="gaming-card w-full max-w-md p-8 text-center"
          >

            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="mx-auto mb-6 w-fit"
            >
              <Loader2
                size={54}
                className="text-neon"
              />
            </motion.div>

            <h1 className="text-2xl font-bold">
              {searchText}
            </h1>

            <p className="mt-3 text-sm text-gray-400">
              Preparing your 1 minute Math Duel.
            </p>

            <div className="mt-8 flex items-center justify-center gap-5">

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neon text-black">
                  <User size={28} />
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  YOU
                </p>
              </div>

              <Swords
                size={28}
                className="text-yellow-400"
              />

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-600">
                  <Bot size={28} />
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  AI
                </p>
              </div>

            </div>

            <button
              onClick={() => setMode('landing')}
              className="mt-8 text-sm text-gray-400 hover:text-white"
            >
              Cancel
            </button>

          </motion.div>
        </div>
      </div>
    )
  }

  /*
   * LANDING SCREEN
   */
  if (mode === 'landing') {
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
              SPRINT
              <br />
              DUELS
            </motion.h1>

            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Race to solve the most in 1 minute
            </p>

          </div>

          <div className="mt-auto grid gap-4 pb-8 md:grid-cols-2">

            <button
              onClick={startDuel}
              className="rounded-2xl border border-yellow-400 bg-yellow-400 px-6 py-5 text-lg font-black text-black shadow-[0_6px_0_#a88a00] transition hover:brightness-110 active:translate-y-1 active:shadow-none"
            >
              PLAY DUEL
            </button>

            <button
              onClick={startSinglePlayer}
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

  /*
   * PLAYING SCREEN
   */

  const progress = Math.min(
    ((currentIndex + 1) / TOTAL_QUESTIONS) * 100,
    100
  )

  return (
    <div className="min-h-screen bg-background px-4 py-5">
      <div className="mx-auto max-w-5xl">

        {/* TOP BAR */}

        <div className="mb-5 flex items-center justify-between">

          <button
            onClick={() => setMode('landing')}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
          >
            <ArrowLeft size={18} />
            Exit
          </button>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
            <Clock size={16} className="text-yellow-400" />
            <span className="font-bold">
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
              {String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>

        </div>

        {/* DUEL PLAYERS */}

        {playType === 'duel' && (
          <div className="mb-6 grid grid-cols-2 gap-3">

            <div className="gaming-card p-4">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neon text-black">
                    <User size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      YOU
                    </p>
                    <p className="font-bold">
                      {score}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-neon">
                  {correctAnswers} solved
                </span>
              </div>

            </div>

            <div className="gaming-card p-4">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600">
                    <Bot size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      AI OPPONENT
                    </p>

                    <p className="font-bold">
                      {botScore}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-purple-400">
                  {botQuestion} solved
                </span>

              </div>

            </div>

          </div>
        )}

        {/* SOLO STATS */}

        {playType === 'single' && (
          <div className="mb-6 grid grid-cols-3 gap-3">

            <div className="gaming-card p-3 text-center">
              <Target
                size={17}
                className="mx-auto mb-1 text-neon"
              />

              <p className="text-xs text-gray-400">
                Score
              </p>

              <p className="text-lg font-bold">
                {score}
              </p>
            </div>

            <div className="gaming-card p-3 text-center">
              <Flame
                size={17}
                className="mx-auto mb-1 text-orange-400"
              />

              <p className="text-xs text-gray-400">
                Streak
              </p>

              <p className="text-lg font-bold text-orange-400">
                {streak}
              </p>
            </div>

            <div className="gaming-card p-3 text-center">
              <Trophy
                size={17}
                className="mx-auto mb-1 text-yellow-400"
              />

              <p className="text-xs text-gray-400">
                Best
              </p>

              <p className="text-lg font-bold text-yellow-400">
                {bestStreak}
              </p>
            </div>

          </div>
        )}

        {/* PROGRESS */}

        <div className="mb-6">

          <div className="mb-2 flex justify-between text-xs">
            <span>
              Question {currentIndex + 1}/{TOTAL_QUESTIONS}
            </span>

            <span className="text-gray-400">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full bg-neon"
            />
          </div>

        </div>

        {/* QUESTION */}

        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="gaming-card p-6 sm:p-8"
        >

          <div className="mb-6 flex items-center justify-between">

            <span className="rounded-full bg-neon/10 px-3 py-1 text-xs font-semibold text-neon">
              {question.category}
            </span>

            <span className="text-xs text-gray-500">
              Level {question.difficulty}
            </span>

          </div>

          <h2 className="text-center text-2xl font-bold leading-relaxed sm:text-3xl">
            {question.question}
          </h2>

          {/* OPTIONS */}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">

            {question.options.map((option, index) => {

              const isCorrect = index === question.correct
              const isSelected = index === selectedAnswer

              return (
                <motion.button
                  key={index}
                  whileHover={!answered ? { scale: 1.02 } : {}}
                  whileTap={!answered ? { scale: 0.98 } : {}}
                  disabled={answered}
                  onClick={() => handleAnswer(index)}
                  className={`rounded-xl border p-4 text-left font-semibold transition-all ${
                    !answered
                      ? 'border-white/10 bg-white/[0.03] hover:border-neon/50 hover:bg-neon/5'
                      : isCorrect
                        ? 'border-green-500/60 bg-green-500/10 text-green-400'
                        : isSelected
                          ? 'border-red-500/60 bg-red-500/10 text-red-400'
                          : 'border-white/5 bg-white/[0.02] opacity-40'
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <span>{option}</span>

                    {answered && isCorrect && (
                      <CheckCircle2 size={20} />
                    )}

                    {answered && isSelected && !isCorrect && (
                      <XCircle size={20} />
                    )}

                  </div>

                </motion.button>
              )
            })}

          </div>

          {/* AI HELPER */}

          {playType === 'single' && (
            <div className="mt-6">

              <button
                onClick={getHint}
                disabled={answered}
                className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/20 disabled:opacity-40"
              >
                <Lightbulb size={17} />
                AI Helper
              </button>

              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4"
                >
                  <div className="flex gap-3">

                    <Brain
                      size={20}
                      className="mt-0.5 shrink-0 text-purple-400"
                    />

                    <div>
                      <p className="text-sm font-semibold text-purple-300">
                        AI Helper
                      </p>

                      <p className="mt-1 text-sm leading-relaxed text-gray-400">
                        {getHintText()}
                      </p>
                    </div>

                  </div>
                </motion.div>
              )}

            </div>
          )}

          {/* NEXT */}

          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-7 flex justify-end"
            >
              <button
                onClick={nextQuestion}
                className="gaming-button flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-black"
              >
                {currentIndex >= TOTAL_QUESTIONS - 1
                  ? 'Finish Game'
                  : 'Next Question'}

                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

        </motion.div>

      </div>
    </div>
  )
}