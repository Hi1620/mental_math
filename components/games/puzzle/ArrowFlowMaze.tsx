'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    Eraser,
    Lightbulb,
    RotateCcw,
    Trophy,
    X,
    Zap,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { GameHeader } from '../shared/GameHeader'
import { GameResults } from '../shared/GameResults'

type Direction = 'up' | 'down' | 'left' | 'right'

// null = empty cell, Direction = an arrow tile pointing that way
type BoardCell = Direction | null

interface LevelLayout {
    size: number
    cells: BoardCell[]
}

const directionIcons = {
    up: ArrowUp,
    down: ArrowDown,
    left: ArrowLeft,
    right: ArrowRight,
}

// ---------------------------------------------------------------------------
// Board generation
//
// The real "Arrow Puzzle" mechanic: tapping an arrow only works if every
// cell between it and the edge (in its own direction) is empty. To
// guarantee every generated board is actually solvable, we build it
// *backwards*: starting from an empty grid we pick a random removal
// order o_1 (first arrow a player would clear) ... o_n (last), then walk
// that order in reverse, placing each arrow with a direction that is
// clear of every arrow that would still be on the board at the moment
// it needs to be removed. That's exactly the guarantee the forward game
// needs.
// ---------------------------------------------------------------------------

function shuffle<T>(arr: T[]): T[] {
    const copy = [...arr]
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}

function pathCells(
    pos: number,
    dir: Direction,
    size: number
): number[] {
    const row = Math.floor(pos / size)
    const col = pos % size
    const out: number[] = []

    if (dir === 'up') {
        for (let r = row - 1; r >= 0; r--) out.push(r * size + col)
    } else if (dir === 'down') {
        for (let r = row + 1; r < size; r++) out.push(r * size + col)
    } else if (dir === 'left') {
        for (let c = col - 1; c >= 0; c--) out.push(row * size + c)
    } else if (dir === 'right') {
        for (let c = col + 1; c < size; c++) out.push(row * size + c)
    }

    return out
}

function isPathClear(
    pos: number,
    dir: Direction,
    size: number,
    occupied: Set<number>
): boolean {
    return pathCells(pos, dir, size).every(c => !occupied.has(c))
}

function generateLevel(size: number, fillAttempts = 2): LevelLayout {
    let best: BoardCell[] = new Array(size * size).fill(null)
    let bestFilled = -1

    // Try a couple of random constructions and keep the densest solvable one.
    for (let attempt = 0; attempt < fillAttempts; attempt++) {
        const n = size * size
        const order = shuffle(Array.from({ length: n }, (_, i) => i))
        const cells: BoardCell[] = new Array(n).fill(null)
        const onBoard = new Set<number>()

        // Walk the removal order backwards: index n-1 is placed first
        // (it will have nothing blocking it yet), index 0 is placed last
        // (almost everything else may already be "on the board").
        for (let i = order.length - 1; i >= 0; i--) {
            const cell = order[i]
            const candidates = shuffle<Direction>([
                'up',
                'down',
                'left',
                'right',
            ])

            for (const dir of candidates) {
                if (isPathClear(cell, dir, size, onBoard)) {
                    cells[cell] = dir
                    onBoard.add(cell)
                    break
                }
            }
            // If no direction is clear, we simply leave this cell empty —
            // that keeps the whole board provably solvable.
        }

        const filled = cells.filter(Boolean).length
        if (filled > bestFilled) {
            bestFilled = filled
            best = cells
        }
    }

    return { size, cells: best }
}

function findFreeArrow(
    cells: BoardCell[],
    size: number
): number | null {
    const occupied = new Set<number>()
    cells.forEach((c, i) => {
        if (c) occupied.add(i)
    })

    const filledIndices = shuffle(
        cells
            .map((c, i) => (c ? i : -1))
            .filter(i => i !== -1)
    )

    for (const idx of filledIndices) {
        const dir = cells[idx] as Direction
        if (isPathClear(idx, dir, size, occupied)) {
            return idx
        }
    }

    return null
}

