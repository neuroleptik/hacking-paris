import CTA from './components/cta';
import { FrequentlyAskedQuestions } from './components/faq';
import { Features } from './components/features';
import { Hero } from './components/hero';
import { SpotlightLogoCloud } from './components/logos-cloud';
import { Rewards } from './components/rewards';

export default function Home() {
  return (
    <div>
      <Hero />
      <SpotlightLogoCloud />
      <Rewards />
      <Features />
      <FrequentlyAskedQuestions />
      <CTA />
    </div>
  );
}
