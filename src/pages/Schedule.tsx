"use client";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { sessions, getSpeakersForSession } from "@/data/sessions";
import { Clock } from "lucide-react";

const Schedule = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-36 pb-20">
      {/* Heading area */}
      <div className="px-6 md:px-8 py-20">
        <h1 className="text-5xl md:text-7xl font-medium text-foreground mb-4 leading-tight">Schedule</h1>
        <p className="text-xl text-muted-foreground mb-4">Craft Summit 2025 — Full Day Program</p>
        <p className="text-muted-foreground mb-0 text-sm">June 12, 2025 · San Francisco, CA</p>
      </div>

      {/* Session rows */}
      <div>
        {sessions.map((session) => {
          const sessionSpeakers = getSpeakersForSession(session);
          return (
            <Link
              key={session.id}
              href={`/session/${session.id}`}
              className="block group"
            >
              <div className="border-b border-border">
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 py-8 px-6 md:px-8 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">{session.time}</span>
                      <p className="text-xs text-muted-foreground mt-1">{session.duration}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 uppercase tracking-wider">{session.track}</span>
                      {session.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:underline mb-3">{session.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{session.description}</p>
                    <div className="flex flex-wrap gap-4">
                      {sessionSpeakers.map((speaker) => (
                        <div key={speaker.id} className="flex items-center gap-2">
                          <img src={speaker.photo} alt={speaker.name} className="w-8 h-8 object-cover border border-border" loading="lazy" />
                          <div>
                            <span className="text-xs font-medium text-foreground">{speaker.name}</span>
                            <span className="text-xs text-muted-foreground ml-1">· {speaker.company}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
    <Footer />
  </div>
);

export default Schedule;
