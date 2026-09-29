'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function Confetti() {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; duration: number }>>([])

  useEffect(() => {
    const pieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.2,
      duration: 2 + Math.random() * 1,
    }))
    setConfetti(pieces)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: -20,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: '100vh',
            opacity: 0,
            rotate: 360,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
          className="absolute text-2xl"
        >
          {['🎉', '⭐', '🎊', '✨', '🌟'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}
    </div>
  )
}
