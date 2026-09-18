import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Badge, Card, Progress, buttonClasses } from "@campus-one/ui";
import { myApplications } from "@campus-one/mocks";
import { PageTitle } from "@/components/espace/shell";

export const metadata: Metadata = { title: "Mes candidatures" };

const statusBadge = {
  brouillon: { tone: "neutral", label: "Brouillon" },
  en_cours: { tone: "warning", label: "En cours d'étude" },
  admis: { tone: "success", label: "Admis" },
  cloture: { tone: "neutral", label: "Clôturé" },
} as const;

export default function ApplicationsPage() {
  const campaigns = [...new Set(myApplications.map((a) => a.campaign))];
  return (
    <>
      <PageTitle
        title="Mes candidatures"
        description="Chaque candidature a son propre suivi. Vous pouvez en déposer plusieurs, sur une ou plusieurs campagnes."
        action={<Link href="/mon-espace/candidatures/nouvelle" className={buttonClasses()}><Plus className="size-4" aria-hidden /> Nouvelle candidature</Link>}
      />
      <div className="space-y-8">
        {campaigns.map((c) => (
          <section key={c} aria-labelledby={`c-${c}`}>
            <h2 id={`c-${c}`} className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Campagne {c}</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {myApplications.filter((a) => a.campaign === c).map((a, i) => {
                const b = statusBadge[a.status];
                return (
                  <Link
                    key={a.id}
                    href={a.status === "brouillon" ? "/mon-espace/candidatures/nouvelle" : `/mon-espace/candidatures/${a.id}`}
                    className="group animate-fade-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <Card className="h-full p-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-lift">
                      <div className="flex items-start justify-between gap-3">
                        <Badge tone={b.tone} dot>{b.label}</Badge>
                        <span className="font-mono text-xs text-muted">{a.id}</span>
                      </div>
                      <p className="mt-3 text-lg font-bold text-navy-900">{a.formation}</p>
                      <p className="text-sm text-muted">{a.school} · {a.city}</p>
                      <div className="mt-5">
                        <div className="mb-1.5 flex justify-between text-xs">
                          <span className="font-medium text-navy-800">{a.currentStep}</span>
                          <span className="text-muted">{a.submittedAt ? `Déposée le ${a.submittedAt}` : "Non envoyée"}</span>
                        </div>
                        <Progress value={a.completeness} tone={a.status === "admis" ? "success" : "brand"} label={`Avancement ${a.formation}`} />
                      </div>
                      <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                        {a.status === "brouillon" ? "Reprendre ma candidature" : "Suivre le dossier"} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </p>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
