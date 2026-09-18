import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleCheck, CircleDashed, Download, FileText, History } from "lucide-react";
import { Badge, Card, CardHeader, Progress, Timeline, buttonClasses } from "@/components/ui";
import { docStatusLabel, docStatusTone, formatFCFA, me, myApplications, myDocuments, myPayments, paymentStatusLabel } from "@/lib/mocks";

export const metadata: Metadata = { title: "Suivi du dossier" };

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = myApplications.find((x) => x.id === id);
  if (!a) notFound();
  const history = [
    { date: "18 juil. 2026", text: "Admission obtenue — lettre d'admission ajoutée à vos documents" },
    { date: "24 juin 2026", text: "Dossier étudié par la commission de l'établissement" },
    { date: "3 juin 2026", text: "Candidature déposée et frais de dossier réglés en agence" },
    { date: "12 mai 2026", text: "Entretien d'orientation avec Claire Mensah" },
  ];
  return (
    <div className="space-y-6">
      <Link href="/mon-espace/candidatures" className="inline-flex items-center gap-2 text-sm text-muted hover:text-navy-900"><ArrowLeft className="size-4" aria-hidden /> Mes candidatures</Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-fade-up">
          <div className="flex items-center gap-2"><span className="font-mono text-sm text-muted">{a.id}</span><Badge tone="navy">{a.campaign}</Badge></div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">{a.formation}</h1>
          <p className="mt-1 text-muted">{a.school} · {a.city} · suivi par {me.advisor.name}</p>
        </div>
        <button className={buttonClasses({ variant: "outline", size: "sm" })}><Download className="size-4" aria-hidden /> Récapitulatif PDF</button>
      </div>

      <Card className="overflow-x-auto p-6"><Timeline steps={a.steps} className="mx-auto" /></Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Pièces du dossier" description={`${myDocuments.filter((d) => d.status === "valide").length} validées sur ${myDocuments.length}`} action={<Link href="/mon-espace/documents" className="text-sm font-semibold text-brand-600">Gérer</Link>} />
          <ul className="divide-y divide-line">
            {myDocuments.map((d) => (
              <li key={d.id} className="flex items-center gap-3 px-5 py-3">
                {d.status === "valide" ? <CircleCheck className="size-4.5 text-emerald-500" aria-hidden /> : d.file ? <FileText className="size-4.5 text-navy-400" aria-hidden /> : <CircleDashed className="size-4.5 text-slate-300" aria-hidden />}
                <span className="flex-1 text-sm text-navy-900">{d.type}</span>
                <Badge tone={docStatusTone[d.status]}>{docStatusLabel[d.status]}</Badge>
              </li>
            ))}
          </ul>
        </Card>
        <div className="space-y-6">
          <Card className="p-5">
            <p className="text-sm font-semibold text-navy-900">Complétude</p>
            <p className="mt-2 text-3xl font-extrabold text-navy-900">{a.completeness} %</p>
            <Progress value={a.completeness} className="mt-3" label="Complétude" />
          </Card>
          <Card>
            <CardHeader title="Paiements" />
            <ul className="divide-y divide-line">
              {myPayments.map((p) => (
                <li key={p.id} className="px-5 py-3 text-sm">
                  <div className="flex justify-between gap-2"><span className="text-navy-900">{p.label}</span><span className="font-semibold">{formatFCFA(p.amount)}</span></div>
                  <Badge tone={p.status === "paye" ? "success" : "danger"} className="mt-1.5">{paymentStatusLabel[p.status]}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title="Historique du dossier" action={<History className="size-4.5 text-slate-400" aria-hidden />} />
        <ol className="space-y-5 p-5">
          {history.map((h, i) => (
            <li key={h.date} className="relative flex gap-4 pl-1">
              <span className={i === 0 ? "mt-1.5 size-2.5 shrink-0 rounded-full bg-brand-500 ring-4 ring-brand-100" : "mt-1.5 size-2.5 shrink-0 rounded-full bg-navy-200"} aria-hidden />
              <div><p className="text-sm text-navy-900">{h.text}</p><p className="text-xs text-muted">{h.date}</p></div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
