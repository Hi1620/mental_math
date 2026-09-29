import Link from 'next/link'

const games = [
    {
        name: 'Math Challenge',
        description: 'Test calculation accuracy, numerical reasoning and problem solving.',
        path: '/games/math/basic',
    },
    {
        name: 'Equation Master',
        description: 'Solve equations under time pressure and maintain your accuracy streak.',
        path: '/games/math/equation-master',
    },
    {
        name: 'Mental Math Sprint',
        description: 'Perform rapid calculations and improve your mental arithmetic speed.',
        path: '/games/math/mental-math-sprint',
    },
    {
        name: 'Number Sequence',
        description: 'Identify numerical patterns and predict what comes next.',
        path: '/games/math/number-sequence',
    },
]

export default function MathGamesPage() {
    return (
        <main className="min-h-screen bg-background px-4 py-6 sm:px-6">
            <div className="max-w-6xl mx-auto">

                <div className="mb-8">
                    <Link
                        href="/"
                        className="text-sm text-gray-400 hover:text-neon transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>

                    <div className="mt-5">
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            Math Arena
                        </h1>

                        <p className="text-sm text-gray-400 mt-2 max-w-2xl">
                            Challenge your calculation speed, accuracy and numerical reasoning.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {games.map((game, index) => (
                        <Link
                            key={game.path}
                            href={game.path}
                            className="gaming-card p-5 sm:p-6 hover:border-neon/50 hover:bg-white/[0.03] transition-all group"
                        >
                            <div className="flex items-start justify-between gap-4">

                                <div>
                                    <span className="text-xs text-gray-500">
                                        GAME {String(index + 1).padStart(2, '0')}
                                    </span>

                                    <h2 className="text-lg sm:text-xl font-semibold mt-1 group-hover:text-neon transition-colors">
                                        {game.name}
                                    </h2>

                                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                                        {game.description}
                                    </p>
                                </div>

                                <div className="text-neon text-lg opacity-60 group-hover:opacity-100 transition-opacity">
                                    →
                                </div>

                            </div>

                            <div className="mt-5 text-xs text-neon font-semibold">
                                START GAME
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </main>
    )
}