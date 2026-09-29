'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowLeft,
    Bot,
    Brain,
    Check,
    Clock,
    Lightbulb,
    Loader2,
    Trophy,
    X,
    Zap
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

type Mode = 'landing' | 'searching' | 'duel' | 'solo' | 'results'

interface Equation {
  question: string
  options: string[]
  correct: number
  hint: string
}

interface ResultData {
  playerScore: number
  aiScore: number
  playerCorrect: number
  aiCorrect: number
  total: number
  mode: 'duel' | 'solo'
}

const TOTAL_QUESTIONS = 10
const SOLO_TIME = 60
const DUEL_TIME = 60

const equations: Equation[] = [
  {
    question: '3x + 5 = 20',
    options: ['3', '4', '5', '6'],
    correct: 2,
    hint: 'Subtract 5 from both sides, then divide by 3.',
  },
  {
    question: '2x - 7 = 15',
    options: ['9', '10', '11', '12'],
    correct: 2,
    hint: 'Add 7 to both sides, then divide by 2.',
  },
  {
    question: '5x = 45',
    options: ['7', '8', '9', '10'],
    correct: 2,
    hint: 'Divide both sides by 5.',
  },
  {
    question: '4x + 8 = 28',
    options: ['4', '5', '6', '7'],
    correct: 1,
    hint: 'First subtract 8 from 28.',
  },
  {
    question: '7x - 14 = 35',
    options: ['5', '6', '7', '8'],
    correct: 2,
    hint: 'Add 14, then divide by 7.',
  },
  {
    question: '6x + 4 = 40',
    options: ['5', '6', '7', '8'],
    correct: 1,
    hint: 'Subtract 4, then divide by 6.',
  },
  {
    question: '9x = 81',
    options: ['7', '8', '9', '10'],
    correct: 2,
    hint: '81 divided by 9.',
  },
  {
    question: '3x - 9 = 12',
    options: ['6', '7', '8', '9'],
    correct: 1,
    hint: 'Add 9 to both sides.',
  },
  {
    question: '8x + 4 = 52',
    options: ['5', '6', '7', '8'],
    correct: 1,
    hint: 'Subtract 4, then divide by 8.',
  },
  {
    question: '10x - 20 = 60',
    options: ['6', '7', '8', '9'],
    correct: 2,
    hint: 'Add 20, then divide by 10.',
  },
]

