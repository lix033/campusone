import { cn } from "./cn";

/**
 * Logo Campus One : pictogramme extrait du logo officiel + nom composé en texte
 * (net à toutes les tailles, déclinable en version claire sur fond sombre).
 */
export function Logo({
  variant = "default",
  className,
  suffix,
  compact,
}: {
  variant?: "default" | "white";
  className?: string;
  suffix?: string;
  compact?: boolean;
}) {
  const white = variant === "white";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src={white ? "/brand/icon-white.png" : "/brand/icon.png"}
        alt=""
        width={307}
        height={408}
        className="h-9 w-auto"
      />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[19px] font-extrabold tracking-tight">
            <span className={white ? "text-white" : "text-navy-900"}>Campus</span>{" "}
            <span className={white ? "text-brand-300" : "text-brand-500"}>One</span>
          </span>
          {suffix && (
            <span className={cn("mt-1 text-[10px] font-semibold uppercase tracking-[0.18em]", white ? "text-navy-200" : "text-muted")}>
              {suffix}
            </span>
          )}
        </span>
      )}
      <span className="sr-only">Campus One{suffix ? ` — ${suffix}` : ""}</span>
    </span>
  );
}
