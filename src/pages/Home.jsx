import Hero from '../components/Hero/Hero';
import TrustBar from '../components/TrustBar/TrustBar';
import SpecialOffer from '../components/SpecialOffer/SpecialOffer';
import Categories from '../components/Categories/Categories';
import BestSellers from '../components/BestSellers/BestSellers';
import GiftKit from '../components/GiftKit/GiftKit';
import HowToBuy from '../components/HowToBuy/HowToBuy';
import Testimonials from '../components/Testimonials/Testimonials';
import Newsletter from '../components/Newsletter/Newsletter';

export default function Home() {
    return (
        <>
            <Hero />
            <TrustBar />
            <SpecialOffer />
            <Categories />
            <BestSellers />
            <GiftKit />
            <HowToBuy />
            <Testimonials />
            {/* La Galería fue removida para mantener la prolijidad visual */}
            <Newsletter />
        </>
    );
}