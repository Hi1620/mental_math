'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import { GameHeader } from '../shared/GameHeader'
import { GameResults } from '../shared/GameResults'
interface Sequence {
    id: number
    title: string
    sequence: string
    question: string
    options: string[]
    correct: number
    explanation: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
}

const sequences: Sequence[] = [
    {
        id: 1,
        title: 'Double Up',
        sequence: '2 → 4 → 8 → 16 → ?',
        question: 'What number should replace the question mark?',
        options: ['24', '28', '32', '36'],
        correct: 2,
        explanation: 'Each number is multiplied by 2.',
        difficulty: 'Easy',
    },
    {
        id: 2,
        title: 'Square Numbers',
        sequence: '1 → 4 → 9 → 16 → ?',
        question: 'Identify the next number.',
        options: ['20', '25', '27', '30'],
        correct: 1,
        explanation:
            'These are consecutive square numbers: 1², 2², 3², 4², so the next is 5² = 25.',
        difficulty: 'Easy',
    },
    {
        id: 3,
        title: 'Increasing Steps',
        sequence: '3 → 6 → 10 → 15 → ?',
        question: 'What comes next?',
        options: ['19', '20', '21', '22'],
        correct: 2,
        explanation:
            'The differences are +3, +4, +5, so the next difference is +6. Therefore 15 + 6 = 21.',
        difficulty: 'Medium',
    },
    {
        id: 4,
        title: 'Alternating Pattern',
        sequence: '5 → 10 → 8 → 16 → 14 → ?',
        question: 'Which number continues the pattern?',
        options: ['20', '24', '28', '30'],
        correct: 1,
        explanation:
            'The pattern alternates ×2 and −2: 5×2=10, 10−2=8, 8×2=16, 16−2=14, 14×2=28.',
        difficulty: 'Medium',
    },
    {
        id: 5,
        title: 'Fibonacci',
        sequence: '1 → 1 → 2 → 3 → 5 → 8 → ?',
        question: 'What is the next number?',
        options: ['11', '12', '13', '15'],
        correct: 2,
        explanation:
            'Each number is the sum of the previous two numbers. 5 + 8 = 13.',
        difficulty: 'Easy',
    },
    {
        id: 6,
        title: 'Hidden Rule',
        sequence: '2 → 5 → 11 → 23 → 47 → ?',
        question: 'Find the next number.',
        options: ['91', '93', '95', '97'],
        correct: 2,
        explanation:
            'Each number is multiplied by 2 and then 1 is added: 47 × 2 + 1 = 95.',
        difficulty: 'Hard',
    },
    {
        id: 7,
        title: 'Cube Pattern',
        sequence: '1 → 8 → 27 → 64 → ?',
        question: 'Which number comes next?',
        options: ['100', '125', '144', '216'],
        correct: 1,
        explanation:
            'These are cube numbers: 1³, 2³, 3³, 4³, 5³ = 125.',
        difficulty: 'Medium',
    },
    {
        id: 8,
        title: 'Difference Ladder',
        sequence: '4 → 7 → 13 → 22 → 34 → ?',
        question: 'Complete the sequence.',
        options: ['46', '47', '48', '49'],
        correct: 2,
        explanation:
            'Differences are +3, +6, +9, +12. The next difference is +14? No — the pattern increases by 3, so it should be +15. Therefore 34 + 15 = 49.',
        difficulty: 'Hard',
    },
]

