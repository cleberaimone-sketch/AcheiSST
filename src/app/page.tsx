import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import PlansSection from "@/components/PlansSection";
import NewsSection from "@/components/NewsSection";
import { FadeInSection } from "@/components/FadeInSection";
import { getAllPosts } from "@/lib/posts"; // Keeping your existing post fetcher

export default function Home() {
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
          <PlansSection />
        </FadeInSection>
        {/* Blog items via MD */}
        <FadeInSection>
          <NewsSection posts={posts.slice(0, 3)} />
        </FadeInSection>
      </main>
      <Footer />
    </div>
  );
}
