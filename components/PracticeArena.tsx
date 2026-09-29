'use client'

import { motion } from 'framer-motion'
import { Gamepad2, Zap, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const gameTypes = [
  { name: 'Math', icon: '🔢', color: 'from-blue-500 to-cyan-500' },
  { name: 'Memory', icon: '🧠', color: 'from-purple-500 to-pink-500' },
  { name: 'Puzzle', icon: '🧩', color: 'from-orange-500 to-yellow-500' },
  { name: 'Logic', icon: '⚡', color: 'from-green-500 to-emerald-500' },
]

const difficulties = ['Easy', 'Medium', 'Hard', 'Adaptive AI']

export function PracticeArena() {
  const [showResults, setShowResults] = useState(false)
  const [selectedGame, setSelectedGame] = useState('Math')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="gaming-card p-8 mb-8"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Gamepad2 size={28} className="text-neon" />
        Practice Arena
      </h2>

      {!showResults ? (
        <>
          {/* Game Type Selection */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">Select Game Type</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {gameTypes.map((game) => (
                <motion.button
                  key={game.name}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedGame(game.name)}
                  className={`p-4 rounded-2xl border-2 transition-all group cursor-pointer text-center ${
                    selectedGame === game.name
                      ? 'border-neon bg-neon/10'
                      : 'border-white/10 hover:border-neon/50'
                  }`}
                >
                  <div className="text-4xl mb-2">{game.icon}</div>
                  <h4 className={`font-semibold transition-all ${
                    selectedGame === game.name ? 'text-neon' : 'group-hover:text-neon'
                  }`}>{game.name}</h4>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">Select Difficulty</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`p-3 rounded-xl border transition-all ${
                    diff === selectedDifficulty
                      ? 'border-neon bg-neon/10 text-neon font-semibold'
                      : 'border-white/10 hover:border-neon/30 hover:bg-white/5'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="flex gap-3">
            <Link 
              href={`/games/${selectedGame.toLowerCase()}`}
              className="flex-1 inline-flex items-center justify-center gap-2 gaming-button"
            >
              <Zap size={18} />
              Start {selectedGame} Game
              <ArrowRight size={18} />
            </Link>
            <button 
              onClick={() => setShowResults(true)}
              className="flex-1 px-6 py-2 rounded-full border border-neon/50 text-neon hover:bg-neon/10 transition-all font-semibold"
            >
              Mock Practice
            </button>
          </div>
        </>
      ) : (
        /* Results Display */
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Practice Complete!</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-3xl font-bold text-neon mb-1">89%</div>
              <div className="text-xs text-gray-400">Accuracy</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">2</div>
              <div className="text-xs text-gray-400">Mistakes</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">1m 32s</div>
              <div className="text-xs text-gray-400">Time Taken</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">+250</div>
              <div className="text-xs text-gray-400">XP Gained</div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-r from-neon/10 to-neon/5 border border-neon/30">
            <p className="text-sm text-gray-100">✨ AI Suggestion: Focus on problem type 3 where you had 1 mistake. Practice similar questions to improve!</p>
          </div>
          <button 
            onClick={() => setShowResults(false)}
            className="gaming-button"
          >
            Practice Again
          </button>
        </div>
      )}
    </motion.div>
  )
}
