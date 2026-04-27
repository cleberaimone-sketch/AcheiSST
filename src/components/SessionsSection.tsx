"use client";
import Link from "next/link";
import { sessions, getSpeakersForSession } from "@/data/sessions";

const SessionRow = ({ session }: { session: typeof sessions[0] }) => {
  const sessionSpeakers = getSpeakersForSession(session);
  return (
    <div className="border-b border-border">
      <div className="px-6 md:px-8 py-5 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-4 md:gap-6 md:items-center">
        <Link href={`/session/${session.id}`} className="text-base font-semibold text-foreground hover:underline leading-tight">
          {session.title}
        </Link>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {sessionSpeakers.map((speaker) => (
            <Link key={speaker.id} href={`/speaker/${speaker.id}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <img src={speaker.photo} alt={speaker.name} className="w-7 h-7 object-cover" loading="lazy" />
              <span className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{speaker.name.split(" ")[0]}</span>
                {", "}
                {speaker.company}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const SessionsSection = () => (
  <section id="sessions" className="bg-background py-24 md:py-40">
    {/* Sessions heading */}
    <div className="px-6 md:px-8 flex items-baseline justify-between mb-6">
      <h2 className="text-3xl md:text-5xl font-medium text-foreground tracking-tight">Sessions</h2>
      <Link href="/sessions" className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.2em]">View all →</Link>
    </div>

    {/* Column headers */}
    <div className="border-b border-border">
      <div className="hidden md:grid grid-cols-[2fr_3fr] gap-6 pb-3 px-6 md:px-8">
        <span className="text-[10px] font-mono font-semibold text-muted-foreground tracking-[0.15em] uppercase">Title</span>
        <span className="text-[10px] font-mono font-semibold text-muted-foreground tracking-[0.15em] uppercase">Speakers</span>
      </div>
    </div>

    {sessions.slice(0, 5).map((session) => (
      <SessionRow key={session.id} session={session} />
    ))}

    {/* Workshops heading */}
    <div className="px-6 md:px-8 flex items-baseline justify-between mb-6 mt-24">
      <h2 className="text-3xl md:text-5xl font-medium text-foreground tracking-tight">Workshops</h2>
    </div>

    <div className="border-b border-border">
      <div className="hidden md:grid grid-cols-[2fr_3fr] gap-6 pb-3 px-6 md:px-8">
        <span className="text-[10px] font-mono font-semibold text-muted-foreground tracking-[0.15em] uppercase">Title</span>
        <span className="text-[10px] font-mono font-semibold text-muted-foreground tracking-[0.15em] uppercase">Speakers</span>
      </div>
    </div>

    {sessions.slice(3, 8).map((session) => (
      <SessionRow key={session.id} session={session} />
    ))}
  </section>
);

export default SessionsSection;
