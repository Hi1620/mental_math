'use client'

import { motion } from 'framer-motion'
import { Award, MessageSquare, Target, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

const feedItems = [
  {
    id: 1,
    user: 'ProPlayer99',
    action: 'Won Championship',
    description: 'Became District Champion!',
    icon: '🏆',
    time: '2 hours ago',
  },
  {
    id: 2,
    user: 'MindMaster',
    action: 'Achieved 100-day streak',
    description: 'Incredible dedication!',
    icon: '🔥',
    time: '5 hours ago',
  },
  {
    id: 3,
    user: 'You',
    action: 'Joined Elite Squad',
    description: 'Welcome to the club!',
    icon: '⚡',
    time: '1 day ago',
  },
]

const statsData = [
  { label: 'Games Played', value: '234', icon: <Zap size={20} />, color: 'text-blue-400' },
  { label: 'Questions Solved', value: '3,482', icon: <Target size={20} />, color: 'text-green-400' },
  { label: 'Highest Streak', value: '42', icon: <Award size={20} />, color: 'text-yellow-400' },
  { label: 'Win Rate', value: '76%', icon: <TrendingUp size={20} />, color: 'text-purple-400' },
  { label: 'Avg Speed', value: '1.2s', icon: <Zap size={20} />, color: 'text-red-400' },
  { label: 'Favorite Game', value: 'Logic', icon: <Target size={20} />, color: 'text-cyan-400' },
]

export function Feed() {
  const [message, setMessage] = useState('')
  const [started, setStarted] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      const v = localStorage.getItem('matiks-feed-started')
      setStarted(!!v)
    } catch (e) {
      setStarted(false)
    }
  }, [])

  const handleViewMore = () => {
    setMessage('Loading more feed items...')
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="gaming-card p-8 mb-8"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare size={28} className="text-neon" />
        Social Feed
      </h2>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-2 rounded-lg bg-neon/20 border border-neon/50 text-neon text-xs font-semibold"
        >
          {message}
        </motion.div>
      )}

      <div className="space-y-3">
        {started ? (
          feedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-neon/30 transition-all hover:bg-white/10 cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold group-hover:text-neon transition-all">
                  {item.user}
                  <span className="text-gray-400 text-sm ml-2">{item.action}</span>
                </p>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap">{item.time}</div>
            </div>
          </motion.div>
          ))
        ) : started === false ? (
          <div className="p-6 rounded-xl border border-white/10 bg-white/3 text-center">
            <p className="mb-3 font-semibold">Your feed is empty</p>
            <p className="text-sm text-gray-400 mb-4">Start the feed to see updates from your activity and friends.</p>
            <button
              onClick={() => {
                try { localStorage.setItem('matiks-feed-started', '1') } catch (e) {}
                setStarted(true)
                setMessage('Starting your feed...')
                setTimeout(() => setMessage(''), 1500)
              }}
              className="px-4 py-2 rounded-lg bg-neon text-black font-semibold"
            >
              Start Feed
            </button>
          </div>
        ) : null}
      </div>

      <button 
        onClick={handleViewMore}
        className="w-full mt-4 py-3 rounded-xl border border-neon/30 text-neon hover:bg-neon/10 transition-all font-semibold"
      >
        View More
      </button>
    </motion.div>
  )
}

export function Statistics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="gaming-card p-8 mb-8"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp size={28} className="text-neon" />
        Your Statistics
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all"
          >
            <div className={`${stat.color} mb-2`}>{stat.icon}</div>
            <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function Competitions() {
  const [joinedCompetitions, setJoinedCompetitions] = useState<number[]>([])
  const [notification, setNotification] = useState('')

  const handleJoinCompetition = (compId: number, compName: string) => {
    if (!joinedCompetitions.includes(compId)) {
      setJoinedCompetitions([...joinedCompetitions, compId])
      setNotification(`✅ Joined ${compName}!`)
      setTimeout(() => setNotification(''), 2000)
    }
  }

  const competitions = [
    {
      id: 1,
      name: 'Speed Championship',
      status: 'Upcoming',
      date: 'Tomorrow',
      icon: '⚡',
      color: 'from-yellow-500/20 to-orange-500/20',
      borderColor: 'border-yellow-500/30',
    },
    {
      id: 2,
      name: 'Logic Masters',
      status: 'Live',
      date: 'Now',
      icon: '🧠',
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
    },
    {
      id: 3,
      name: 'Memory Challenge',
      status: 'Locked',
      date: 'In 3 days',
      icon: '🎮',
      color: 'from-gray-500/20 to-gray-500/20',
      borderColor: 'border-gray-500/30',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="gaming-card p-8"
    >
      <h2 className="text-2xl font-bold mb-6">Competitions</h2>

      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-neon/20 border border-neon/50 text-neon text-sm font-semibold"
        >
          {notification}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {competitions.map((comp) => (
          <motion.div
            key={comp.id}
            whileHover={{ y: -5 }}
            className={`p-4 rounded-2xl bg-gradient-to-br ${comp.color} border ${comp.borderColor} transition-all`}
          >
            <div className="text-4xl mb-2">{comp.icon}</div>
            <h4 className="font-bold mb-1">{comp.name}</h4>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span
                className={`px-2 py-1 rounded-full font-semibold ${
                  comp.status === 'Live'
                    ? 'bg-green-500/30 text-green-300'
                    : comp.status === 'Locked'
                      ? 'bg-gray-500/30 text-gray-300'
                      : 'bg-yellow-500/30 text-yellow-300'
                }`}
              >
                {comp.status}
              </span>
              <span className="text-gray-400">{comp.date}</span>
            </div>
            <button
              onClick={() => handleJoinCompetition(comp.id, comp.name)}
              disabled={comp.status === 'Locked' || joinedCompetitions.includes(comp.id)}
              className={`w-full p-2 rounded-lg font-semibold text-sm transition-all ${
                comp.status === 'Locked'
                  ? 'bg-white/5 text-gray-400 cursor-not-allowed'
                  : joinedCompetitions.includes(comp.id)
                    ? 'bg-neon/30 border border-neon/70 text-neon'
                    : 'bg-neon/20 border border-neon/50 text-neon hover:bg-neon/30'
              }`}
            >
              {comp.status === 'Locked' ? 'Complete Streak' : joinedCompetitions.includes(comp.id) ? 'Joined' : 'Join'}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
