import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import EPICalloutSection from "@/components/EPICalloutSection";
import EventsSection from "@/components/EventsSection";
import NewsSection from "@/components/NewsSection";
import { FadeInSection } from "@/components/FadeInSection";
import { getAllPosts } from "@/lib/posts";
import { Sparkles, ArrowRight } from "lucide-react";

export default async function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FadeInSection>
          <FeaturedSection />
        </FadeInSection>
        <FadeInSection>
          <EPICalloutSection />
        </FadeInSection>
        <FadeInSection>
          <EventsSection />
        </FadeInSection>

        {/* CTA Planos */}
        <FadeInSection>
          <section className="bg-white py-10 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900 mb-0.5">Quer aparecer em destaque no AcheiSST?</p>
                <p className="text-sm text-slate-500">Planos a partir de R$ 0. Aumente sua visibilidade no maior hub de SST do Brasil.</p>
              </div>
              <a
                href="/planos"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shrink-0 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Ver planos e preços
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <NewsSection posts={posts.slice(0, 3)} />
        </FadeInSection>
      </main>
      <Footer />
    </div>
  );
}
