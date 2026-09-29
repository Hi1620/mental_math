'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Flame, Target } from 'lucide-react'
import { GameHeader } from '../shared/GameHeader'
import { GameResults } from '../shared/GameResults'

const TOTAL_TIME = 150

type Phase = 'ready' | 'showing' | 'recall' | 'result'

const SYMBOLS = [
    '▲',
    '●',
    '■',
    '◆',
    '★',
    '⬟',
    '✚',
    '✦',
]

interface RoundResult {
    correct: boolean
    points: number
}

function generateSequence(length: number) {
    const sequence: string[] = []

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(
            Math.random() * SYMBOLS.length
        )

        sequence.push(SYMBOLS[randomIndex])
    }

    return sequence
}

export function SequenceRecall() {
    const [level, setLevel] = useState(1)

    const [sequence, setSequence] = useState<string[]>(
        () => generateSequence(3)
    )

    const [userSequence, setUserSequence] =
        useState<string[]>([])

    const [phase, setPhase] =
        useState<Phase>('ready')

    const [currentSymbol, setCurrentSymbol] =
        useState(0)

    const [score, setScore] = useState(0)

    const [streak, setStreak] = useState(0)

    const [bestStreak, setBestStreak] =
        useState(0)

    const [correctRounds, setCorrectRounds] =
        useState(0)

    const [attempts, setAttempts] =
        useState(0)

    const [timeLeft, setTimeLeft] =
        useState(TOTAL_TIME)

    const [roundResults, setRoundResults] =
        useState<RoundResult[]>([])

    const [showResults, setShowResults] =
        useState(false)

    /*
     * Sequence length increases as the player
     * performs better.
     */
    const sequenceLength = useMemo(() => {
        return Math.min(
            3 + Math.floor((level - 1) / 2),
            10
        )
    }, [level])

    /*
     * How quickly symbols are displayed.
     * Higher level = faster.
     */
    const displaySpeed = Math.max(
        350,
        900 - level * 55
    )

    /*
     * Generate a new round.
     */
    const startRound = useCallback(
        (nextLevel: number) => {
            const newLength = Math.min(
                3 + Math.floor((nextLevel - 1) / 2),
                10
            )

            setSequence(
                generateSequence(newLength)
            )

            setUserSequence([])

            setCurrentSymbol(0)

            setPhase('ready')
        },
        []
    )

    /*
     * Global timer.
     */
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

    /*
     * Start showing the sequence.
     */
    useEffect(() => {
        if (phase !== 'ready') return

        const timer = setTimeout(() => {
            setPhase('showing')
            setCurrentSymbol(0)
        }, 700)

        return () => clearTimeout(timer)
    }, [phase])

    /*
     * Display each symbol one by one.
     */
    useEffect(() => {
        if (phase !== 'showing') return

        if (currentSymbol >= sequence.length) {
            const timer = setTimeout(() => {
                setPhase('recall')
            }, 500)

            return () => clearTimeout(timer)
        }

        const timer = setTimeout(() => {
            setCurrentSymbol(prev => prev + 1)
        }, displaySpeed)

        return () => clearTimeout(timer)
    }, [
        phase,
        currentSymbol,
        sequence.length,
        displaySpeed,
    ])

    /*
     * Handle player's symbol selection.
     */
    const handleSymbolClick = (
        symbol: string
    ) => {
        if (phase !== 'recall') return

        const nextSequence = [
            ...userSequence,
            symbol,
        ]

        setUserSequence(nextSequence)

        const position =
            nextSequence.length - 1

        /*
         * Check the current position immediately.
         */
        if (symbol !== sequence[position]) {
            finishRound(false)
            return
        }

        /*
         * Complete sequence reproduced correctly.
         */
        if (
            nextSequence.length ===
            sequence.length
        ) {
            finishRound(true)
        }
    }

    /*
     * Finish a round.
     */
    const finishRound = (
        correct: boolean
    ) => {
        setAttempts(prev => prev + 1)

        if (correct) {
            const newStreak = streak + 1

            const multiplier =
                newStreak >= 7
                    ? 3
                    : newStreak >= 4
                        ? 2
                        : 1

            const basePoints =
                sequence.length * 20

            const points =
                basePoints * multiplier

            setScore(prev => prev + points)

            setStreak(newStreak)

            setBestStreak(prev =>
                Math.max(prev, newStreak)
            )

            setCorrectRounds(prev => prev + 1)

            setRoundResults(prev => [
                ...prev,
                {
                    correct: true,
                    points,
                },
            ])

            /*
             * Increase difficulty after every
             * second successful round.
             */
            const nextLevel =
                newStreak % 2 === 0
                    ? level + 1
                    : level

            setLevel(nextLevel)

            setPhase('result')

            setTimeout(() => {
                startRound(nextLevel)
            }, 700)
        } else {
            setStreak(0)

            setRoundResults(prev => [
                ...prev,
                {
                    correct: false,
                    points: 0,
                },
            ])

            /*
             * Losing a round doesn't immediately
             * decrease difficulty. The player gets
             * another chance.
             */
            setPhase('result')

            setTimeout(() => {
                startRound(level)
            }, 900)
        }
    }

    const accuracy =
        attempts > 0
            ? Math.round(
                (correctRounds / attempts) * 100
            )
            : 0

    /*
     * Current progress.
     */
    const recallProgress =
        sequence.length > 0
            ? Math.round(
                (userSequence.length /
                    sequence.length) *
                100
            )
            : 0

    const multiplier =
        streak >= 7
            ? 3
            : streak >= 4
                ? 2
                : 1

    /*
     * Results screen.
     */
    if (showResults) {
        return (
            <GameResults
                gameName="Sequence Recall"
                gameType="memory"
                score={score}
                maxScore={Math.max(score, 100)}
                accuracy={accuracy}
                timeSpent={TOTAL_TIME - timeLeft}
                totalTime={TOTAL_TIME}
                difficulty={
                    level >= 8
                        ? 'Expert'
                        : level >= 5
                            ? 'Hard'
                            : 'Medium'
                }
                xpEarned={Math.round(score * 1.5)}
            />
        )
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <GameHeader
                    title="Sequence Recall"
                    timeLeft={timeLeft}
                    score={score}
                    onQuit={() => setShowResults(true)}
                />

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">

                    <div className="gaming-card p-3 text-center">
                        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                            <Brain size={14} />
                            Level
                        </div>

                        <p className="text-lg font-semibold text-neon mt-1">
                            {level}
                        </p>
                    </div>

                    <div className="gaming-card p-3 text-center">
                        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                            <Flame size={14} />
                            Streak
                        </div>

                        <p className="text-lg font-semibold text-neon mt-1">
                            {streak}
                        </p>
                    </div>

                    <div className="gaming-card p-3 text-center">
                        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                            <Target size={14} />
                            Accuracy
                        </div>

                        <p className="text-lg font-semibold text-neon mt-1">
                            {accuracy}%
                        </p>
                    </div>

                    <div className="gaming-card p-3 text-center">
                        <p className="text-gray-400 text-xs">
                            Sequence
                        </p>

                        <p className="text-lg font-semibold text-neon mt-1">
                            {sequence.length} symbols
                        </p>
                    </div>

                </div>

                {/* Game Card */}
                <motion.div
                    key={`${level}-${sequence.join('')}`}
                    initial={{
                        opacity: 0,
                        y: 12,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="gaming-card p-5 md:p-8"
                >

                    {/* Status */}
                    <div className="text-center mb-7">

                        {phase === 'ready' && (
                            <>
                                <p className="text-sm font-semibold text-neon">
                                    GET READY
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    Watch the sequence carefully
                                </p>
                            </>
                        )}

                        {phase === 'showing' && (
                            <>
                                <p className="text-sm font-semibold text-neon">
                                    MEMORIZE
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    Symbol {Math.min(
                                        currentSymbol + 1,
                                        sequence.length
                                    )} of {sequence.length}
                                </p>
                            </>
                        )}

                        {phase === 'recall' && (
                            <>
                                <p className="text-sm font-semibold text-neon">
                                    YOUR TURN
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    Reproduce the sequence in the
                                    same order
                                </p>
                            </>
                        )}

                        {phase === 'result' && (
                            <>
                                <p className="text-sm font-semibold text-neon">
                                    {roundResults[
                                        roundResults.length - 1
                                    ]?.correct
                                        ? 'CORRECT'
                                        : 'INCORRECT'}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    Preparing next challenge...
                                </p>
                            </>
                        )}

                    </div>

                    {/* Sequence Display */}
                    <div className="min-h-[150px] flex items-center justify-center mb-7">

                        {phase === 'showing' &&
                            currentSymbol < sequence.length && (
                                <motion.div
                                    key={currentSymbol}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.7,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 1.2,
                                    }}
                                    className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border border-neon/60 bg-neon/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,65,0.15)]"
                                >
                                    <span className="text-5xl md:text-6xl text-neon">
                                        {sequence[currentSymbol]}
                                    </span>
                                </motion.div>
                            )}

                        {phase === 'ready' && (
                            <motion.div
                                animate={{
                                    scale: [1, 1.04, 1],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1.2,
                                }}
                                className="w-24 h-24 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center"
                            >
                                <Brain
                                    size={34}
                                    className="text-neon"
                                />
                            </motion.div>
                        )}

                        {phase === 'recall' && (
                            <div className="flex items-center gap-2 flex-wrap justify-center max-w-xl">

                                {Array.from({
                                    length: sequence.length,
                                }).map((_, index) => (
                                    <div
                                        key={index}
                                        className={`
                      w-10 h-10 rounded-lg
                      border flex items-center justify-center
                      text-sm font-semibold
                      ${userSequence[index]
                                                ? 'border-neon bg-neon/10 text-neon'
                                                : 'border-white/10 bg-white/[0.03] text-gray-600'
                                            }
                    `}
                                    >
                                        {userSequence[index] || '?'}
                                    </div>
                                ))}

                            </div>
                        )}

                        {phase === 'result' && (
                            <div className="text-center">
                                <div className="flex justify-center gap-2 mb-3">

                                    {sequence.map(
                                        (symbol, index) => (
                                            <span
                                                key={index}
                                                className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-lg text-neon"
                                            >
                                                {symbol}
                                            </span>
                                        )
                                    )}

                                </div>

                                <p className="text-xs text-gray-500">
                                    Correct sequence
                                </p>
                            </div>
                        )}

                    </div>

                    {/* Symbol Input */}
                    {phase === 'recall' && (
                        <div className="max-w-xl mx-auto">

                            <div className="grid grid-cols-4 gap-2.5">

                                {SYMBOLS.map(symbol => (
                                    <motion.button
                                        key={symbol}
                                        whileHover={{
                                            scale: 1.04,
                                        }}
                                        whileTap={{
                                            scale: 0.96,
                                        }}
                                        onClick={() =>
                                            handleSymbolClick(symbol)
                                        }
                                        className="h-14 md:h-16 rounded-xl border border-white/10 bg-white/[0.04] hover:border-neon/50 hover:bg-neon/5 transition-all flex items-center justify-center"
                                    >
                                        <span className="text-xl md:text-2xl text-gray-200">
                                            {symbol}
                                        </span>
                                    </motion.button>
                                ))}

                            </div>

                            {/* Progress */}
                            <div className="mt-5">

                                <div className="flex justify-between text-xs text-gray-500 mb-2">
                                    <span>
                                        Recall progress
                                    </span>

                                    <span>
                                        {userSequence.length}/
                                        {sequence.length}
                                    </span>
                                </div>

                                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">

                                    <motion.div
                                        animate={{
                                            width: `${recallProgress}%`,
                                        }}
                                        className="h-full bg-neon"
                                    />

                                </div>

                            </div>

                        </div>
                    )}

                    {/* Combo */}
                    {multiplier > 1 && (
                        <div className="flex justify-center mt-6">

                            <div className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
                                ×{multiplier} COMBO
                            </div>

                        </div>
                    )}

                </motion.div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-4 text-xs text-gray-500">

                    <span>
                        Best streak: {bestStreak}
                    </span>

                    <span>
                        Adaptive difficulty
                    </span>

                </div>

            </div>
        </div>
    )
}
