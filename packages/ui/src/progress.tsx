import { cn } from "./cn";

export function Progress({
  value,
  className,
  tone = "brand",
  label,
}: {
  value: number;
  className?: string;
  tone?: "brand" | "success" | "warning";
  label?: string;
}) {
  const color = tone === "success" ? "bg-emerald-500" : tone === "warning" ? "bg-amber-500" : "bg-brand-500";
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-navy-50", className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={cn("h-full rounded-full transition-[width] duration-700 ease-out", color)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
