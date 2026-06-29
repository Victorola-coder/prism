import { Hero } from "@/components/home/hero"
import { FeaturesGrid } from "@/components/home/features-grid"
import { TrendingList } from "@/components/home/trending-list"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturesGrid />
      <TrendingList />
    </div>
  )
}
