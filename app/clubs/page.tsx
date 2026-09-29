import { FeaturePage } from '@/components/FeaturePage'

export default function ClubsPage() {
  return (
    <FeaturePage
      title="Clubs"
      description="Join community clubs, unlock events, and connect with players who share your interests."
      emoji="🪩"
      accentClass="from-indigo-500/20 to-violet-500/20"
      ctaLabel="Start exploring"
      ctaHref="/games"
    />
  )
}
