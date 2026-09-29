'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function StoryModePage() {
  const [currentPage, setCurrentPage] = useState(0)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const stories = [
    {
      title: 'The Adventure Begins',
      text: 'Once upon a time, in a magical kingdom far away...',
      image: '🏰',
      question: 'What was the first thing in the story?',
      options: ['Kingdom', 'Time', 'Magic'],
      correct: 0,
    },
    {
      title: 'The Brave Hero',
      text: 'A brave knight set out on a great quest...',
      image: '🗡️',
      question: 'What did the knight go on?',
      options: ['Vacation', 'Quest', 'School'],
      correct: 1,
    },
    {
      title: 'The Treasure Found',
      text: 'After many challenges, they found the treasure!',
      image: '🏆',
      question: 'What did they find?',
      options: ['Treasure', 'Food', 'Friend'],
      correct: 0,
    },
  ]

  const handleAnswer = (index: number) => {
    if (index === stories[currentPage].correct) {
      setScore(prev => prev + 10)
    }
    if (currentPage < stories.length - 1) {
      setCurrentPage(currentPage + 1)
    } else {
      setIsComplete(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <Link
          href="/kids-zone"
          className="flex items-center gap-2 text-white font-bold mb-6 hover:opacity-80 transition-all"
        >
          <ArrowLeft size={24} />
          Back to Kids Zone
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">Story Mode</h1>
        <div className="text-xl text-white/80">
          Stars Earned: <span className="font-bold text-yellow-300">{score}</span>
        </div>
      </div>

      {/* Story Card */}
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-2xl"
      >
        {!isComplete ? (
          <>
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">{stories[currentPage].image}</div>
              <h2 className="text-3xl font-bold text-purple-900 mb-2">
                {stories[currentPage].title}
              </h2>
              <p className="text-lg text-gray-600 mb-4">Page {currentPage + 1} of {stories.length}</p>
            </div>

            <p className="text-xl text-gray-700 mb-8 text-center">
              {stories[currentPage].text}
            </p>

            <div className="mb-8">
              <p className="font-bold text-lg text-purple-900 mb-4">
                {stories[currentPage].question}
              </p>
              <div className="grid grid-cols-1 gap-3">
                {stories[currentPage].options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(index)}
                    className="p-4 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-lg hover:shadow-lg transition-all"
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-purple-900 mb-4">Story Complete!</h2>
            <p className="text-xl text-gray-600 mb-4">You earned {score} stars!</p>
            <Link
              href="/kids-zone"
              className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full hover:shadow-lg transition-all"
            >
              Back to Games
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
