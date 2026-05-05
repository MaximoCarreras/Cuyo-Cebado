/**
 * App — Root component assembling all 16 sections.
 * Renders sections in the exact order specified. [SF][CA]
 */
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import TrustBar from './components/TrustBar/TrustBar';
import SpecialOffer from './components/SpecialOffer/SpecialOffer';
import Categories from './components/Categories/Categories';
import BestSellers from './components/BestSellers/BestSellers';
import GiftKit from './components/GiftKit/GiftKit';
import HowToBuy from './components/HowToBuy/HowToBuy';
import WhyUs from './components/WhyUs/WhyUs';
import OurStory from './components/OurStory/OurStory';
import CareGuide from './components/CareGuide/CareGuide';
import Testimonials from './components/Testimonials/Testimonials';
import FAQ from './components/FAQ/FAQ';
import Gallery from './components/Gallery/Gallery';
import Newsletter from './components/Newsletter/Newsletter';
import Footer from './components/Footer/Footer';
import './App.css';

export default function App() {
  return (
    <>
      {/* 1. Fixed navigation bar */}
      <Navbar />

      <main>
        {/* 2. Hero — Full screen with two columns */}
        <Hero />

        {/* 3. Trust indicators — Dark bar */}
        <TrustBar />

        {/* 4. Special offer with countdown */}
        <SpecialOffer />

        {/* 5. Product categories — Visual filters */}
        <Categories />

        {/* 6. Best sellers — Product grid from Supabase */}
        <BestSellers />

        {/* 7. Gift kit — Featured product highlight */}
        <GiftKit />

        {/* 8. How to buy — 4-step process */}
        <HowToBuy />

        {/* 9. Why us — Value proposition */}
        <WhyUs />

        {/* 10. Our story — Brand narrative */}
        <OurStory />

        {/* 11. Care guide — Mate curing steps */}
        <CareGuide />

        {/* 12. Testimonials — Customer reviews */}
        <Testimonials />

        {/* 13. FAQ — Expandable accordion */}
        <FAQ />

        {/* 14. Gallery — Instagram photos */}
        <Gallery />

        {/* 15. Newsletter — Club del Mate */}
        <Newsletter />
      </main>

      {/* 16. Footer */}
      <Footer />
    </>
  );
}
