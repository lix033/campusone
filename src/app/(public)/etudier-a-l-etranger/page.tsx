import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building, Clock3, GraduationCap, House, Landmark, Wallet } from "lucide-react";
import { Badge, buttonClasses } from "@/components/ui";
import { destinations } from "@/lib/mocks";
import { Container, PageHero, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = { title: "Étudier à l'étranger" };

export default function AbroadPage() {
  const france = destinations[0]!;
  return (
    <>
      <PageHero eyebrow="Étudier à l'étranger" title="Choisissez votre destination" text="La France est notre première destination. Belgique, Canada, Allemagne et Royaume-Uni arrivent progressivement." image="/images/paris-night.jpg" />
      <section className="py-20">
        <Container>
          <Reveal className="grid overflow-hidden rounded-3xl border border-line bg-white shadow-soft lg:grid-cols-2">
            <img src={france.image} alt="Paris et la Seine au coucher du soleil" className="h-72 w-full object-cover lg:h-full" />
            <div className="p-8 sm:p-10">
              <Badge tone="success" dot>Destination disponible</Badge>
              <h2 className="mt-4 text-3xl font-bold text-navy-900">Étudier en France</h2>
              <p className="mt-3 text-muted">Un enseignement supérieur reconnu dans le monde entier, plus de 3 500 établissements et des frais de scolarité parmi les plus accessibles d'Europe.</p>
              <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                {[
                  { icon: GraduationCap, k: "Système LMD", v: "Licence (Bac+3), Master (Bac+5), Doctorat" },
                  { icon: Wallet, k: "Coût des études", v: france.cost! },
                  { icon: House, k: "Budget de vie", v: france.living! },
                  { icon: Landmark, k: "Procédure", v: "Campus France selon votre pays, puis visa étudiant" },
                ].map(({ icon: Icon, k, v }) => (
                  <div key={k} className="flex gap-3">
                    <Icon className="mt-0.5 size-5 shrink-0 text-brand-500" aria-hidden />
                    <div><dt className="text-sm font-semibold text-navy-900">{k}</dt><dd className="text-sm text-muted">{v}</dd></div>
                  </div>
                ))}
              </dl>
              <Link href="/formations" className={buttonClasses({ className: "mt-8" })}>
                Voir les {france.formations} formations <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
      <section className="bg-surface py-20">
        <Container>
          <SectionHeading eyebrow="Bientôt" title="De nouvelles destinations en préparation" text="Laissez-nous vos coordonnées sur la page contact pour être prévenu à l'ouverture." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.slice(1).map((d, i) => (
              <Reveal key={d.slug} delay={i * 0.06} className="rounded-2xl border border-dashed border-navy-200 bg-white p-6">
                <Building className="size-6 text-navy-300" aria-hidden />
                <p className="mt-4 text-lg font-bold text-navy-900">{d.name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted"><Clock3 className="size-4" aria-hidden /> Ouverture prochaine</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
