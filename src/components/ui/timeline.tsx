import { Check } from "lucide-react";
import { cn } from "./cn";

export type TimelineStep = { label: string; date?: string; status: "done" | "current" | "upcoming" };

/** Suivi d'avancement horizontal (défilable sur mobile) — pièce centrale de l'espace candidat. */
export function Timeline({ steps, className }: { steps: TimelineStep[]; className?: string }) {
  return (
    <ol className={cn("flex min-w-max items-start", className)}>
      {steps.map((s, i) => (
        <li key={s.label} className="relative flex w-28 flex-col items-center text-center sm:w-32">
          {i > 0 && (
            <span
              className={cn(
                "absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2",
                s.status === "upcoming" ? "bg-line" : "bg-brand-500",
              )}
              aria-hidden
            />
          )}
          <span
            className={cn(
              "relative z-10 flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold",
              s.status === "done" && "border-brand-500 bg-brand-500 text-white",
              s.status === "current" && "border-brand-500 bg-white text-brand-600 ring-4 ring-brand-100",
              s.status === "upcoming" && "border-line bg-white text-slate-400",
            )}
          >
            {s.status === "done" ? <Check className="size-4" strokeWidth={3} aria-hidden /> : i + 1}
          </span>
          <span className={cn("mt-2 px-1 text-xs font-semibold", s.status === "upcoming" ? "text-slate-400" : "text-navy-900")}>
            {s.label}
          </span>
          {s.date && <span className="mt-0.5 text-[11px] text-muted">{s.date}</span>}
          <span className="sr-only">
            {s.status === "done" ? "terminée" : s.status === "current" ? "en cours" : "à venir"}
          </span>
        </li>
      ))}
    </ol>
  );
}
