import { FeaturePage } from '@/components/FeaturePage'

export default function QuestsPage() {
  return (
    <FeaturePage
      title="Quests"
      description="Take on daily missions, collect rewards, and keep your streak going."
      emoji="🎯"
      accentClass="from-orange-500/20 to-amber-500/20"
      ctaLabel="Open the game hub"
      ctaHref="/games"
    />
  )
}
