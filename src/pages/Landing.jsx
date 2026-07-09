import PublicFooter from '../components/common/PublicFooter.jsx';
import PublicHeader from '../components/common/PublicHeader.jsx';
import Hero from '../components/landing/Hero.jsx';
import Stats from '../components/landing/Stats.jsx';
import WhyJMGym from '../components/landing/WhyJMGym.jsx';
import AppShowcase from '../components/landing/AppShowcase.jsx';
import Programas from '../components/landing/Programas.jsx';
import Servicios from '../components/landing/Servicios.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import Galeria from '../components/landing/Galeria.jsx';
import Testimonios from '../components/landing/Testimonios.jsx';
import FAQ from '../components/landing/FAQ.jsx';
import CTA from '../components/landing/CTA.jsx';

function Landing() {
  return (
    <main className="min-h-screen bg-[#07111f] text-primary-foreground">
      <PublicHeader />
      <Hero />
      <Stats />
      <WhyJMGym />
      <AppShowcase />
      <Programas />
      <Servicios />
      <HowItWorks />
      <Galeria />
      <Testimonios />
      <FAQ />
      <CTA />
      <PublicFooter />
    </main>
  );
}

export default Landing;
