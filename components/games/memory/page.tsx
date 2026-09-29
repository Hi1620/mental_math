import Link from 'next/link'

const games = [
    {
        name: 'Memory Master',
        description: 'Classic visual memory challenge.',
        path: '/games/memory/basic',
    },
    {
        name: 'Memory Matrix',
        description: 'Remember positions and reproduce visual patterns.',
        path: '/games/memory/matrix',
    },
    {
        name: 'Memory Sequence',
        description: 'Remember sequences under increasing difficulty.',
        path: '/games/memory/memory-sequence',
    },
    {
        name: 'Sequence Recall',
        description: 'Recall information accurately under pressure.',
        path: '/games/memory/sequence-recall',
    },
]

export default function MemoryGamesPage() {
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
                    Memory Arena
                </h1>

                <p className="text-gray-400 mt-2 mb-8">
                    Strengthen visual memory, working memory and recall speed.
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