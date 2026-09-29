'use client'

import { motion } from 'framer-motion'
import { Brain, Zap, Target } from 'lucide-react'
import { useState } from 'react'

export function AICoachCard() {
  const [isLoading, setIsLoading] = useState(false)

  const handlePracticeWithAI = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert('🤖 AI Coach: Starting personalized practice session based on your weak areas!')
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="gaming-card p-8 mb-8"
    >
      <div className="flex items-start gap-6">
        {/* AI Icon */}
        <div className="flex-shrink-0">
          <motion.div
            animate={{ scale: isLoading ? 1.1 : 1 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-neon/30 to-neon/10 border border-neon/50 flex items-center justify-center neon-glow"
          >
            <Brain size={40} className="text-neon" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">AI Learning Coach</h3>
          <p className="text-gray-400 mb-4">Practice before ranked games with personalized guidance</p>

          {/* Feature List */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Zap size={16} className="text-neon" />
              <span>Detect weak topics and skills automatically</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target size={16} className="text-neon" />
              <span>Personalized practice recommendations daily</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Brain size={16} className="text-neon" />
              <span>Adaptive difficulty that grows with you</span>
            </div>
          </div>

          {/* CTA Button */}
          <button 
            onClick={handlePracticeWithAI}
            disabled={isLoading}
            className="gaming-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap size={18} className="inline mr-2" />
            {isLoading ? 'Loading...' : 'Practice with AI'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
