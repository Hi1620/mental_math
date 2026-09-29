'use client'

import { motion } from 'framer-motion'
import { Trophy, TrendingUp } from 'lucide-react'
import { useState } from 'react'

const leaderboardData = [
  { rank: 1, name: 'ProPlayer99', score: 12850, winRate: '92%', streak: 47 },
  { rank: 2, name: 'MindMaster', score: 12340, winRate: '88%', streak: 35 },
  { rank: 3, name: 'GameGenie', score: 11920, winRate: '85%', streak: 28 },
  { rank: 4, name: 'You', score: 8932, winRate: '76%', streak: 15, isUser: true },
  { rank: 5, name: 'QuickThink', score: 8450, winRate: '72%', streak: 12 },
  { rank: 6, name: 'LogicKing', score: 7890, winRate: '68%', streak: 8 },
]

const tabs = ['District', 'State', 'National', 'Global', 'Friends']

export function LeaderboardSection() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="gaming-card p-8 mb-8"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Trophy size={28} className="text-neon" />
        Leaderboard
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-semibold ${
              activeTab === index
                ? 'bg-neon text-black neon-glow-strong'
                : 'bg-white/5 text-gray-300 border border-white/10 hover:border-neon/30'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 p-4 border-b border-white/10 text-xs font-semibold text-gray-400 mb-2">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Player</div>
            <div className="col-span-2">Score</div>
            <div className="col-span-2">Win Rate</div>
            <div className="col-span-2">Streak</div>
          </div>

          {/* Rows */}
          <div className="space-y-2">
            {leaderboardData.map((player, index) => (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`grid grid-cols-12 gap-2 p-4 rounded-xl transition-all hover:bg-white/5 group ${
                  player.isUser ? 'bg-neon/10 border border-neon/30' : 'border border-white/10'
                }`}
              >
                <div className={`col-span-1 font-bold ${player.rank <= 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {player.rank <= 3 ? '🏆' : '#'}{player.rank}
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    player.isUser
                      ? 'bg-neon text-black'
                      : 'bg-gradient-to-br from-neon/50 to-neon/30'
                  }`}>
                    {player.name.charAt(0)}
                  </div>
                  <span className="font-semibold">{player.name}</span>
                </div>
                <div className="col-span-2 text-neon font-bold">{player.score.toLocaleString()}</div>
                <div className="col-span-2 text-green-400 font-semibold">{player.winRate}</div>
                <div className="col-span-2 flex items-center gap-1 text-orange-400 font-semibold">
                  <TrendingUp size={14} />
                  {player.streak}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* View More Button */}
      <button className="mt-6 w-full py-3 rounded-xl border border-neon/30 text-neon hover:bg-neon/10 transition-all font-semibold">
        View Full Leaderboard
      </button>
    </motion.div>
  )
}
