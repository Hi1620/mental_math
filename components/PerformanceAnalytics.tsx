'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { TrendingUp } from 'lucide-react'

const weeklyData = [
  { day: 'Mon', performance: 65 },
  { day: 'Tue', performance: 72 },
  { day: 'Wed', performance: 68 },
  { day: 'Thu', performance: 82 },
  { day: 'Fri', performance: 85 },
  { day: 'Sat', performance: 89 },
  { day: 'Sun', performance: 88 },
]

const skillsData = [
  { skill: 'Accuracy', value: 89 },
  { skill: 'Speed', value: 76 },
  { skill: 'Logic', value: 92 },
  { skill: 'Memory', value: 83 },
  { skill: 'Reaction', value: 78 },
]

export function PerformanceAnalytics() {
  const overallScore = 89

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="gaming-card p-8 mb-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp size={28} className="text-neon" />
          Performance Analytics
        </h2>
        <div className="text-right">
          <div className="text-4xl font-bold text-neon">{overallScore}</div>
          <div className="text-sm text-gray-400">Overall Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Weekly Trend Chart */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-400 mb-4">Weekly Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="day" stroke="rgba(255, 255, 255, 0.3)" />
              <YAxis stroke="rgba(255, 255, 255, 0.3)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(18, 18, 18, 0.9)',
                  border: '1px solid rgba(0, 255, 65, 0.3)',
                  borderRadius: '12px',
                }}
                labelStyle={{ color: '#00ff41' }}
              />
              <Line
                type="monotone"
                dataKey="performance"
                stroke="#00ff41"
                strokeWidth={3}
                dot={{ fill: '#00ff41', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Radar Chart */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-4">Skill Profile</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={skillsData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
              <PolarAngleAxis dataKey="skill" stroke="rgba(255, 255, 255, 0.5)" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis stroke="rgba(255, 255, 255, 0.3)" angle={90} domain={[0, 100]} />
              <Radar name="Score" dataKey="value" stroke="#00ff41" fill="#00ff41" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skills Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {skillsData.map((skill) => (
          <div
            key={skill.skill}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-neon/30 transition-all text-center"
          >
            <div className="text-2xl font-bold text-neon mb-1">{skill.value}</div>
            <div className="text-xs text-gray-400 font-medium">{skill.skill}</div>
          </div>
        ))}
      </div>

      {/* AI Feedback */}
      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-neon/10 to-neon/5 border border-neon/30 flex gap-3">
        <div className="text-neon text-2xl">💡</div>
        <div>
          <p className="text-sm font-semibold text-gray-100">AI Coach Feedback</p>
          <p className="text-xs text-gray-400 mt-1">Your accuracy is excellent! Focus on improving reaction time to boost your overall performance.</p>
        </div>
      </div>
    </motion.div>
  )
}
