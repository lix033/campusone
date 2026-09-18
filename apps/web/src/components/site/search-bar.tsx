"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button, cn } from "@campus-one/ui";
import { cities, domains, levels } from "@campus-one/mocks";

const fields = [
  { name: "diplome", label: "Mon diplôme", options: ["Baccalauréat", "BTS / DUT", "Licence", "Master 1", "Master 2"] },
  { name: "niveau", label: "Niveau visé", options: levels },
  { name: "domaine", label: "Domaine", options: domains },
  { name: "destination", label: "Destination", options: ["France", "Belgique (bientôt)", "Canada (bientôt)"] },
  { name: "ville", label: "Ville", options: cities },
  { name: "budget", label: "Budget annuel", options: ["Moins de 5 000 €", "5 000 à 8 000 €", "8 000 à 12 000 €", "Plus de 12 000 €"] },
];

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <form
      role="search"
      aria-label="Rechercher une formation"
      className={cn("rounded-3xl border border-line bg-white p-3 shadow-lift", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const q = new URLSearchParams();
        for (const [k, v] of data.entries()) if (v) q.set(k, String(v));
        router.push(`/formations?${q.toString()}`);
      }}
    >
      <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-[repeat(6,minmax(0,1fr))_auto]">
        {fields.map((f) => (
          <label key={f.name} className="group relative rounded-2xl px-4 py-2.5 transition-colors hover:bg-navy-50 focus-within:bg-navy-50">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-navy-700">{f.label}</span>
            <select name={f.name} defaultValue="" className="mt-0.5 w-full cursor-pointer appearance-none bg-transparent text-sm text-muted focus:outline-none">
              <option value="">Tous</option>
              {f.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}
        <Button type="submit" size="lg" className="col-span-2 m-1 md:col-span-3 lg:col-span-1">
          <Search className="size-5" aria-hidden />
          Rechercher
        </Button>
      </div>
    </form>
  );
}
