'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Bot,
  Brain,
  Clock,
  Lightbulb,
  Search,
  Sparkles,
  Trophy,
  User,
  Zap,
} from 'lucide-react'

type Mode = 'menu' | 'searching' | 'playing' | 'finished'
type GameMode = 'solo' | 'duel'

interface Question {
  text: string
  answer: number
}

interface Result {
  playerScore: number
  aiScore: number
  playerCorrect: number
  aiCorrect: number
  timeUsed: number
}

const GAME_TIME = 60
const TOTAL_QUESTIONS = 30

function generateQuestion(): Question {
  const type = Math.floor(Math.random() * 5)

  if (type === 0) {
    const a = Math.floor(Math.random() * 50) + 10
    const b = Math.floor(Math.random() * 50) + 10

    return {
      text: `${a} + ${b}`,
      answer: a + b,
    }
  }

  if (type === 1) {
    const a = Math.floor(Math.random() * 80) + 30
    const b = Math.floor(Math.random() * 30) + 5

    return {
      text: `${a} − ${b}`,
      answer: a - b,
    }
  }

  if (type === 2) {
    const a = Math.floor(Math.random() * 15) + 2
    const b = Math.floor(Math.random() * 12) + 2

    return {
      text: `${a} × ${b}`,
      answer: a * b,
    }
  }

  if (type === 3) {
    const b = Math.floor(Math.random() * 10) + 2
    const answer = Math.floor(Math.random() * 15) + 2
    const a = b * answer

    return {
      text: `${a} ÷ ${b}`,
      answer,
    }
  }

  const a = Math.floor(Math.random() * 20) + 5
  const percent = [10, 20, 25, 50][Math.floor(Math.random() * 4)]

  return {
    text: `${percent}% of ${a * (100 / percent)}`,
    answer: a,
  }
}

function createQuestions(): Question[] {
  return Array.from({ length: TOTAL_QUESTIONS }, generateQuestion)
}

function calculateAiPerformance() {
  /*
   * AI deliberately has imperfect performance.
   *
   * Accuracy:
   *  Easy-ish range: 72–94%
   *
   * Speed:
   *  Random delay between 1.4 and 3.8 seconds.
   *
   * This means the AI can win OR lose.
   */

  const accuracy = 0.72 + Math.random() * 0.22

  return {
    accuracy,
    averageDelay: 1400 + Math.random() * 2400,
  }
}

