"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import PlansSection from "@/components/PlansSection";
import NewsSection from "@/components/NewsSection";
import { FadeInSection } from "@/components/FadeInSection";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <HeroSection />
      <FadeInSection>
        <CategoriesSection />
      </FadeInSection>
      <FadeInSection>
        <PlansSection />
      </FadeInSection>
      <FadeInSection>
        <NewsSection />
      </FadeInSection>
    </main>
    <Footer />
  </div>
);

export default Index;