export function SequenceMaster() {
    const [current, setCurrent] = useState(0)
    const [score, setScore] = useState(0)
    const [selected, setSelected] = useState<number | null>(null)
    const [answered, setAnswered] = useState(false)
    const [timeLeft, setTimeLeft] = useState(240)
    const [showResults, setShowResults] = useState(false)

    const puzzle = sequences[current]

    const progress = useMemo(
        () => ((current + 1) / sequences.length) * 100,
        [current]
    )

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    setShowResults(true)
                    return 0
                }

                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const handleAnswer = (index: number) => {
        if (answered) return

        setSelected(index)
        setAnswered(true)

        if (index === puzzle.correct) {
            setScore(prev => prev + 100)
        }
    }

    const nextQuestion = () => {
        if (current < sequences.length - 1) {
            setCurrent(prev => prev + 1)
            setSelected(null)
            setAnswered(false)
        } else {
            setShowResults(true)
        }
    }

    const restart = () => {
        setCurrent(0)
        setScore(0)
        setSelected(null)
        setAnswered(false)
        setTimeLeft(240)
        setShowResults(false)
    }

    if (showResults) {
        const maxScore = sequences.length * 100
        const accuracy = Math.round((score / maxScore) * 100)

        return (
            <GameResults
                gameName="Sequence Master"
                gameType="logic"
                score={score}
                maxScore={maxScore}
                accuracy={accuracy}
                timeSpent={240 - timeLeft}
                totalTime={240}
                difficulty="Medium"
                xpEarned={Math.round(score * 0.75)}
            />
        )
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <div className="max-w-4xl mx-auto">

                <GameHeader
                    title="Sequence Master"
                    timeLeft={timeLeft}
                    score={score}
                    onQuit={() => setShowResults(true)}
                />

                {/* Progress */}
                <div className="gaming-card p-4 mb-5">

                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                            Pattern {current + 1} / {sequences.length}
                        </span>

                        <span className="text-gray-500">
                            {Math.round(progress)}%
                        </span>
                    </div>

                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                        <motion.div
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-neon"
                        />
                    </div>

                </div>

                {/* Main Card */}
                <motion.div
                    key={puzzle.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gaming-card p-5 md:p-8"
                >

                    {/* Title */}
                    <div className="flex items-center justify-between mb-6">

                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">
                                Pattern Analysis
                            </p>

                            <h2 className="text-lg md:text-xl font-semibold mt-1">
                                {puzzle.title}
                            </h2>
                        </div>

                        <span
                            className={`text-xs px-3 py-1 rounded-full border ${puzzle.difficulty === 'Hard'
                                    ? 'text-red-400 border-red-500/30 bg-red-500/10'
                                    : puzzle.difficulty === 'Medium'
                                        ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
                                        : 'text-green-400 border-green-500/30 bg-green-500/10'
                                }`}
                        >
                            {puzzle.difficulty}
                        </span>

                    </div>

                    {/* Sequence Display */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 mb-6">

                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 text-center">
                            Find the Pattern
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">

                            {puzzle.sequence.split('→').map((item, index) => {

                                const isLast = index === puzzle.sequence.split('→').length - 1

                                return (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-2 ${isLast ? 'text-neon' : 'text-white'
                                            }`}
                                    >

                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: index * 0.08 }}
                                            className={`min-w-[52px] h-12 px-3 rounded-lg border flex items-center justify-center font-semibold text-lg ${isLast
                                                    ? 'border-neon/50 bg-neon/10'
                                                    : 'border-white/10 bg-white/5'
                                                }`}
                                        >
                                            {item.trim()}
                                        </motion.div>

                                        {!isLast && (
                                            <span className="text-gray-600 text-lg">
                                                →
                                            </span>
                                        )}

                                    </div>
                                )
                            })}

                        </div>

                    </div>

                    {/* Question */}
                    <h3 className="text-base md:text-lg font-medium mb-5 text-center">
                        {puzzle.question}
                    </h3>

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-3">

                        {puzzle.options.map((option, index) => {

                            const correct = index === puzzle.correct
                            const selectedOption = index === selected

                            let style =
                                'border-white/10 bg-white/[0.03] hover:border-neon/50 hover:bg-white/[0.05]'

                            if (answered) {
                                if (correct) {
                                    style =
                                        'border-green-500/60 bg-green-500/10 text-green-300'
                                } else if (selectedOption) {
                                    style =
                                        'border-red-500/60 bg-red-500/10 text-red-300'
                                } else {
                                    style =
                                        'border-white/5 bg-white/[0.02] opacity-40'
                                }
                            }

                            return (
                                <motion.button
                                    key={option}
                                    whileHover={!answered ? { scale: 1.015 } : {}}
                                    whileTap={!answered ? { scale: 0.98 } : {}}
                                    onClick={() => handleAnswer(index)}
                                    disabled={answered}
                                    className={`min-h-[56px] rounded-xl border px-4 text-sm md:text-base font-semibold transition-all ${style}`}
                                >

                                    <div className="flex items-center justify-center gap-2">

                                        <span>{option}</span>

                                        {answered && correct && (
                                            <CheckCircle2
                                                size={17}
                                                className="text-green-400"
                                            />
                                        )}

                                        {answered && selectedOption && !correct && (
                                            <XCircle
                                                size={17}
                                                className="text-red-400"
                                            />
                                        )}

                                    </div>

                                </motion.button>
                            )
                        })}

                    </div>

                    {/* Explanation */}
                    {answered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-5"
                        >

                            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">

                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                    Pattern Explanation
                                </p>

                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {puzzle.explanation}
                                </p>

                            </div>

                            <div className="flex justify-end mt-4">

                                <button
                                    onClick={nextQuestion}
                                    className="gaming-button px-5 py-2.5 text-sm font-semibold text-black"
                                >
                                    {current === sequences.length - 1
                                        ? 'View Results'
                                        : 'Next Pattern'}
                                </button>

                            </div>

                        </motion.div>
                    )}

                </motion.div>

                {/* Restart */}
                <div className="flex justify-center mt-4">

                    <button
                        onClick={restart}
                        className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors"
                    >
                        <RotateCcw size={14} />
                        Restart Game
                    </button>

                </div>

            </div>
        </div>
    )
}