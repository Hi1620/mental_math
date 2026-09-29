'use client'

import { useAdventure } from '@/lib/kids-zone-context'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function AdventureMap() {
  const router = useRouter()
  const { state } = useAdventure()

  const worldCoordinates: { [key: string]: { x: string; y: string } } = {
    forest: { x: '10%', y: '30%' },
    mountains: { x: '40%', y: '20%' },
    ocean: { x: '70%', y: '40%' },
    volcano: { x: '55%', y: '70%' },
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-sky-300 to-blue-200 overflow-hidden">
      <button
        onClick={() => router.push('/')}
        className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-blue-900 shadow-lg backdrop-blur transition hover:bg-white"
      >
        ← Back
      </button>

      <div className="absolute top-10 left-10 text-6xl opacity-40">☁️</div>
      <div className="absolute top-20 right-20 text-5xl opacity-50">☁️</div>
      <div className="absolute bottom-40 left-1/4 text-6xl opacity-30">☁️</div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path
          d="M 100 250 Q 300 200 400 200 Q 600 200 700 300"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="10,10"
        />
      </svg>

      <div className="relative w-full h-full">
        {state.worlds.map((world, index) => {
          const coords = worldCoordinates[world.id]
          return (
            <motion.div
              key={world.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute"
              style={{
                left: coords.x,
                top: coords.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {world.unlocked ? (
                <Link href={`/kids-zone/world/${world.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${world.colorScheme} shadow-xl border-4 border-white flex flex-col items-center justify-center cursor-pointer`}
                  >
                    <div className="text-6xl">{world.icon}</div>
                    <div className="absolute -bottom-8 bg-white/90 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                      {world.name}
                    </div>
                    {world.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-lg font-bold"
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                </Link>
              ) : (
                <motion.div
                  className="relative w-28 h-28 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 shadow-xl border-4 border-gray-400 flex flex-col items-center justify-center opacity-60"
                >
                  <div className="text-6xl grayscale">{world.icon}</div>
                  <div className="absolute -bottom-8 bg-gray-400/70 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap text-gray-700">
                    Locked
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-purple-400 to-pink-400 p-4 flex justify-around items-center"
      >
        <div className="text-white font-bold text-center">
          <div className="text-2xl">⭐</div>
          <div>{state.totalStars} Stars</div>
        </div>
        <div className="text-white font-bold text-center">
          <div className="text-2xl">🔥</div>
          <div>{state.streak} Day Streak</div>
        </div>
        <div className="text-white font-bold text-center">
          <div className="text-2xl">🎮</div>
          <div>World {state.worlds.filter((w) => w.completed).length}/4</div>
        </div>
      </motion.div>
    </div>
  )
}
