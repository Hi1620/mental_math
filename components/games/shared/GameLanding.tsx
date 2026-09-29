'use client'

import { motion } from 'framer-motion'
import {
    ArrowLeft,
    ArrowRight,
    Bot,
    Clock3,
    Gamepad2,
    HelpCircle,
    Users,
    Zap,
} from 'lucide-react'

interface GameLandingProps {
  gameName: string
  category: 'MATH' | 'MEMORY' | 'PUZZLE' | 'LOGIC'
  description: string
  duration?: number
  difficulty?: string
  rating?: number
  icon?: string
  onBack: () => void
  onPlayDuel: () => void
  onPlayFriend: () => void
  onPlaySingle: () => void
  onHowToPlay: () => void
}

export function GameLanding({
  gameName,
  category,
  description,
  duration = 60,
  difficulty = 'Normal',
  rating = 1000,
  icon = '⚡',
  onBack,
  onPlayDuel,
  onPlayFriend,
  onPlaySingle,
  onHowToPlay,
}: GameLandingProps) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-4 py-6 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* TOP NAVIGATION */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-xl border border-white/15 bg-white/[0.03] flex items-center justify-center hover:border-neon/50 hover:bg-white/[0.06] transition-all"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            onClick={onHowToPlay}
            className="px-4 py-3 rounded-xl border border-white/15 bg-white/[0.03] text-sm font-semibold hover:border-neon/50 transition-all flex items-center gap-2"
          >
            <HelpCircle size={17} />
            HOW TO PLAY?
          </button>
        </div>

        {/* GAME IDENTITY */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="px-3 py-1.5 rounded-lg bg-white/[0.08] border border-white/10 text-xs font-bold tracking-wide">
              {category}
            </span>

            <span className="px-3 py-1.5 rounded-lg bg-white/[0.08] border border-white/10 text-xs font-bold tracking-wide flex items-center gap-1.5">
              <Clock3 size={13} />
              {duration} SEC DUEL
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-3xl shrink-0">
              {icon}
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">
                {gameName}
              </h1>

              <p className="text-sm sm:text-base text-gray-400 mt-3 max-w-2xl leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </motion.section>

        {/* GAME INFORMATION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs text-gray-500 mb-1">
              DIFFICULTY
            </div>
            <div className="text-sm font-semibold">
              {difficulty}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs text-gray-500 mb-1">
              DURATION
            </div>
            <div className="text-sm font-semibold">
              {duration} sec
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs text-gray-500 mb-1">
              RATING
            </div>
            <div className="text-sm font-semibold text-neon">
              {rating}
            </div>
          </div>
        </motion.div>

        {/* MAIN GAME MODES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >

          {/* DUEL */}
          <button
            onClick={onPlayDuel}
            className="w-full group rounded-2xl bg-neon text-black p-5 sm:p-6 flex items-center justify-between hover:brightness-110 transition-all shadow-[0_0_25px_rgba(0,255,65,0.12)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-black/10 flex items-center justify-center">
                <Bot size={22} />
              </div>

              <div className="text-left">
                <div className="text-lg font-black">
                  PLAY DUEL
                </div>

                <div className="text-xs font-medium opacity-70 mt-1">
                  Compete against an AI opponent
                </div>
              </div>
            </div>

            <ArrowRight
              size={22}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          {/* FRIEND */}
          <button
            onClick={onPlayFriend}
            className="w-full group rounded-2xl border border-white/15 bg-white/[0.03] p-5 sm:p-6 flex items-center justify-between hover:border-white/30 hover:bg-white/[0.05] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center">
                <Users size={21} />
              </div>

              <div className="text-left">
                <div className="text-base font-bold">
                  PLAY A FRIEND
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  Create or join a private match
                </div>
              </div>
            </div>

            <ArrowRight
              size={20}
              className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all"
            />
          </button>

          {/* SINGLE PLAYER */}
          <button
            onClick={onPlaySingle}
            className="w-full group rounded-2xl border border-white/15 bg-white/[0.03] p-5 sm:p-6 flex items-center justify-between hover:border-white/30 hover:bg-white/[0.05] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center">
                <Gamepad2 size={21} />
              </div>

              <div className="text-left">
                <div className="text-base font-bold">
                  SINGLE PLAYER
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  Train your skills against the clock
                </div>
              </div>
            </div>

            <ArrowRight
              size={20}
              className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all"
            />
          </button>

        </motion.div>

        {/* BOTTOM INFORMATION */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex gap-3">
            <Zap
              size={18}
              className="text-neon mt-0.5"
            />

            <div>
              <div className="text-sm font-semibold">
                Performance Tracking
              </div>

              <div className="text-xs text-gray-500 mt-1">
                Score, accuracy, streak and XP are tracked during the game.
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex gap-3">
            <Bot
              size={18}
              className="text-neon mt-0.5"
            />

            <div>
              <div className="text-sm font-semibold">
                AI Coach
              </div>

              <div className="text-xs text-gray-500 mt-1">
                Get contextual hints without revealing the answer.
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  )
}