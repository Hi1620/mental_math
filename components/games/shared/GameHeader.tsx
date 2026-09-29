'use client'

import { motion } from 'framer-motion'
import { Clock, Zap, X } from 'lucide-react'

interface GameHeaderProps {
  title: string
  timeLeft: number
  score: number
  onQuit: () => void
}

export function GameHeader({
  title,
  timeLeft,
  score,
  onQuit,
}: GameHeaderProps) {

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  const isCritical = timeLeft <= 10

  const handleQuit = () => {
    const confirmed = window.confirm(
      'Are you sure you want to quit? Your current game will end.'
    )

    if (confirmed) {
      onQuit()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="gaming-card mb-5 flex items-center justify-between gap-4 px-4 py-3"
    >

      {/* Game name */}
      <div className="min-w-0">
        <h1 className="truncate text-base font-semibold sm:text-lg">
          {title}
        </h1>

        <p className="hidden text-[11px] text-gray-500 sm:block">
          Cognitive Challenge
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Timer */}
        <motion.div
          animate={
            isCritical
              ? {
                scale: [1, 1.05, 1],
              }
              : {}
          }
          transition={{
            repeat: isCritical ? Infinity : 0,
            duration: 0.8,
          }}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 sm:px-3 ${isCritical
              ? 'border-red-500/40 bg-red-500/10'
              : 'border-white/10 bg-white/[0.04]'
            }`}
        >
          <Clock
            size={15}
            className={
              isCritical
                ? 'text-red-400'
                : 'text-neon'
            }
          />

          <span
            className={`font-mono text-sm font-semibold ${isCritical
                ? 'text-red-400'
                : 'text-neon'
              }`}
          >
            {formatTime(timeLeft)}
          </span>
        </motion.div>

        {/* Score */}
        <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 sm:px-3">

          <Zap
            size={15}
            className="text-neon"
          />

          <span className="text-sm font-semibold text-neon">
            {score}
          </span>

        </div>

        {/* Quit */}
        <button
          type="button"
          onClick={handleQuit}
          aria-label="Quit game"
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <X size={19} />
        </button>

      </div>

    </motion.div>
  )
}