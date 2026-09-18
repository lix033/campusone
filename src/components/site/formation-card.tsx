import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { Badge, buttonClasses } from "@/components/ui";
import { schoolOf, type Formation } from "@/lib/mocks";

export const statusTone = { Ouvert: "success", "Bientôt disponible": "warning", "Candidatures closes": "neutral" } as const;

export function formatEuro(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export function FormationCard({ f }: { f: Formation }) {
  const school = schoolOf(f);
  const closed = f.status === "Candidatures closes";
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={f.image} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge tone="navy" className="bg-white/95">{f.level}</Badge>
          <Badge tone={statusTone[f.status]} dot className="bg-white/95">{f.status}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{f.domain}</p>
        <h3 className="mt-1.5 text-lg font-bold leading-snug text-navy-900">
          <Link href={`/formations/${f.slug}`} className="after:absolute after:inset-0 focus:outline-none">
            {f.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted">{school.name}</p>
        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-navy-800">
          <div className="flex items-center gap-2"><MapPin className="size-4 text-slate-400" aria-hidden /><dt className="sr-only">Ville</dt><dd>{(f.cities ?? [f.city]).join(", ")}</dd></div>
          <div className="flex items-center gap-2"><Clock className="size-4 text-slate-400" aria-hidden /><dt className="sr-only">Durée</dt><dd>{f.duration}</dd></div>
          <div className="flex items-center gap-2"><CalendarDays className="size-4 text-slate-400" aria-hidden /><dt className="sr-only">Rentrée</dt><dd>{f.intake}</dd></div>
          <div className="flex items-center gap-2 font-semibold"><dt className="sr-only">Frais indicatifs</dt><dd>{formatEuro(f.fees)}<span className="font-normal text-muted"> / an</span></dd></div>
        </dl>
        <div className="relative z-10 mt-auto flex gap-2 pt-5">
          <Link href={`/formations/${f.slug}`} className={buttonClasses({ variant: "outline", size: "sm", className: "flex-1" })}>
            Voir la formation
          </Link>
          {closed ? (
            <span className={buttonClasses({ size: "sm", className: "flex-1 opacity-50" })} aria-disabled>Clôturée</span>
          ) : (
            <Link href={`/candidater?formation=${f.slug}`} className={buttonClasses({ size: "sm", className: "flex-1" })}>
              Candidater <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
