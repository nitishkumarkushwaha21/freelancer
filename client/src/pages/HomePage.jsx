import Hero from '../components/sections/Hero';
import MarqueeStrip from '../components/sections/MarqueeStrip';
import Services from '../components/sections/Services';
import FeaturedWork from '../components/sections/FeaturedWork';
import Process from '../components/sections/Process';
import About from '../components/sections/About';
import Pricing from '../components/sections/Pricing';
import Testimonials from '../components/sections/Testimonials';
import FAQ from '../components/sections/FAQ';
import HomeCTA from '../components/sections/HomeCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <Services />
      <FeaturedWork />
      <Process />
      <About />
      <Pricing />
      <Testimonials />
      <FAQ />
      <HomeCTA />
    </>
  );
}
