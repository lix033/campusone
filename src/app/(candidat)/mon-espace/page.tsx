import Link from "next/link";
import { ArrowRight, CalendarDays, CircleAlert, CreditCard, FileUp, FolderOpen, MessagesSquare, Video } from "lucide-react";
import { Avatar, Badge, Card, CardHeader, Progress, Timeline, buttonClasses } from "@/components/ui";
import { FirstName } from "@/components/espace/first-name";
import { formatFCFA, me, myApplications, myAppointments, myDocuments, myMessages, myPayments } from "@/lib/mocks";

export default function DashboardPage() {
  const main = myApplications[0]!;
  const toFix = myDocuments.filter((d) => d.status === "a_corriger");
  const missing = myDocuments.filter((d) => d.required && d.status === "a_fournir");
  const unpaid = myPayments.filter((p) => p.status === "non_paye");
  const nextRdv = myAppointments.find((a) => a.status === "confirme");
  const lastMsg = myMessages.filter((m) => m.from === "advisor").at(-1)!;

  const actions = [
    ...toFix.map((d) => ({ icon: CircleAlert, tone: "danger" as const, title: `${d.type} à corriger`, text: d.reason!, href: "/mon-espace/documents", cta: "Corriger" })),
    ...unpaid.map((p) => ({ icon: CreditCard, tone: "warning" as const, title: `${p.label} : ${formatFCFA(p.amount)}`, text: `À régler avant le ${p.due}.`, href: "/mon-espace/paiements", cta: "Payer" })),
    ...missing.map((d) => ({ icon: FileUp, tone: "info" as const, title: `${d.type} à fournir`, text: "Document obligatoire pour la procédure de visa.", href: "/mon-espace/documents", cta: "Déposer" })),
  ];

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <p className="text-sm text-muted">Jeudi 18 septembre 2026</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">Bonjour <FirstName />,</h1>
        <p className="mt-1.5 text-muted">
          {actions.length ? (
            <>Vous avez <span className="font-semibold text-navy-900">{actions.length} action{actions.length > 1 ? "s" : ""}</span> à réaliser pour faire avancer votre dossier.</>
          ) : (
            "Tout est à jour. Votre conseillère traite votre dossier."
          )}
        </p>
      </div>

      <Card className="animate-fade-up overflow-hidden [animation-delay:60ms]">
        <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="success" dot>Admis</Badge>
              <span className="text-sm text-muted">{main.id} · {main.campaign}</span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-navy-900">{main.formation}</h2>
            <p className="text-sm text-muted">{main.school} · {main.city}</p>
          </div>
          <Link href={`/mon-espace/candidatures/${main.id}`} className={buttonClasses({ variant: "outline", size: "sm" })}>
            Voir le dossier <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="overflow-x-auto px-3 py-6">
          <Timeline steps={main.steps} className="mx-auto" />
        </div>
        <div className="flex flex-col gap-3 bg-brand-50/60 px-5 py-4 sm:flex-row sm:items-center">
          <p className="flex-1 text-sm text-navy-800">
            <span className="font-semibold">Étape en cours : Campus France.</span> Votre conseillère prépare votre dossier en ligne. Prochaine étape : simulation d'entretien le 23 septembre.
          </p>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="animate-fade-up [animation-delay:120ms] xl:col-span-2">
          <CardHeader title="À faire maintenant" description="Classé par priorité" />
          {actions.length ? (
            <ul className="divide-y divide-line">
              {actions.map((a) => (
                <li key={a.title} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                  <span
                    className={
                      a.tone === "danger"
                        ? "flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600"
                        : a.tone === "warning"
                          ? "flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600"
                          : "flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600"
                    }
                  >
                    <a.icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy-900">{a.title}</p>
                    <p className="text-sm text-muted">{a.text}</p>
                  </div>
                  <Link href={a.href} className={buttonClasses({ size: "sm", variant: a.tone === "danger" ? "primary" : "outline", className: "shrink-0" })}>
                    {a.cta}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>

        <div className="space-y-6">
          <Card className="animate-fade-up p-5 [animation-delay:160ms]">
            <p className="text-sm font-semibold text-navy-900">Complétude du dossier</p>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-3xl font-extrabold text-navy-900">{main.completeness} %</p>
              <p className="text-sm text-muted">{myDocuments.filter((d) => d.status === "valide").length}/{myDocuments.filter((d) => d.required).length} pièces validées</p>
            </div>
            <Progress value={main.completeness} className="mt-3" label="Complétude du dossier" />
          </Card>

          {nextRdv && (
            <Card className="animate-fade-up p-5 [animation-delay:200ms]">
              <p className="flex items-center gap-2 text-sm font-semibold text-navy-900"><CalendarDays className="size-4 text-brand-500" aria-hidden /> Prochain rendez-vous</p>
              <p className="mt-3 font-semibold text-navy-900">{nextRdv.title}</p>
              <p className="text-sm text-muted">{nextRdv.date} · {nextRdv.time}</p>
              <a href="#" className={buttonClasses({ variant: "secondary", size: "sm", className: "mt-4 w-full" })}>
                <Video className="size-4" aria-hidden /> Rejoindre sur Google Meet
              </a>
            </Card>
          )}

          <Card className="animate-fade-up p-5 [animation-delay:240ms]">
            <p className="flex items-center gap-2 text-sm font-semibold text-navy-900"><MessagesSquare className="size-4 text-brand-500" aria-hidden /> Dernier message</p>
            <div className="mt-3 flex gap-3">
              <Avatar name={me.advisor.name} size="sm" />
              <div className="min-w-0">
                <p className="text-sm text-navy-800 line-clamp-2">{lastMsg.body}</p>
                <p className="mt-1 text-xs text-muted">{me.advisor.name} · {lastMsg.time}</p>
              </div>
            </div>
            <Link href="/mon-espace/messages" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
              Répondre <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </Card>
        </div>
      </div>

      <Card className="animate-fade-up [animation-delay:280ms]">
        <CardHeader
          title="Mes autres candidatures"
          action={<Link href="/mon-espace/candidatures" className="text-sm font-semibold text-brand-600 hover:text-brand-700">Tout voir</Link>}
        />
        <ul className="divide-y divide-line">
          {myApplications.slice(1).map((a) => (
            <li key={a.id}>
              <Link href={a.status === "brouillon" ? "/mon-espace/candidatures/nouvelle" : `/mon-espace/candidatures/${a.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-surface">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600"><FolderOpen className="size-5" aria-hidden /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-navy-900">{a.formation}</p>
                  <p className="text-sm text-muted">{a.school} · {a.campaign}</p>
                </div>
                <Badge tone={a.status === "brouillon" ? "neutral" : "warning"} dot className="max-sm:hidden">{a.status === "brouillon" ? "Brouillon" : a.currentStep}</Badge>
                <ArrowRight className="size-4 text-slate-400" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
