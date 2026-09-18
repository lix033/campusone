import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleUserRound, ClipboardList, FileUp, Send, UserPlus } from "lucide-react";
import { buttonClasses } from "@/components/ui";
import { formations } from "@/lib/mocks";
import { Container } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = { title: "Candidater" };

export default async function ApplyPage({ searchParams }: { searchParams: Promise<{ formation?: string }> }) {
  const { formation } = await searchParams;
  const f = formations.find((x) => x.slug === formation);
  const next = `/mon-espace/candidatures/nouvelle${f ? `?formation=${f.slug}` : ""}`;
  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container className="max-w-5xl">
        <div className="animate-fade-up text-center">
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-5xl">Déposer ma candidature</h1>
          {f ? (
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">Vous candidatez à <span className="font-semibold text-navy-900">{f.title}</span>. Votre choix sera prérempli.</p>
          ) : (
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">Votre candidature se fait depuis votre espace personnel : vous pourrez l'enregistrer et la reprendre à tout moment.</p>
          )}
        </div>

        <ol className="mt-14 grid gap-4 sm:grid-cols-4">
          {[
            { icon: UserPlus, t: "Créez votre compte", d: "2 minutes, email ou téléphone" },
            { icon: ClipboardList, t: "Complétez le formulaire", d: "5 étapes, sauvegarde automatique" },
            { icon: FileUp, t: "Déposez vos documents", d: "Au format PDF" },
            { icon: Send, t: "Envoyez", d: "Suivez l'avancement en temps réel" },
          ].map(({ icon: Icon, t, d }, i) => (
            <Reveal as="li" key={t} delay={i * 0.08} className="rounded-2xl bg-white p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon className="size-5" aria-hidden /></span>
                <span className="text-sm font-bold text-brand-600">Étape {i + 1}</span>
              </div>
              <p className="mt-4 font-semibold text-navy-900">{t}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </Reveal>
          ))}
        </ol>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Reveal className="rounded-3xl border-2 border-brand-500 bg-white p-8">
            <UserPlus className="size-7 text-brand-500" aria-hidden />
            <h2 className="mt-4 text-xl font-bold text-navy-900">Première candidature</h2>
            <p className="mt-2 text-muted">Créez votre espace Campus One pour commencer.</p>
            <Link href={`/inscription?next=${encodeURIComponent(next)}`} className={buttonClasses({ size: "lg", className: "mt-6 w-full" })}>
              Créer mon compte <ArrowRight className="size-5" aria-hidden />
            </Link>
          </Reveal>
          <Reveal delay={0.08} className="rounded-3xl border border-line bg-white p-8">
            <CircleUserRound className="size-7 text-navy-600" aria-hidden />
            <h2 className="mt-4 text-xl font-bold text-navy-900">J'ai déjà un compte</h2>
            <p className="mt-2 text-muted">Ajoutez une nouvelle candidature depuis votre espace.</p>
            <Link href={`/connexion?next=${encodeURIComponent(next)}`} className={buttonClasses({ variant: "outline", size: "lg", className: "mt-6 w-full" })}>
              Me connecter
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
