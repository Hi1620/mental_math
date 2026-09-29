'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface KidsZoneLayoutProps {
  children: React.ReactNode
}

export function KidsZoneLayout({ children }: KidsZoneLayoutProps) {
  const [notification, setNotification] = useState('')

  const handleGoBack = () => {
    setNotification('Taking you back to the main dashboard...')
    setTimeout(() => window.location.href = '/', 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pb-8">
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-4 right-4 mx-auto max-w-md p-4 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg text-center font-bold text-purple-900 z-50"
        >
          {notification}
        </motion.div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 lg:p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleGoBack}
            className="flex items-center gap-2 text-white font-bold text-lg hover:opacity-80 transition-all"
          >
            <ArrowLeft size={24} />
            Back to Dashboard
          </motion.button>
          <h1 className="text-3xl lg:text-4xl font-bold text-white text-center flex-1">
            Matiks+ Kids Zone 🎮
          </h1>
          <div className="text-2xl">👦</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">{children}</main>
    </div>
  )
}

export function KidsZoneHero() {
  const [showNotification, setShowNotification] = useState('')

  const handleContinueLearning = () => {
    setShowNotification('Loading your favorite games...')
    setTimeout(() => setShowNotification(''), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8 p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-300 text-center shadow-2xl"
    >
      <h2 className="text-4xl lg:text-5xl font-bold text-purple-900 mb-2">Welcome, Learning Champion!</h2>
      <p className="text-lg text-purple-800 mb-6">Build amazing things while learning</p>

      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-2 rounded-lg bg-white/70 text-purple-900 font-bold text-sm"
        >
          {showNotification}
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all"
        >
          <div className="text-4xl mb-2">🎮</div>
          <div className="font-bold text-purple-900">42</div>
          <div className="text-xs text-purple-800">Games Played</div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all"
        >
          <div className="text-4xl mb-2">⭐</div>
          <div className="font-bold text-purple-900">1,250</div>
          <div className="text-xs text-purple-800">Stars Earned</div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all"
        >
          <div className="text-4xl mb-2">🏆</div>
          <div className="font-bold text-purple-900">8</div>
          <div className="text-xs text-purple-800">Badges</div>
        </motion.div>
      </div>

      <button 
        onClick={handleContinueLearning}
        className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full text-lg hover:shadow-lg transition-all transform hover:scale-105"
      >
        Continue Learning
      </button>
    </motion.div>
  )
}

export function BuildingProgress() {
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null)
  const [buildingMessages, setBuildingMessages] = useState('')

  const buildings = [
    { id: 1, name: 'House', icon: '🏠', progress: 100, reward: '50 stars' },
    { id: 2, name: 'Castle', icon: '🏰', progress: 65, reward: '25 stars' },
    { id: 3, name: 'Rocket', icon: '🚀', progress: 30, reward: '10 stars' },
    { id: 4, name: 'Garden', icon: '🌺', progress: 0, reward: '100 stars' },
  ]

  const handleBuildingClick = (building: typeof buildings[0]) => {
    setSelectedBuilding(building.id)
    if (building.progress === 100) {
      setBuildingMessages(`Congratulations! You completed ${building.name}! Earned ${building.reward} 🎉`)
    } else {
      setBuildingMessages(`${building.name} is ${building.progress}% complete. Keep learning to unlock it!`)
    }
    setTimeout(() => setBuildingMessages(''), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-cyan-300 to-blue-400 shadow-xl"
    >
      <h3 className="text-3xl font-bold text-blue-900 mb-6">Your Building Progress</h3>

      {buildingMessages && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-white/70 text-blue-900 font-bold text-center"
        >
          {buildingMessages}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {buildings.map((building, index) => (
          <motion.button
            key={building.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => handleBuildingClick(building)}
            className={`p-4 rounded-2xl text-center transition-all ${
              selectedBuilding === building.id
                ? 'bg-white/80 shadow-xl border-4 border-blue-500'
                : 'bg-white/60 hover:shadow-lg border-2 border-transparent'
            }`}
          >
            <motion.div 
              animate={selectedBuilding === building.id ? { scale: 1.2 } : { scale: 1 }}
              className="text-5xl mb-2"
            >
              {building.icon}
            </motion.div>
            <h4 className="font-bold text-lg text-blue-900 mb-2">{building.name}</h4>
            <div className="w-full h-3 bg-white/50 rounded-full overflow-hidden mb-1">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                style={{ width: `${building.progress}%` }}
                animate={selectedBuilding === building.id ? { boxShadow: '0 0 10px rgba(251, 146, 60, 0.8)' } : {}}
              />
            </div>
            <div className="text-xs font-semibold text-blue-800">{building.progress}%</div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export function GameModules() {
  const games = [
    { id: 1, name: 'Story Mode', icon: '📖', difficulty: 'Easy', stars: 3, xp: 50, href: '/kids-zone/story-mode' },
    { id: 2, name: 'Math Adventure', icon: '🔢', difficulty: 'Medium', stars: 2, xp: 75, href: '/kids-zone/math-adventure' },
    { id: 3, name: 'Alphabet Quest', icon: '🔤', difficulty: 'Easy', stars: 3, xp: 50, href: '/kids-zone/alphabet-quest' },
    { id: 4, name: 'Memory Forest', icon: '🌲', difficulty: 'Medium', stars: 1, xp: 75, href: '/kids-zone/memory-forest' },
    { id: 5, name: 'Puzzle Island', icon: '🏝️', difficulty: 'Hard', stars: 0, xp: 100, href: '/kids-zone/puzzle-island' },
    { id: 6, name: 'Sticker Collection', icon: '✨', difficulty: 'Bonus', stars: 2, xp: 60, href: '/kids-zone/sticker-collection' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-green-300 to-emerald-400 shadow-xl"
    >
      <h3 className="text-3xl font-bold text-green-900 mb-6">Play & Learn Games</h3>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game, index) => (
          <Link
            key={game.id}
            href={game.href}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-2xl backdrop-blur-sm hover:shadow-lg transition-all bg-white/70 border-2 border-transparent cursor-pointer h-full"
            >
              <motion.div 
                className="text-4xl mb-2"
              >
                {game.icon}
              </motion.div>
              <h4 className="font-bold text-green-900 mb-1">{game.name}</h4>
              <div className="text-xs text-green-800 mb-2 font-semibold">{game.difficulty}</div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(3)].map((_, i) => (
                  <span key={i}>
                    {i < game.stars ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
              <div className="text-xs text-green-700 font-bold">+{game.xp} XP</div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}

export function AILearningCompanion() {
  const [talkIndex, setTalkIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const messages = [
    "Great job today! You've earned 125 stars! 🌟 Let's keep the momentum going!",
    "You're getting better at Math Adventure! Practice a few more games to unlock the next level! 🎓",
    "I noticed you love Memory games! Keep playing to become a Memory Master! 🧠",
    "Don't give up on Puzzle Island! One more game and you'll unlock it! 💪",
    "You're doing amazing! You're in the top 10 learners in your class! 🏆",
  ]

  const handleAITalk = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTalkIndex((prev) => (prev + 1) % messages.length)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const handleKeepPlaying = () => {
    setTalkIndex(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="p-8 rounded-3xl bg-gradient-to-br from-red-300 via-pink-300 to-purple-300 shadow-xl text-center"
    >
      <motion.div 
        animate={isAnimating ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.05, rotate: -3 }}
        onClick={handleAITalk}
        className="text-7xl mb-4 cursor-pointer hover:filter hover:drop-shadow-lg transition-all"
      >
        🤖
      </motion.div>
      <h3 className="text-3xl font-bold text-purple-900 mb-2">Your AI Friend</h3>
      <p className="text-lg text-purple-800 mb-6">I&apos;m here to help you learn and celebrate your wins!</p>

      <motion.div
        key={talkIndex}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-6 max-w-md mx-auto min-h-24 flex items-center justify-center"
      >
        <p className="text-purple-900 font-semibold text-lg">
          {messages[talkIndex]}
        </p>
      </motion.div>

      <div className="flex gap-3 justify-center flex-wrap">
        <button 
          onClick={handleAITalk}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:shadow-lg transition-all transform hover:scale-105"
        >
          Ask AI More
        </button>
        <button 
          onClick={handleKeepPlaying}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full text-lg hover:shadow-lg transition-all transform hover:scale-105"
        >
          Keep Playing
        </button>
      </div>
    </motion.div>
  )
}
