'use client'

import { motion } from 'framer-motion'
import {
    ArrowLeft,
    ArrowRight,
    Bot,
    Brain,
    Check,
    Lightbulb,
    RotateCcw,
    Swords,
    Trophy,
    X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { GameHeader } from '../shared/GameHeader'
import { GameResults } from '../shared/GameResults'

type Mode = 'menu' | 'single' | 'duel'

type Difficulty = 'Easy' | 'Medium' | 'Hard'

interface ArithmeticQuestion {
  id: number
  text: string
  answer: number
  options: number[]
  operation: '+' | '-' | '×' | '÷'
}

interface DuelStats {
  score: number
  correct: number
  answered: number
  totalTime: number
}

const TOTAL_QUESTIONS = 15
const GAME_TIME = 120

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5)
}

function generateQuestion(
  id: number,
  difficulty: Difficulty
): ArithmeticQuestion {
  let max = 20

  if (difficulty === 'Medium') max = 50
  if (difficulty === 'Hard') max = 100

  const operations: ArithmeticQuestion['operation'][] =
    difficulty === 'Easy'
      ? ['+', '-']
      : difficulty === 'Medium'
        ? ['+', '-', '×']
        : ['+', '-', '×', '÷']

  const operation =
    operations[Math.floor(Math.random() * operations.length)]

  let a = Math.floor(Math.random() * max) + 1
  let b = Math.floor(Math.random() * max) + 1
  let answer = 0

  if (operation === '+') {
    answer = a + b
  }

  if (operation === '-') {
    if (b > a) {
      ;[a, b] = [b, a]
    }

    answer = a - b
  }

  if (operation === '×') {
    const multiplicationMax =
      difficulty === 'Hard' ? 20 : difficulty === 'Medium' ? 12 : 10

    a = Math.floor(Math.random() * multiplicationMax) + 1
    b = Math.floor(Math.random() * multiplicationMax) + 1
    answer = a * b
  }

  if (operation === '÷') {
    b = Math.floor(Math.random() * 12) + 2
    answer = Math.floor(Math.random() * 12) + 2
    a = b * answer
  }

  const wrongAnswers = new Set<number>()

  while (wrongAnswers.size < 3) {
    const offset =
      Math.floor(Math.random() * Math.max(5, Math.abs(answer) * 0.25 + 5)) + 1

    const direction = Math.random() > 0.5 ? 1 : -1
    const wrong = answer + offset * direction

    if (wrong !== answer && wrong >= 0) {
      wrongAnswers.add(wrong)
    }
  }

  const options = shuffle([answer, ...Array.from(wrongAnswers)])

  return {
    id,
    text: `${a} ${operation} ${b}`,
    answer,
    options,
    operation,
  }
}

function createQuestions(difficulty: Difficulty) {
  return Array.from({ length: TOTAL_QUESTIONS }, (_, index) =>
    generateQuestion(index + 1, difficulty)
  )
}

