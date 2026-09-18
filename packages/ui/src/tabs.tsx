"use client";

import * as React from "react";
import { cn } from "./cn";

export type TabItem = { id: string; label: string; count?: number; icon?: React.ReactNode };

export function Tabs({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    const n = (i + d + items.length) % items.length;
    refs.current[n]?.focus();
    onChange(items[n]!.id);
  };
  return (
    <div role="tablist" className={cn("flex gap-1 overflow-x-auto border-b border-line", className)}>
      {items.map((t, i) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              "relative -mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-3 text-sm font-semibold transition-colors",
              active ? "border-brand-500 text-navy-900" : "border-transparent text-muted hover:text-navy-900",
            )}
          >
            {t.icon}
            {t.label}
            {t.count !== undefined && (
              <span className={cn("rounded-full px-1.5 py-px text-[11px]", active ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-600")}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
