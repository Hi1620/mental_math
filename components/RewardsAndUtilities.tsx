'use client'

import { motion } from 'framer-motion'
import { Shield, Share2, Copy, Award, Clock } from 'lucide-react'
import { useState } from 'react'

export function StreakShield() {
  const [shieldsUsed, setShieldsUsed] = useState(0)
  const [notification, setNotification] = useState('')
  const totalShields = 3

  const handleUseShield = () => {
    if (shieldsUsed < totalShields) {
      setShieldsUsed(shieldsUsed + 1)
      setNotification('⚔️ Shield activated! Your streak is protected.')
      setTimeout(() => setNotification(''), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="gaming-card p-6 mb-8"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Shield size={24} className="text-blue-400" />
          Streak Shield
        </h3>
        <div className="text-3xl font-bold text-blue-400">{totalShields - shieldsUsed}</div>
      </div>

      <p className="text-gray-400 text-sm mb-4">Monthly shields to protect your streak from losses</p>

      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-2 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-400 text-xs font-semibold"
        >
          {notification}
        </motion.div>
      )}

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <Clock size={16} className="text-gray-400" />
          <div>
            <div className="text-sm font-semibold">Next Recharge</div>
            <div className="text-xs text-gray-400">In 5 days</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Shield size={16} className="text-blue-400" />
          <div>
            <div className="text-sm font-semibold">Shields Remaining</div>
            <div className="text-xs text-gray-400">{totalShields - shieldsUsed}/{totalShields} this month</div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleUseShield}
        disabled={shieldsUsed >= totalShields}
        className="w-full py-2 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {shieldsUsed >= totalShields ? 'No Shields Available' : 'Use Shield'}
      </button>
    </motion.div>
  )
}

export function InviteFriends() {
  const [copied, setCopied] = useState(false)
  const [shareMessage, setShareMessage] = useState('')
  const referralCode = 'MATIKS2024ABC'

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    setShareMessage('Share dialog opened. Invite your friends!')
    setTimeout(() => setShareMessage(''), 2000)
  }

  const handleViewStats = () => {
    setShareMessage('Opening your referral statistics...')
    setTimeout(() => setShareMessage(''), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="gaming-card p-6 mb-8"
    >
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Share2 size={24} className="text-purple-400" />
        Invite Friends
      </h3>

      <p className="text-gray-400 text-sm mb-4">Earn rewards for each friend that joins</p>

      {shareMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-2 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-400 text-xs font-semibold"
        >
          {shareMessage}
        </motion.div>
      )}

      {/* Referral Code */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-400 block mb-2">Your Referral Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralCode}
            readOnly
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-sm"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-neon/20 border border-neon/50 text-neon hover:bg-neon/30 transition-all font-semibold text-sm flex items-center gap-1"
          >
            <Copy size={14} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-2">
        {[
          { friends: 1, reward: '100 XP' },
          { friends: 3, reward: 'Rare Avatar' },
          { friends: 5, reward: 'Epic Avatar' },
        ].map((milestone, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
            <span className="text-sm">{milestone.friends} Friend{milestone.friends > 1 ? 's' : ''}</span>
            <span className="text-neon font-semibold text-sm">{milestone.reward}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button 
          onClick={handleShare}
          className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-semibold text-sm"
        >
          Share
        </button>
        <button 
          onClick={handleViewStats}
          className="flex-1 py-2 rounded-lg bg-neon/20 border border-neon/50 text-neon hover:bg-neon/30 transition-all font-semibold text-sm"
        >
          View Stats
        </button>
      </div>
    </motion.div>
  )
}

export function Achievements() {
  const [selectedAchievement, setSelectedAchievement] = useState<number | null>(null)
  const achievements = [
    { id: 1, name: 'First Win', icon: '🥇', locked: false, desc: 'Won your first game' },
    { id: 2, name: '10-Day Streak', icon: '🔥', locked: false, desc: 'Maintained 10-day winning streak' },
    { id: 3, name: 'Speed Demon', icon: '⚡', locked: false, desc: 'Solved 10 questions in 5 minutes' },
    { id: 4, name: 'Memory Master', icon: '🧠', locked: true, desc: 'Score 100% in Memory games' },
    { id: 5, name: '100-Day Streak', icon: '👑', locked: true, desc: 'Achieve 100-day winning streak' },
    { id: 6, name: 'World Champion', icon: '🌍', locked: true, desc: 'Rank #1 globally' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="gaming-card p-6"
    >
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Award size={24} className="text-yellow-400" />
        Achievements
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => !achievement.locked && setSelectedAchievement(achievement.id)}
            className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
              achievement.locked
                ? 'bg-white/5 border border-white/10 opacity-50'
                : selectedAchievement === achievement.id
                  ? 'bg-yellow-500/20 border border-yellow-500/50'
                  : 'bg-yellow-500/10 border border-yellow-500/30 hover:shadow-lg'
            }`}
            style={
              !achievement.locked
                ? { 
                    boxShadow: selectedAchievement === achievement.id 
                      ? '0 0 20px rgba(250, 204, 21, 0.4)' 
                      : '0 0 15px rgba(250, 204, 21, 0.2)' 
                  }
                : {}
            }
          >
            <div className="text-2xl mb-1">{achievement.locked ? '🔒' : achievement.icon}</div>
            <div className="text-xs text-center font-semibold text-gray-300 line-clamp-2">{achievement.name}</div>
            {!achievement.locked && selectedAchievement === achievement.id && (
              <div className="text-xs text-center text-yellow-400 mt-1">{achievement.desc}</div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
