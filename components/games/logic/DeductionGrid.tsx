'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Lightbulb, RotateCcw, XCircle } from 'lucide-react'
import { GameHeader } from '../shared/GameHeader'
import { GameResults } from '../shared/GameResults'
interface Puzzle {
    id: number
    title: string
    scenario: string
    question: string
    options: string[]
    correct: number
    explanation: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
}

const puzzles: Puzzle[] = [
    {
        id: 1,
        title: 'The Office Meeting',
        scenario:
            'Four employees — Alex, Ben, Chris and Diana — each attend a meeting on a different day from Monday to Thursday.',
        question:
            'Alex is before Chris. Ben is immediately after Diana. If Diana attends on Monday, who attends on Wednesday?',
        options: ['Alex', 'Ben', 'Chris', 'Diana'],
        correct: 0,
        explanation:
            'Diana is Monday, so Ben is Tuesday. Alex must be before Chris, leaving Alex Wednesday and Chris Thursday.',
        difficulty: 'Easy',
    },
    {
        id: 2,
        title: 'The Missing Number',
        scenario:
            'A sequence follows a hidden rule. Each number is generated from the previous number.',
        question: '3, 6, 12, 24, ?',
        options: ['36', '42', '48', '54'],
        correct: 2,
        explanation: 'Each value is multiplied by 2: 3 → 6 → 12 → 24 → 48.',
        difficulty: 'Easy',
    },
    {
        id: 3,
        title: 'Three Boxes',
        scenario:
            'There are three boxes labelled Red, Blue and Green. Only one contains a prize.',
        question:
            'The Red box says "The prize is not here." The Blue box says "The prize is in the Red box." Exactly one statement is true. Where is the prize?',
        options: ['Red', 'Blue', 'Green', 'Cannot determine'],
        correct: 2,
        explanation:
            'If the prize is Green, Red is telling the truth and Blue is lying. Therefore exactly one statement is true.',
        difficulty: 'Medium',
    },
    {
        id: 4,
        title: 'Ranking Challenge',
        scenario:
            'Four players — A, B, C and D — finish a race.',
        question:
            'A finishes before B. C finishes after B. D finishes before A. Who must finish first?',
        options: ['A', 'B', 'C', 'D'],
        correct: 3,
        explanation:
            'The ordering must be D → A → B → C, so D must finish first.',
        difficulty: 'Medium',
    },
    {
        id: 5,
        title: 'The Code',
        scenario:
            'A four-digit security code follows a logical pattern.',
        question:
            'If 2468 becomes 8642 by reversing the digits, what does 1357 become?',
        options: ['7531', '7513', '5731', '7351'],
        correct: 0,
        explanation: 'The digits are simply reversed: 1-3-5-7 becomes 7-5-3-1.',
        difficulty: 'Easy',
    },
    {
        id: 6,
        title: 'Advanced Ordering',
        scenario:
            'Five tasks A, B, C, D and E must be completed in order.',
        question:
            'A must occur before C. B must occur after D. E must occur before A. Which task could be first?',
        options: ['A', 'B', 'C', 'E'],
        correct: 3,
        explanation:
            'E can be first because E → A → C is valid, while B must follow D.',
        difficulty: 'Hard',
    },
]