export function MentalMathSprint() {
  const [mode, setMode] = useState<Mode>('menu')
  const [gameMode, setGameMode] = useState<GameMode>('solo')

  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)

  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)

  const [timeLeft, setTimeLeft] = useState(GAME_TIME)
  const [answer, setAnswer] = useState('')

  const [aiScore, setAiScore] = useState(0)
  const [aiCorrect, setAiCorrect] = useState(0)

  const [aiThinking, setAiThinking] = useState(false)

  const [result, setResult] = useState<Result | null>(null)

  const [helperOpen, setHelperOpen] = useState(false)

  const [searchProgress, setSearchProgress] = useState(0)

  const ai = useMemo(() => calculateAiPerformance(), [mode])

  /*
   * Start a solo game immediately.
   */
  const startSolo = () => {
    const newQuestions = createQuestions()

    setQuestions(newQuestions)
    setCurrent(0)

    setScore(0)
    setCorrect(0)

    setAiScore(0)
    setAiCorrect(0)

    setTimeLeft(GAME_TIME)
    setAnswer('')

    setGameMode('solo')
    setMode('playing')

    setResult(null)
    setHelperOpen(false)
  }

  /*
   * Duel first searches for an opponent.
   */
  const startDuel = () => {
    setGameMode('duel')
    setMode('searching')
    setSearchProgress(0)

    const interval = setInterval(() => {
      setSearchProgress(prev => {
        const next = prev + 20

        if (next >= 100) {
          clearInterval(interval)

          setTimeout(() => {
            startDuelGame()
          }, 500)

          return 100
        }

        return next
      })
    }, 400)
  }

  const startDuelGame = () => {
    const newQuestions = createQuestions()

    setQuestions(newQuestions)
    setCurrent(0)

    setScore(0)
    setCorrect(0)

    setAiScore(0)
    setAiCorrect(0)

    setTimeLeft(GAME_TIME)
    setAnswer('')

    setMode('playing')
    setResult(null)
    setHelperOpen(false)
  }

  /*
   * Game timer.
   */
  useEffect(() => {
    if (mode !== 'playing') return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          finishGame()
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [mode])

  /*
   * AI automatically plays during duel.
   *
   * IMPORTANT:
   * It does NOT always answer correctly.
   */
  useEffect(() => {
    if (mode !== 'playing') return
    if (gameMode !== 'duel') return
    if (!questions[current]) return

    setAiThinking(true)

    const delay =
      ai.averageDelay * (0.65 + Math.random() * 0.7)

    const timer = setTimeout(() => {
      const isCorrect = Math.random() < ai.accuracy

      if (isCorrect) {
        setAiCorrect(prev => prev + 1)
        setAiScore(prev => prev + 10)
      }

      setAiThinking(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [current, mode, gameMode, questions, ai])

  const submitAnswer = () => {
    if (!questions[current]) return
    if (answer.trim() === '') return

    const numericAnswer = Number(answer)

    if (numericAnswer === questions[current].answer) {
      setCorrect(prev => prev + 1)
      setScore(prev => prev + 10)
    }

    setAnswer('')

    if (current >= questions.length - 1) {
      finishGame()
    } else {
      setCurrent(prev => prev + 1)
    }
  }

  const finishGame = () => {
    setMode('finished')

    setResult({
      playerScore: score,
      aiScore,
      playerCorrect: correct,
      aiCorrect,
      timeUsed: GAME_TIME - timeLeft,
    })
  }

  const goBack = () => {
    setMode('menu')
    setQuestions([])
    setAnswer('')
    setResult(null)
  }

  const getHelperText = () => {
    if (!questions[current]) {
      return 'Start a game and I will help you.'
    }

    const question = questions[current].text

    if (question.includes('×')) {
      return 'Break the multiplication into smaller parts. For example, 12 × 8 can be thought of as 10 × 8 + 2 × 8.'
    }

    if (question.includes('÷')) {
      return 'Think about the multiplication that gives you the first number. Division is the reverse of multiplication.'
    }

    if (question.includes('−')) {
      return 'Subtract the larger place values first, then handle the remaining digits.'
    }

    if (question.includes('%')) {
      return '10% means divide by 10. 20% means one fifth. 25% means one quarter. 50% means one half.'
    }

    return 'Add from left to right and keep the numbers grouped in your head.'
  }

  /*
   * MENU
   */
  if (mode === 'menu') {
    return (
      <div className="min-h-screen bg-background px-5 py-6">
        <div className="mx-auto flex min-h-[85vh] max-w-5xl flex-col">

          <button
            onClick={goBack}
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
              MENTAL
              <br />
              MATH
              <br />
              SPRINT
            </motion.h1>

            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Race to solve the most calculations in 1 minute
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
   * SEARCHING FOR OPPONENT
   */
  if (mode === 'searching') {
    return (
      <main className="min-h-screen bg-[#151515] text-white flex items-center justify-center px-5">

        <div className="w-full max-w-lg text-center">

          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
            }}
            className="mx-auto w-24 h-24 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center"
          >
            <Search className="text-yellow-300" size={38} />
          </motion.div>

          <h1 className="text-3xl font-black mt-8">
            SEARCHING FOR OPPONENT
          </h1>

          <p className="text-gray-400 mt-3">
            Finding a player at your skill level...
          </p>

          <div className="mt-10 w-full h-3 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              animate={{ width: `${searchProgress}%` }}
              className="h-full bg-yellow-400"
            />
          </div>

          <div className="mt-8 flex justify-center gap-4">

            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
              <User size={30} />
            </div>

            <div className="text-3xl text-gray-500 flex items-center">
              VS
            </div>

            <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center">
              <Bot size={30} />
            </div>

          </div>

          <p className="text-sm text-gray-500 mt-8">
            Opponent found: <span className="text-white">MathBot</span>
          </p>

        </div>

      </main>
    )
  }

  /*
   * RESULTS
   */
  if (mode === 'finished' && result) {
    const playerWon = result.playerScore > result.aiScore
    const draw = result.playerScore === result.aiScore

    return (
      <main className="min-h-screen bg-[#151515] text-white px-5 py-8">

        <div className="max-w-3xl mx-auto text-center">

          <Trophy
            size={70}
            className="mx-auto text-yellow-400 mt-16"
          />

          <h1 className="text-5xl font-black mt-6">
            {gameMode === 'solo'
              ? 'SPRINT COMPLETE'
              : draw
                ? 'DRAW'
                : playerWon
                  ? 'YOU WIN!'
                  : 'MATHBOT WINS'}
          </h1>

          <p className="text-gray-400 mt-3">
            {gameMode === 'solo'
              ? 'Great work. Review your performance and try again.'
              : playerWon
                ? 'You outplayed your opponent.'
                : 'Your opponent was faster this time.'}
          </p>

          <div className="grid grid-cols-2 gap-5 mt-12">

            <div className="rounded-3xl bg-white/5 border border-white/10 p-7">
              <User className="mx-auto text-blue-400" size={30} />

              <p className="text-gray-400 mt-4">
                YOU
              </p>

              <p className="text-5xl font-black mt-2">
                {result.playerScore}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {result.playerCorrect} correct
              </p>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-7">
              <Bot className="mx-auto text-purple-400" size={30} />

              <p className="text-gray-400 mt-4">
                MATHBOT
              </p>

              <p className="text-5xl font-black mt-2">
                {gameMode === 'solo' ? '—' : result.aiScore}
              </p>

              {gameMode === 'duel' && (
                <p className="text-sm text-gray-500 mt-2">
                  {result.aiCorrect} correct
                </p>
              )}
            </div>

          </div>

          <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                Time Used
              </span>

              <span>
                {result.timeUsed}s
              </span>
            </div>

            <div className="flex justify-between text-sm mt-3">
              <span className="text-gray-400">
                Accuracy
              </span>

              <span>
                {result.playerCorrect > 0
                  ? Math.round(
                      (result.playerCorrect /
                        Math.max(1, current + 1)) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">

            <button
              onClick={gameMode === 'duel' ? startDuel : startSolo}
              className="rounded-xl bg-yellow-400 text-black font-bold py-4"
            >
              PLAY AGAIN
            </button>

            <button
              onClick={goBack}
              className="rounded-xl bg-white/10 border border-white/10 font-bold py-4"
            >
              BACK
            </button>

          </div>

        </div>

      </main>
    )
  }

  /*
   * GAME SCREEN
   */
  const question = questions[current]

  return (
    <main className="min-h-screen bg-[#151515] text-white px-4 py-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <button
            onClick={goBack}
            className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="text-center">

            <p className="text-xs text-gray-500">
              {gameMode === 'duel'
                ? '1 MIN DUEL'
                : 'SOLO SPRINT'}
            </p>

            <h1 className="font-black text-lg">
              MENTAL MATH
            </h1>

          </div>

          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">

            <Clock size={18} className="text-yellow-400" />

            <span className="font-black">
              {timeLeft}s
            </span>

          </div>

        </div>

        {/* PLAYERS */}

        {gameMode === 'duel' && (
          <div className="grid grid-cols-2 gap-4 mt-8">

            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center">
                  <User size={20} />
                </div>

                <div>
                  <p className="font-bold">YOU</p>
                  <p className="text-sm text-gray-400">
                    {correct} correct
                  </p>
                </div>

              </div>

              <p className="text-3xl font-black mt-3">
                {score}
              </p>

            </div>

            <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-4">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-full bg-purple-500 flex items-center justify-center">
                  <Bot size={20} />
                </div>

                <div>
                  <p className="font-bold">MATHBOT</p>

                  <p className="text-sm text-gray-400">
                    {aiThinking
                      ? 'Thinking...'
                      : `${aiCorrect} correct`}
                  </p>
                </div>

              </div>

              <p className="text-3xl font-black mt-3">
                {aiScore}
              </p>

            </div>

          </div>
        )}

        {/* PROGRESS */}

        <div className="mt-8">

          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>
              Question {current + 1}
            </span>

            <span>
              {score} XP
            </span>
          </div>

          <div className="h-2 bg-white/10 rounded-full overflow-hidden">

            <motion.div
              animate={{
                width: `${((current + 1) / questions.length) * 100}%`,
              }}
              className="h-full bg-yellow-400"
            />

          </div>

        </div>

        {/* QUESTION */}

        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-3xl bg-white/5 border border-white/10 p-8 md:p-14 text-center"
        >

          <p className="text-gray-500 text-sm uppercase tracking-widest">
            Calculate
          </p>

          <h2 className="text-5xl md:text-7xl font-black mt-8">
            {question?.text}
          </h2>

          <div className="max-w-md mx-auto mt-10">

            <input
              autoFocus
              type="number"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  submitAnswer()
                }
              }}
              placeholder="Your answer"
              className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-5 text-center text-2xl font-bold outline-none focus:border-yellow-400"
            />

            <button
              onClick={submitAnswer}
              className="w-full mt-4 bg-yellow-400 text-black font-black py-5 rounded-2xl"
            >
              SUBMIT ANSWER
            </button>

          </div>

        </motion.div>

        {/* AI HELPER */}

        <div className="mt-6">

          <button
            onClick={() => setHelperOpen(prev => !prev)}
            className="w-full rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4 flex items-center justify-center gap-3 text-yellow-300 font-bold"
          >

            <Lightbulb size={20} />

            AI HELPER

            <Sparkles size={17} />

          </button>

          {helperOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 rounded-2xl bg-white/5 border border-white/10 p-5"
            >

              <div className="flex gap-3">

                <Brain className="text-yellow-400 shrink-0" />

                <div>
                  <p className="font-bold">
                    Coach Hint
                  </p>

                  <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                    {getHelperText()}
                  </p>
                </div>

              </div>

            </motion.div>
          )}

        </div>

        {/* FOOTER STATS */}

        <div className="grid grid-cols-3 gap-3 mt-6">

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <Zap size={18} className="mx-auto text-yellow-400" />
            <p className="text-xs text-gray-500 mt-2">
              SCORE
            </p>
            <p className="font-bold">
              {score}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <Brain size={18} className="mx-auto text-purple-400" />
            <p className="text-xs text-gray-500 mt-2">
              CORRECT
            </p>
            <p className="font-bold">
              {correct}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <Clock size={18} className="mx-auto text-blue-400" />
            <p className="text-xs text-gray-500 mt-2">
              TIME
            </p>
            <p className="font-bold">
              {timeLeft}s
            </p>
          </div>

        </div>

      </div>

    </main>
  )
}