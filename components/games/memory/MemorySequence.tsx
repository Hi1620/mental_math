'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, RotateCcw, Brain } from 'lucide-react'
import { GameHeader } from '../shared/GameHeader'
import { GameResults } from '../shared/GameResults'

type Phase = 'show' | 'answer' | 'result'

const TOTAL_ROUNDS = 8
const START_LENGTH = 3
const SHOW_TIME = 900

const symbols = [
    '◆',
    '●',
    '▲',
    '■',
    '★',
    '✦',
    '⬟',
    '⬢',
]

export function MemorySequence() {
    const [round, setRound] = useState(1)
    const [sequence, setSequence] = useState<string[]>([])
    const [playerSequence, setPlayerSequence] = useState<string[]>([])
    const [phase, setPhase] = useState<Phase>('show')
    const [score, setScore] = useState(0)
    const [correctRounds, setCorrectRounds] = useState(0)
    const [timeLeft, setTimeLeft] = useState(120)
    const [showResults, setShowResults] = useState(false)
    const [roundResult, setRoundResult] = useState<boolean | null>(null)

    const generateSequence = useCallback((length: number) => {
        const result: string[] = []

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * symbols.length)
            result.push(symbols[randomIndex])
        }

        return result
    }, [])

    const startRound = useCallback(() => {
        const length = START_LENGTH + Math.floor((round - 1) / 2)
        const newSequence = generateSequence(length)

        setSequence(newSequence)
        setPlayerSequence([])
        setRoundResult(null)
        setPhase('show')

        const timer = setTimeout(() => {
            setPhase('answer')
        }, Math.max(SHOW_TIME, length * 650))

        return () => clearTimeout(timer)
    }, [generateSequence, round])

    useEffect(() => {
        startRound()
    }, [round, startRound])

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

    const handleSymbolClick = (symbol: string) => {
        if (phase !== 'answer') return

        const nextSequence = [...playerSequence, symbol]

        setPlayerSequence(nextSequence)

        const currentIndex = nextSequence.length - 1

        if (symbol !== sequence[currentIndex]) {
            finishRound(false)
            return
        }

        if (nextSequence.length === sequence.length) {
            finishRound(true)
        }
    }

    const finishRound = (correct: boolean) => {
        setPhase('result')
        setRoundResult(correct)

        if (correct) {
            const roundScore = sequence.length * 15
            setScore(prev => prev + roundScore)
            setCorrectRounds(prev => prev + 1)
        }
    }

    const nextRound = () => {
        if (round >= TOTAL_ROUNDS) {
            setShowResults(true)
            return
        }

        setRound(prev => prev + 1)
    }

    const restartGame = () => {
        setRound(1)
        setScore(0)
        setCorrectRounds(0)
        setTimeLeft(120)
        setShowResults(false)
        setPlayerSequence([])
        setRoundResult(null)
    }

    if (showResults) {
        return (
            <GameResults
                gameName="Memory Sequence"
                gameType="memory"
                score={score}
                maxScore={600}
                accuracy={Math.round((correctRounds / TOTAL_ROUNDS) * 100)}
                timeSpent={120 - timeLeft}
                totalTime={120}
                difficulty="Adaptive"
                xpEarned={correctRounds * 40}
            />
        )
    }

    return (
        <div className="min-h-screen bg-background px-4 py-6">
            <div className="max-w-3xl mx-auto">

                <GameHeader
                    title="Memory Sequence"
                    timeLeft={timeLeft}
                    score={score}
                    onQuit={() => setShowResults(true)}
                />

                {/* Progress */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                            Round {round}/{TOTAL_ROUNDS}
                        </span>

                        <span className="text-xs text-gray-400">
                            Sequence length: {sequence.length}
                        </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                            animate={{
                                width: `${(round / TOTAL_ROUNDS) * 100}%`,
                            }}
                            className="h-full bg-neon"
                        />
                    </div>
                </div>

                {/* Main Card */}
                <motion.div
                    key={`${round}-${phase}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gaming-card p-6 md:p-8"
                >

                    {/* Instructions */}
                    <div className="text-center mb-7">
                        <div className="flex justify-center mb-3">
                            <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center">
                                <Brain size={20} className="text-neon" />
                            </div>
                        </div>

                        {phase === 'show' && (
                            <>
                                <h2 className="text-xl font-semibold mb-1">
                                    Memorize the sequence
                                </h2>
                                <p className="text-sm text-gray-400">
                                    Watch carefully. It will disappear shortly.
                                </p>
                            </>
                        )}

                        {phase === 'answer' && (
                            <>
                                <h2 className="text-xl font-semibold mb-1">
                                    Rebuild the sequence
                                </h2>
                                <p className="text-sm text-gray-400">
                                    Select the symbols in the exact order.
                                </p>
                            </>
                        )}

                        {phase === 'result' && (
                            <>
                                <h2 className="text-xl font-semibold mb-1">
                                    {roundResult ? 'Excellent recall!' : 'Sequence broken'}
                                </h2>

                                <p className="text-sm text-gray-400">
                                    {roundResult
                                        ? 'Your memory pattern was correct.'
                                        : 'The sequence did not match.'}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Sequence Display */}
                    {phase === 'show' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-wrap justify-center gap-3 mb-8"
                        >
                            {sequence.map((symbol, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: index * 0.12,
                                    }}
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl border border-neon/50 bg-neon/10 flex items-center justify-center text-3xl text-neon"
                                >
                                    {symbol}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Player Progress */}
                    {phase === 'answer' && (
                        <>
                            <div className="flex justify-center gap-2 mb-7 min-h-10">
                                {sequence.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm ${playerSequence[index]
                                                ? 'border-neon bg-neon/10 text-neon'
                                                : 'border-white/15 bg-white/5'
                                            }`}
                                    >
                                        {playerSequence[index] || ''}
                                    </div>
                                ))}
                            </div>

                            {/* Symbol Grid */}
                            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
                                {symbols.map(symbol => (
                                    <motion.button
                                        key={symbol}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSymbolClick(symbol)}
                                        className="aspect-square rounded-xl border border-white/15 bg-white/[0.04] hover:border-neon/60 hover:bg-neon/10 transition-all text-2xl text-gray-200"
                                    >
                                        {symbol}
                                    </motion.button>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Result */}
                    {phase === 'result' && (
                        <div className="text-center">

                            <div
                                className={`w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center border ${roundResult
                                        ? 'bg-green-500/10 border-green-500/40 text-green-400'
                                        : 'bg-red-500/10 border-red-500/40 text-red-400'
                                    }`}
                            >
                                {roundResult ? (
                                    <Check size={28} />
                                ) : (
                                    <RotateCcw size={26} />
                                )}
                            </div>

                            <div className="mb-6">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                    Correct sequence
                                </p>

                                <div className="flex justify-center gap-2">
                                    {sequence.map((symbol, index) => (
                                        <span
                                            key={index}
                                            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg"
                                        >
                                            {symbol}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={nextRound}
                                className="gaming-button px-6 py-2.5 text-sm font-semibold text-black"
                            >
                                {round === TOTAL_ROUNDS
                                    ? 'View Results'
                                    : 'Next Round'}
                            </button>
                        </div>
                    )}

                </motion.div>

                {/* Footer Stats */}
                <div className="grid grid-cols-2 gap-3 mt-4">

                    <div className="gaming-card px-4 py-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">
                            Correct
                        </p>
                        <p className="text-lg font-semibold text-neon">
                            {correctRounds}/{round - 1}
                        </p>
                    </div>

                    <div className="gaming-card px-4 py-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">
                            Current Level
                        </p>
                        <p className="text-lg font-semibold text-neon">
                            {sequence.length}
                        </p>
                    </div>

                </div>

            </div>
        </div>
    )
}