export function DeductionGrid() {
    const [current, setCurrent] = useState(0)
    const [score, setScore] = useState(0)
    const [selected, setSelected] = useState<number | null>(null)
    const [answered, setAnswered] = useState(false)
    const [timeLeft, setTimeLeft] = useState(240)
    const [showResults, setShowResults] = useState(false)

    const puzzle = puzzles[current]

    const progress = useMemo(
        () => ((current + 1) / puzzles.length) * 100,
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

    const nextPuzzle = () => {
        if (current < puzzles.length - 1) {
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
        const maxScore = puzzles.length * 100
        const accuracy = Math.round((score / maxScore) * 100)

        return (
            <GameResults
                gameName="Deduction Grid"
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
                    title="Deduction Grid"
                    timeLeft={timeLeft}
                    score={score}
                    onQuit={() => setShowResults(true)}
                />

                {/* Game information */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gaming-card p-4 mb-5"
                >
                    <div className="flex items-center justify-between gap-4">

                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">
                                Logic Challenge
                            </p>

                            <h2 className="text-lg md:text-xl font-semibold mt-1">
                                {puzzle.title}
                            </h2>
                        </div>

                        <span
                            className={`text-xs px-3 py-1 rounded-full border ${puzzle.difficulty === 'Hard'
                                    ? 'border-red-500/40 text-red-400 bg-red-500/10'
                                    : puzzle.difficulty === 'Medium'
                                        ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10'
                                        : 'border-green-500/40 text-green-400 bg-green-500/10'
                                }`}
                        >
                            {puzzle.difficulty}
                        </span>

                    </div>

                    <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-neon"
                        />
                    </div>

                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>
                            Challenge {current + 1} / {puzzles.length}
                        </span>

                        <span>
                            {Math.round(progress)}%
                        </span>
                    </div>
                </motion.div>

                {/* Scenario */}
                <motion.div
                    key={puzzle.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gaming-card p-5 md:p-7"
                >

                    <div className="flex gap-3 mb-5">
                        <div className="w-9 h-9 shrink-0 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <Lightbulb size={18} className="text-purple-400" />
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                Scenario
                            </p>

                            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                                {puzzle.scenario}
                            </p>
                        </div>
                    </div>

                    {/* Question */}
                    <div className="mb-6">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                            Your Task
                        </p>

                        <h3 className="text-lg md:text-xl font-semibold leading-relaxed">
                            {puzzle.question}
                        </h3>
                    </div>

                    {/* Answers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                        {puzzle.options.map((option, index) => {

                            const isCorrect = index === puzzle.correct
                            const isSelected = index === selected

                            let answerClass =
                                'border-white/10 bg-white/[0.03] hover:border-neon/50 hover:bg-white/[0.05]'

                            if (answered) {
                                if (isCorrect) {
                                    answerClass =
                                        'border-green-500/60 bg-green-500/10 text-green-300'
                                } else if (isSelected) {
                                    answerClass =
                                        'border-red-500/60 bg-red-500/10 text-red-300'
                                } else {
                                    answerClass =
                                        'border-white/5 bg-white/[0.02] opacity-50'
                                }
                            }

                            return (
                                <motion.button
                                    key={option}
                                    whileHover={!answered ? { scale: 1.01 } : {}}
                                    whileTap={!answered ? { scale: 0.98 } : {}}
                                    onClick={() => handleAnswer(index)}
                                    disabled={answered}
                                    className={`min-h-[58px] px-4 py-3 rounded-xl border text-left transition-all ${answerClass}`}
                                >
                                    <div className="flex items-center gap-3">

                                        <span className="w-7 h-7 shrink-0 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold">
                                            {String.fromCharCode(65 + index)}
                                        </span>

                                        <span className="text-sm md:text-base font-medium">
                                            {option}
                                        </span>

                                        {answered && isCorrect && (
                                            <CheckCircle2
                                                size={18}
                                                className="ml-auto text-green-400"
                                            />
                                        )}

                                        {answered && isSelected && !isCorrect && (
                                            <XCircle
                                                size={18}
                                                className="ml-auto text-red-400"
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
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-5"
                        >

                            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">

                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                                    Reasoning
                                </p>

                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {puzzle.explanation}
                                </p>

                            </div>

                            <div className="flex justify-end mt-4">

                                <button
                                    onClick={nextPuzzle}
                                    className="gaming-button px-5 py-2.5 text-sm font-semibold text-black"
                                >
                                    {current === puzzles.length - 1
                                        ? 'View Results'
                                        : 'Next Challenge'}
                                </button>

                            </div>

                        </motion.div>
                    )}

                </motion.div>

                {/* Reset */}
                <div className="flex justify-center mt-4">

                    <button
                        onClick={restart}
                        className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors"
                    >
                        <RotateCcw size={14} />
                        Restart Challenge
                    </button>

                </div>

            </div>
        </div>
    )
}