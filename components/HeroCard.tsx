'use client'

import { motion } from 'framer-motion'
import { Zap, Target } from 'lucide-react'
import { useState } from 'react'

export function HeroCard() {
  const dailyProgress = 75
  const xpProgress = 62
  const [showNotification, setShowNotification] = useState('')

  const handleQuickPlay = () => {
    setShowNotification('Starting Quick Play session...')
    setTimeout(() => setShowNotification(''), 2000)
  }

  const handleViewChallenges = () => {
    setShowNotification('Loading challenges...')
    setTimeout(() => setShowNotification(''), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="gaming-card p-8 mb-8"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Welcome Section */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">Welcome Back, Player!</h1>
          <p className="text-gray-400 text-lg">Let&apos;s break your streak today</p>
          {showNotification && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-neon text-sm mt-2 font-semibold"
            >
              {showNotification}
            </motion.p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {/* Daily Challenge */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#00ff41"
                  strokeWidth="8"
                  strokeDasharray={`${dailyProgress * 2.83} 283`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon">{dailyProgress}%</div>
                  <div className="text-xs text-gray-400">Daily Goal</div>
                </div>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-1">
                <Zap size={16} className="text-neon" />
                XP Progress
              </span>
              <span className="text-sm text-neon font-bold">{xpProgress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/10 border border-white/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon to-neon-dark rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">1,240 / 2,000 points to next rank</p>
          </div>
        </div>
      </div>

      {/* Quick Play Button */}
      <div className="mt-8 flex gap-3">
        <button 
          onClick={handleQuickPlay}
          className="gaming-button hover:neon-glow-strong"
        >
          <Target size={18} className="inline mr-2" />
          Quick Play
        </button>
        <button 
          onClick={handleViewChallenges}
          className="px-6 py-2 rounded-full border border-neon/50 text-neon hover:bg-neon/10 transition-all duration-200 font-semibold"
        >
          View Challenges
        </button>
      </div>
    </motion.div>
  )
}
