"use client";
import { Search, ShieldCheck, MapPin } from "lucide-react";

const HeroSection = () => (
  <section className="relative bg-gradient-hero overflow-hidden">
    {/* Subtle dotted backdrop */}
    <div
      className="absolute inset-0 opacity-[0.04] pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(hsl(var(--primary)) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
      aria-hidden
    />

    <div className="relative px-6 md:px-10 pt-14 md:pt-20 pb-8 md:pb-12 max-w-7xl mx-auto">
      <div className="max-w-4xl mx-auto text-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-xs font-semibold mb-6 mt-6 md:mt-10">
            <ShieldCheck className="w-3.5 h-3.5" />
            Plataforma 100% dedicada à SST
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-foreground">
            A primeira plataforma que reúne{" "}
            <span className="text-primary">profissionais de SST</span>{" "}
            do <span className="text-secondary">Brasil</span>
          </h1>

          {/* Search bar */}
          <form
            className="mt-10 mx-auto flex items-center bg-background border border-border rounded-full shadow-card pl-5 pr-2 py-2 max-w-xl focus-within:border-primary focus-within:shadow-card-hover transition-all"
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("categorias")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Busque por PGR, LTCAT, médico do trabalho..."
              className="flex-1 bg-transparent outline-none px-3 py-2 text-sm md:text-base placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground rounded-full px-5 md:px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-all"
            >
              Buscar
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            Cobertura nacional · Profissionais verificados
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
