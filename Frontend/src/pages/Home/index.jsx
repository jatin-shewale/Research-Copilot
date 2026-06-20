import HeroSection from './sections/HeroSection'
import FeatureShowcase from './sections/FeatureShowcase'
import HowItWorks from './sections/HowItWorks'
import AgentsSection from './sections/AgentsSection'
import PreviewShowcase from './sections/PreviewShowcase'
import FAQSection from './sections/FAQSection'
import CTASection from './sections/CTASection'
import PageTransition from '../../components/layout/PageTransition'

export default function HomePage() {
  return (
    <PageTransition>
      <HeroSection />
      <FeatureShowcase />
      <HowItWorks />
      <AgentsSection />
      <PreviewShowcase />
      <FAQSection />
      <CTASection />
    </PageTransition>
  )
}
