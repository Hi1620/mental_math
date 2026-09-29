'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function MemoryForestPage() {
  const [cards, setCards] = useState<{ id: number; emoji: string; matched: boolean; flipped: boolean }[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const emojis = ['🌲', '🌳', '🍀', '🌿', '🌲', '🌳', '🍀', '🌿']
    const shuffled = emojis.sort(() => Math.random() - 0.5)
    setCards(
      shuffled.map((emoji, i) => ({
        id: i,
        emoji,
        matched: false,
        flipped: false,
      }))
    )
  }

  const handleCardClick = (id: number) => {
    if (flipped.length === 2 || cards[id].matched || flipped.includes(id)) return

    const newFlipped = [...flipped, id]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]].emoji === cards[newFlipped[1]].emoji) {
        setScore(prev => prev + 10)
        const newCards = [...cards]
        newCards[newFlipped[0]].matched = true
        newCards[newFlipped[1]].matched = true
        setCards(newCards)
        setFlipped([])
        if (newCards.every((c) => c.matched)) {
          setComplete(true)
        }
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 p-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/kids-zone"
          className="flex items-center gap-2 text-white font-bold mb-6 hover:opacity-80 transition-all"
        >
          <ArrowLeft size={24} />
          Back to Kids Zone
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">Memory Forest</h1>
        <div className="text-xl text-white/80 mb-8">
          Score: <span className="font-bold">{score}</span>
        </div>

        {!complete && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {cards.map((card) => (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-2xl font-bold text-4xl transition-all ${card.matched || flipped.includes(card.id)
                    ? 'bg-white text-green-900'
                    : 'bg-gradient-to-br from-green-300 to-teal-400'
                  }`}
              >
                {card.matched || flipped.includes(card.id) ? card.emoji : '?'}
              </motion.button>
            ))}
          </div>
        )}

        {complete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 shadow-2xl text-center"
          >
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-green-900 mb-4">Memory Challenge Complete!</h2>
            <p className="text-xl text-gray-600 mb-4">Final Score: {score} stars</p>
            <Link
              href="/kids-zone"
              className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-full hover:shadow-lg transition-all"
            >
              Back to Games
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
