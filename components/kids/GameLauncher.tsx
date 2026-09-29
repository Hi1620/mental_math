'use client'

import { useAdventure } from '@/lib/kids-zone-context'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Confetti } from './Confetti'

interface GameLauncherProps {
  gameName: string
  gameType: string
  worldId: string
  onExit: () => void
}

export function GameLauncher({ gameName, gameType, worldId, onExit }: GameLauncherProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const { completeGame, updateMissionProgress } = useAdventure()

  const handleStartGame = () => {
    setIsPlaying(true)
    setScore(0)
    setQuestionsAnswered(0)
    setShowConfetti(false)
    setGameFinished(false)
  }

  const handleAnswerQuestion = (correct: boolean) => {
    const nextQuestion = questionsAnswered + 1
    const newScore = correct ? score + 10 : score

    setScore(newScore)
    setQuestionsAnswered(nextQuestion)

    if (nextQuestion >= 5) {
      completeGame(gameType, newScore, worldId)
      updateMissionProgress('1', 2)
      setGameFinished(true)
      setShowConfetti(true)
    }
  }

  const handleQuit = () => {
    setIsPlaying(false)
    setGameFinished(false)
    onExit()
  }

  const getQuestionSet = (activeGameName: string) => {
    switch (activeGameName) {
      case 'Memory Master':
        return [
          { question: 'Which object appeared first in the trail: 🍀, 🌟, 🍀?', options: ['🍀', '🌟', '🌈', '☀️'], correct: 0 },
          { question: 'Which color was mentioned twice: blue, red, blue?', options: ['blue', 'red', 'green', 'yellow'], correct: 0 },
          { question: 'What came after the star: 🌟, 🌈, 🌟?', options: ['🌈', '☁️', '⭐', '🍀'], correct: 0 },
          { question: 'Which item was repeated: 🐻, 🐰, 🐻?', options: ['🐻', '🐰', '🦊', '🐼'], correct: 0 },
          { question: 'Which shape appeared last: ▲, ●, ▲?', options: ['▲', '●', '■', '◆'], correct: 1 },
        ]
      case 'Puzzle Quest':
        return [
          { question: 'What comes next? 🔺 🔻 🔺 🔻 ?', options: ['🔺', '🔻', '◼️', '🔷'], correct: 0 },
          { question: 'Which shape fits the pattern? ■ □ ■ □ ?', options: ['■', '□', '◆', '●'], correct: 1 },
          { question: 'Find the odd one out: 🟦 🟩 🟦 🟨', options: ['🟦', '🟩', '🟨', '🟦'], correct: 2 },
          { question: 'Which number is missing? 2, 4, __, 8', options: ['3', '5', '6', '7'], correct: 2 },
          { question: 'Which letter comes next? A, C, E, __', options: ['D', 'F', 'G', 'H'], correct: 1 },
        ]
      default:
        return [
          { question: 'What is 5 + 3?', options: ['7', '8', '9', '6'], correct: 1 },
          { question: 'What is 12 - 4?', options: ['6', '8', '10', '9'], correct: 1 },
          { question: 'What is 6 × 2?', options: ['10', '12', '14', '11'], correct: 1 },
          { question: 'What is 20 ÷ 4?', options: ['4', '5', '6', '7'], correct: 1 },
          { question: 'What is 7 + 8?', options: ['14', '15', '16', '13'], correct: 1 },
        ]
    }
  }

  const questionSet = getQuestionSet(gameName)
  const introText = gameName === 'Memory Master'
    ? 'Use your memory and answer 5 quick clue questions!'
    : gameName === 'Puzzle Quest'
      ? 'Solve 5 fun logic puzzles to finish the quest!'
      : 'Answer 5 quick math questions to complete this game!'

  if (!isPlaying) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center"
      >
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-2xl font-bold text-white mb-2">{gameName}</h3>
        <p className="text-white/80 mb-6">{introText}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartGame}
          className="px-8 py-3 bg-green-400 text-white font-bold rounded-xl hover:bg-green-500 transition-all"
        >
          Start Game
        </motion.button>
      </motion.div>
    )
  }

  const currentQuestion = questionSet[questionsAnswered]

  if (gameFinished) {
    return (
      <>
        {showConfetti && <Confetti />}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-8xl mb-4"
          >
            🎉
          </motion.div>
          <h3 className="text-3xl font-bold text-white mb-2">Game Complete!</h3>
          <p className="text-white/80 mb-4 text-2xl">Final Score: {score} Points</p>
          <p className="mb-4 text-white/70">You finished {gameName} and earned rewards!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuit}
            className="px-8 py-3 bg-blue-400 text-white font-bold rounded-xl hover:bg-blue-500 transition-all"
          >
            Back to World
          </motion.button>
        </motion.div>
      </>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/20 backdrop-blur-sm rounded-2xl p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="text-white font-bold">
          Question {questionsAnswered + 1}/5
        </div>
        <div className="text-white font-bold">
          Score: {score}
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        {currentQuestion.question}
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {currentQuestion.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswerQuestion(index === currentQuestion.correct)}
            className="p-4 bg-white/30 hover:bg-white/50 rounded-xl font-bold text-white transition-all border-2 border-white/50"
          >
            {option}
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleQuit}
        className="w-full px-6 py-2 bg-red-400/50 text-white font-bold rounded-xl hover:bg-red-400/70 transition-all"
      >
        Quit Game
      </motion.button>
    </motion.div>
  )
}