export function EquationMaster() {
  const [mode, setMode] = useState<Mode>('landing')

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [playerScore, setPlayerScore] = useState(0)
  const [playerCorrect, setPlayerCorrect] = useState(0)

  const [aiScore, setAiScore] = useState(0)
  const [aiCorrect, setAiCorrect] = useState(0)

  const [timeLeft, setTimeLeft] = useState(DUEL_TIME)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const [aiThinking, setAiThinking] = useState(false)
  const [aiLastAnswer, setAiLastAnswer] = useState<
    'correct' | 'wrong' | null
  >(null)

  const [showHint, setShowHint] = useState(false)
  const [searchText, setSearchText] = useState('Finding opponent...')

  const [results, setResults] = useState<ResultData | null>(null)

  const question = equations[currentQuestion]

  /*
   * Random AI performance.
   *
   * The AI is intentionally NOT perfect.
   * Each question gives the AI a random chance of getting it correct.
   */
  const getAIRandomAnswer = useCallback(
    (correctAnswer: number) => {
      const skillRoll = Math.random()

      // Approximately 70% correct.
      if (skillRoll < 0.7) {
        return correctAnswer
      }

      const wrongOptions = [0, 1, 2, 3].filter(
        (index) => index !== correctAnswer
      )

      return wrongOptions[
        Math.floor(Math.random() * wrongOptions.length)
      ]
    },
    []
  )

  const startDuel = () => {
    setMode('searching')
    setSearchText('Finding opponent...')
  }

  const startSolo = () => {
    resetGame()
    setMode('solo')
    setTimeLeft(SOLO_TIME)
  }

  const startActualDuel = () => {
    resetGame()
    setMode('duel')
    setTimeLeft(DUEL_TIME)
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setPlayerScore(0)
    setPlayerCorrect(0)
    setAiScore(0)
    setAiCorrect(0)
    setSelectedAnswer(null)
    setAnswered(false)
    setAiThinking(false)
    setAiLastAnswer(null)
    setShowHint(false)
    setResults(null)
  }

  /*
   * Simulated matchmaking.
   *
   * This is currently local/demo matchmaking.
   * Later this function can be replaced by your real backend/socket.
   */
  useEffect(() => {
    if (mode !== 'searching') return

    const messages = [
      'Finding opponent...',
      'Searching nearby players...',
      'Opponent found!',
      'Preparing duel...',
    ]

    let index = 0

    const interval = setInterval(() => {
      index++

      if (index < messages.length) {
        setSearchText(messages[index])
      }

      if (index === messages.length - 1) {
        clearInterval(interval)

        setTimeout(() => {
          startActualDuel()
        }, 900)
      }
    }, 700)

    return () => clearInterval(interval)
  }, [mode])

  /*
   * Main timer for Solo and Duel.
   */
  useEffect(() => {
    if (mode !== 'solo' && mode !== 'duel') return

    if (timeLeft <= 0) {
      finishGame()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          return 0
        }

        return previous - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [mode, timeLeft])

  /*
   * AI automatically answers after a short random delay.
   */
  useEffect(() => {
    if (mode !== 'duel') return
    if (aiThinking) return
    if (answered) return

    setAiThinking(true)

    const delay = 900 + Math.random() * 1800

    const timer = setTimeout(() => {
      const aiAnswer = getAIRandomAnswer(question.correct)

      if (aiAnswer === question.correct) {
        setAiCorrect((previous) => previous + 1)
        setAiScore((previous) => previous + 10)
        setAiLastAnswer('correct')
      } else {
        setAiLastAnswer('wrong')
      }

      setAiThinking(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [
    mode,
    currentQuestion,
    question.correct,
    getAIRandomAnswer,
    answered,
    aiThinking,
  ])

  const handleAnswer = (index: number) => {
    if (answered) return

    setSelectedAnswer(index)
    setAnswered(true)

    if (index === question.correct) {
      setPlayerCorrect((previous) => previous + 1)
      setPlayerScore((previous) => previous + 10)
    }

    /*
     * Give player a small delay before next question.
     */
    setTimeout(() => {
      goToNextQuestion()
    }, 650)
  }

  const goToNextQuestion = () => {
    if (currentQuestion >= TOTAL_QUESTIONS - 1) {
      finishGame()
      return
    }

    setCurrentQuestion((previous) => previous + 1)
    setSelectedAnswer(null)
    setAnswered(false)
    setShowHint(false)
    setAiLastAnswer(null)
    setAiThinking(false)
  }

  const finishGame = () => {
    setResults({
      playerScore,
      aiScore,
      playerCorrect,
      aiCorrect,
      total: TOTAL_QUESTIONS,
      mode: mode === 'duel' ? 'duel' : 'solo',
    })

    setMode('results')
  }

  const goHome = () => {
    setMode('landing')
    resetGame()
    setTimeLeft(DUEL_TIME)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const progress =
    ((currentQuestion + 1) / TOTAL_QUESTIONS) * 100

  /*
   * =========================
   * LANDING SCREEN
   * =========================
   */
  if (mode === 'landing') {
    return (
      <div className="min-h-screen bg-background px-5 py-6">
        <div className="mx-auto flex min-h-[85vh] max-w-5xl flex-col">

          <button
            onClick={goHome}
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
              EQUATION
              <br />
              MASTER
            </motion.h1>

            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Outsmart your opponent with equation solving
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
              onClick={startSolo}
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
   * =========================
   * SEARCHING SCREEN
   * =========================
   */
  if (mode === 'searching') {
    return (
      <main className="min-h-screen bg-[#090909] text-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg w-full"
        >
          <div className="w-28 h-28 mx-auto rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center">
            <Loader2
              size={48}
              className="text-yellow-400 animate-spin"
            />
          </div>

          <h1 className="text-4xl font-black mt-8">
            SEARCHING
          </h1>

          <p className="text-gray-400 mt-3">
            {searchText}
          </p>

          <div className="mt-10 rounded-2xl border border-white/10 bg-[#151515] p-6">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs text-gray-500">YOUR RATING</p>
                <p className="text-xl font-bold text-yellow-400">
                  1000
                </p>
              </div>

              <Zap className="text-yellow-400" />

              <div className="text-left">
                <p className="text-xs text-gray-500">
                  MATCH TYPE
                </p>
                <p className="text-xl font-bold">
                  1 MIN DUEL
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={goHome}
            className="mt-8 text-gray-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </motion.div>
      </main>
    )
  }

  /*
   * =========================
   * RESULT SCREEN
   * =========================
   */
  if (mode === 'results' && results) {
    const playerWon =
      results.mode === 'solo'
        ? true
        : results.playerScore > results.aiScore

    const draw =
      results.mode === 'duel' &&
      results.playerScore === results.aiScore

    return (
      <main className="min-h-screen bg-[#090909] text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <Trophy
              size={60}
              className="mx-auto text-yellow-400"
            />

            <h1 className="text-5xl md:text-7xl font-black mt-6">
              {results.mode === 'solo'
                ? 'RUN COMPLETE'
                : draw
                  ? 'DRAW'
                  : playerWon
                    ? 'YOU WIN'
                    : 'YOU LOSE'}
            </h1>

            <p className="text-gray-400 mt-3">
              {results.mode === 'solo'
                ? 'Great work. Keep improving your equation speed.'
                : draw
                  ? 'Both players finished with the same score.'
                  : playerWon
                    ? 'You solved more equations than your opponent.'
                    : 'Your opponent solved more equations this time.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
            <div
              className={`rounded-3xl border p-8 ${
                playerWon
                  ? 'border-yellow-400/50 bg-yellow-400/5'
                  : 'border-white/10 bg-[#151515]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">
                    PLAYER
                  </p>
                  <h2 className="text-2xl font-black mt-1">
                    YOU
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black text-xl">
                  U
                </div>
              </div>

              <div className="text-6xl font-black mt-10">
                {results.playerScore}
              </div>

              <p className="text-gray-500 mt-2">
                {results.playerCorrect}/{results.total}{' '}
                correct
              </p>
            </div>

            {results.mode === 'duel' && (
              <div
                className={`rounded-3xl border p-8 ${
                  !playerWon && !draw
                    ? 'border-red-400/40 bg-red-400/5'
                    : 'border-white/10 bg-[#151515]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">
                      OPPONENT
                    </p>
                    <h2 className="text-2xl font-black mt-1">
                      MATH BOT
                    </h2>
                  </div>

                  <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center">
                    <Bot size={28} />
                  </div>
                </div>

                <div className="text-6xl font-black mt-10">
                  {results.aiScore}
                </div>

                <p className="text-gray-500 mt-2">
                  {results.aiCorrect}/{results.total}{' '}
                  correct
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              onClick={results.mode === 'duel' ? startDuel : startSolo}
              className="flex-1 h-16 rounded-full bg-yellow-400 text-black font-black hover:bg-yellow-300 transition-colors"
            >
              PLAY AGAIN
            </button>

            <button
              onClick={goHome}
              className="flex-1 h-16 rounded-full border border-white/20 bg-[#171717] font-black hover:bg-[#222] transition-colors"
            >
              BACK TO GAME
            </button>
          </div>
        </div>
      </main>
    )
  }

  /*
   * =========================
   * GAME SCREEN
   * =========================
   */
  return (
    <main className="min-h-screen bg-[#090909] text-white px-4 py-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* TOP BAR */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <button
            onClick={goHome}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#191919] border border-white/10">
              <Clock size={16} className="text-yellow-400" />

              <span
                className={`font-bold ${
                  timeLeft <= 10
                    ? 'text-red-400'
                    : 'text-white'
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="px-4 py-2 rounded-full bg-[#191919] border border-white/10">
              <span className="text-gray-500 text-xs mr-2">
                SCORE
              </span>
              <span className="font-black text-yellow-400">
                {playerScore}
              </span>
            </div>
          </div>
        </div>

        {/* DUEL PLAYERS */}
        {mode === 'duel' && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/5 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black">
                  U
                </div>

                <div>
                  <p className="font-bold">YOU</p>
                  <p className="text-xs text-gray-500">
                    {playerCorrect} correct
                  </p>
                </div>
              </div>

              <div className="text-2xl font-black mt-3 text-yellow-400">
                {playerScore}
              </div>
            </div>

            <div className="rounded-2xl border border-purple-400/30 bg-purple-400/5 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <Bot size={20} />
                </div>

                <div>
                  <p className="font-bold">MATH BOT</p>

                  <p className="text-xs text-gray-500">
                    {aiThinking
                      ? 'Thinking...'
                      : aiLastAnswer === 'correct'
                        ? 'Solved correctly'
                        : aiLastAnswer === 'wrong'
                          ? 'Made a mistake'
                          : 'Ready'}
                  </p>
                </div>
              </div>

              <div className="text-2xl font-black mt-3 text-purple-400">
                {aiScore}
              </div>
            </div>
          </div>
        )}

        {/* PROGRESS */}
        <div className="mt-8">
          <div className="flex justify-between text-sm mb-2">
            <span>
              Equation {currentQuestion + 1}/
              {TOTAL_QUESTIONS}
            </span>

            <span className="text-gray-500">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full bg-yellow-400"
            />
          </div>
        </div>

        {/* GAME CARD */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mt-10"
        >
          <div className="rounded-3xl border border-white/10 bg-[#151515] p-6 md:p-10">
            <div className="text-center">
              <p className="text-gray-500 text-sm uppercase tracking-widest">
                Solve for X
              </p>

              <h1 className="text-4xl md:text-6xl font-black mt-8">
                {question.question}
              </h1>
            </div>

            {/* OPTIONS */}
            <div className="grid grid-cols-2 gap-4 mt-10">
              {question.options.map((option, index) => {
                const isCorrect =
                  index === question.correct

                const isSelected =
                  selectedAnswer === index

                let buttonClass =
                  'border-white/10 bg-[#1b1b1b] hover:border-yellow-400/50 hover:bg-[#222]'

                if (answered) {
                  if (isCorrect) {
                    buttonClass =
                      'border-green-500 bg-green-500/10 text-green-400'
                  } else if (isSelected) {
                    buttonClass =
                      'border-red-500 bg-red-500/10 text-red-400'
                  } else {
                    buttonClass =
                      'border-white/5 bg-[#111] opacity-40'
                  }
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={{
                      scale: answered ? 1 : 1.02,
                    }}
                    whileTap={{
                      scale: answered ? 1 : 0.98,
                    }}
                    onClick={() => handleAnswer(index)}
                    disabled={answered}
                    className={`min-h-20 rounded-2xl border text-xl font-bold transition-all ${buttonClass}`}
                  >
                    {option}

                    {answered && isCorrect && (
                      <Check
                        size={20}
                        className="inline ml-3"
                      />
                    )}

                    {answered &&
                      isSelected &&
                      !isCorrect && (
                        <X
                          size={20}
                          className="inline ml-3"
                        />
                      )}
                  </motion.button>
                )
              })}
            </div>

            {/* SOLO AI HELPER */}
            {mode === 'solo' && (
              <div className="mt-8">
                <button
                  onClick={() =>
                    setShowHint((previous) => !previous)
                  }
                  className="w-full rounded-2xl border border-purple-400/30 bg-purple-400/5 p-4 flex items-center justify-center gap-3 text-purple-300 hover:bg-purple-400/10 transition-colors"
                >
                  <Lightbulb size={20} />

                  <span className="font-bold">
                    {showHint
                      ? 'HIDE AI HELPER'
                      : 'ASK AI HELPER'}
                  </span>
                </button>

                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: 'auto',
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 rounded-2xl bg-purple-400/10 border border-purple-400/20 p-5">
                        <div className="flex items-start gap-3">
                          <Brain
                            size={20}
                            className="text-purple-300 mt-1"
                          />

                          <div>
                            <p className="font-bold text-purple-200">
                              AI Helper
                            </p>

                            <p className="text-sm text-gray-400 mt-1">
                              {question.hint}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* NEXT INDICATOR */}
            {answered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-7 text-sm text-gray-500"
              >
                Loading next equation...
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* DUEL STATUS */}
        {mode === 'duel' && (
          <div className="max-w-4xl mx-auto mt-6 flex justify-center">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Bot size={16} />

              {aiThinking
                ? 'Your opponent is solving...'
                : aiLastAnswer === 'correct'
                  ? 'Math Bot solved this one.'
                  : aiLastAnswer === 'wrong'
                    ? 'Math Bot made a mistake.'
                    : 'Race against Math Bot.'}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}