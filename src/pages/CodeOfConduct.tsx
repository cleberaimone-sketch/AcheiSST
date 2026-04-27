"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, Users, Shield, MessageCircle, AlertTriangle } from "lucide-react";

const CodeOfConduct = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-36 pb-20">
      <article className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-5xl md:text-6xl font-medium text-foreground mb-4 leading-tight">Code of Conduct</h1>
        <p className="text-muted-foreground mb-6 text-sm font-mono uppercase tracking-wider">Craft Summit 2025 — Community Guidelines</p>
        <p className="text-xl text-muted-foreground mb-16 leading-relaxed max-w-3xl">
          Craft Summit is dedicated to providing a harassment-free, inclusive experience for everyone. We value the participation of each member of our community and want all attendees to have an enjoyable and fulfilling experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            { icon: Heart, title: "Be Kind & Respectful", desc: "Treat everyone with dignity. Disagreement is natural, but hostility is not. Choose empathy over ego." },
            { icon: Users, title: "Be Inclusive", desc: "Welcome and support people of all backgrounds, identities, and experience levels. Diversity makes us stronger." },
            { icon: Shield, title: "Be Professional", desc: "Remember that this is a professional environment. Conduct yourself in a way that reflects well on you and your organization." },
            { icon: MessageCircle, title: "Be Constructive", desc: "Offer thoughtful feedback. Focus on ideas, not people. Build others up rather than tearing them down." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="border border-border p-8">
              <Icon className="w-8 h-8 text-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-medium text-foreground mb-6">Unacceptable Behavior</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">The following behaviors are considered violations of this code of conduct and will not be tolerated at Craft Summit events, online communities, or any associated spaces:</p>
        <ul className="space-y-4 mb-16">
          {[
            "Harassment, intimidation, or discrimination in any form",
            "Offensive verbal comments related to gender, sexual orientation, disability, physical appearance, body size, race, or religion",
            "Inappropriate physical contact or unwelcome sexual attention",
            "Deliberate intimidation, stalking, or following",
            "Sustained disruption of talks, workshops, or other events",
            "Publishing others' private information without explicit permission",
            "Advocating for or encouraging any of the above behaviors",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-muted-foreground">
              <AlertTriangle className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="text-3xl font-medium text-foreground mb-6">Reporting & Enforcement</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          If you experience or witness unacceptable behavior, please report it immediately to our safety team. All reports will be handled with discretion and confidentiality.
        </p>
        <div className="bg-muted/30 border border-border p-8 mb-16">
          <h3 className="text-lg font-semibold text-foreground mb-4">How to Report</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li><strong className="text-foreground">In person:</strong> Approach any Nexus team member wearing a staff badge</li>
            <li><strong className="text-foreground">Email:</strong> conduct@craftsummit.dev (monitored 24/7 during events)</li>
            <li><strong className="text-foreground">Phone:</strong> +1 (415) 555-0142 (event safety hotline)</li>
            <li><strong className="text-foreground">Anonymous:</strong> Use the reporting form at craftsummit.dev/report</li>
          </ul>
        </div>

        <h2 className="text-3xl font-medium text-foreground mb-6">Consequences</h2>
        <p className="text-muted-foreground leading-relaxed">
          Participants asked to stop any harassing behavior are expected to comply immediately. Organizers may take any action they deem appropriate, including warning the offender, expulsion from the event without refund, or banning from future Nexus events and online communities. Serious violations may be reported to local law enforcement.
        </p>
      </article>
    </main>
    <Footer />
  </div>
);

export default CodeOfConduct;
