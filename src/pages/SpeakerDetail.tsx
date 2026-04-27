"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSpeaker, getSessionsForSpeaker } from "@/data/sessions";
import { ArrowLeft, Twitter, Github, Clock } from "lucide-react";

const SpeakerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const speaker = id ? getSpeaker(id) : undefined;

  if (!speaker) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 text-center">
          <h1 className="text-4xl font-medium text-foreground mb-4">Speaker not found</h1>
          <Link href="/speakers" className="text-muted-foreground hover:text-foreground transition-colors underline">Back to speakers</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const speakerSessions = getSessionsForSpeaker(speaker.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-36 pb-20">
        <section className="max-w-4xl mx-auto px-4 py-20">
          <Link href="/speakers" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-mono mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to speakers
          </Link>

          <div className="flex flex-col md:flex-row gap-10 mb-16">
            <img
              src={speaker.photo}
              alt={speaker.name}
              className="w-40 h-40 object-cover border-4 border-border shrink-0"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-medium text-foreground mb-2 leading-tight">{speaker.name}</h1>
              <p className="text-xl text-muted-foreground mb-1">{speaker.role}</p>
              <p className="text-lg text-muted-foreground mb-6">{speaker.company}</p>
              <div className="flex items-center gap-4">
                {speaker.twitter && (
                  <a href={`https://twitter.com/${speaker.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                    <Twitter className="w-4 h-4" /> @{speaker.twitter}
                  </a>
                )}
                {speaker.github && (
                  <a href={`https://github.com/${speaker.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                    <Github className="w-4 h-4" /> {speaker.github}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-medium text-foreground mb-4">About</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{speaker.bio}</p>
          </div>

          {speakerSessions.length > 0 && (
            <div>
              <h2 className="text-2xl font-medium text-foreground mb-6">Sessions</h2>
              <div className="space-y-4">
                {speakerSessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/session/${session.id}`}
                    className="block border border-border p-6 hover:border-foreground/40 hover:bg-muted/30 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono font-semibold bg-muted/50 text-muted-foreground px-2 py-0.5 uppercase tracking-wider">{session.track}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {session.time}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 hover:underline">{session.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{session.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SpeakerDetail;
