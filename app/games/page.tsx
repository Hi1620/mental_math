'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { CATEGORY_INFO, getGamesByCategory } from '@/lib/games'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function GamesPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold">🎮 Game Arena</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-2xl">
            Explore all available games across different categories. Choose a challenge and test your skills.
          </p>
        </motion.div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {['math', 'memory', 'puzzle', 'logic'].map((category, index) => {
            const info = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO]
            const games = getGamesByCategory(category as any)
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, translateY: -4 }}
              >
                <Link href={`/games/${category}`} className="gaming-card p-6 border border-white/10 hover:border-neon/50 hover:bg-white/[0.03] transition-all group block h-full cursor-pointer">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="text-5xl">{info.emoji}</div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white group-hover:text-neon transition-colors uppercase tracking-wider">
                    {info.label}
                  </h2>
                  
                  <p className="text-sm text-gray-400 mt-3 mb-4">
                    {info.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Total Games</p>
                      <p className="text-xl font-bold text-neon">{games.length}</p>
                    </div>
                    <ChevronRight size={24} className="text-gray-400 group-hover:text-neon group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* All Games Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-6 rounded-2xl bg-neutral-900 border border-white/10"
        >
          <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Total Games</p>
              <p className="text-3xl font-bold text-neon">14</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Categories</p>
              <p className="text-3xl font-bold text-neon">4</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Avg Duration</p>
              <p className="text-3xl font-bold text-neon">3-5m</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Max XP</p>
              <p className="text-3xl font-bold text-neon">250</p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
