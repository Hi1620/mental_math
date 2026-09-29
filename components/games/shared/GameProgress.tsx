'use client'

import { motion } from 'framer-motion'

interface GameProgressProps {
    current: number
    total: number
    accuracy?: number
    streak?: number
}

export function GameProgress({
    current,
    total,
    accuracy = 0,
    streak = 0,
}: GameProgressProps) {
    const progress = Math.min(
        100,
        Math.round((current / total) * 100)
    )

    return (
        <div className="mb-5">
            <div className="flex items-center justify-between mb-2 text-xs">
                <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-300">
                        Round {current}
                        <span className="text-gray-500"> / {total}</span>
                    </span>

                    {streak > 1 && (
                        <span className="text-neon font-semibold">
                            {streak} streak
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3 text-gray-400">
                    <span>{accuracy}% accuracy</span>
                    <span>{progress}%</span>
                </div>
            </div>

            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-neon to-neon-dark rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{
                        duration: 0.4,
                        ease: 'easeOut',
                    }}
                />
            </div>
        </div>
    )
}