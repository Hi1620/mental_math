'use client'

import { PerformanceCoach } from '@/components/ai/PerformanceCoach'
import { FeedbackModal } from '@/components/FeedbackModal'
import { motion } from 'framer-motion'
import { Brain, Home, Share2, X, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface GameResultsProps {
  gameName: string
  gameType: 'math' | 'memory' | 'puzzle' | 'logic'
  score: number
  maxScore: number
  accuracy: number
  timeSpent: number
  totalTime: number
  difficulty: string
  xpEarned: number
}

export function GameResults({
  gameName,
  gameType,
  score,
  maxScore,
  accuracy,
  timeSpent,
  totalTime,
  difficulty,
  xpEarned,
}: GameResultsProps) {
  const router = useRouter()

  const [showAICoach, setShowAICoach] = useState(false)
  const [showFeedback, setShowFeedback] = useState(true)

  const percentage =
    maxScore > 0
      ? Math.min(100, Math.round((score / maxScore) * 100))
      : 0

  const getRank = (acc: number) => {
    if (acc >= 95)
      return {
        rank: 'S',
        label: 'Exceptional',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/40',
      }

    if (acc >= 85)
      return {
        rank: 'A',
        label: 'Excellent',
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/40',
      }

    if (acc >= 75)
      return {
        rank: 'B',
        label: 'Good',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/40',
      }

    if (acc >= 60)
      return {
        rank: 'C',
        label: 'Keep Improving',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/40',
      }

    return {
      rank: 'D',
      label: 'Needs Practice',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/40',
    }
  }

  const rankInfo = getRank(accuracy)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    if (mins === 0) {
      return `${secs}s`
    }

    return `${mins}m ${secs}s`
  }

  const handleShare = async () => {
    const shareText = `I scored ${score}/${maxScore} in ${gameName} with ${accuracy}% accuracy! Rank: ${rankInfo.rank}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${gameName} Result`,
          text: shareText,
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        alert('Result copied to clipboard!')
      }
    } catch {
      // User cancelled sharing
    }
  }

  return (
    <>
      {showFeedback && (
        <FeedbackModal
          gameName={gameName}
          onClose={() => setShowFeedback(false)}
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-4"
      >
        <div className="min-h-full flex items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="gaming-card w-full max-w-xl p-5 md:p-7"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div
                className={`w-20 h-20 mx-auto rounded-full ${rankInfo.bg} ${rankInfo.border} border-2 flex items-center justify-center mb-3`}
              >
                <span
                  className={`text-4xl font-bold ${rankInfo.color}`}
                >
                  {rankInfo.rank}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy size={18} className="text-neon" />

                <h2 className="text-xl md:text-2xl font-bold">
                  {rankInfo.label}
                </h2>
              </div>

              <p className="text-sm text-gray-400">
                You completed {gameName}
              </p>
            </div>

            {/* Main Score */}
            <div className="text-center mb-6">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Final Score
              </p>

              <p className="text-4xl font-bold text-neon">
                {score}
                <span className="text-lg text-gray-500">
                  /{maxScore}
                </span>
              </p>

              <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-neon"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-xs text-gray-500 mb-1">
                  Accuracy
                </p>

                <p className="text-lg font-semibold">
                  {accuracy}%
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-xs text-gray-500 mb-1">
                  Time
                </p>

                <p className="text-lg font-semibold">
                  {formatTime(timeSpent)}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-xs text-gray-500 mb-1">
                  Difficulty
                </p>

                <p className="text-lg font-semibold">
                  {difficulty}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-neon/10 border border-neon/30 text-center">
                <p className="text-xs text-gray-500 mb-1">
                  XP
                </p>

                <p className="text-lg font-semibold text-neon">
                  +{xpEarned}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setShowAICoach(true)}
                className="py-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-all text-sm font-medium flex items-center justify-center gap-1.5"
              >
                <Brain size={16} />
                AI Coach
              </button>

              <button
                type="button"
                onClick={() => router.push('/')}
                className="py-2.5 rounded-lg gaming-button text-sm font-medium flex items-center justify-center gap-1.5"
              >
                <Home size={16} />
                Home
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="py-2.5 rounded-lg border border-neon/30 text-neon hover:bg-neon/10 transition-all text-sm font-medium flex items-center justify-center gap-1.5"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* AI Coach */}
      {showAICoach && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <div className="min-h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="gaming-card w-full max-w-3xl relative"
            >
              <button
                type="button"
                onClick={() => setShowAICoach(false)}
                className="absolute top-3 right-3 p-2 rounded-lg bg-white/5 hover:bg-white/10"
              >
                <X size={18} />
              </button>

              <div className="p-5 md:p-6">
                <PerformanceCoach />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  )
}