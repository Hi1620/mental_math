'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronDown, ChevronRight, Coins, Flame, MessageSquare, Search, History, Play, Trophy, Users, Zap, Check, Lock } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CompetePage() {
  const [activeSubTab, setActiveSubTab] = useState<'creators' | 'explore' | 'collegiate'>('creators')
  const [showLockModal, setShowLockModal] = useState(false)
  const [coins, setCoins] = useState(500)
  const [streak, setStreak] = useState(0)
  const [xp, setXp] = useState(0)

  const handleTabClick = (tab: 'creators' | 'explore' | 'collegiate') => {
    if (tab === 'explore' || tab === 'collegiate') {
      setShowLockModal(true)
    } else {
      setActiveSubTab(tab)
    }
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
          
          {/* Search contests bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search Contests"
              className="w-full bg-neutral-900 border border-white/10 rounded-full pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00ff41]/50 transition-all"
            />
          </div>

          {/* Sub-tabs & History */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[
                { id: 'creators', label: 'CREATORS' },
                { id: 'explore', label: 'EXPLORE' },
                { id: 'collegiate', label: 'COLLEGIATE' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id as any)}
                  className={`px-4 py-1.5 rounded-full border text-[11px] font-bold tracking-wider transition-all ${
                    activeSubTab === tab.id
                      ? 'bg-[#00ff41]/10 border-[#00ff41] text-[#00ff41] font-extrabold'
                      : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <button className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-gray-400 hover:text-white hover:bg-neutral-800 transition">
              <History size={16} />
            </button>
          </div>

          {/* Notification Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 rounded-xl bg-white text-black font-semibold shadow-md gap-4"
          >
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-black shrink-0" />
              <span className="text-xs md:text-sm font-bold tracking-wide">
                New league participation rule!
              </span>
            </div>
            <button className="px-4 py-1.5 rounded-lg border border-black/20 text-xs font-bold hover:bg-black/5 transition whitespace-nowrap">
              Read
            </button>
          </motion.div>

          {/* Leagues feed */}
          <div className="space-y-6">
            
            {/* Divider 1 */}
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
              <span className="text-xs font-bold text-gray-500 tracking-wider">
                23rd August <span className="text-gray-600 font-normal">Sunday</span>
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Jeevitha League Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="rounded-3xl border border-white/5 bg-neutral-900 overflow-hidden shadow-lg relative group cursor-pointer"
            >
              {/* Graphic banner with photo representation */}
              <div className="relative h-48 bg-gradient-to-r from-emerald-950 via-neutral-900 to-emerald-950 flex items-center px-8 border-b border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,65,0.08),transparent_70%)]" />
                
                <div className="z-10 space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    Live
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-[#00ff41] tracking-tighter uppercase leading-none">
                    JEEVITHA
                    <br />
                    LEAGUE
                  </h3>
                </div>

                {/* Simulated photo avatar overlapping on the right */}
                <div className="absolute right-8 bottom-0 top-4 w-36 h-full flex items-end overflow-hidden select-none opacity-85">
                  <div className="w-full h-full bg-neutral-800 rounded-t-full border-t border-x border-white/10 flex items-center justify-center text-5xl">
                    👩‍🏫
                  </div>
                </div>
              </div>

              {/* Card Footer details */}
              <div className="p-5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-white leading-none">Jeevitha League</h4>
                  <p className="text-xs text-gray-500 font-medium">Matiks</p>
                </div>
                
                <button className="px-6 py-2 bg-[#00ff41] hover:bg-[#00e035] text-black font-extrabold text-xs rounded-full shadow-lg shadow-[#00ff41]/20 transition transform hover:scale-105 active:scale-95">
                  JOIN NOW
                </button>
              </div>
            </motion.div>

            {/* Divider 2 */}
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
              <span className="text-xs font-bold text-gray-500 tracking-wider">
                Tomorrow 28th August <span className="text-gray-600 font-normal">Friday</span>
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Krishdev League Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="rounded-3xl border border-white/5 bg-neutral-900 overflow-hidden shadow-lg relative group cursor-pointer"
            >
              {/* Graphic banner */}
              <div className="relative h-48 bg-gradient-to-r from-green-950 via-neutral-900 to-green-950 flex items-center px-8 border-b border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,65,0.06),transparent_70%)]" />
                
                <div className="z-10 space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-neutral-800 border border-white/10 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Registration Open
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-[#00ff41] tracking-tighter uppercase leading-none">
                    KRISHDEV
                    <br />
                    LEAGUE
                  </h3>
                </div>

                {/* Photo overlapping */}
                <div className="absolute right-8 bottom-0 top-4 w-36 h-full flex items-end overflow-hidden select-none opacity-85">
                  <div className="w-full h-full bg-neutral-800 rounded-t-full border-t border-x border-white/10 flex items-center justify-center text-5xl">
                    👨‍🏫
                  </div>
                </div>
              </div>

              {/* Card Footer details */}
              <div className="p-5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-white leading-none">Krishdev League</h4>
                  <p className="text-xs text-gray-500 font-medium">Matiks</p>
                </div>
                
                <button className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white font-extrabold text-xs rounded-full transition transform hover:scale-105 active:scale-95">
                  REGISTER
                </button>
              </div>
            </motion.div>

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

      {/* Competitions Locked Modal */}
      <AnimatePresence>
        {showLockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLockModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl flex flex-col items-center text-center z-10 space-y-6"
            >
              {/* Lock Graphic */}
              <div className="relative w-28 h-28 flex items-center justify-center mt-2">
                <div className="w-16 h-20 bg-white rounded-xl relative flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-neutral-800" />
                  <div className="w-2 h-8 bg-neutral-800 absolute top-10" />
                </div>
                {/* Lock shackle */}
                <div className="absolute top-0 w-12 h-14 border-4 border-[#00ff41] border-b-0 rounded-t-full" />
              </div>

              {/* Text info */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-wider text-[#00ff41] uppercase">
                  Competitions
                  <br />
                  Locked
                </h3>
                <p className="text-xs text-gray-400 font-medium">
                  Complete 3 days streak to unlock
                </p>
              </div>

              {/* Flame days streak timeline */}
              <div className="flex items-center justify-center gap-6 w-full py-2">
                {[
                  { label: 'Day 1', active: false },
                  { label: 'Day 2', active: false },
                  { label: 'Day 3', active: false },
                ].map((d, index) => (
                  <div key={d.label} className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-full border border-white/10 bg-neutral-800 flex items-center justify-center text-gray-500">
                      <Flame size={18} />
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold">{d.label}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowLockModal(false)}
                className="w-full py-3 rounded-2xl bg-[#00ff41] hover:bg-[#00e035] text-black font-extrabold text-xs uppercase tracking-wider transition-all"
              >
                3 more days to unlock
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  )
}
