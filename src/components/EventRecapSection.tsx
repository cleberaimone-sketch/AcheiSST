"use client";
import { ArrowRight } from "lucide-react";
import conferenceStage from "@/assets/gallery/conference-stage.jpg";
import conferenceAudience from "@/assets/gallery/conference-audience.jpg";
import conferenceNetworking from "@/assets/gallery/conference-networking.jpg";
import conferenceExhibition from "@/assets/gallery/conference-exhibition.jpg";
import conferencePanel from "@/assets/gallery/conference-panel.jpg";
import conferenceVenue from "@/assets/gallery/conference-venue.jpg";

const EventRecapSection = () => (
  <section className="bg-background py-24 md:py-40">
    <div className="px-6 md:px-8 mb-16 md:mb-20">
      <h2 className="text-2xl md:text-4xl font-medium text-foreground max-w-4xl mb-8 leading-[1.2] tracking-tight">
        Last year, Craft Summit 2024 brought together 2,000 product leaders to explore how the best teams discover, build, and ship products that people love.
      </h2>
      <button className="inline-flex items-center gap-2 border border-foreground text-foreground px-5 py-2.5 text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-all">
        See the 2024 recap <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>

    {/* Asymmetric gallery — large left, smaller right column */}
    <div className="px-6 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <img src={conferenceStage} alt="Speaker on stage" className="w-full aspect-[4/3] object-cover" loading="lazy" />
        <img src={conferenceAudience} alt="Conference audience" className="w-full aspect-[4/3] object-cover" loading="lazy" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-0">
        <img src={conferenceNetworking} alt="Networking lobby" className="w-full aspect-square object-cover" loading="lazy" />
        <img src={conferenceExhibition} alt="Exhibition hall" className="w-full aspect-square object-cover" loading="lazy" />
        <img src={conferencePanel} alt="Panel discussion" className="w-full aspect-square object-cover" loading="lazy" />
        <img src={conferenceVenue} alt="Conference venue" className="w-full aspect-square object-cover" loading="lazy" />
      </div>
    </div>
  </section>
);

export default EventRecapSection;
