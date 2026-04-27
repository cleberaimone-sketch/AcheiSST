"use client";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllSpeakers, getSessionsForSpeaker } from "@/data/sessions";

const Speakers = () => {
  const allSpeakers = getAllSpeakers();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-36 pb-20">
        {/* Heading */}
        <div className="px-6 md:px-8 py-20">
          <h1 className="text-5xl md:text-7xl font-medium text-foreground mb-4 leading-tight">Speakers</h1>
          <p className="text-xl text-muted-foreground">Meet the product leaders shaping what we build next.</p>
        </div>

        {/* Edge-to-edge speaker grid with border dividers */}
        <div className="border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {allSpeakers.map((speaker, i) => {
              const speakerSessions = getSessionsForSpeaker(speaker.id);
              return (
                <Link
                  key={speaker.id}
                  href={`/speaker/${speaker.id}`}
                  className={`group p-6 md:p-8 border-b border-border hover:bg-muted/30 transition-all ${
                    /* vertical borders between columns */
                    (i % 3 !== 2) ? "lg:border-r" : ""
                  } ${(i % 2 !== 1) ? "sm:border-r lg:border-r-0" : "sm:border-r-0"} ${(i % 3 !== 2) ? "lg:border-r" : ""}`}
                >
                  <img
                    src={speaker.photo}
                    alt={speaker.name}
                    className="w-24 h-24 object-cover mb-5 group-hover:opacity-80 transition-opacity"
                    loading="lazy"
                  />
                  <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:underline">{speaker.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{speaker.role}</p>
                  <p className="text-sm text-muted-foreground mb-4">{speaker.company}</p>
                  <div className="flex flex-wrap gap-2">
                    {speakerSessions.map((s) => (
                      <span key={s.id} className="text-[10px] font-mono bg-muted/50 text-muted-foreground px-2 py-1">{s.title.length > 30 ? s.title.slice(0, 30) + "…" : s.title}</span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Speakers;
