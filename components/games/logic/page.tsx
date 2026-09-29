import Link from 'next/link'

const games = [
    {
        name: 'Logic Puzzle',
        description: 'Test deduction, reasoning and logical thinking.',
        path: '/games/logic/basic',
    },
    {
        name: 'Deduction Grid',
        description: 'Solve complex deduction problems using logical clues.',
        path: '/games/logic/deduction-grid',
    },
    {
        name: 'Rule Breaker',
        description: 'Discover hidden rules and identify logical exceptions.',
        path: '/games/logic/rule-breaker',
    },
    {
        name: 'Sequence Master',
        description: 'Detect patterns and predict what comes next.',
        path: '/games/logic/sequence-master',
    },
]

export default function LogicGamesPage() {
    return (
        <main className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto">

                <Link
                    href="/"
                    className="text-sm text-gray-400 hover:text-neon"
                >
                    ← Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold mt-4">
                    Logic Arena
                </h1>

                <p className="text-gray-400 mt-2 mb-8">
                    Train deduction, reasoning, pattern recognition and decision making.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {games.map((game) => (
                        <Link
                            key={game.path}
                            href={game.path}
                            className="gaming-card p-6 hover:border-neon/50 transition-all group"
                        >
                            <h2 className="text-xl font-semibold group-hover:text-neon">
                                {game.name}
                            </h2>

                            <p className="text-sm text-gray-400 mt-2">
                                {game.description}
                            </p>

                            <div className="mt-5 text-sm text-neon font-semibold">
                                Start Game →
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </main>
    )
}