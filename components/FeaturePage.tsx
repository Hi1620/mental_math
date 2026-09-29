'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface FeaturePageProps {
  title: string
  description: string
  emoji: string
  accentClass?: string
  ctaLabel?: string
  ctaHref?: string
}

export function FeaturePage({
  title,
  description,
  emoji,
  accentClass = 'from-neon/20 to-cyan-500/20',
  ctaLabel = 'Go to Games',
  ctaHref = '/games',
}: FeaturePageProps) {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border border-white/10 bg-gradient-to-br ${accentClass} p-8 shadow-[0_0_70px_rgba(0,255,65,0.12)]`}
        >
          <div className="text-6xl">{emoji}</div>
          <h1 className="mt-6 text-3xl font-semibold text-white">{title}</h1>
          <p className="mt-3 max-w-2xl text-base text-gray-400">{description}</p>
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-5 py-3 text-sm font-semibold text-neon transition hover:bg-neon/20"
          >
            {ctaLabel}
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
