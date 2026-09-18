"use client";

import * as React from "react";
import { cn } from "@/components/ui";

/** Barres horizontales, série unique (magnitude). Libellés en texte, valeur au survol et en fin de barre. */
export function BarList({ data, label, highlight }: { data: { name: string; value: number }[]; label: string; highlight?: string }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <figure>
      <ul className="space-y-2.5" aria-hidden>
        {data.map((d) => (
          <li key={d.name} className="group grid grid-cols-[120px_1fr_40px] items-center gap-3 text-sm sm:grid-cols-[150px_1fr_44px]">
            <span className={cn("truncate", d.name === highlight ? "font-semibold text-navy-900" : "text-muted")}>{d.name}</span>
            <span className="relative h-2.5 rounded-full bg-navy-50">
              <span
                className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-700 group-hover:brightness-110", d.name === highlight ? "bg-brand-500" : "bg-brand-300")}
                style={{ width: `${(d.value / max) * 100}%` }}
              />
            </span>
            <span className="text-right font-semibold tabular-nums text-navy-900">{d.value}</span>
          </li>
        ))}
      </ul>
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>{data.map((d) => <tr key={d.name}><th>{d.name}</th><td>{d.value}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}

/** Colonnes verticales, série unique dans le temps, avec info-bulle au survol / focus. */
export function Columns({ data, label, unit }: { data: { month: string; value: number }[]; label: string; unit: string }) {
  const [hover, setHover] = React.useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value));
  const ticks = [0, Math.round(max / 2), max];
  return (
    <figure>
      <div className="relative flex h-48 gap-3 pl-8" aria-hidden>
        <div className="pointer-events-none absolute inset-y-0 left-8 right-0 flex flex-col-reverse justify-between">
          {ticks.map((t) => (
            <div key={t} className="relative border-t border-dashed border-line">
              <span className="absolute -left-8 -top-2 w-6 text-right text-[11px] tabular-nums text-muted">{t}</span>
            </div>
          ))}
        </div>
        {data.map((d, i) => (
          <div
            key={d.month}
            className="relative flex flex-1 cursor-default flex-col justify-end"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            {hover === i && (
              <div className="absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded-lg bg-navy-950 px-2.5 py-1.5 text-xs text-white shadow-lift" style={{ bottom: `${(d.value / max) * 100}%` }}>
                <span className="font-semibold">{d.value}</span> {unit} · {d.month}
              </div>
            )}
            <div
              className={cn("mx-auto w-full max-w-10 rounded-t-[4px] transition-colors", hover === i ? "bg-brand-600" : "bg-brand-400")}
              style={{ height: `${(d.value / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-3 pl-8 text-center text-xs text-muted" aria-hidden>
        {data.map((d) => <span key={d.month} className="flex-1">{d.month}</span>)}
      </div>
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>{data.map((d) => <tr key={d.month}><th>{d.month}</th><td>{d.value} {unit}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}
