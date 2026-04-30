"use client";
import { Search, ShieldCheck, MapPin } from "lucide-react";

const HeroSection = () => (
  <section className="relative bg-gradient-hero overflow-hidden">
    <div
      className="absolute inset-0 opacity-[0.04] pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(hsl(var(--primary)) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
      aria-hidden
    />

    <div className="relative px-6 md:px-10 pt-10 md:pt-14 pb-6 md:pb-10 max-w-7xl mx-auto">
      <div className="max-w-3xl mx-auto text-center">

        <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-xs font-semibold mb-4 mt-4 md:mt-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          Plataforma 100% dedicada à SST
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-foreground mb-4">
          Encontre profissionais e fornecedores de{" "}
          <span className="text-primary">SST</span>{" "}
          em todo o <span className="text-secondary">Brasil</span>
        </h1>

        <form
          className="mx-auto flex items-center bg-background border border-border rounded-full shadow-card pl-5 pr-2 py-2 max-w-xl focus-within:border-primary focus-within:shadow-card-hover transition-all"
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

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          Cobertura nacional · Profissionais verificados
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
