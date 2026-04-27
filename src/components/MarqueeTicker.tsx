"use client";
const message = "PGR · LTCAT · PCMSO · MEDICINA OCUPACIONAL · LAUDOS · TREINAMENTOS NR · EPI · ERGONOMIA";
const separator = " ✦ ";
const repeated = Array(6).fill(message).join(separator) + separator;

const MarqueeTicker = () => (
  <div className="bg-primary overflow-hidden whitespace-nowrap">
    <div className="inline-flex animate-marquee">
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary-foreground py-2 px-4">
        {repeated}
      </span>
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary-foreground py-2 px-4">
        {repeated}
      </span>
    </div>
  </div>
);

export default MarqueeTicker;
