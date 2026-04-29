import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedSection from "@/components/FeaturedSection";
import EPICalloutSection from "@/components/EPICalloutSection";
import PlansSection from "@/components/PlansSection";
import NewsSection from "@/components/NewsSection";
import { FadeInSection } from "@/components/FadeInSection";
import { getAllPosts } from "@/lib/posts";

export default async function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FadeInSection>
          <CategoriesSection />
        </FadeInSection>
        <FadeInSection>
          <FeaturedSection />
        </FadeInSection>
        <FadeInSection>
          <EPICalloutSection />
        </FadeInSection>
        <FadeInSection>
          <PlansSection />
        </FadeInSection>
        <FadeInSection>
          <NewsSection posts={posts.slice(0, 3)} />
        </FadeInSection>
      </main>
      <Footer />
    </div>
  );
}
