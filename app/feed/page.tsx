'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronDown, Coins, Flame, Link as LinkIcon, MessageSquare, Play, Trophy, UserPlus, Users, Zap, Check } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface FeedItem {
  id: string
  user: string
  action: string
  description: string
  icon: string
  time: string
}

const feedItems: FeedItem[] = [
  { id: 'f1', user: 'ProPlayer99', action: 'Won Championship', description: 'Became District Champion!', icon: '🏆', time: '2 hours ago' },
  { id: 'f2', user: 'MindMaster', action: 'Achieved 100-day streak', description: 'Incredible dedication!', icon: '🔥', time: '5 hours ago' },
  { id: 'f3', user: 'HannahCM', action: 'Earned Memory Master badge', description: 'Perfect accuracy in Memory!', icon: '🧠', time: '1 day ago' },
]

export default function FeedPage() {
  const [hasFriends, setHasFriends] = useState(false)
  const [coins, setCoins] = useState(500)
  const [streak, setStreak] = useState(0)
  const [xp, setXp] = useState(0)
  const [inviteCopied, setInviteCopied] = useState(false)

  const handleAddFriends = () => {
    setHasFriends(true)
  }

  const handleCopyLink = () => {
    setInviteCopied(true)
    setTimeout(() => setInviteCopied(false), 2000)
  }

  const quests = [
    { id: 'q1', title: 'Play 1 Memory - Mind Snap Duel', progress: '0/1', isCompleted: false, ctaLabel: 'Play Now', ctaHref: '/games/memory' },
    { id: 'q2', title: 'Play 1 Math - Sprint Duel', progress: '1/1', isCompleted: true },
    { id: 'q3', title: 'Complete today\'s Puzzle - Sudoku Challenge', progress: '1/1', isCompleted: true },
  ]

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 max-w-7xl mx-auto pb-10">
        
        {/* Main Central Section */}
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-85 select-none">
            <h1 className="text-xl font-bold text-white tracking-wide">Feed</h1>
            <ChevronDown size={16} className="text-gray-400 mt-0.5" />
          </div>

          <AnimatePresence mode="wait">
            {!hasFriends ? (
              /* EMPTY STATE MOCKUP */
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-14 text-center space-y-6"
              >
                {/* Mascot and Frames Drawing */}
                <div className="relative w-64 h-48 flex items-center justify-center">
                  
                  {/* Empty Frames on Wall */}
                  <div className="absolute top-0 left-4 w-14 h-18 border-2 border-orange-500/20 bg-neutral-900/10 rounded flex items-center justify-center text-gray-700 text-xs">🖼️</div>
                  <div className="absolute top-4 right-6 w-16 h-12 border-2 border-orange-500/20 bg-neutral-900/10 rounded flex items-center justify-center text-gray-700 text-xs">🖼️</div>
                  <div className="absolute top-16 left-12 w-20 h-14 border-2 border-orange-500/20 bg-neutral-900/10 rounded flex items-center justify-center text-gray-700 text-xs">🖼️</div>
                  <div className="absolute bottom-16 right-12 w-12 h-16 border-2 border-orange-500/20 bg-neutral-900/10 rounded flex items-center justify-center text-gray-700 text-xs">🖼️</div>
                  
                  {/* Stool */}
                  <div className="absolute bottom-4 w-28 h-10 flex flex-col items-center justify-end select-none">
                    <div className="w-24 h-1 bg-amber-800 rounded" />
                    <div className="flex justify-between w-20 h-8">
                      <div className="w-1.5 h-full bg-amber-800 transform rotate-12" />
                      <div className="w-1.5 h-full bg-amber-800 transform -rotate-12" />
                    </div>
                  </div>

                  {/* Mascot Character */}
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                    className="absolute bottom-12 text-6xl cursor-pointer select-none"
                  >
                    👾
                  </motion.div>
                </div>

                {/* Text Messages */}
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-wider text-white uppercase">
                    No Feed..?
                  </h2>
                  <p className="text-xs text-gray-400 font-semibold tracking-wide">
                    Your feed starts when you add friends.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                  <button
                    onClick={handleAddFriends}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full border-2 border-[#00ff41] hover:bg-[#00ff41]/5 text-xs font-extrabold text-[#00ff41] uppercase tracking-wider transition-all"
                  >
                    <UserPlus size={14} />
                    Add Friends
                  </button>
                  
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 hover:text-white uppercase tracking-wider transition-colors"
                  >
                    <LinkIcon size={12} />
                    {inviteCopied ? 'Link Copied!' : 'Invite via Link'}
                  </button>
                </div>

              </motion.div>
            ) : (
              /* LIVE FEED LIST STATE */
              <motion.div
                key="feed-list"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {feedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-2xl bg-neutral-900 border border-white/5 hover:border-[#00ff41]/20 transition-all hover:bg-neutral-900/80 cursor-pointer flex gap-4 items-start"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {item.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-baseline justify-between gap-4">
                        <h4 className="font-extrabold text-sm text-white truncate hover:text-[#00ff41] transition-colors">
                          {item.user}
                        </h4>
                        <span className="text-[10px] text-gray-500 font-bold whitespace-nowrap">
                          {item.time}
                        </span>
                      </div>
                      
                      <p className="text-xs font-bold text-gray-400">
                        {item.action}
                      </p>
                      
                      <p className="text-xs text-gray-500 font-medium">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                <button
                  onClick={() => setHasFriends(false)}
                  className="w-full py-2 border border-white/10 rounded-xl text-xs font-bold text-gray-500 hover:text-white hover:bg-white/5 transition"
                >
                  Clear Feed & Reset mockup
                </button>
              </motion.div>
            )}
          </AnimatePresence>

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
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            quest.isCompleted ? 'bg-green-500' : 'bg-blue-400'
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
              <div className="p-2.5 bg-white rounded-2xl w-32 h-32 flex items-center justify-center shadow-lg">
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
            
            <div className="absolute right-2 bottom-0 w-12 h-12 text-3xl opacity-35 select-none transform rotate-12">
              👾
            </div>
          </div>

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
