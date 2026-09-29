import type { Difficulty } from './gameTypes'

export interface DifficultyConfig {
    label: string
    level: number

    // How difficult the generated question/task should be
    complexity: number

    // Time allowed per question
    timeMultiplier: number

    // Score multiplier
    scoreMultiplier: number

    // How aggressively adaptive difficulty changes
    adaptationRate: number
}

export const DIFFICULTY_CONFIG: Record<
    Exclude<Difficulty, 'adaptive'>,
    DifficultyConfig
> = {
    easy: {
        label: 'Easy',
        level: 1,
        complexity: 0.25,
        timeMultiplier: 1.35,
        scoreMultiplier: 0.8,
        adaptationRate: 0.15,
    },

    medium: {
        label: 'Medium',
        level: 2,
        complexity: 0.5,
        timeMultiplier: 1,
        scoreMultiplier: 1,
        adaptationRate: 0.2,
    },

    hard: {
        label: 'Hard',
        level: 3,
        complexity: 0.75,
        timeMultiplier: 0.8,
        scoreMultiplier: 1.25,
        adaptationRate: 0.25,
    },

    expert: {
        label: 'Expert',
        level: 4,
        complexity: 1,
        timeMultiplier: 0.65,
        scoreMultiplier: 1.5,
        adaptationRate: 0.3,
    },
}

/**
 * Returns the configuration for a fixed difficulty.
 */
export function getDifficultyConfig(
    difficulty: Exclude<Difficulty, 'adaptive'>
): DifficultyConfig {
    return DIFFICULTY_CONFIG[difficulty]
}

/**
 * Converts a difficulty into a numeric level.
 *
 * Easy    = 1
 * Medium  = 2
 * Hard    = 3
 * Expert  = 4
 */
export function getDifficultyLevel(
    difficulty: Difficulty
): number {
    if (difficulty === 'adaptive') {
        return 2
    }

    return DIFFICULTY_CONFIG[difficulty].level
}

/**
 * Determines the next difficulty based on player performance.
 *
 * High performance  → increase difficulty
 * Low performance   → decrease difficulty
 * Normal performance → keep difficulty
 */
export function getAdaptiveDifficulty(
    currentDifficulty: Difficulty,
    accuracy: number,
    averageResponseTime: number
): Exclude<Difficulty, 'adaptive'> {
    let currentLevel = getDifficultyLevel(currentDifficulty)

    /*
     * Performance score combines:
     *
     * 70% accuracy
     * 30% response speed
     */
    const speedScore =
        averageResponseTime <= 3
            ? 100
            : averageResponseTime <= 5
                ? 80
                : averageResponseTime <= 8
                    ? 60
                    : 40

    const performance =
        accuracy * 0.7 +
        speedScore * 0.3

    /*
     * Increase difficulty when the player
     * consistently performs strongly.
     */
    if (performance >= 85) {
        currentLevel += 1
    }

    /*
     * Decrease difficulty when performance
     * drops significantly.
     */
    if (performance < 55) {
        currentLevel -= 1
    }

    currentLevel = Math.max(
        1,
        Math.min(4, currentLevel)
    )

    const levels: Exclude<Difficulty, 'adaptive'>[] = [
        'easy',
        'medium',
        'hard',
        'expert',
    ]

    return levels[currentLevel - 1]
}

/**
 * Returns a difficulty label suitable for the UI.
 */
export function getDifficultyLabel(
    difficulty: Difficulty
): string {
    if (difficulty === 'adaptive') {
        return 'Adaptive'
    }

    return DIFFICULTY_CONFIG[difficulty].label
}

/**
 * Returns a human-readable description.
 */
export function getDifficultyDescription(
    difficulty: Difficulty
): string {
    switch (difficulty) {
        case 'easy':
            return 'Build confidence with lower cognitive load.'

        case 'medium':
            return 'Balanced challenge for consistent performance.'

        case 'hard':
            return 'Higher cognitive load with tighter constraints.'

        case 'expert':
            return 'Maximum challenge for advanced players.'

        case 'adaptive':
            return 'Difficulty automatically adjusts to your performance.'

        default:
            return 'Adaptive cognitive challenge.'
    }
}