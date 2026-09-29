'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
    Check,
    Lightbulb,
    RotateCcw,
    Target,
    X,
    Zap,
} from 'lucide-react'
import { GameHeader } from '../shared/GameHeader'
import { GameResults } from '../shared/GameResults'

interface RuleChallenge {
    id: number
    title: string
    instruction: string
    examples: {
        input: string
        output: string
    }[]
    options: string[]
    correct: number
    explanation: string
}

const challenges: RuleChallenge[] = [
    {
        id: 1,
        title: 'Number Filter',
        instruction:
            'Study the examples. Find the hidden rule and choose what the rule produces for the final input.',
        examples: [
            { input: '2 → 6', output: 'YES' },
            { input: '4 → 12', output: 'YES' },
            { input: '7 → 21', output: 'YES' },
            { input: '5 → 11', output: 'NO' },
        ],
        options: ['YES', 'NO'],
        correct: 0,
        explanation:
            'The hidden rule is multiplication by 3. 2×3=6, 4×3=12 and 7×3=21.',
    },

    {
        id: 2,
        title: 'Shape Logic',
        instruction:
            'The system accepts shapes according to a hidden rule. Determine whether the new shape should be accepted.',
        examples: [
            { input: 'Triangle — 3 sides', output: 'ACCEPT' },
            { input: 'Square — 4 sides', output: 'ACCEPT' },
            { input: 'Pentagon — 5 sides', output: 'ACCEPT' },
            { input: 'Circle — 0 sides', output: 'REJECT' },
        ],
        options: ['ACCEPT', 'REJECT'],
        correct: 0,
        explanation:
            'The rule accepts closed polygons with straight sides. A triangle, square and pentagon satisfy it.',
    },

    {
        id: 3,
        title: 'Sequence Rule',
        instruction:
            'Find the transformation used by the examples and apply it to the target.',
        examples: [
            { input: '3 → 10', output: 'RULE' },
            { input: '4 → 17', output: 'RULE' },
            { input: '5 → 26', output: 'RULE' },
            { input: '6 → ?', output: 'TARGET' },
        ],
        options: ['31', '36', '37', '42'],
        correct: 2,
        explanation:
            'The rule is n² + 1. 3²+1=10, 4²+1=17, 5²+1=26, therefore 6²+1=37.',
    },

    {
        id: 4,
        title: 'Odd Rule',
        instruction:
            'Identify which item violates the hidden classification rule.',
        examples: [
            { input: 'Apple', output: 'FRUIT' },
            { input: 'Mango', output: 'FRUIT' },
            { input: 'Banana', output: 'FRUIT' },
            { input: 'Carrot', output: 'TARGET' },
        ],
        options: ['Apple', 'Mango', 'Banana', 'Carrot'],
        correct: 3,
        explanation:
            'Apple, mango and banana are fruits. Carrot is classified as a vegetable.',
    },

    {
        id: 5,
        title: 'Binary Pattern',
        instruction:
            'Observe how each binary value is transformed.',
        examples: [
            { input: '101', output: '5' },
            { input: '110', output: '6' },
            { input: '111', output: '7' },
            { input: '1000', output: '?' },
        ],
        options: ['6', '7', '8', '9'],
        correct: 2,
        explanation:
            'The binary values are converted to decimal. 1000 in binary equals 8.',
    },

    {
        id: 6,
        title: 'Letter Movement',
        instruction:
            'Discover how the first letter changes into the second.',
        examples: [
            { input: 'A → D', output: '+3' },
            { input: 'B → E', output: '+3' },
            { input: 'C → F', output: '+3' },
            { input: 'G → ?', output: 'TARGET' },
        ],
        options: ['H', 'I', 'J', 'K'],
        correct: 2,
        explanation:
            'Each letter moves forward by 3 positions. G → H → I → J.',
    },
]

