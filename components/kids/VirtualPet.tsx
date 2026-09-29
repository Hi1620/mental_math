'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAdventure } from '@/lib/kids-zone-context'

const PET_EMOJIS = {
  dragon: '🐉',
  unicorn: '🦄',
  phoenix: '🔥',
  griffin: '🦅',
  kitsune: '🦊',
}

export function VirtualPet() {
  const { state, updatePet, updateMissionProgress } = useAdventure()
  const [showFeedback, setShowFeedback] = useState('')

  const pet = state.pet
  const petEmoji = PET_EMOJIS[pet.type as keyof typeof PET_EMOJIS]

  const handleFeed = () => {
    updatePet({ hunger: Math.max(0, pet.hunger - 30) })
    setShowFeedback('Nom nom! 😋')
    
    const feedMission = state.dailyMissions.find((m) => m.id === '2')
    if (feedMission && !feedMission.completed) {
      updateMissionProgress('2', feedMission.progress + 1)
    }
    
    setTimeout(() => setShowFeedback(''), 1500)
  }

  const handlePlay = () => {
    updatePet({ happiness: Math.min(100, pet.happiness + 15), hunger: Math.min(100, pet.hunger + 10) })
    setShowFeedback('Woohoo! 🎉')
    setTimeout(() => setShowFeedback(''), 1500)
  }

  const handlePet = () => {
    updatePet({ happiness: Math.min(100, pet.happiness + 10) })
    setShowFeedback('Purrrr... 😊')
    setTimeout(() => setShowFeedback(''), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-300 to-pink-300 rounded-3xl p-8 shadow-xl"
    >
      <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">Meet {pet.name}</h2>

      {/* Pet Display */}
      <div className="bg-white/70 rounded-2xl p-8 mb-6 text-center">
        <motion.div
          animate={{
            y: showFeedback === 'Woohoo! 🎉' ? [0, -10, 0] : [0],
            rotate: showFeedback === 'Purrrr... 😊' ? [0, -5, 5, 0] : [0],
          }}
          className="text-9xl mb-4"
        >
          {petEmoji}
        </motion.div>

        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-2xl font-bold text-purple-600 mb-4"
          >
            {showFeedback}
          </motion.div>
        )}

        <div className="space-y-3 text-left">
          <div className="flex justify-between items-center">
            <span className="font-bold text-purple-900">Level {pet.level}</span>
            <span className="text-sm text-purple-700">{pet.experience} XP</span>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-semibold text-purple-900">Happiness</span>
              <span className="text-sm">{pet.happiness}%</span>
            </div>
            <div className="w-full h-3 bg-white/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-pink-400"
                animate={{ width: `${pet.happiness}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-semibold text-purple-900">Hunger</span>
              <span className="text-sm">{pet.hunger}%</span>
            </div>
            <div className="w-full h-3 bg-white/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-orange-400"
                animate={{ width: `${pet.hunger}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFeed}
          className="bg-orange-400 text-white font-bold py-3 rounded-xl hover:bg-orange-500 transition-all"
        >
          🍖 Feed
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlay}
          className="bg-blue-400 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition-all"
        >
          🎮 Play
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePet}
          className="bg-purple-400 text-white font-bold py-3 rounded-xl hover:bg-purple-500 transition-all"
        >
          🤚 Pet
        </motion.button>
      </div>
    </motion.div>
  )
}
