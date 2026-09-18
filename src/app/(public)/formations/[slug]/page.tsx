import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CalendarDays,
  CircleCheck,
  Clock,
  FileText,
  GraduationCap,
  Languages,
  MapPin,
  MessageCircle,
  Users,
  Wallet,
} from "lucide-react";
import { Badge, buttonClasses } from "@/components/ui";
import { formations, schoolOf } from "@/lib/mocks";
import { Container } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { FormationCard, formatEuro, statusTone } from "@/components/site/formation-card";

export function generateStaticParams() {
  return formations.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = formations.find((x) => x.slug === slug);
  return { title: f?.title ?? "Formation" };
}

export default async function FormationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = formations.find((x) => x.slug === slug);
  if (!f) notFound();
  const school = schoolOf(f);
  const closed = f.status === "Candidatures closes";
  const similar = formations.filter((x) => x.domain === f.domain && x.slug !== f.slug).slice(0, 3);

  const facts = [
    { icon: GraduationCap, label: "Diplôme", value: f.diploma },
    { icon: MapPin, label: "Campus", value: (f.cities ?? [f.city]).join(", ") },
    { icon: Clock, label: "Durée et rythme", value: `${f.duration} · ${f.rhythm}` },
    { icon: CalendarDays, label: "Rentrée", value: f.intake },
    { icon: Languages, label: "Langue", value: f.language },
    { icon: Award, label: "Reconnaissance", value: f.recognition },
  ];

  const cta = closed ? (
    <span className={buttonClasses({ size: "lg", className: "w-full opacity-50" })} aria-disabled>Candidatures closes</span>
  ) : (
    <Link href={`/candidater?formation=${f.slug}`} className={buttonClasses({ size: "lg", className: "w-full" })}>
      Candidater à cette formation <ArrowRight className="size-5" aria-hidden />
    </Link>
  );

  return (
    <>
      <section className="relative overflow-hidden bg-navy-950">
        <img src={f.image} alt="" className="absolute inset-0 size-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/50" aria-hidden />
        <Container className="relative py-12 sm:py-16">
          <Link href="/formations" className="inline-flex items-center gap-2 text-sm text-navy-200 hover:text-white">
            <ArrowLeft className="size-4" aria-hidden /> Retour au catalogue
          </Link>
          <div className="mt-6 max-w-3xl animate-fade-up">
            <div className="flex flex-wrap gap-2">
              <Badge tone="brand">{f.level}</Badge>
              <Badge tone={statusTone[f.status]} dot>{f.status}</Badge>
              {f.seats > 0 && <Badge tone="navy"><Users className="size-3" aria-hidden /> {f.seats} places</Badge>}
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">{f.title}</h1>
            <p className="mt-3 text-lg text-navy-200">{school.name} · {f.city}, {f.country}</p>
          </div>
        </Container>
      </section>

      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-12">
          <Reveal>
            <h2 className="text-xl font-bold text-navy-900">Présentation</h2>
            <p className="mt-3 text-lg leading-relaxed text-muted">{f.summary}</p>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3 rounded-2xl border border-line p-4">
                  <Icon className="mt-0.5 size-5 shrink-0 text-brand-500" aria-hidden />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-navy-900">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal>
            <h2 className="text-xl font-bold text-navy-900">Conditions d'admission</h2>
            <ul className="mt-4 space-y-3">
              {[
                ["Diplôme requis", f.requirements.diploma],
                ["Niveau académique", f.requirements.academic],
                ["Niveau linguistique", f.requirements.language],
              ].map(([k, v]) => (
                <li key={k} className="flex gap-3">
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-500" aria-hidden />
                  <p><span className="font-semibold text-navy-900">{k} : </span><span className="text-muted">{v}</span></p>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl bg-surface p-5">
              <p className="flex items-center gap-2 font-semibold text-navy-900"><FileText className="size-4.5 text-brand-500" aria-hidden /> Documents demandés (PDF)</p>
              <ul className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2">
                {f.documents.map((d) => (
                  <li key={d} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-400" aria-hidden />{d}</li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <h2 className="flex items-center gap-2 text-xl font-bold text-navy-900"><BookOpen className="size-5 text-brand-500" aria-hidden /> Programme</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {f.program.map((p) => (
                <div key={p.title} className="rounded-2xl border border-line p-5">
                  <p className="font-semibold text-navy-900">{p.title}</p>
                  <ul className="mt-3 space-y-2 text-sm text-muted">
                    {p.items.map((i) => <li key={i}>{i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-navy-900"><Briefcase className="size-5 text-brand-500" aria-hidden /> Débouchés</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {f.careers.map((c) => <li key={c} className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800">{c}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-900">Poursuite d'études</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {f.further.map((c) => <li key={c} className="rounded-full bg-navy-50 px-3 py-1.5 text-sm font-medium text-navy-800">{c}</li>)}
              </ul>
            </div>
          </Reveal>

          <Reveal className="rounded-2xl border border-line p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">L'établissement</p>
            <div className="mt-3 flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 font-extrabold text-navy-700">{school.short.slice(0, 2)}</span>
              <div>
                <p className="font-bold text-navy-900">{school.name}</p>
                <p className="text-sm text-muted">{school.type} · {school.city} · depuis {school.founded}</p>
                <p className="mt-2 text-sm text-muted">{school.description}</p>
              </div>
            </div>
          </Reveal>
        </div>

        <aside className="lg:order-none">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
              <p className="flex items-center gap-2 text-sm text-muted"><Wallet className="size-4" aria-hidden /> Frais de scolarité indicatifs</p>
              <p className="mt-1 text-3xl font-extrabold text-navy-900">{formatEuro(f.fees)}<span className="text-base font-medium text-muted"> / an</span></p>
              <div className="mt-6">{cta}</div>
              <Link href="/contact#rendez-vous" className={buttonClasses({ variant: "outline", className: "mt-3 w-full" })}>
                <MessageCircle className="size-4" aria-hidden /> Poser une question
              </Link>
              <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm text-muted">
                <li className="flex gap-2"><CircleCheck className="size-4 shrink-0 text-emerald-500" aria-hidden /> Dossier vérifié par un conseiller</li>
                <li className="flex gap-2"><CircleCheck className="size-4 shrink-0 text-emerald-500" aria-hidden /> Suivi en temps réel dans votre espace</li>
                <li className="flex gap-2"><CircleCheck className="size-4 shrink-0 text-emerald-500" aria-hidden /> Accompagnement Campus France et visa</li>
              </ul>
            </div>
          </div>
        </aside>
      </Container>

      {similar.length > 0 && (
        <section className="bg-surface py-16">
          <Container>
            <h2 className="text-2xl font-bold text-navy-900">Formations similaires</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {similar.map((s) => <FormationCard key={s.slug} f={s} />)}
            </div>
          </Container>
        </section>
      )}

      {/* CTA mobile toujours visible */}
      {!closed && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 pr-20 backdrop-blur lg:hidden">{cta}</div>
      )}
    </>
  );
}
