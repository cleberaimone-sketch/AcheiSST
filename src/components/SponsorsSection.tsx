"use client";
const allSponsors = [
  "Clearpath",
  "Tideshift",
  "Heliograph",
  "Northpine",
  "Ridgeline",
  "Orbiter",
  "Fathom",
  "Waypoint",
  "Prismly",
  "Covalent",
  "Lattice",
  "Sparkhub",
];

const SponsorsSection = () => (
  <section id="sponsors" className="bg-background py-24 md:py-40">
    <div className="px-6 md:px-8">
      <h2 className="text-3xl md:text-5xl font-medium text-foreground tracking-tight mb-16 md:mb-20">Sponsors</h2>
    </div>

    <div className="border-t border-border px-6 md:px-8 pt-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0">
        {allSponsors.map((name) => (
          <div
            key={name}
            className="flex items-center justify-center py-8 border-b border-r border-border hover:bg-muted/30 transition-all cursor-pointer"
          >
            <span className="text-xl md:text-2xl font-medium text-foreground tracking-tight">{name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SponsorsSection;
