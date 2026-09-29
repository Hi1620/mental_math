'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'

const rewards = ['Coins x100', 'XP x50', 'Avatar Rare', 'Avatar Epic', 'Avatar Diamond', 'Border Gold']

export function DailyLuckySpin() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedReward, setSelectedReward] = useState<string | null>(null)
  const [spinCount, setSpinCount] = useState(0)

  const handleSpin = () => {
    if (spinCount >= 1) return

    setIsSpinning(true)
    const randomIndex = Math.floor(Math.random() * rewards.length)

    setTimeout(() => {
      setSelectedReward(rewards[randomIndex])
      setIsSpinning(false)
      setSpinCount(1)
    }, 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="gaming-card p-8 mb-8"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Sparkles size={28} className="text-neon" />
        Daily Lucky Spin
      </h2>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Spin Wheel */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-40 h-40 mb-6">
            {/* Wheel */}
            <motion.div
              animate={{ rotate: isSpinning ? 360 : 0 }}
              transition={{
                duration: isSpinning ? 3 : 0,
                ease: 'easeOut',
              }}
              className="absolute inset-0"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {rewards.map((_, index) => {
                  const angle = (360 / rewards.length) * index
                  const sliceAngle = 360 / rewards.length
                  const startAngle = angle
                  const endAngle = angle + sliceAngle

                  const colors = [
                    '#00ff41',
                    '#00cc35',
                    '#00aa2a',
                    '#008822',
                    '#ff6b6b',
                    '#ffd93d',
                  ]

                  return (
                    <g key={index}>
                      <path
                        d={`M 100,100 L ${100 + 90 * Math.cos((startAngle * Math.PI) / 180)},${
                          100 + 90 * Math.sin((startAngle * Math.PI) / 180)
                        } A 90,90 0 0,1 ${100 + 90 * Math.cos((endAngle * Math.PI) / 180)},${
                          100 + 90 * Math.sin((endAngle * Math.PI) / 180)
                        } Z`}
                        fill={colors[index]}
                        fillOpacity="0.6"
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter="url(#glow)"
                      />
                    </g>
                  )
                })}
              </svg>
            </motion.div>

            {/* Center Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-background border-4 border-neon flex items-center justify-center text-2xl font-bold">
                🎰
              </div>
            </div>

            {/* Pointer */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-neon" />
          </div>

          {/* Spin Button */}
          <button
            onClick={handleSpin}
            disabled={spinCount >= 1 || isSpinning}
            className={`gaming-button text-lg font-bold transition-all ${
              spinCount >= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
          >
            <RefreshCw size={20} className={`inline mr-2 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? 'Spinning...' : spinCount >= 1 ? 'Spun Today' : 'Spin Now'}
          </button>

          {spinCount >= 1 && (
            <p className="mt-3 text-xs text-gray-400">Come back tomorrow for another spin!</p>
          )}
        </div>

        {/* Reward Display */}
        <div className="flex-1 flex flex-col items-center lg:items-end gap-4">
          <div className="text-center lg:text-right">
            <p className="text-sm text-gray-400 mb-2">Current Prize</p>
            {selectedReward ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-neon/20 to-neon/10 border border-neon/50 neon-glow"
              >
                <div className="text-5xl mb-2">🎁</div>
                <h3 className="text-2xl font-bold text-neon">{selectedReward}</h3>
              </motion.div>
            ) : (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-gray-400">
                <div className="text-3xl mb-2">❓</div>
                <p className="text-sm">Unknown Reward</p>
              </div>
            )}
          </div>

          {/* Claim Button */}
          {selectedReward && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-neon to-neon-dark text-black font-bold hover:shadow-lg transition-all neon-glow-strong"
            >
              Claim Reward
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
