'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { CATEGORY_INFO, getGamesByCategory } from '@/lib/games'
import { motion } from 'framer-motion'
import { ChevronRight, Coins, Flame, MessageSquare, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Profile interface
interface Profile {
  id: string
  name: string
  avatarText: string
  avatarColor: string
  isYou?: boolean
  customAvatar?: string
  statusColor?: string
}

// Quest interface
interface DailyQuest {
  id: string
  title: string
  progress: string
  isCompleted: boolean
  ctaLabel?: string
  ctaHref?: string
}

const profiles: Profile[] = [
  { id: 'brumble', name: 'Brumble', avatarText: 'Brumble', avatarColor: 'bg-green-600', customAvatar: '🟢' },
  { id: 'you', name: 'YOU', avatarText: 'YOU', avatarColor: 'bg-blue-500', isYou: true },
  { id: 'hannah', name: 'HANNAHCM', avatarText: 'H', avatarColor: 'bg-emerald-700', statusColor: 'bg-green-400' },
  { id: 'axuu', name: 'AXUU_9', avatarText: 'A', avatarColor: 'bg-cyan-700', statusColor: 'bg-green-400' },
  { id: 'patidar', name: 'PATIDAR.C...', avatarText: '😐', avatarColor: 'bg-yellow-600', statusColor: 'bg-green-400' },
  { id: 'divya', name: 'DIVYASRE...', avatarText: 'D', avatarColor: 'bg-teal-700', statusColor: 'bg-green-400' },
  { id: 'vishal', name: 'VISHALSIN...', avatarText: 'V', avatarColor: 'bg-indigo-700', statusColor: 'bg-green-400' },
]

export default function ArenaPage() {
  const [coins] = useState(0)
  const [streak] = useState(0)
  const [xp] = useState(0)

  const quests: DailyQuest[] = [
    { id: 'q1', title: 'Play 1 Memory Game', progress: '0/1', isCompleted: false, ctaLabel: 'Play Now', ctaHref: '/games/memory' },
    { id: 'q2', title: 'Play 1 Math Game', progress: '1/1', isCompleted: true },
    { id: 'q3', title: 'Complete 1 Puzzle Game', progress: '1/1', isCompleted: true },
  ]

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 max-w-7xl mx-auto pb-10">

        {/* Main Central Section */}
        <div className="space-y-6">

          {/* Top Profile Circles */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 select-none">
            {profiles.map((profile) => (
              <div key={profile.id} className="flex flex-col items-center min-w-[70px] text-center">
                <div className="relative">
                  {profile.customAvatar ? (
                    <div className="w-14 h-14 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-xl cursor-pointer">
                      <span className="text-xs font-bold text-black bg-white rounded-md px-1 py-0.5 leading-none">
                        BRUMBLE
                        <br />
                        <span className="text-[10px]">26</span>
                      </span>
                    </div>
                  ) : (
                    <div className={`w-14 h-14 rounded-full ${profile.avatarColor} border-2 border-white/20 flex items-center justify-center font-bold text-white text-sm cursor-pointer shadow-lg`}>
                      {profile.avatarText}
                    </div>
                  )}
                  {profile.statusColor && (
                    <span className={`absolute top-0 right-0 w-3.5 h-3.5 ${profile.statusColor} border-2 border-background rounded-full`} />
                  )}
                </div>
                <span className="text-[11px] text-gray-400 font-semibold mt-1 truncate w-16">
                  {profile.name}
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center min-w-[50px]">
              <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center justify-center text-gray-400">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Daily Challenges */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-5 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between cursor-pointer"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Daily Challenges</h3>
                <div className="flex items-center gap-1 text-[11px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                  <Flame size={12} className="text-orange-400" />
                  <span>12:40</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">Complete to earn rewards</p>

              <div className="flex items-center gap-4">
                <div className="w-full bg-neutral-800 h-6 rounded-full overflow-hidden relative flex items-center px-4">
                  <div className="absolute left-0 top-0 bottom-0 bg-green-500 rounded-full" style={{ width: '0%' }} />
                  <span className="text-xs font-bold text-white relative z-10">0/7</span>
                </div>
                <div className="text-yellow-400">🏆</div>
              </div>
            </div>
            <ChevronRight className="text-gray-500" />
          </motion.div>

          {/* GAME ARENA */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-xl font-bold text-white uppercase tracking-widest">🎮 Game Arena</h3>
              <p className="text-xs text-gray-400 mt-1">Choose a category and start playing</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['math', 'memory', 'puzzle', 'logic'].map((category, index) => {
                const info = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO]
                const games = getGamesByCategory(category as any)
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, translateY: -2 }}
                  >
                    <Link
                      href={`/games/${category}`}
                      className="gaming-card p-6 border border-white/10 hover:border-neon/50 transition-all group flex flex-col justify-between h-full cursor-pointer"
                    >
                      <div>
                        <div className="text-5xl mb-3">{info.emoji}</div>
                        <h4 className="text-lg font-bold text-white group-hover:text-neon transition-colors uppercase tracking-wider">
                          {info.label}
                        </h4>
                        <p className="text-xs text-gray-400 mt-2">{info.description}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-semibold text-neon">{games.length} Games</span>
                        <ChevronRight size={18} className="text-gray-400 group-hover:text-neon group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Right Sidebar Section */}
        <div className="space-y-6">

          {/* Header Stats */}
          <div className="flex items-center justify-end gap-3 select-none">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/10 text-xs font-bold text-gray-300">
              <Coins size={14} className="text-[#00ff41]" />
              <span>{coins}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/10 text-xs font-bold text-gray-300">
              <Flame size={14} className="text-orange-400" />
              <span>{streak}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/10 text-xs font-bold text-gray-300">
              <Zap size={14} className="text-yellow-400" />
              <span>{xp} XP</span>
            </div>
          </div>

          {/* Daily Quests */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold tracking-wider text-gray-500 uppercase flex items-center gap-1">
                Daily Quest
                <div className="flex items-center gap-0.5 text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded-md border border-white/5">
                  <Flame size={10} className="text-orange-400" />
                  <span>12:40</span>
                </div>
              </h3>
              <button className="text-[10px] font-bold text-[#00ff41] uppercase tracking-wider hover:opacity-85">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {quests.map((quest) => (
                <div key={quest.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <p className="text-xs font-bold text-gray-200 leading-tight">
                      {quest.title}
                    </p>

                    {/* Quest Progress Bar */}
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${quest.isCompleted ? 'bg-green-500' : 'bg-blue-400'
                            }`}
                          style={{ width: quest.progress === '1/1' ? '100%' : '0%' }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">
                        {quest.progress}
                      </span>
                    </div>
                  </div>

                  {quest.isCompleted ? (
                    quest.id === 'q2' ? (
                      <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs text-black font-bold border border-yellow-500 shadow-md">
                        ✓
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs text-black font-bold border border-green-600 shadow-md">
                        ✓
                      </div>
                    )
                  ) : quest.ctaHref ? (
                    <Link
                      href={quest.ctaHref}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#00ff41] text-xs font-bold text-white hover:text-black border border-white/10 hover:border-[#00ff41] transition-all whitespace-nowrap"
                    >
                      {quest.ctaLabel}
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Download Mobile App QR Box */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 relative overflow-hidden">
            <h4 className="text-lg font-black text-center text-white tracking-wide leading-tight">
              DOWNLOAD MOBILE APP
            </h4>
            <p className="text-[11px] text-gray-400 text-center mt-1 mb-4">
              Scan the QR code using your phone
            </p>

            <div className="flex flex-col items-center gap-3">
              {/* QR Image Box */}
              <div className="p-2.5 bg-white rounded-2xl w-32 h-32 flex items-center justify-center shadow-lg">
                {/* Minimal QR SVG code representation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                  <rect x="0" y="0" width="25" height="25" fill="black" />
                  <rect x="5" y="5" width="15" height="15" fill="white" />
                  <rect x="75" y="0" width="25" height="25" fill="black" />
                  <rect x="80" y="5" width="15" height="15" fill="white" />
                  <rect x="0" y="75" width="25" height="25" fill="black" />
                  <rect x="5" y="80" width="15" height="15" fill="white" />
                  <rect x="35" y="35" width="30" height="30" fill="black" />
                  <rect x="40" y="40" width="20" height="20" fill="white" />
                  <rect x="45" y="45" width="10" height="10" fill="black" />
                  <rect x="30" y="10" width="10" height="10" fill="black" />
                  <rect x="10" y="30" width="10" height="10" fill="black" />
                  <rect x="60" y="70" width="10" height="15" fill="black" />
                  <rect x="70" y="60" width="15" height="10" fill="black" />
                </svg>
              </div>

              {/* Badges buttons */}
              <div className="flex flex-col gap-2 w-full mt-2">
                <button className="flex items-center justify-center gap-2 py-2 px-3 bg-black hover:bg-neutral-800 border border-white/10 rounded-xl transition text-left">
                  <span className="text-xl">🍏</span>
                  <div className="text-[10px] text-gray-400">
                    Download on the
                    <div className="text-xs font-bold text-white leading-none">App Store</div>
                  </div>
                </button>
                <button className="flex items-center justify-center gap-2 py-2 px-3 bg-black hover:bg-neutral-800 border border-white/10 rounded-xl transition text-left">
                  <span className="text-xl">🤖</span>
                  <div className="text-[10px] text-gray-400">
                    Get it on
                    <div className="text-xs font-bold text-white leading-none">Play Store</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Mascot peeking */}
            <div className="absolute right-2 bottom-0 w-12 h-12 text-3xl opacity-35 select-none transform rotate-12">
              👾
            </div>
          </div>

          {/* Footer links */}
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest pt-2">
            <button className="hover:text-white transition">Blogs</button>
            <span>•</span>
            <button className="hover:text-white transition">Feedback</button>
            <span>•</span>
            <button className="hover:text-white transition">Refer a Friend</button>
          </div>

        </div>

      </div>

      {/* Floating Messages pill */}
      <div className="fixed bottom-4 right-4 z-40">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1c1c1e] hover:bg-neutral-800 border border-white/10 shadow-xl transition-all font-bold text-xs text-white">
          <MessageSquare size={14} className="text-[#00ff41]" />
          Messages
        </button>
      </div>

    </DashboardLayout>
  )
}
