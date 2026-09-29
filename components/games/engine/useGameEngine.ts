'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Difficulty, GameMetrics, GameType } from './gameTypes'

interface UseGameEngineOptions {
    gameType: GameType
    totalQuestions: number
    totalTime: number
    difficulty?: Difficulty
}

interface AnswerRecord {
    questionIndex: number
    correct: boolean
    responseTime: number
    difficulty: Difficulty
}

export function useGameEngine({
    gameType,
    totalQuestions,
    totalTime,
    difficulty = 'adaptive',
}: UseGameEngineOptions) {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(totalTime)

    const [questionsAnswered, setQuestionsAnswered] = useState(0)
    const [correctAnswers, setCorrectAnswers] = useState(0)

    const [streak, setStreak] = useState(0)
    const [bestStreak, setBestStreak] = useState(0)

    const [isFinished, setIsFinished] = useState(false)
    const [isPaused, setIsPaused] = useState(false)

    const [answers, setAnswers] = useState<AnswerRecord[]>([])

    const questionStartTime = useRef(Date.now())

    /*
     * ----------------------------------------
     * TIMER
     * ----------------------------------------
     */

    useEffect(() => {
        if (isFinished || isPaused) return

        const timer = setInterval(() => {
            setTimeLeft(previous => {
                if (previous <= 1) {
                    clearInterval(timer)
                    setIsFinished(true)
                    return 0
                }

                return previous - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isFinished, isPaused])

    /*
     * ----------------------------------------
     * CURRENT QUESTION TIMER
     * ----------------------------------------
     */

    const resetQuestionTimer = useCallback(() => {
        questionStartTime.current = Date.now()
    }, [])

    /*
     * ----------------------------------------
     * ANSWER HANDLING
     * ----------------------------------------
     */

    const submitAnswer = useCallback(
        (correct: boolean) => {
            if (isFinished) return

            const responseTime = Math.max(
                0,
                (Date.now() - questionStartTime.current) / 1000
            )

            const nextStreak = correct ? streak + 1 : 0

            setQuestionsAnswered(previous => previous + 1)

            if (correct) {
                setCorrectAnswers(previous => previous + 1)
                setStreak(nextStreak)

                if (nextStreak > bestStreak) {
                    setBestStreak(nextStreak)
                }

                /*
                 * Professional scoring system:
                 *
                 * Base points
                 * + speed bonus
                 * + streak bonus
                 */

                const baseScore = 10

                const speedBonus =
                    responseTime <= 3
                        ? 5
                        : responseTime <= 6
                            ? 3
                            : 1

                const streakBonus = Math.min(nextStreak * 2, 20)

                const earnedPoints =
                    baseScore + speedBonus + streakBonus

                setScore(previous => previous + earnedPoints)
            } else {
                setStreak(0)
            }

            setAnswers(previous => [
                ...previous,
                {
                    questionIndex: currentQuestion,
                    correct,
                    responseTime,
                    difficulty,
                },
            ])
        },
        [
            currentQuestion,
            difficulty,
            isFinished,
            streak,
            bestStreak,
        ]
    )

    /*
     * ----------------------------------------
     * NEXT QUESTION
     * ----------------------------------------
     */

    const nextQuestion = useCallback(() => {
        if (currentQuestion >= totalQuestions - 1) {
            setIsFinished(true)
            return
        }

        setCurrentQuestion(previous => previous + 1)
        resetQuestionTimer()
    }, [
        currentQuestion,
        totalQuestions,
        resetQuestionTimer,
    ])

    /*
     * ----------------------------------------
     * PREVIOUS QUESTION
     * ----------------------------------------
     */

    const previousQuestion = useCallback(() => {
        if (currentQuestion <= 0) return

        setCurrentQuestion(previous => previous - 1)
        resetQuestionTimer()
    }, [
        currentQuestion,
        resetQuestionTimer,
    ])

    /*
     * ----------------------------------------
     * PAUSE / RESUME
     * ----------------------------------------
     */

    const togglePause = useCallback(() => {
        setIsPaused(previous => !previous)
    }, [])

    /*
     * ----------------------------------------
     * FINISH GAME
     * ----------------------------------------
     */

    const finishGame = useCallback(() => {
        setIsFinished(true)
    }, [])

    /*
     * ----------------------------------------
     * ACCURACY
     * ----------------------------------------
     */

    const accuracy = useMemo(() => {
        if (questionsAnswered === 0) return 0

        return Math.round(
            (correctAnswers / questionsAnswered) * 100
        )
    }, [questionsAnswered, correctAnswers])

    /*
     * ----------------------------------------
     * PERFORMANCE SCORE
     * ----------------------------------------
     */

    const performanceScore = useMemo(() => {
        const accuracyScore = accuracy

        const speedRatio =
            totalTime > 0
                ? ((totalTime - timeLeft) / totalTime) * 100
                : 0

        const streakScore = Math.min(bestStreak * 5, 25)

        return Math.round(
            accuracyScore * 0.65 +
            speedRatio * 0.10 +
            streakScore * 0.25
        )
    }, [
        accuracy,
        totalTime,
        timeLeft,
        bestStreak,
    ])

    /*
     * ----------------------------------------
     * FINAL METRICS
     * ----------------------------------------
     */

    const metrics: GameMetrics = useMemo(
        () => ({
            score,
            accuracy,
            timeSpent: totalTime - timeLeft,
            totalTime,
            questionsAnswered,
            correctAnswers,
            streak,
            bestStreak,
            difficulty,
        }),
        [
            score,
            accuracy,
            totalTime,
            timeLeft,
            questionsAnswered,
            correctAnswers,
            streak,
            bestStreak,
            difficulty,
        ]
    )

    return {
        gameType,

        currentQuestion,

        score,
        accuracy,

        timeLeft,
        timeSpent: totalTime - timeLeft,

        questionsAnswered,
        correctAnswers,

        streak,
        bestStreak,

        performanceScore,

        isFinished,
        isPaused,

        answers,
        metrics,

        submitAnswer,
        nextQuestion,
        previousQuestion,

        togglePause,
        finishGame,

        resetQuestionTimer,
    }
}