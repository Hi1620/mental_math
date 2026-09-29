'use client'

import { CoachPayload, fetchCoachPayload } from '@/lib/ai-service'
import { motion } from 'framer-motion'
import {
    ArrowRight,
    Brain,
    Compass,
    Lightbulb,
    Sparkles,
    Target,
    TrendingUp,
    Trophy,
    Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
    CartesianGrid,
    Line,
    LineChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

interface PerformanceCoachProps {
  userId?: string
}

function CircularScore({ value, label }: { value: number; label: string }) {
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(100, Math.max(0, value))
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90">
          <circle cx="60" cy="60" r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth="10" fill="none" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#00ff41"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-neon">{Math.round(value)}</span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500">{label}</span>
        </div>
      </div>
    </div>
  )
}

export function PerformanceCoach({ userId = 'demo-user' }: PerformanceCoachProps) {
  const [coach, setCoach] = useState<CoachPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const payload = await fetchCoachPayload(userId)
        if (active) {
          setCoach(payload)
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      active = false
    }
  }, [userId])

  const skillData = useMemo(() => {
    if (!coach) {
      return []
    }

    const base = {
      Math: 70,
      Memory: 65,
      Logic: 74,
      Puzzle: 72,
    }

    const strongest = coach.strongestSkill
    const weakest = coach.weakestSkill

    return [
      {
        skill: 'Math',
        value: Math.min(100, Math.max(35, base.Math + (strongest === 'Math' ? 10 : 0) + (weakest === 'Math' ? -8 : 0))),
      },
      {
        skill: 'Memory',
        value: Math.min(100, Math.max(35, base.Memory + (strongest === 'Memory' ? 10 : 0) + (weakest === 'Memory' ? -8 : 0))),
      },
      {
        skill: 'Logic',
        value: Math.min(100, Math.max(35, base.Logic + (strongest === 'Logic' ? 10 : 0) + (weakest === 'Logic' ? -8 : 0))),
      },
      {
        skill: 'Puzzle',
        value: Math.min(100, Math.max(35, base.Puzzle + (strongest === 'Puzzle' ? 10 : 0) + (weakest === 'Puzzle' ? -8 : 0))),
      },
    ]
  }, [coach])

  const trendData = useMemo(() => {
    if (!coach) {
      return []
    }

    const baseline = coach.predictedScore - 6
    const series =
      coach.trend === 'upward'
        ? [baseline - 2, baseline + 1, baseline + 4, baseline + 7, coach.predictedScore]
        : coach.trend === 'downward'
          ? [baseline + 8, baseline + 6, baseline + 4, baseline + 2, baseline]
          : [baseline + 1, baseline + 2, baseline + 3, baseline + 4, baseline + 5]

    return [
      { name: 'Mon', score: series[0] },
      { name: 'Tue', score: series[1] },
      { name: 'Wed', score: series[2] },
      { name: 'Thu', score: series[3] },
      { name: 'Fri', score: series[4] },
    ]
  }, [coach])

  if (loading || !coach) {
    return (
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-neon/10 to-purple-500/10 p-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-neon/30 bg-neon/10">
          <Brain className="h-8 w-8 text-neon" />
        </div>
        <p className="text-xl font-semibold">Training the ML coach...</p>
        <p className="mt-2 text-sm text-gray-400">Preparing your personalized performance profile.</p>
      </div>
    )
  }

  const goalValue = Math.min(100, Math.round(coach.predictedScore))
  const confidenceLabel = coach.confidence > 0.85 ? 'High confidence' : coach.confidence > 0.7 ? 'Strong signal' : 'Steady outlook'

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="rounded-3xl border border-neon/30 bg-gradient-to-br from-neon/15 via-black/20 to-purple-500/20 p-8 shadow-[0_0_80px_rgba(0,255,65,0.16)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-sm text-neon">
              <Sparkles className="h-4 w-4" />
              AI Performance Coach
            </div>
            <h2 className="text-3xl font-semibold text-white">Your next breakthrough is already visible.</h2>
            <p className="mt-3 max-w-2xl text-sm text-gray-400">
              The model combines your recent gameplay history with your skill profile to generate a premium coaching plan and a data-backed brain score.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <p className="text-sm text-gray-400">Confidence</p>
            <p className="text-2xl font-semibold text-neon">{Math.round(coach.confidence * 100)}%</p>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{confidenceLabel}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Overall Brain Score</p>
              <p className="text-4xl font-semibold text-neon">{Math.round(coach.brainScore)}</p>
            </div>
            <div className="rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-sm text-neon">
              {coach.trend === 'upward' ? 'Momentum rising' : coach.trend === 'downward' ? 'Reset and recover' : 'Steady pace'}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <CircularScore value={coach.brainScore} label="Brain" />
            <CircularScore value={coach.predictedScore} label="Next" />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
              <div className="flex items-center gap-2 text-green-400">
                <Trophy className="h-4 w-4" />
                <span className="text-sm font-semibold">Strength</span>
              </div>
              <p className="mt-2 text-xl font-semibold text-white">{coach.strongestSkill}</p>
            </div>
            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
              <div className="flex items-center gap-2 text-orange-400">
                <Compass className="h-4 w-4" />
                <span className="text-sm font-semibold">Weakness</span>
              </div>
              <p className="mt-2 text-xl font-semibold text-white">{coach.weakestSkill}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="mb-4 flex items-center gap-2 text-neon">
            <Target className="h-5 w-5" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">Today&apos;s Goal</p>
          </div>
          <p className="text-4xl font-semibold text-white">{goalValue}%</p>
          <p className="mt-2 text-sm text-gray-400">An intentionally ambitious target for your next session.</p>
          <div className="mt-6 h-3 rounded-full bg-white/10">
            <div className="h-3 rounded-full bg-gradient-to-r from-neon to-cyan-400" style={{ width: `${goalValue}%` }} />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span>Expected improvement: {coach.estimatedImprovement}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="mb-4 flex items-center gap-2 text-neon">
            <TrendingUp className="h-5 w-5" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">Weekly Trend</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} domain={[50, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#00ff41" strokeWidth={3} dot={{ r: 4, fill: '#00ff41' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="mb-4 flex items-center gap-2 text-neon">
            <Brain className="h-5 w-5" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">Skill Radar</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillData}>
                <PolarGrid stroke="rgba(255,255,255,0.12)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#d1d5db', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar dataKey="value" stroke="#00ff41" fill="#00ff41" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="mb-4 flex items-center gap-2 text-neon">
            <Lightbulb className="h-5 w-5" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">Personalized Advice</p>
          </div>
          <p className="mb-4 text-sm leading-7 text-gray-400">{coach.explanation}</p>
          <div className="space-y-3">
            {coach.personalizedTips.map((tip, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-gray-300">
                {tip}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="mb-4 flex items-center gap-2 text-neon">
            <ArrowRight className="h-5 w-5" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">Recommended Games</p>
          </div>
          <div className="space-y-3">
            {coach.recommendedGames.map((game, index) => (
              <div key={index} className="flex items-center justify-between rounded-2xl border border-neon/20 bg-neon/10 px-4 py-3">
                <span className="font-medium text-white">{game}</span>
                <span className="text-sm text-neon">#{index + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-r from-neon/15 to-purple-500/15 p-4">
            <p className="text-sm font-semibold text-white">Motivation</p>
            <p className="mt-2 text-sm text-gray-400">{coach.motivation}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-neon/10 to-purple-500/10 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Daily Plan</p>
            <p className="mt-2 text-xl font-semibold text-white">A focused path for your next session</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {coach.dailyPlan.map((step, index) => (
              <span key={index} className="rounded-full border border-neon/20 bg-black/20 px-3 py-1 text-sm text-gray-300">
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
