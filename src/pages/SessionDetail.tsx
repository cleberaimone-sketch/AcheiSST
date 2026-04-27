"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSession, getSpeakersForSession } from "@/data/sessions";
import { ArrowLeft, Clock, Tag } from "lucide-react";

const SessionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const session = id ? getSession(id) : undefined;

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 text-center">
          <h1 className="text-4xl font-medium text-foreground mb-4">Session not found</h1>
          <Link href="/schedule" className="text-muted-foreground hover:text-foreground transition-colors underline">Back to schedule</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const sessionSpeakers = getSpeakersForSession(session);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-36 pb-20">
        <section className="max-w-5xl mx-auto px-4 py-20">
          <Link href="/schedule" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-mono mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to schedule
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-mono font-semibold bg-muted/50 text-muted-foreground px-3 py-1 uppercase tracking-wider">{session.track}</span>
            {session.tags.map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground flex items-center gap-1"><Tag className="w-3 h-3" />{tag}</span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-medium text-foreground mb-6 leading-tight">{session.title}</h1>

          <div className="flex items-center gap-6 mb-10 text-muted-foreground text-sm">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {session.time}</span>
            <span>{session.duration}</span>
          </div>

          {/* Description */}
          <div className="mb-16">
            <h2 className="text-2xl font-medium text-foreground mb-4">About this session</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{session.description}</p>
          </div>

          {/* Speakers */}
          <div>
            <h2 className="text-2xl font-medium text-foreground mb-6">Speakers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {sessionSpeakers.map((speaker) => (
                <Link
                  key={speaker.id}
                  href={`/speaker/${speaker.id}`}
                  className="flex items-start gap-4 border border-border p-6 hover:border-foreground/40 hover:bg-muted/30 transition-all"
                >
                  <img src={speaker.photo} alt={speaker.name} className="w-16 h-16 object-cover border-2 border-border" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground hover:underline">{speaker.name}</h3>
                    <p className="text-sm text-muted-foreground">{speaker.role}</p>
                    <p className="text-sm text-muted-foreground">{speaker.company}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SessionDetail;
