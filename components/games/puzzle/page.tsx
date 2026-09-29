import Link from 'next/link'

const games = [
    {
        name: 'Sliding Puzzle',
        description: 'Rearrange the tiles and solve the board with minimum moves.',
        path: '/games/puzzle/sliding',
    },
    {
        name: 'Arrow Flow Maze',
        description: 'Navigate directional paths and find the correct flow.',
        path: '/games/puzzle/arrow-flow',
    },
]

export default function PuzzleGamesPage() {
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
                    Puzzle Arena
                </h1>

                <p className="text-gray-400 mt-2 mb-8">
                    Solve spatial challenges, navigate patterns and think several moves ahead.
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