"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, FileSearch, Landmark, Timer, TrendingUp, TriangleAlert } from "lucide-react";
import { Avatar, Badge, Card, CardHeader, Progress, buttonClasses, cn } from "@campus-one/ui";
import { agents, appointmentRequests, auditLog, bordereaux, dashboardStats, dossiers } from "@campus-one/mocks";
import { PageHeader } from "@/components/shell";
import { BarList, Columns } from "@/components/charts";
import { useRole } from "@/lib/permissions";

export default function DashboardPage() {
  const { can, roleName, firstName } = useRole();
  const docs = dossiers.reduce((a, d) => a + d.docsToReview, 0);
  const deadlines = dossiers.filter((d) => d.deadline).length;

  const today = [
    { icon: FileSearch, n: docs, label: "pièces à vérifier", sub: `dans ${dossiers.filter((d) => d.docsToReview).length} dossiers`, href: "/dossiers?filtre=documents", tone: "brand", show: can("docs.review") },
    { icon: Landmark, n: bordereaux.length, label: "bordereaux à valider", sub: `dont ${bordereaux.filter((b) => b.sinceHours > 48).length} depuis plus de 48 h`, href: "/paiements", tone: "warning", show: can("payments.validate") },
    { icon: CalendarClock, n: appointmentRequests.length, label: "rendez-vous à confirmer", sub: "cette semaine", href: "/rendez-vous", tone: "info", show: can("dossiers.edit") },
    { icon: Timer, n: deadlines, label: "échéances sous 30 jours", sub: "Campus France et visa", href: "/dossiers?filtre=echeances", tone: "danger", show: can("dossiers.read") },
  ].filter((x) => x.show);

  const kpis = [
    { label: "Dossiers actifs", value: 486, delta: "+12 cette semaine" },
    { label: "Incomplets", value: 94, delta: "19 % du total" },
    { label: "En vérification", value: 61, delta: "délai moyen 2,4 j" },
    { label: "Admissions obtenues", value: 128, delta: "+6 cette semaine" },
  ];

  return (
    <>
      <PageHeader
        title={`Bonjour ${firstName}`}
        description={`Jeudi 18 septembre 2026 · Campagne France 2026-2027 · Profil ${roleName}`}
        actions={can("reports.export") ? <button className={buttonClasses({ variant: "outline", size: "sm" })}>Exporter le rapport</button> : undefined}
      />

      <section aria-labelledby="today">
        <h2 id="today" className="mb-3 text-sm font-semibold text-navy-900">À traiter aujourd'hui</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {today.map(({ icon: Icon, n, label, sub, href, tone }, i) => (
            <Link key={label} href={href} className="group animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <Card className="h-full p-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-lift">
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl",
                      tone === "brand" && "bg-brand-50 text-brand-600",
                      tone === "warning" && "bg-amber-50 text-amber-600",
                      tone === "info" && "bg-sky-50 text-sky-600",
                      tone === "danger" && "bg-rose-50 text-rose-600",
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <ArrowUpRight className="size-4 text-slate-300 transition-colors group-hover:text-brand-500" aria-hidden />
                </div>
                <p className="mt-4 text-3xl font-extrabold tabular-nums text-navy-900">{n}</p>
                <p className="text-sm font-medium text-navy-800">{label}</p>
                <p className="mt-0.5 text-xs text-muted">{sub}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Card className="mt-6 grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
        {kpis.map((k) => (
          <div key={k.label} className="p-5">
            <p className="text-sm text-muted">{k.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-navy-900">{k.value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted"><TrendingUp className="size-3.5 text-emerald-600" aria-hidden /> {k.delta}</p>
          </div>
        ))}
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader title="Dossiers par étape" description="Répartition actuelle du pipeline" />
          <div className="p-5">
            <BarList data={dashboardStats.byStep.map((s) => ({ name: s.step, value: s.count }))} highlight="Admission obtenue" label="Nombre de dossiers par étape" />
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader title="Candidatures reçues" description="Par mois, campagne en cours" />
          <div className="p-5">
            <Columns data={dashboardStats.byMonth} label="Candidatures reçues par mois" unit="candidatures" />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader title="Formations les plus demandées" />
          <ol className="divide-y divide-line">
            {dashboardStats.topFormations.map((f, i) => (
              <li key={f.name} className="flex items-center gap-3 px-5 py-3 text-sm">
                <span className="w-5 font-semibold tabular-nums text-muted">{i + 1}</span>
                <span className="flex-1 text-navy-900">{f.name}</span>
                <span className="font-semibold tabular-nums">{f.count}</span>
              </li>
            ))}
          </ol>
        </Card>
        <Card>
          <CardHeader title="Charge des conseillers" description="Dossiers actifs affectés" />
          <ul className="space-y-4 p-5">
            {agents.filter((a) => a.load > 0).map((a) => (
              <li key={a.id}>
                <div className="mb-1.5 flex items-center gap-2 text-sm">
                  <Avatar name={a.name} size="sm" />
                  <span className="flex-1 text-navy-900">{a.name}</span>
                  <span className="font-semibold tabular-nums">{a.load}</span>
                  {a.load > 40 && <Badge tone="warning"><TriangleAlert className="size-3" aria-hidden /> Élevée</Badge>}
                </div>
                <Progress value={(a.load / 50) * 100} tone={a.load > 40 ? "warning" : "brand"} label={`Charge de ${a.name}`} />
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Activité récente" action={can("audit.read") ? <Link href="/audit" className="text-sm font-semibold text-brand-600">Journal</Link> : undefined} />
          <ul className="divide-y divide-line">
            {auditLog.slice(0, 5).map((l) => (
              <li key={l.id} className="flex gap-3 px-5 py-3">
                <Avatar name={l.actor} size="sm" />
                <p className="text-sm text-muted"><span className="font-medium text-navy-900">{l.actor}</span> {l.action} <span className="text-navy-800">{l.target}</span><span className="block text-xs">{l.at.slice(11)}</span></p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Link href="/dossiers" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">Tous les dossiers <ArrowRight className="size-4" aria-hidden /></Link>
      </div>
    </>
  );
}
