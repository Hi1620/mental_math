import { FeaturePage } from '@/components/FeaturePage'

export default function MorePage() {
  return (
    <FeaturePage
      title="More"
      description="Discover extra tools, shortcuts, and upcoming features in the Matiks universe."
      emoji="✨"
      accentClass="from-teal-500/20 to-emerald-500/20"
      ctaLabel="Jump into the action"
      ctaHref="/games"
    />
  )
}
