'use client'

import { GameLauncher } from '@/components/kids/GameLauncher'
import { VirtualPet } from '@/components/kids/VirtualPet'
import { useAdventure } from '@/lib/kids-zone-context'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { use, useState } from 'react'

function WorldPageContent({ worldId }: { worldId: string }) {
  const { state } = useAdventure()
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const world = state.worlds.find((w) => w.id === worldId)

  if (!world) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">❌</div>
          <p className="text-2xl font-bold text-gray-700">World not found</p>
          <Link href="/kids-zone">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="mt-8 px-6 py-3 bg-blue-500 text-white font-bold rounded-xl"
            >
              Back to Adventure Map
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${world.colorScheme} pb-8`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/20 backdrop-blur-sm p-4 flex justify-between items-center"
      >
        <Link href="/kids-zone">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="px-4 py-2 bg-white/30 hover:bg-white/50 rounded-xl font-bold transition-all"
          >
            ← Back
          </motion.button>
        </Link>
        <h1 className="text-3xl font-bold text-white">{world.icon} {world.name}</h1>
        <div className="text-white font-bold">⭐ {state.totalStars}</div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <VirtualPet />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/20 backdrop-blur-sm rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Today's Missions</h2>
              <div className="space-y-4">
                {state.dailyMissions.map((mission, index) => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl ${
                      mission.completed
                        ? 'bg-green-400/30 border-2 border-green-500'
                        : 'bg-white/30 border-2 border-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-white text-lg">{mission.title}</h3>
                        <p className="text-white/80 text-sm">{mission.description}</p>
                      </div>
                      <div className="text-yellow-300 font-bold">+{mission.rewards}</div>
                    </div>
                    <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-yellow-400"
                        animate={{ width: `${(mission.progress / mission.maxProgress) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-white/70 mt-1">
                      {mission.progress}/{mission.maxProgress}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 text-center"
            >
              <h2 className="text-xl font-bold text-white mb-4">Resources</h2>
              <div className="space-y-3">
                <div className="bg-yellow-300/30 rounded-xl p-3">
                  <div className="text-3xl mb-1">🪙</div>
                  <p className="font-bold text-white">{state.coins} Coins</p>
                </div>
                <div className="bg-purple-300/30 rounded-xl p-3">
                  <div className="text-3xl mb-1">💎</div>
                  <p className="font-bold text-white">{state.gems} Gems</p>
                </div>
                <div className="bg-blue-300/30 rounded-xl p-3">
                  <div className="text-3xl mb-1">🎫</div>
                  <p className="font-bold text-white">{state.stickersCollected.length} Stickers</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/20 backdrop-blur-sm rounded-3xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">World Progress</h2>
              <div className="text-center">
                <div className="text-5xl mb-3">
                  {world.completed ? '🏆' : '🎯'}
                </div>
                <p className="text-white font-bold mb-3">
                  {world.completed ? 'Completed!' : `${world.progress}% Complete`}
                </p>
                <div className="w-full h-4 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-400"
                    animate={{ width: `${world.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white/20 backdrop-blur-sm rounded-3xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Learning Games</h2>
          
          {selectedGame ? (
            <GameLauncher
              gameName={selectedGame}
              gameType={selectedGame.toLowerCase().replace(' ', '-')}
              worldId={worldId}
              onExit={() => setSelectedGame(null)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Math Challenge', icon: '🔢' },
                { name: 'Memory Master', icon: '🧠' },
                { name: 'Puzzle Quest', icon: '🧩' }
              ].map((game, index) => (
                <motion.button
                  key={game.name}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedGame(game.name)}
                  className="p-6 bg-white/30 hover:bg-white/50 rounded-2xl font-bold text-white transition-all border-2 border-white/50"
                >
                  {game.icon} {game.name}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default function WorldPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <WorldPageContent worldId={id} />
}