const LEVEL_SIZES = [6, 7]

export function ArrowFlowMaze() {
    const [layouts] = useState<LevelLayout[]>(() =>
        LEVEL_SIZES.map(size => generateLevel(size))
    )

    const [levelIndex, setLevelIndex] = useState(0)
    const [cells, setCells] = useState<BoardCell[]>(layouts[0].cells)
    const [moves, setMoves] = useState(0)
    const [lives, setLives] = useState(3)
    const [hints, setHints] = useState(3)
    const [erasers, setErasers] = useState(2)
    const [eraserActive, setEraserActive] = useState(false)
    const [timeLeft, setTimeLeft] = useState(180)
    const [showResults, setShowResults] = useState(false)
    const [finished, setFinished] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [shakeIndex, setShakeIndex] = useState<number | null>(null)
    const [hintIndex, setHintIndex] = useState<number | null>(null)

    const level = layouts[levelIndex]
    const totalArrows = useMemo(
        () => level.cells.filter(Boolean).length,
        [level]
    )
    const remaining = useMemo(() => cells.filter(Boolean).length, [cells])
    const progress = useMemo(() => {
        if (totalArrows === 0) return 100
        return Math.round(((totalArrows - remaining) / totalArrows) * 100)
    }, [totalArrows, remaining])

    useEffect(() => {
        if (finished || gameOver) return

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
    }, [finished, gameOver])

    const resetLevel = useCallback(() => {
        setCells(level.cells)
        setMoves(0)
        setLives(3)
        setHints(3)
        setErasers(2)
        setEraserActive(false)
        setFinished(false)
        setGameOver(false)
        setShakeIndex(null)
        setHintIndex(null)
    }, [level])

    const completeLevel = useCallback(() => {
        if (levelIndex < layouts.length - 1) {
            const nextIndex = levelIndex + 1
            const nextLevel = layouts[nextIndex]

            setLevelIndex(nextIndex)
            setCells(nextLevel.cells)
            setMoves(0)
            setHints(prev => Math.max(prev, 1))
            setEraserActive(false)
            setHintIndex(null)
        } else {
            setFinished(true)
            setShowResults(true)
        }
    }, [levelIndex, layouts])

    const handleTap = useCallback(
        (index: number) => {
            if (finished || gameOver) return

            const dir = cells[index]
            if (!dir) return

            setHintIndex(null)

            // Eraser mode: force-remove for free, no risk.
            if (eraserActive) {
                setCells(prev => {
                    const next = [...prev]
                    next[index] = null
                    return next
                })
                setErasers(prev => Math.max(prev - 1, 0))
                setEraserActive(false)
                setMoves(prev => prev + 1)
                return
            }

            const occupied = new Set<number>()
            cells.forEach((c, i) => {
                if (c) occupied.add(i)
            })

            const clear = isPathClear(index, dir, level.size, occupied)

            if (!clear) {
                setShakeIndex(index)
                setTimeout(() => setShakeIndex(null), 420)

                setLives(prev => {
                    const next = Math.max(prev - 1, 0)
                    if (next === 0) {
                        setGameOver(true)
                        setTimeout(() => setShowResults(true), 500)
                    }
                    return next
                })
                return
            }

            setMoves(prev => prev + 1)
            setCells(prev => {
                const next = [...prev]
                next[index] = null
                return next
            })
        },
        [cells, eraserActive, finished, gameOver, level.size]
    )

    // Detect a cleared board.
    useEffect(() => {
        if (finished || gameOver) return
        if (totalArrows > 0 && remaining === 0) {
            setTimeout(() => completeLevel(), 500)
        }
    }, [remaining, totalArrows, finished, gameOver, completeLevel])

    const useHint = () => {
        if (hints <= 0 || finished || gameOver) return

        const freeIndex = findFreeArrow(cells, level.size)
        if (freeIndex === null) return

        setHints(prev => prev - 1)
        setHintIndex(freeIndex)

        setTimeout(() => setHintIndex(null), 1400)
    }

    if (showResults) {
        const cleared = totalArrows - remaining
        const accuracy =
            moves > 0 ? Math.round((cleared / moves) * 100) : 0

        return (
            <GameResults
                gameName="Arrow Puzzle"
                gameType="puzzle"
                score={finished ? 100 : Math.max(0, accuracy - (3 - lives) * 5)}
                maxScore={100}
                accuracy={accuracy}
                timeSpent={180 - timeLeft}
                totalTime={180}
                difficulty="Adaptive"
                xpEarned={finished ? 250 : 25}
            />
        )
    }

    return (
        <div className="min-h-screen bg-background px-4 py-5 md:px-6">
            <div className="max-w-5xl mx-auto">
                <GameHeader
                    title="Arrow Puzzle"
                    timeLeft={timeLeft}
                    score={Math.max(0, 100 - moves)}
                    onQuit={() => setShowResults(true)}
                />

                {/* Game information */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5"
                >
                    <div className="gaming-card p-3 text-center">
                        <p className="text-xs text-gray-400">LEVEL</p>
                        <p className="text-lg font-bold text-neon">
                            {levelIndex + 1}/{layouts.length}
                        </p>
                    </div>

                    <div className="gaming-card p-3 text-center">
                        <p className="text-xs text-gray-400">MOVES</p>
                        <p className="text-lg font-bold">{moves}</p>
                    </div>

                    <div className="gaming-card p-3 text-center">
                        <p className="text-xs text-gray-400">LIVES</p>
                        <p className="text-lg font-bold">
                            {'♥'.repeat(lives)}
                            <span className="text-gray-600">
                                {'♥'.repeat(3 - lives)}
                            </span>
                        </p>
                    </div>

                    <div className="gaming-card p-3 text-center">
                        <p className="text-xs text-gray-400">HINTS</p>
                        <p className="text-lg font-bold text-yellow-400">
                            {hints}
                        </p>
                    </div>

                    <div className="gaming-card p-3 text-center">
                        <p className="text-xs text-gray-400">LEFT</p>
                        <p className="text-lg font-bold text-green-400">
                            {remaining}
                        </p>
                    </div>
                </motion.div>

                {/* Progress */}
                <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400">
                            Board Cleared
                        </span>
                        <span className="text-xs font-semibold text-neon">
                            {progress}%
                        </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-neon"
                        />
                    </div>
                </div>

                {/* Main Game */}
                <div className="grid lg:grid-cols-[1fr_250px] gap-5">
                    {/* Board */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="gaming-card p-4 md:p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Tap the Arrows Away
                                </h2>
                                <p className="text-xs text-gray-400 mt-1">
                                    An arrow can only leave the board if its
                                    path to the edge is completely clear.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Zap size={14} className="text-neon" />
                                {eraserActive ? 'Eraser: pick a tile' : 'Tap to move'}
                            </div>
                        </div>

                        <div
                            className="grid gap-1.5 mx-auto max-w-[620px]"
                            style={{
                                gridTemplateColumns: `repeat(${level.size}, minmax(0, 1fr))`,
                            }}
                        >
                            {cells.map((cell, index) => {
                                const isShaking = shakeIndex === index
                                const isHinted = hintIndex === index
                                const Icon = cell ? directionIcons[cell] : null

                                return (
                                    <motion.button
                                        key={index}
                                        disabled={!cell}
                                        whileHover={{ scale: cell ? 1.05 : 1 }}
                                        whileTap={{ scale: cell ? 0.92 : 1 }}
                                        animate={
                                            isShaking
                                                ? { x: [0, -6, 6, -4, 4, 0] }
                                                : { x: 0 }
                                        }
                                        transition={{ duration: 0.4 }}
                                        onClick={() => handleTap(index)}
                                        className={`
                      relative aspect-square rounded-lg
                      border transition-colors duration-200
                      flex items-center justify-center
                      ${!cell
                                                ? 'bg-white/[0.015] border-white/5'
                                                : isShaking
                                                    ? 'bg-red-500/20 border-red-400'
                                                    : isHinted
                                                        ? 'bg-yellow-400/20 border-yellow-400 shadow-[0_0_16px_rgba(250,204,21,0.35)]'
                                                        : eraserActive
                                                            ? 'bg-white/[0.06] border-red-400/30 hover:bg-red-400/10 cursor-pointer'
                                                            : 'bg-white/[0.05] border-white/10 hover:border-neon/40 cursor-pointer'
                                            }
                    `}
                                    >
                                        <AnimatePresence>
                                            {Icon && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        scale: 0.4,
                                                    }}
                                                >
                                                    <Icon
                                                        size={20}
                                                        strokeWidth={2.25}
                                                        className={
                                                            isHinted
                                                                ? 'text-yellow-300'
                                                                : isShaking
                                                                    ? 'text-red-300'
                                                                    : 'text-gray-300'
                                                        }
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                )
                            })}
                        </div>

                        <div className="flex justify-center gap-2 mt-5">
                            <button
                                onClick={() => {
                                    setEraserActive(prev => !prev)
                                }}
                                disabled={erasers <= 0}
                                className={`px-4 py-2.5 rounded-lg border text-sm flex items-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                                    eraserActive
                                        ? 'border-red-400 bg-red-400/10 text-red-300'
                                        : 'border-white/15 hover:bg-white/5'
                                }`}
                            >
                                <Eraser size={15} />
                                Eraser ({erasers})
                            </button>

                            <button
                                onClick={resetLevel}
                                className="px-4 py-2.5 rounded-lg border border-white/15 hover:bg-white/5 transition-all text-sm flex items-center gap-2"
                            >
                                <RotateCcw size={15} />
                                Reset
                            </button>
                        </div>
                    </motion.div>

                    {/* Side panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="gaming-card p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Lightbulb
                                    size={17}
                                    className="text-yellow-400"
                                />
                                <h3 className="font-semibold text-sm">
                                    Smart Hint
                                </h3>
                            </div>

                            <p className="text-xs text-gray-400 leading-relaxed mb-4">
                                Stuck? A hint briefly highlights one arrow
                                that's currently free to tap away.
                            </p>

                            <button
                                onClick={useHint}
                                disabled={hints <= 0}
                                className="w-full py-2 rounded-lg border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold"
                            >
                                Use Hint ({hints})
                            </button>
                        </div>

                        <div className="gaming-card p-4">
                            <h3 className="font-semibold text-sm mb-3">
                                How To Play
                            </h3>

                            <div className="space-y-2 text-xs text-gray-400">
                                <p>
                                    <span className="text-neon">01.</span>{' '}
                                    Every tile hides an arrow pointing a
                                    fixed direction.
                                </p>
                                <p>
                                    <span className="text-neon">02.</span>{' '}
                                    Tap an arrow to send it off the board —
                                    but only if nothing blocks its path to
                                    the edge.
                                </p>
                                <p>
                                    <span className="text-neon">03.</span>{' '}
                                    Tapping a blocked arrow costs a heart.
                                </p>
                                <p>
                                    <span className="text-neon">04.</span>{' '}
                                    Clear every arrow to win the level.
                                </p>
                            </div>
                        </div>

                        <div className="gaming-card p-4">
                            <div className="flex items-center gap-2">
                                <Trophy size={15} className="text-green-400" />
                                <span className="text-xs text-gray-400">
                                    {remaining} arrow{remaining === 1 ? '' : 's'} left on
                                    the board.
                                </span>
                            </div>
                        </div>

                        <div className="gaming-card p-4">
                            <div className="flex items-center gap-2">
                                <X size={15} className="text-red-400" />
                                <span className="text-xs text-gray-400">
                                    A blocked tap costs a heart. Lose all
                                    three and it's game over.
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}