export function RuleBreaker() {
    const [current, setCurrent] = useState(0)
    const [selected, setSelected] = useState<number | null>(null)
    const [score, setScore] = useState(0)
    const [correctAnswers, setCorrectAnswers] = useState(0)
    const [streak, setStreak] = useState(0)
    const [bestStreak, setBestStreak] = useState(0)
    const [hints, setHints] = useState(2)
    const [timeLeft, setTimeLeft] = useState(180)
    const [showResults, setShowResults] = useState(false)
    const [locked, setLocked] = useState(false)

    const challenge = challenges[current]

    const progress = useMemo(() => {
        return Math.round(((current + 1) / challenges.length) * 100)
    }, [current])

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
        if (locked) return

        setSelected(index)
        setLocked(true)

        const isCorrect = index === challenge.correct

        if (isCorrect) {
            const speedBonus = Math.min(timeLeft, 30)
            const streakBonus = streak * 5
            const earned = 15 + speedBonus + streakBonus

            setScore(prev => prev + earned)
            setCorrectAnswers(prev => prev + 1)

            setStreak(prev => {
                const next = prev + 1
                setBestStreak(best => Math.max(best, next))
                return next
            })
        } else {
            setStreak(0)
        }
    }

    const nextChallenge = () => {
        if (current >= challenges.length - 1) {
            setShowResults(true)
            return
        }

        setCurrent(prev => prev + 1)
        setSelected(null)
        setLocked(false)
    }

    const useHint = () => {
        if (hints <= 0 || locked) return

        setHints(prev => prev - 1)

        const wrongOptions = challenge.options
            .map((_, index) => index)
            .filter(index => index !== challenge.correct)

        const removeCount = Math.min(1, wrongOptions.length)

        if (removeCount > 0) {
            const optionToRemove = wrongOptions[0]

            const element = document.querySelector(
                `[data-option="${optionToRemove}"]`
            )

            if (element) {
                element.classList.add('opacity-20')
            }
        }
    }

    const resetGame = () => {
        setCurrent(0)
        setSelected(null)
        setScore(0)
        setCorrectAnswers(0)
        setStreak(0)
        setBestStreak(0)
        setHints(2)
        setTimeLeft(180)
        setShowResults(false)
        setLocked(false)
    }

    if (showResults) {
        return (
            <GameResults
                gameName="Rule Breaker"
                gameType="logic"
                score={score}
                maxScore={challenges.length * 50}
                accuracy={Math.round(
                    (correctAnswers / challenges.length) * 100
                )}
                timeSpent={180 - timeLeft}
                totalTime={180}
                difficulty="Adaptive"
                xpEarned={correctAnswers * 30 + bestStreak * 10}
            />
        )
    }

    return (
        <div className="min-h-screen bg-background px-4 py-5 md:px-6">
            <div className="max-w-5xl mx-auto">

                <GameHeader
                    title="Rule Breaker"
                    timeLeft={timeLeft}
                    score={score}
                    onQuit={() => setShowResults(true)}
                />

                {/* Compact Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">

                    <div className="gaming-card p-3 text-center">
                        <p className="text-[11px] text-gray-400">
                            CHALLENGE
                        </p>
                        <p className="text-lg font-bold text-neon">
                            {current + 1}/{challenges.length}
                        </p>
                    </div>

                    <div className="gaming-card p-3 text-center">
                        <p className="text-[11px] text-gray-400">
                            ACCURACY
                        </p>
                        <p className="text-lg font-bold">
                            {Math.round(
                                (correctAnswers / Math.max(current, 1)) * 100
                            ) || 0}
                            %
                        </p>
                    </div>

                    <div className="gaming-card p-3 text-center">
                        <p className="text-[11px] text-gray-400">
                            STREAK
                        </p>
                        <p className="text-lg font-bold text-yellow-400">
                            {streak}
                        </p>
                    </div>

                    <div className="gaming-card p-3 text-center">
                        <p className="text-[11px] text-gray-400">
                            HINTS
                        </p>
                        <p className="text-lg font-bold text-purple-400">
                            {hints}
                        </p>
                    </div>

                </div>

                {/* Progress */}
                <div className="mb-5">
                    <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-400">
                            Rule discovery progress
                        </span>

                        <span className="text-xs text-neon font-semibold">
                            {progress}%
                        </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-neon"
                        />
                    </div>
                </div>

                {/* Main Game */}
                <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gaming-card p-5 md:p-7"
                >

                    {/* Challenge Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Target
                                    size={17}
                                    className="text-neon"
                                />

                                <span className="text-xs text-neon font-semibold uppercase tracking-wider">
                                    Hidden Rule
                                </span>
                            </div>

                            <h2 className="text-xl md:text-2xl font-bold">
                                {challenge.title}
                            </h2>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Zap
                                size={14}
                                className="text-yellow-400"
                            />
                            Speed affects score
                        </div>

                    </div>

                    <p className="text-sm text-gray-400 mb-6 max-w-3xl">
                        {challenge.instruction}
                    </p>

                    {/* Examples */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-7">

                        {challenge.examples.map((example, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.06 }}
                                className={`
                  rounded-xl border p-4
                  ${example.output === 'TARGET'
                                        ? 'border-yellow-400/30 bg-yellow-400/5'
                                        : 'border-white/10 bg-white/[0.03]'
                                    }
                `}
                            >

                                <div className="flex items-center justify-between gap-3">

                                    <span className="text-sm font-semibold">
                                        {example.input}
                                    </span>

                                    <span
                                        className={`
                      text-[11px] font-bold px-2 py-1 rounded-md
                      ${example.output === 'TARGET'
                                                ? 'text-yellow-400 bg-yellow-400/10'
                                                : 'text-neon bg-neon/10'
                                            }
                    `}
                                    >
                                        {example.output}
                                    </span>

                                </div>

                            </motion.div>
                        ))}

                    </div>

                    {/* Options */}
                    <div className="mb-5">

                        <p className="text-xs text-gray-400 mb-3">
                            YOUR PREDICTION
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                            {challenge.options.map((option, index) => {

                                const isCorrect =
                                    index === challenge.correct

                                const isSelected =
                                    selected === index

                                let className =
                                    'border-white/15 bg-white/[0.03] hover:border-neon/50 hover:bg-white/[0.06]'

                                if (locked && isCorrect) {
                                    className =
                                        'border-green-500 bg-green-500/15 text-green-400'
                                }

                                if (
                                    locked &&
                                    isSelected &&
                                    !isCorrect
                                ) {
                                    className =
                                        'border-red-500 bg-red-500/15 text-red-400'
                                }

                                return (
                                    <motion.button
                                        key={index}
                                        data-option={index}
                                        whileHover={{
                                            scale: locked ? 1 : 1.02,
                                        }}
                                        whileTap={{
                                            scale: locked ? 1 : 0.98,
                                        }}
                                        onClick={() => handleAnswer(index)}
                                        disabled={locked}
                                        className={`
                      relative p-4 rounded-xl border
                      transition-all text-sm font-semibold
                      ${className}
                    `}
                                    >

                                        <span className="flex items-center justify-between">

                                            <span>
                                                {option}
                                            </span>

                                            {locked && isCorrect && (
                                                <Check size={17} />
                                            )}

                                            {locked &&
                                                isSelected &&
                                                !isCorrect && (
                                                    <X size={17} />
                                                )}

                                        </span>

                                    </motion.button>
                                )
                            })}

                        </div>

                    </div>

                    {/* Result */}
                    {locked && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 8,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className={`
                rounded-xl border p-4 mb-5
                ${selected === challenge.correct
                                    ? 'border-green-500/30 bg-green-500/10'
                                    : 'border-red-500/30 bg-red-500/10'
                                }
              `}
                        >

                            <div className="flex items-start gap-3">

                                {selected === challenge.correct ? (
                                    <Check
                                        size={18}
                                        className="text-green-400 mt-0.5"
                                    />
                                ) : (
                                    <X
                                        size={18}
                                        className="text-red-400 mt-0.5"
                                    />
                                )}

                                <div>

                                    <p
                                        className={`text-sm font-semibold mb-1 ${selected === challenge.correct
                                                ? 'text-green-400'
                                                : 'text-red-400'
                                            }`}
                                    >
                                        {selected === challenge.correct
                                            ? 'Correct rule detected'
                                            : 'Rule mismatch'}
                                    </p>

                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        {challenge.explanation}
                                    </p>

                                </div>

                            </div>

                        </motion.div>
                    )}

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3">

                        <button
                            onClick={useHint}
                            disabled={hints <= 0 || locked}
                            className="px-4 py-2.5 rounded-lg border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold flex items-center justify-center gap-2"
                        >
                            <Lightbulb size={16} />
                            Hint ({hints})
                        </button>

                        {locked ? (
                            <button
                                onClick={nextChallenge}
                                className="gaming-button px-5 py-2.5 rounded-lg text-sm font-semibold"
                            >
                                {current === challenges.length - 1
                                    ? 'Finish Game'
                                    : 'Next Rule'}
                            </button>
                        ) : (
                            <div className="text-xs text-gray-500 flex items-center">
                                Analyze the examples before answering.
                            </div>
                        )}

                    </div>

                </motion.div>

                {/* Footer */}
                <div className="flex justify-center mt-5">

                    <button
                        onClick={resetGame}
                        className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <RotateCcw size={13} />
                        Restart challenge
                    </button>

                </div>

            </div>
        </div>
    )
}