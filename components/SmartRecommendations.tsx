'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Target, Trophy, Users, Zap } from 'lucide-react'
import { useState } from 'react'

const recommendations = [
  {
    id: 1,
    title: "Today's Practice Recommendation",
    description: 'Math - Algebra Basics',
    icon: <Zap size={24} />,
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    action: 'Practice Now',
  },
  {
    id: 2,
    title: 'Weak Topic to Focus On',
    description: 'Logic - Pattern Recognition',
    icon: <Target size={24} />,
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    action: 'Learn More',
  },
  {
    id: 3,
    title: 'Best Tournament Match',
    description: 'Speed Championship - Your Level',
    icon: <Trophy size={24} />,
    color: 'from-yellow-500/20 to-orange-500/20',
    borderColor: 'border-yellow-500/30',
    action: 'Join',
  },
  {
    id: 4,
    title: 'Friend to Challenge',
    description: 'ProPlayer99 - Similar Skill',
    icon: <Users size={24} />,
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    action: 'Challenge',
  },
]

export function SmartRecommendations() {
  const [notification, setNotification] = useState('')

  const handleAction = (action: string, description: string) => {
    setNotification(`${action} for ${description}...`)
    setTimeout(() => setNotification(''), 2500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="gaming-card p-8"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Lightbulb size={28} className="text-neon" />
        AI Smart Recommendations
      </h2>

      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-neon/20 border border-neon/50 text-neon text-sm font-semibold"
        >
          {notification}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ translateY: -5 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${rec.color} border ${rec.borderColor} transition-all hover:shadow-lg cursor-pointer group`}
          >
            <div className="flex items-start gap-4">
              <div className="text-neon group-hover:scale-110 transition-transform">
                {rec.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-400 mb-1">{rec.title}</h3>
                <p className="font-bold text-lg text-white mb-3 group-hover:text-neon transition-colors">
                  {rec.description}
                </p>
                <button 
                  onClick={() => handleAction(rec.action, rec.description)}
                  className="px-3 py-1 rounded-lg bg-neon/20 border border-neon/50 text-neon hover:bg-neon/30 transition-all font-semibold text-xs"
                >
                  {rec.action}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
