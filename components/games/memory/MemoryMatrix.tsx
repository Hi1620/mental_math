'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Check, X } from 'lucide-react'
import { GameHeader } from '../shared/GameHeader'
import { GameResults } from '../shared/GameResults'

type Phase = 'memorize' | 'answer' | 'result'

const TOTAL_ROUNDS = 8
const TOTAL_CELLS = 36
const GRID_SIZE = 6

export function MemoryMatrix() {
    const [round, setRound] = useState(1)
    const [highlightedCells, setHighlightedCells] = useState<number[]>([])
    const [selectedCells, setSelectedCells] = useState<number[]>([])
    const [phase, setPhase] = useState<Phase>('memorize')

    const [score, setScore] = useState(0)
    const [correctRounds, setCorrectRounds] = useState(0)
    const [timeLeft, setTimeLeft] = useState(120)

    const [roundResult, setRoundResult] = useState<boolean | null>(null)
    const [showResults, setShowResults] = useState(false)

    /*
     * Number of cells to remember increases with every round.
     *
     * Round 1 → 4 cells
     * Round 2 → 5 cells
     * Round 3 → 6 cells
     * ...
     */
    const getTargetCount = useCallback(() => {
        return 3 + round
    }, [round])

    const generateCells = useCallback(() => {
        const count = getTargetCount()
        const cells: number[] = []

        while (cells.length < count) {
            const randomCell = Math.floor(Math.random() * TOTAL_CELLS)

            if (!cells.includes(randomCell)) {
                cells.push(randomCell)
            }
        }

        return cells.sort((a, b) => a - b)
    }, [getTargetCount])

    const startRound = useCallback(() => {
        const cells = generateCells()

        setHighlightedCells(cells)
        setSelectedCells([])
        setRoundResult(null)
        setPhase('memorize')

        /*
         * Give the player more time as the pattern becomes larger.
         */
        const displayTime = 1400 + getTargetCount() * 180

        const timer = setTimeout(() => {
            setPhase('answer')
        }, displayTime)

        return () => clearTimeout(timer)
    }, [generateCells, getTargetCount])

    useEffect(() => {
        startRound()
    }, [round, startRound])

    /*
     * Global game timer.
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

    const handleCellClick = (index: number) => {
        if (phase !== 'answer') return

        /*
         * Prevent selecting the same cell twice.
         */
        if (selectedCells.includes(index)) return

        const newSelected = [...selectedCells, index]

        setSelectedCells(newSelected)

        /*
         * As soon as the player selects the required
         * number of cells, evaluate the answer.
         */
        if (newSelected.length === highlightedCells.length) {
            evaluateAnswer(newSelected)
        }
    }

    const evaluateAnswer = (selected: number[]) => {
        const correct =
            selected.length === highlightedCells.length &&
            selected.every(cell => highlightedCells.includes(cell))

        setRoundResult(correct)
        setPhase('result')

        if (correct) {
            const roundScore = getTargetCount() * 20

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
        setSelectedCells([])
        setHighlightedCells([])
        setRoundResult(null)
        setShowResults(false)
    }

    if (showResults) {
        return (
            <GameResults
                gameName="Memory Matrix"
                gameType="memory"
                score={score}
                maxScore={1080}
                accuracy={Math.round((correctRounds / TOTAL_ROUNDS) * 100)}
                timeSpent={120 - timeLeft}
                totalTime={120}
                difficulty="Adaptive"
                xpEarned={correctRounds * 45}
            />
        )
    }

    return (
        <div className="min-h-screen bg-background px-4 py-6">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <GameHeader
                    title="Memory Matrix"
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
                            Remember {getTargetCount()} cells
                        </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                            animate={{
                                width: `${(round / TOTAL_ROUNDS) * 100}%`,
                            }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-neon"
                        />
                    </div>
                </div>

                {/* Game Card */}
                <motion.div
                    key={`${round}-${phase}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gaming-card p-5 md:p-7"
                >

                    {/* Title */}
                    <div className="text-center mb-6">

                        <div className="flex justify-center mb-3">
                            <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center">
                                <Brain
                                    size={20}
                                    className="text-neon"
                                />
                            </div>
                        </div>

                        {phase === 'memorize' && (
                            <>
                                <h2 className="text-xl font-semibold mb-1">
                                    Memorize the pattern
                                </h2>

                                <p className="text-sm text-gray-400">
                                    Remember the highlighted cells.
                                </p>
                            </>
                        )}

                        {phase === 'answer' && (
                            <>
                                <h2 className="text-xl font-semibold mb-1">
                                    Recreate the pattern
                                </h2>

                                <p className="text-sm text-gray-400">
                                    Select the cells that were highlighted.
                                </p>
                            </>
                        )}

                        {phase === 'result' && (
                            <>
                                <h2 className="text-xl font-semibold mb-1">
                                    {roundResult
                                        ? 'Perfect recall'
                                        : 'Pattern mismatch'}
                                </h2>

                                <p className="text-sm text-gray-400">
                                    {roundResult
                                        ? 'You remembered the spatial pattern correctly.'
                                        : 'Some selected cells did not match the original pattern.'}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Matrix */}
                    <div className="max-w-md mx-auto">
                        <div
                            className="grid gap-2"
                            style={{
                                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                            }}
                        >
                            {Array.from({ length: TOTAL_CELLS }).map((_, index) => {

                                const isHighlighted =
                                    highlightedCells.includes(index)

                                const isSelected =
                                    selectedCells.includes(index)

                                const showCorrectPattern =
                                    phase === 'result' && isHighlighted

                                const showWrongSelection =
                                    phase === 'result' &&
                                    isSelected &&
                                    !isHighlighted

                                return (
                                    <motion.button
                                        key={index}
                                        whileHover={
                                            phase === 'answer'
                                                ? { scale: 1.05 }
                                                : {}
                                        }
                                        whileTap={
                                            phase === 'answer'
                                                ? { scale: 0.95 }
                                                : {}
                                        }
                                        onClick={() => handleCellClick(index)}
                                        disabled={phase !== 'answer'}
                                        className={`
                      aspect-square
                      rounded-lg
                      border
                      transition-all
                      duration-200
                      flex
                      items-center
                      justify-center

                      ${phase === 'memorize' && isHighlighted
                                                ? 'bg-neon border-neon shadow-[0_0_16px_rgba(0,255,65,0.45)]'
                                                : ''
                                            }

                      ${phase === 'memorize' && !isHighlighted
                                                ? 'bg-white/[0.03] border-white/10'
                                                : ''
                                            }

                      ${phase === 'answer' && isSelected
                                                ? 'bg-neon/30 border-neon'
                                                : ''
                                            }

                      ${phase === 'answer' && !isSelected
                                                ? 'bg-white/[0.03] border-white/10 hover:border-neon/60 hover:bg-neon/10'
                                                : ''
                                            }

                      ${showCorrectPattern
                                                ? 'bg-green-500/30 border-green-500'
                                                : ''
                                            }

                      ${showWrongSelection
                                                ? 'bg-red-500/30 border-red-500'
                                                : ''
                                            }
                    `}
                                    >
                                        {phase === 'result' && isHighlighted && (
                                            <span className="w-2 h-2 rounded-full bg-green-400" />
                                        )}

                                        {phase === 'result' &&
                                            showWrongSelection && (
                                                <X
                                                    size={15}
                                                    className="text-red-400"
                                                />
                                            )}

                                        {phase === 'answer' && isSelected && (
                                            <span className="w-2 h-2 rounded-full bg-neon" />
                                        )}
                                    </motion.button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Answer Counter */}
                    {phase === 'answer' && (
                        <div className="text-center mt-5">
                            <p className="text-xs text-gray-500">
                                Selected
                            </p>

                            <p className="text-lg font-semibold text-neon">
                                {selectedCells.length}/{highlightedCells.length}
                            </p>
                        </div>
                    )}

                    {/* Result */}
                    {phase === 'result' && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mt-6"
                        >
                            <div
                                className={`
                  w-12 h-12
                  mx-auto
                  mb-4
                  rounded-full
                  flex
                  items-center
                  justify-center
                  border

                  ${roundResult
                                        ? 'bg-green-500/10 border-green-500/40'
                                        : 'bg-red-500/10 border-red-500/40'
                                    }
                `}
                            >
                                {roundResult ? (
                                    <Check
                                        size={22}
                                        className="text-green-400"
                                    />
                                ) : (
                                    <X
                                        size={22}
                                        className="text-red-400"
                                    />
                                )}
                            </div>

                            <button
                                onClick={nextRound}
                                className="gaming-button px-6 py-2.5 text-sm font-semibold text-black"
                            >
                                {round === TOTAL_ROUNDS
                                    ? 'View Results'
                                    : 'Next Round'}
                            </button>
                        </motion.div>
                    )}

                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mt-4">

                    <div className="gaming-card px-4 py-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">
                            Correct Rounds
                        </p>

                        <p className="text-lg font-semibold text-neon">
                            {correctRounds}/{Math.max(round - 1, 0)}
                        </p>
                    </div>

                    <div className="gaming-card px-4 py-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">
                            Memory Load
                        </p>

                        <p className="text-lg font-semibold text-neon">
                            {getTargetCount()} cells
                        </p>
                    </div>

                </div>

            </div>
        </div>
    )
}