export function SpeedArithmetic() {
  const [mode, setMode] = useState<Mode>('menu')
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium')

  const [questions, setQuestions] = useState<ArithmeticQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)

  const [timeLeft, setTimeLeft] = useState(GAME_TIME)

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const [showResults, setShowResults] = useState(false)

  const [showHelper, setShowHelper] = useState(false)

  const [duelSearching, setDuelSearching] = useState(false)
  const [duelStarted, setDuelStarted] = useState(false)

  const [aiStats, setAiStats] = useState<DuelStats>({
    score: 0,
    correct: 0,
    answered: 0,
    totalTime: 0,
  })

  const [playerStats, setPlayerStats] = useState<DuelStats>({
    score: 0,
    correct: 0,
    answered: 0,
    totalTime: 0,
  })

  const [duelResult, setDuelResult] = useState<
    'win' | 'loss' | 'draw' | null
  >(null)

  const question = questions[currentQuestion]

  const accuracy = useMemo(() => {
    if (answeredQuestions === 0) return 0

    return Math.round((correctAnswers / answeredQuestions) * 100)
  }, [correctAnswers, answeredQuestions])

  /*
   * Start Single Player
   */
  const startSinglePlayer = () => {
    setQuestions(createQuestions(difficulty))
    setCurrentQuestion(0)
    setScore(0)
    setCorrectAnswers(0)
    setAnsweredQuestions(0)
    setSelectedAnswer(null)
    setAnswered(false)
    setTimeLeft(GAME_TIME)
    setShowResults(false)
    setShowHelper(false)
    setMode('single')
  }

  /*
   * Start Duel
   */
  const startDuel = () => {
    setDuelSearching(true)
    setMode('menu')

    setTimeout(() => {
      const newQuestions = createQuestions(difficulty)

      setQuestions(newQuestions)
      setCurrentQuestion(0)

      setScore(0)
      setCorrectAnswers(0)
      setAnsweredQuestions(0)

      setSelectedAnswer(null)
      setAnswered(false)

      setTimeLeft(GAME_TIME)

      setAiStats({
        score: 0,
        correct: 0,
        answered: 0,
        totalTime: 0,
      })

      setPlayerStats({
        score: 0,
        correct: 0,
        answered: 0,
        totalTime: 0,
      })

      setDuelResult(null)
      setDuelSearching(false)
      setDuelStarted(true)
      setMode('duel')
    }, 1800)
  }

  /*
   * AI opponent
   *
   * The AI deliberately has variable accuracy.
   * It does NOT always answer correctly.
   */
  const calculateAIAnswer = useCallback(
    (current: ArithmeticQuestion) => {
      const accuracyRange =
        difficulty === 'Easy'
          ? 0.65
          : difficulty === 'Medium'
            ? 0.78
            : 0.88

      const isCorrect = Math.random() < accuracyRange

      if (isCorrect) {
        return {
          correct: true,
          answer: current.answer,
        }
      }

      const wrong = current.options.filter(
        option => option !== current.answer
      )

      return {
        correct: false,
        answer: wrong[Math.floor(Math.random() * wrong.length)],
      }
    },
    [difficulty]
  )

  /*
   * Duel AI plays every question automatically.
   */
  useEffect(() => {
    if (!duelStarted || mode !== 'duel' || !question) return
    if (answered) return

    const aiDelay =
      difficulty === 'Easy'
        ? 1600 + Math.random() * 1400
        : difficulty === 'Medium'
          ? 1100 + Math.random() * 1300
          : 800 + Math.random() * 1100

    const timer = setTimeout(() => {
      const result = calculateAIAnswer(question)

      setAiStats(prev => ({
        score: prev.score + (result.correct ? 10 : 0),
        correct: prev.correct + (result.correct ? 1 : 0),
        answered: prev.answered + 1,
        totalTime: prev.totalTime + aiDelay / 1000,
      }))
    }, aiDelay)

    return () => clearTimeout(timer)
  }, [
    duelStarted,
    mode,
    question,
    answered,
    calculateAIAnswer,
    difficulty,
  ])

  /*
   * Main timer
   */
  useEffect(() => {
    if (mode !== 'single' && mode !== 'duel') return
    if (showResults) return

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
   * Finish duel
   */
  const finishDuel = () => {
    const finalPlayer = {
      score,
      correct: correctAnswers,
      answered: answeredQuestions,
      totalTime: GAME_TIME - timeLeft,
    }

    setPlayerStats(finalPlayer)

    const playerAccuracy =
      finalPlayer.answered > 0
        ? finalPlayer.correct / finalPlayer.answered
        : 0

    const aiAccuracy =
      aiStats.answered > 0
        ? aiStats.correct / aiStats.answered
        : 0

    let result: 'win' | 'loss' | 'draw'

    if (score > aiStats.score) {
      result = 'win'
    } else if (score < aiStats.score) {
      result = 'loss'
    } else if (playerAccuracy > aiAccuracy) {
      result = 'win'
    } else if (playerAccuracy < aiAccuracy) {
      result = 'loss'
    } else {
      result = 'draw'
    }

    setDuelResult(result)
    setShowResults(true)
  }

  /*
   * Answer question
   */
  const handleAnswer = (answer: number) => {
    if (answered || !question || showResults) return

    const isCorrect = answer === question.answer

    setSelectedAnswer(answer)
    setAnswered(true)
    setAnsweredQuestions(prev => prev + 1)

    if (isCorrect) {
      const speedBonus = Math.max(1, Math.ceil(timeLeft / 30))

      setScore(prev => prev + 10 + speedBonus)
      setCorrectAnswers(prev => prev + 1)
    }

    if (mode === 'duel') {
      setPlayerStats(prev => ({
        ...prev,
        score:
          prev.score +
          (isCorrect ? 10 + Math.max(1, Math.ceil(timeLeft / 30)) : 0),
        correct: prev.correct + (isCorrect ? 1 : 0),
        answered: prev.answered + 1,
        totalTime: GAME_TIME - timeLeft,
      }))
    }
  }

  /*
   * Next question
   */
  const nextQuestion = () => {
    if (currentQuestion >= questions.length - 1) {
      if (mode === 'duel') {
        finishDuel()
      } else {
        setShowResults(true)
      }

      return
    }

    setCurrentQuestion(prev => prev + 1)
    setSelectedAnswer(null)
    setAnswered(false)
    setShowHelper(false)
  }

  /*
   * AI Helper
   */
  const getHint = () => {
    if (!question) return ''

    if (question.operation === '+') {
      return 'Try breaking the numbers into tens and units before adding them.'
    }

    if (question.operation === '-') {
      return 'Subtract the larger place values first, then finish the smaller digits.'
    }

    if (question.operation === '×') {
      return 'Break multiplication into smaller parts. For example, ×12 can become ×10 + ×2.'
    }

    return 'For division, think about which number multiplied by the divisor gives the dividend.'
  }

  /*
   * Menu
   */
  if (mode === 'menu') {
    if (duelSearching) {
      return (
        <div className="min-h-screen bg-background p-4 sm:p-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="gaming-card max-w-md mx-auto p-8 text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-full border-2 border-neon/40 flex items-center justify-center mb-5 animate-pulse">
                <Swords className="text-neon" size={25} />
              </div>

              <h2 className="text-lg font-semibold">
                Finding Opponent
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Searching for a suitable opponent...
              </p>

              <div className="flex justify-center gap-1 mt-5">
                <span className="w-2 h-2 rounded-full bg-neon animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-neon animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-neon animate-bounce [animation-delay:300ms]" />
              </div>
            </motion.div>
          </div>
        </div>
      )
    }

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
              SPEED
              <br />
              ARITHMETIC
            </motion.h1>

            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Calculate fast. Stay accurate. Beat the clock
            </p>

            <div className="mt-6 flex items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Difficulty
              </p>
              <select
                value={difficulty}
                onChange={e =>
                  setDifficulty(e.target.value as Difficulty)
                }
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

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
   * Results
   */
  if (showResults) {
    if (mode === 'duel') {
      return (
        <div className="min-h-screen bg-background p-4 sm:p-6 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="gaming-card w-full max-w-3xl p-6"
          >
            <div className="text-center mb-7">

              <div
                className={`w-16 h-16 mx-auto rounded-full border flex items-center justify-center mb-3 ${
                  duelResult === 'win'
                    ? 'border-green-500/50 bg-green-500/10'
                    : duelResult === 'loss'
                      ? 'border-red-500/50 bg-red-500/10'
                      : 'border-yellow-500/50 bg-yellow-500/10'
                }`}
              >
                {duelResult === 'win' ? (
                  <Trophy className="text-green-400" size={28} />
                ) : duelResult === 'loss' ? (
                  <X className="text-red-400" size={28} />
                ) : (
                  <Swords className="text-yellow-400" size={28} />
                )}
              </div>

              <h1 className="text-2xl font-bold">
                {duelResult === 'win'
                  ? 'Victory!'
                  : duelResult === 'loss'
                    ? 'Defeat'
                    : 'Draw'}
              </h1>

              <p className="text-sm text-gray-400 mt-1">
                Speed Arithmetic Duel
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">

              <div className="rounded-xl border border-neon/30 bg-neon/5 p-5 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Brain size={17} className="text-neon" />
                  <span className="text-sm text-gray-400">
                    You
                  </span>
                </div>

                <p className="text-2xl font-bold text-neon">
                  {playerStats.score}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {playerStats.correct}/{playerStats.answered} correct
                </p>
              </div>

              <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-5 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Bot size={17} className="text-purple-400" />
                  <span className="text-sm text-gray-400">
                    AI Opponent
                  </span>
                </div>

                <p className="text-2xl font-bold text-purple-400">
                  {aiStats.score}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {aiStats.correct}/{aiStats.answered} correct
                </p>
              </div>

            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Accuracy</p>
                <p className="text-sm font-semibold mt-1">
                  {accuracy}%
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-semibold mt-1">
                  {GAME_TIME - timeLeft}s
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Difficulty</p>
                <p className="text-sm font-semibold mt-1">
                  {difficulty}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowResults(false)
                setDuelStarted(false)
                setMode('menu')
              }}
              className="w-full gaming-button py-3 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw size={17} />
              Play Again
            </button>
          </motion.div>
        </div>
      )
    }

    return (
      <GameResults
        gameName="Speed Arithmetic"
        gameType="math"
        score={score}
        maxScore={Math.max(100, TOTAL_QUESTIONS * 13)}
        accuracy={accuracy}
        timeSpent={GAME_TIME - timeLeft}
        totalTime={GAME_TIME}
        difficulty={difficulty}
        xpEarned={Math.round(score * 1.5)}
      />
    )
  }

  /*
   * Game screen
   */
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">

        <GameHeader
          title={
            mode === 'duel'
              ? 'Speed Arithmetic Duel'
              : 'Speed Arithmetic'
          }
          timeLeft={timeLeft}
          score={score}
          onQuit={() => setShowResults(true)}
        />

        {mode === 'duel' && (
          <div className="grid grid-cols-2 gap-3 mb-5">

            <div className="gaming-card p-3">
              <div className="flex items-center gap-2">
                <Brain size={16} className="text-neon" />
                <span className="text-xs text-gray-400">
                  YOU
                </span>
              </div>

              <p className="text-lg font-bold text-neon mt-1">
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

              <p className="text-lg font-bold text-purple-400 mt-1">
                {aiStats.score}
              </p>
            </div>

          </div>
        )}

        <div className="gaming-card p-5 sm:p-7">

          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-500">
                QUESTION
              </p>

              <p className="text-sm font-semibold mt-1">
                {currentQuestion + 1} / {TOTAL_QUESTIONS}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500">
                ACCURACY
              </p>

              <p className="text-sm font-semibold text-neon mt-1">
                {accuracy}%
              </p>
            </div>
          </div>

          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-8">
            <motion.div
              className="h-full bg-neon"
              animate={{
                width: `${((currentQuestion + 1) / TOTAL_QUESTIONS) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-xs text-gray-500 mb-3">
              CALCULATE
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {question?.text}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 mt-8">

            {question?.options.map((option, index) => {
              const isCorrect = option === question.answer
              const isSelected = option === selectedAnswer

              return (
                <motion.button
                  key={index}
                  whileHover={!answered ? { scale: 1.02 } : {}}
                  whileTap={!answered ? { scale: 0.98 } : {}}
                  disabled={answered}
                  onClick={() => handleAnswer(option)}
                  className={`py-4 rounded-xl border text-base font-semibold transition-all ${
                    !answered
                      ? 'border-white/15 bg-white/[0.03] hover:border-neon/50 hover:bg-neon/5'
                      : isCorrect
                        ? 'border-green-500/50 bg-green-500/10 text-green-400'
                        : isSelected
                          ? 'border-red-500/50 bg-red-500/10 text-red-400'
                          : 'border-white/10 bg-white/[0.02] text-gray-500'
                  }`}
                >
                  {option}
                </motion.button>
              )
            })}

          </div>

          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5"
            >
              <div
                className={`rounded-lg p-3 text-sm flex items-center gap-2 ${
                  selectedAnswer === question.answer
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {selectedAnswer === question.answer ? (
                  <>
                    <Check size={17} />
                    Correct. Keep your speed up.
                  </>
                ) : (
                  <>
                    <X size={17} />
                    Incorrect. The correct answer is {question.answer}.
                  </>
                )}
              </div>

              <button
                onClick={nextQuestion}
                className="gaming-button mt-4 ml-auto px-5 py-2.5 text-sm flex items-center gap-2"
              >
                {currentQuestion === TOTAL_QUESTIONS - 1
                  ? mode === 'duel'
                    ? 'Finish Duel'
                    : 'View Results'
                  : 'Next'}
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          <div className="mt-5 flex justify-between items-center">

            <button
              onClick={() => setShowHelper(prev => !prev)}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-2"
            >
              <Lightbulb size={15} />
              AI Helper
            </button>

            <span className="text-xs text-gray-500">
              {difficulty} difficulty
            </span>

          </div>

          {showHelper && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 rounded-lg border border-purple-500/20 bg-purple-500/5 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Brain size={15} className="text-purple-400" />
                <span className="text-xs font-semibold text-purple-400">
                  AI HELPER
                </span>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {getHint()}
              </p>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}