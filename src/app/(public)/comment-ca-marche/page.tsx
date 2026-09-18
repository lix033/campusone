import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { buttonClasses } from "@/components/ui";
import { faq, howItWorks } from "@/lib/mocks";
import { Container, PageHero, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Faq } from "@/components/site/faq";

export const metadata: Metadata = { title: "Comment ça marche ?" };

export default function HowPage() {
  return (
    <>
      <PageHero
        eyebrow="Comment ça marche ?"
        title="Huit étapes, un seul accompagnement"
        text="Voici comment nous construisons votre projet avec vous, du premier entretien jusqu'à votre installation. Chaque étape est visible dans votre espace candidat."
        image="/images/study-desk.jpg"
      />
      <section className="py-20">
        <Container className="max-w-4xl">
          <ol className="relative">
            <li className="absolute left-7 top-4 bottom-4 w-px bg-gradient-to-b from-brand-300 via-brand-200 to-transparent sm:left-8" aria-hidden />
            {howItWorks.map((s, i) => (
              <Reveal as="li" key={s.n} delay={0.05} className="relative flex gap-6 pb-12 last:pb-0 sm:gap-8">
                <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl bg-navy-900 text-lg font-extrabold text-white shadow-soft sm:size-16">
                  {s.n}
                </span>
                <div className="flex-1 rounded-2xl border border-line bg-white p-6 shadow-soft transition-shadow hover:shadow-lift">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-bold text-navy-900">{s.title}</h2>
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">{s.duration}</span>
                  </div>
                  <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
                  {i === 5 && (
                    <p className="mt-4 flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                      La décision de délivrance du visa appartient exclusivement aux autorités consulaires.
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>
      <section className="bg-surface py-20">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="FAQ" title="Questions fréquentes" />
            <Reveal className="mt-8">
              <Link href="/candidater" className={buttonClasses({ size: "lg" })}>
                Commencer ma candidature <ArrowRight className="size-5" aria-hidden />
              </Link>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-8"><Faq items={faq} /></Reveal>
        </Container>
      </section>
    </>
  );
}
