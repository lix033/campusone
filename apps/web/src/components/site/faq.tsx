"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@campus-one/ui";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <h3>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-semibold text-navy-900 hover:text-brand-700"
              >
                {it.q}
                <Plus className={cn("size-5 shrink-0 text-brand-500 transition-transform duration-300", isOpen && "rotate-45")} aria-hidden />
              </button>
            </h3>
            <div id={`faq-${i}`} className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <p className="overflow-hidden px-6 text-muted">
                <span className="block pb-5">{it.a}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
