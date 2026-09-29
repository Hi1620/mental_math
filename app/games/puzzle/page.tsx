'use client'

import { CATEGORY_INFO, getGamesByCategory } from '@/lib/games'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PuzzleCategoryPage() {
  const games = getGamesByCategory('puzzle')
  const categoryInfo = CATEGORY_INFO.puzzle

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-neon transition-colors"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold">
            {categoryInfo.emoji} {categoryInfo.label} Arena
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-2xl">
            {categoryInfo.description}
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ translateY: -4 }}
            >
              <Link
                href={game.path}
                className="gaming-card p-5 sm:p-6 border border-white/10 hover:border-neon/50 hover:bg-white/[0.03] transition-all group block h-full"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="text-3xl">{game.icon}</div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    game.difficulty === 'Easy'
                      ? 'bg-green-500/20 text-green-400'
                      : game.difficulty === 'Medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}>
                    {game.difficulty}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-semibold group-hover:text-neon transition-colors">
                  {game.name}
                </h2>

                <p className="text-sm text-gray-400 mt-2">
                  {game.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>~{game.estimatedTime} min</span>
                  <span className="text-neon font-semibold group-hover:translate-x-1 transition-transform">
                    Play <ArrowRight size={14} className="inline ml-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
