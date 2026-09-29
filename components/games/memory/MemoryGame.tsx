'use client'

import { motion } from 'framer-motion'
import { Brain, Flame, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GameHeader } from '../shared/GameHeader'
import { GameResults } from '../shared/GameResults'

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

interface Card {
  id: number
  symbol: string
  flipped: boolean
  matched: boolean
}

function createCards(): Card[] {
  const duplicated = [...symbols, ...symbols]

  return duplicated
    .sort(() => Math.random() - 0.5)
    .map((symbol, id) => ({
      id,
      symbol,
      flipped: false,
      matched: false,
    }))
}

export function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([])
  const [firstCard, setFirstCard] = useState<number | null>(null)
  const [secondCard, setSecondCard] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180)
  const [showResults, setShowResults] = useState(false)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    setCards(createCards())
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
    if (firstCard === null || secondCard === null) return

    setLocked(true)

    const first = cards[firstCard]
    const second = cards[secondCard]

    if (first?.symbol === second?.symbol) {
      setCards(prev =>
        prev.map(card =>
          card.id === firstCard || card.id === secondCard
            ? { ...card, matched: true }
            : card
        )
      )

      setMatches(prev => {
        const next = prev + 1

        if (next === 8) {
          setTimeout(() => setShowResults(true), 500)
        }

        return next
      })

      setScore(prev => prev + 20)
    }

    const timeout = setTimeout(() => {
      if (first?.symbol !== second?.symbol) {
        setCards(prev =>
          prev.map(card =>
            card.id === firstCard || card.id === secondCard
              ? { ...card, flipped: false }
              : card
          )
        )
      }

      setMoves(prev => prev + 1)
      setFirstCard(null)
      setSecondCard(null)
      setLocked(false)
    }, 700)

    return () => clearTimeout(timeout)
  }, [firstCard, secondCard])

  const handleCardClick = (id: number) => {
    if (locked) return
    if (firstCard === id) return
    if (cards[id]?.flipped || cards[id]?.matched) return

    setCards(prev =>
      prev.map(card =>
        card.id === id
          ? { ...card, flipped: true }
          : card
      )
    )

    if (firstCard === null) {
      setFirstCard(id)
    } else {
      setSecondCard(id)
    }
  }

  const accuracy =
    moves > 0
      ? Math.min(Math.round((matches * 2 / moves) * 100), 100)
      : 0

  if (showResults) {
    return (
      <GameResults
        gameName="Memory Master"
        gameType="memory"
        score={score}
        maxScore={160}
        accuracy={accuracy}
        timeSpent={180 - timeLeft}
        totalTime={180}
        difficulty="Adaptive"
        xpEarned={score * 2}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-5">
      <div className="mx-auto max-w-4xl">

        <GameHeader
          title="Memory Master"
          timeLeft={timeLeft}
          score={score}
          onQuit={() => setShowResults(true)}
        />

        <div className="mb-6 grid grid-cols-3 gap-3">

          <div className="gaming-card p-3 text-center">
            <Brain size={17} className="mx-auto mb-1 text-neon" />
            <p className="text-xs text-gray-400">Matches</p>
            <p className="text-lg font-bold text-neon">
              {matches}/8
            </p>
          </div>

          <div className="gaming-card p-3 text-center">
            <Flame size={17} className="mx-auto mb-1 text-orange-400" />
            <p className="text-xs text-gray-400">Moves</p>
            <p className="text-lg font-bold text-orange-400">
              {moves}
            </p>
          </div>

          <div className="gaming-card p-3 text-center">
            <Target size={17} className="mx-auto mb-1 text-blue-400" />
            <p className="text-xs text-gray-400">Accuracy</p>
            <p className="text-lg font-bold text-blue-400">
              {accuracy}%
            </p>
          </div>

        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gaming-card mx-auto max-w-xl p-5 md:p-6"
        >

          <div className="mb-5 text-center">
            <p className="text-sm font-semibold">
              Match all pairs
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Remember positions and minimize your moves.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2.5 md:gap-3">

            {cards.map(card => (
              <motion.button
                key={card.id}
                whileHover={
                  !card.flipped && !card.matched && !locked
                    ? { scale: 1.04 }
                    : {}
                }
                whileTap={
                  !locked
                    ? { scale: 0.96 }
                    : {}
                }
                onClick={() => handleCardClick(card.id)}
                disabled={locked}
                className={`aspect-square rounded-xl border text-xl font-semibold transition-all md:text-2xl ${
                  card.flipped || card.matched
                    ? 'border-neon/60 bg-neon/10 text-neon'
                    : 'border-white/10 bg-white/[0.03] text-transparent hover:border-neon/40'
                }`}
              >
                {card.flipped || card.matched
                  ? card.symbol
                  : '?'}
              </motion.button>
            ))}

          </div>

        </motion.div>
      </div>
    </div>
  )
}