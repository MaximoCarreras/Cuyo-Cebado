import Hero from '../components/Hero/Hero';
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
            {/* Se eliminó TrustBar y SpecialOffer para limpiar visualmente */}
            <Categories />
            <BestSellers />
            <GiftKit />
            <HowToBuy />
            <Testimonials />
            <Newsletter />
        </>
    );
}