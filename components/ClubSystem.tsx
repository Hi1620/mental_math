'use client'

import { motion } from 'framer-motion'
import { Users, Plus, LogIn, MessageCircle, Trophy, Zap } from 'lucide-react'
import { useState } from 'react'

const myClubs = [
  {
    id: 1,
    name: 'Elite Squad',
    members: 24,
    icon: '⚡',
    rank: 2,
    points: 8932,
  },
  {
    id: 2,
    name: 'Math Wizards',
    members: 18,
    icon: '🧙',
    rank: 5,
    points: 6234,
  },
]

const suggestedClubs = [
  {
    id: 3,
    name: 'Speed Demons',
    members: 42,
    icon: '🚀',
    description: 'Fast reaction time challenges',
  },
  {
    id: 4,
    name: 'Logic Lords',
    members: 38,
    icon: '🧠',
    description: 'Complex puzzle solving',
  },
]

export function ClubSystem() {
  const [joinedClubs, setJoinedClubs] = useState<number[]>([])
  const [message, setMessage] = useState('')

  const handleCreateClub = () => {
    setMessage('Club creation dialog opened!')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleJoinClub = (clubId: number, clubName: string) => {
    if (!joinedClubs.includes(clubId)) {
      setJoinedClubs([...joinedClubs, clubId])
      setMessage(`✅ Successfully joined ${clubName}!`)
      setTimeout(() => setMessage(''), 2000)
    }
  }

  const handleClubAction = (action: string) => {
    setMessage(`Opening ${action}...`)
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="gaming-card p-8 mb-8"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Users size={28} className="text-neon" />
        Club System
      </h2>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-neon/20 border border-neon/50 text-neon text-sm font-semibold"
        >
          {message}
        </motion.div>
      )}

      {/* My Clubs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">My Clubs</h3>
          <button 
            onClick={handleCreateClub}
            className="gaming-button text-sm py-1 px-3"
          >
            <Plus size={16} className="inline mr-1" />
            Create
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {myClubs.map((club) => (
            <motion.div
              key={club.id}
              whileHover={{ y: -5 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-neon/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{club.icon}</div>
                <div className="text-right">
                  <div className="text-xl font-bold text-neon">#{club.rank}</div>
                  <div className="text-xs text-gray-400">Rank</div>
                </div>
              </div>
              <h4 className="font-semibold mb-1">{club.name}</h4>
              <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                <Users size={12} />
                {club.members} members
              </p>
              <div className="flex gap-2 text-xs">
                <button 
                  onClick={() => handleClubAction('Chat')}
                  className="flex-1 p-2 rounded-lg bg-neon/10 border border-neon/30 text-neon hover:bg-neon/20 transition-all font-semibold flex items-center justify-center gap-1"
                >
                  <MessageCircle size={12} />
                  Chat
                </button>
                <button 
                  onClick={() => handleClubAction('Leaderboard')}
                  className="flex-1 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-semibold flex items-center justify-center gap-1"
                >
                  <Trophy size={12} />
                  Leaderboard
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Club Wars & Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Weekly Club Wars */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Zap size={18} className="text-orange-400" />
            Club Wars
          </h4>
          <p className="text-sm text-gray-300 mb-3">Your club is ranking #2 this week!</p>
          <div className="flex gap-2 mb-3">
            <div className="flex-1 p-2 rounded-lg bg-white/5 text-center">
              <div className="text-lg font-bold text-orange-400">8,932</div>
              <div className="text-xs text-gray-400">Points</div>
            </div>
            <div className="flex-1 p-2 rounded-lg bg-white/5 text-center">
              <div className="text-lg font-bold text-orange-400">24</div>
              <div className="text-xs text-gray-400">Members</div>
            </div>
          </div>
          <button 
            onClick={() => handleClubAction('Club Wars')}
            className="w-full p-2 rounded-lg bg-orange-500/20 border border-orange-500/50 text-orange-400 hover:bg-orange-500/30 transition-all font-semibold text-sm"
          >
            View Competition
          </button>
        </div>

        {/* Weekly Missions */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Trophy size={18} className="text-purple-400" />
            Weekly Missions
          </h4>
          <p className="text-sm text-gray-300 mb-3">3/5 missions completed</p>
          <div className="w-full h-2 rounded-full bg-white/10 mb-3 overflow-hidden">
            <div className="h-full w-3/5 bg-gradient-to-r from-purple-500 to-pink-500" />
          </div>
          <button 
            onClick={() => handleClubAction('Weekly Missions')}
            className="w-full p-2 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-400 hover:bg-purple-500/30 transition-all font-semibold text-sm"
          >
            View Missions
          </button>
        </div>
      </div>

      {/* Suggested Clubs */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Suggested Clubs to Join</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {suggestedClubs.map((club) => (
            <motion.div
              key={club.id}
              whileHover={{ y: -5 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-neon/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-4xl mb-2">{club.icon}</div>
                  <h4 className="font-semibold">{club.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{club.description}</p>
                </div>
                <div className="text-right text-xs">
                  <div className="text-gray-300 font-semibold">{club.members}</div>
                  <div className="text-gray-500">members</div>
                </div>
              </div>
              <button 
                onClick={() => handleJoinClub(club.id, club.name)}
                disabled={joinedClubs.includes(club.id)}
                className="w-full p-2 rounded-lg bg-neon/20 border border-neon/50 text-neon hover:bg-neon/30 transition-all font-semibold text-sm flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn size={14} />
                {joinedClubs.includes(club.id) ? 'Joined' : 'Join Club'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
