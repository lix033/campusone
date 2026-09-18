import { cn } from "./cn";

const palette = [
  "bg-brand-100 text-brand-800",
  "bg-navy-100 text-navy-800",
  "bg-emerald-100 text-emerald-800",
  "bg-amber-100 text-amber-800",
  "bg-sky-100 text-sky-800",
  "bg-violet-100 text-violet-800",
];

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function Avatar({ name, size = "md", className }: { name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const s = size === "sm" ? "size-7 text-[11px]" : size === "lg" ? "size-12 text-base" : "size-9 text-xs";
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-semibold", palette[hash % palette.length], s, className)}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
