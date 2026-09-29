'use client'

import { motion } from 'framer-motion'
import { Brain, RotateCcw, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GameHeader } from '../shared/GameHeader'
import { GameResults } from '../shared/GameResults'

interface Tile {
  id: number
  value: number | null
  position: number
}

function shufflePuzzle(): Tile[] {
  const tiles: Tile[] = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    value: i + 1,
    position: i,
  }))

  tiles.push({
    id: 15,
    value: null,
    position: 15,
  })

  let emptyPosition = 15

  for (let i = 0; i < 100; i++) {
    const row = Math.floor(emptyPosition / 4)
    const col = emptyPosition % 4

    const possible: number[] = []

    if (row > 0) possible.push(emptyPosition - 4)
    if (row < 3) possible.push(emptyPosition + 4)
    if (col > 0) possible.push(emptyPosition - 1)
    if (col < 3) possible.push(emptyPosition + 1)

    const nextPosition =
      possible[Math.floor(Math.random() * possible.length)]

    const movingTile = tiles.find(
      tile => tile.position === nextPosition
    )

    const emptyTile = tiles.find(
      tile => tile.position === emptyPosition
    )

    if (!movingTile || !emptyTile) continue

    movingTile.position = emptyPosition
    emptyTile.position = nextPosition

    emptyPosition = nextPosition
  }

  return tiles
}

export function PuzzleGame() {
  const [tiles, setTiles] = useState<Tile[]>([])
  const [moves, setMoves] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180)
  const [showResults, setShowResults] = useState(false)
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    setTiles(shufflePuzzle())
  }, [])

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

  useEffect(() => {
    if (tiles.length !== 16) return

    const complete = tiles.every(tile => {
      if (tile.value === null) {
        return tile.position === 15
      }

      return tile.position === tile.value - 1
    })

    if (complete && moves > 0) {
      setSolved(true)
      setTimeout(() => setShowResults(true), 500)
    }
  }, [tiles, moves])

  const canMove = (tile: Tile) => {
    const empty = tiles.find(t => t.value === null)

    if (!empty) return false

    const tileRow = Math.floor(tile.position / 4)
    const tileCol = tile.position % 4

    const emptyRow = Math.floor(empty.position / 4)
    const emptyCol = empty.position % 4

    return (
      (
        tileRow === emptyRow &&
        Math.abs(tileCol - emptyCol) === 1
      ) ||
      (
        tileCol === emptyCol &&
        Math.abs(tileRow - emptyRow) === 1
      )
    )
  }

  const moveTile = (tile: Tile) => {
    if (!canMove(tile)) return

    const empty = tiles.find(t => t.value === null)

    if (!empty) return

    setTiles(prev =>
      prev.map(current => {
        if (current.id === tile.id) {
          return {
            ...current,
            position: empty.position,
          }
        }

        if (current.id === empty.id) {
          return {
            ...current,
            position: tile.position,
          }
        }

        return current
      })
    )

    setMoves(prev => prev + 1)
  }

  const resetPuzzle = () => {
    setTiles(shufflePuzzle())
    setMoves(0)
    setSolved(false)
    setTimeLeft(180)
    setShowResults(false)
  }

  const score = solved
    ? Math.max(100 - Math.max(moves - 40, 0) * 2, 20)
    : Math.max(100 - moves, 0)

  if (showResults) {
    return (
      <GameResults
        gameName="Sliding Puzzle"
        gameType="puzzle"
        score={solved ? score : 0}
        maxScore={100}
        accuracy={solved ? 100 : 0}
        timeSpent={180 - timeLeft}
        totalTime={180}
        difficulty="Adaptive"
        xpEarned={solved ? score * 2 : 0}
      />
    )
  }

  const grid = Array.from({ length: 16 }, (_, position) =>
    tiles.find(tile => tile.position === position)
  )

  return (
    <div className="min-h-screen bg-background px-4 py-5">
      <div className="mx-auto max-w-4xl">

        <GameHeader
          title="Sliding Puzzle"
          timeLeft={timeLeft}
          score={score}
          onQuit={() => setShowResults(true)}
        />

        <div className="mb-6 grid grid-cols-2 gap-3">

          <div className="gaming-card p-3 text-center">
            <Brain size={17} className="mx-auto mb-1 text-neon" />
            <p className="text-xs text-gray-400">Moves</p>
            <p className="text-lg font-bold text-neon">
              {moves}
            </p>
          </div>

          <div className="gaming-card p-3 text-center">
            <Target size={17} className="mx-auto mb-1 text-purple-400" />
            <p className="text-xs text-gray-400">Efficiency</p>
            <p className="text-lg font-bold text-purple-400">
              {moves === 0
                ? '—'
                : `${Math.max(0, Math.round((1 - Math.min(moves / 120, 1)) * 100))}%`}
            </p>
          </div>

        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gaming-card mx-auto max-w-md p-5"
        >

          <div className="mb-5 text-center">
            <p className="text-sm font-semibold">
              Solve the board
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Arrange the numbers from 1 to 15.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">

            {grid.map((tile, index) => (
              <motion.button
                key={index}
                whileHover={
                  tile && canMove(tile)
                    ? { scale: 1.04 }
                    : {}
                }
                whileTap={
                  tile && canMove(tile)
                    ? { scale: 0.96 }
                    : {}
                }
                onClick={() => tile && moveTile(tile)}
                disabled={!tile || !canMove(tile)}
                className={`aspect-square rounded-lg text-lg font-semibold transition-all ${
                  tile && tile.value !== null
                    ? canMove(tile)
                      ? 'cursor-pointer border border-neon/50 bg-neon/10 text-neon hover:bg-neon/20'
                      : 'border border-white/10 bg-white/[0.04] text-white'
                    : 'border border-white/5 bg-black/20'
                }`}
              >
                {tile?.value ?? ''}
              </motion.button>
            ))}

          </div>

          <button
            onClick={resetPuzzle}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-sm font-medium transition-all hover:border-neon/40 hover:bg-white/5"
          >
            <RotateCcw size={15} />
            New Challenge
          </button>

        </motion.div>
      </div>
    </div>
  )
}