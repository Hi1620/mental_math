'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { PerformanceCoach } from '@/components/ai/PerformanceCoach'
import { motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'

export default function AICoachPage() {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="rounded-3xl border border-neon/30 bg-gradient-to-br from-neon/15 via-black/20 to-purple-500/20 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-neon/30 bg-neon/10">
                <Brain className="h-8 w-8 text-neon" />
              </div>
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-neon/20 bg-black/20 px-3 py-1 text-sm text-neon">
                  <Sparkles className="h-4 w-4" />
                  Next-generation brain training insight
                </p>
                <h1 className="text-3xl font-semibold text-white">Matiks AI Performance Coach</h1>
                <p className="mt-2 max-w-2xl text-sm text-gray-400">
                  Your game sessions are transformed into a living performance profile that predicts your next score and adapts your daily practice plan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <PerformanceCoach />
      </motion.div>
    </DashboardLayout>
  )
}
