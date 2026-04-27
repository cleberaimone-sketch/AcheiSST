"use client";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const tickets = [
  {
    name: "Conference Ticket",
    price: 200,
    priceId: "price_1TE3kyJiebNPrRsQWInVtHA3",
    description:
      "Access to the full event, including all keynote talks, panel discussions, and networking sessions. Complimentary snacks and beverages provided throughout the day.",
    bgClass: "bg-accent text-accent-foreground",
  },
  {
    name: "Conference Ticket + Party",
    price: 300,
    priceId: "price_1TE3l5JiebNPrRsQcSncyru5",
    description:
      "Includes everything from the conference ticket, plus entry to our closing night party — celebrate the weekend, reconnect with new friends, and wrap things up in style.",
    bgClass: "bg-primary text-primary-foreground",
  },
];

const TicketCard = ({ ticket }: { ticket: (typeof tickets)[0] }) => {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: ticket.priceId, quantity: qty },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${ticket.bgClass} p-8 md:p-10 flex flex-col justify-between min-h-[320px]`}>
      <div>
        <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">
          {ticket.name}
        </h3>
        <p className="text-lg font-medium mb-4">${ticket.price.toFixed(2)}</p>
        <p className="text-sm leading-relaxed opacity-85 max-w-md">
          {ticket.description}
        </p>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <div className="flex items-center border border-current rounded-none">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-lg hover:opacity-70 transition-opacity"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-mono">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-10 flex items-center justify-center text-lg hover:opacity-70 transition-opacity"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="flex-1 bg-background text-foreground h-10 text-[10px] font-mono uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Loading…" : "Buy now"}
        </button>
      </div>
    </div>
  );
};

const TicketsSection = () => (
  <section id="tickets" className="bg-background py-24 md:py-40">
    <div className="px-6 md:px-8 mb-10">
      <h2 className="text-3xl md:text-5xl font-medium text-foreground tracking-tight">
        Register now
      </h2>
    </div>
    <div className="px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      {tickets.map((t) => (
        <TicketCard key={t.name} ticket={t} />
      ))}
    </div>
  </section>
);

export default TicketsSection;
