import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { buttonClasses } from "@campus-one/ui";
import { services } from "@campus-one/mocks";
import { Container, PageHero, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { serviceIcons } from "@/lib/icons";

export const metadata: Metadata = { title: "Nos services" };

const highlights = [
  { title: "Un conseiller dédié", text: "Une seule personne connaît votre dossier de bout en bout et répond à vos questions.", image: "/images/advisor.jpg" },
  { title: "Des démarches vérifiées", text: "Chaque document est contrôlé avant d'être transmis aux établissements et aux autorités.", image: "/images/documents.jpg" },
  { title: "Une arrivée préparée", text: "Logement, assurance, premières démarches : vous arrivez avec l'essentiel déjà réglé.", image: "/images/paris.jpg" },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Nos services"
        title="Un accompagnement à 360°"
        text="Choisissez l'accompagnement complet ou uniquement les services dont vous avez besoin."
        image="/images/team-work.jpg"
      >
        <Link href="/contact#rendez-vous" className={buttonClasses({ size: "lg" })}>Prendre rendez-vous <ArrowRight className="size-5" aria-hidden /></Link>
      </PageHero>
      <section className="py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => {
              const Icon = serviceIcons[s.icon]!;
              return (
                <Reveal key={s.id} delay={(i % 4) * 0.06}>
                  <article className="group h-full rounded-2xl border border-line bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <h2 className="mt-5 font-bold text-navy-900">{s.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>
      <section className="bg-surface py-20">
        <Container>
          <SectionHeading eyebrow="Notre différence" title="Pourquoi choisir Campus One ?" align="center" />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 0.1} className="overflow-hidden rounded-3xl bg-white shadow-soft">
                <img src={h.image} alt="" className="aspect-[3/2] w-full object-cover" loading="lazy" />
                <div className="p-6">
                  <h3 className="font-bold text-navy-900">{h.title}</h3>
                  <p className="mt-2 text-sm text-muted">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mx-auto mt-14 max-w-3xl rounded-3xl bg-navy-900 p-8 text-white sm:p-10">
            <h3 className="text-2xl font-bold">Ce qui est inclus dans l'accompagnement complet</h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Entretien d'orientation", "Jusqu'à 5 candidatures", "Vérification des documents", "Préparation Campus France", "Relecture du dossier de visa", "Aide à la recherche de logement", "Accueil à l'arrivée", "Suivi pendant la 1re année"].map((x) => (
                <li key={x} className="flex gap-2.5 text-navy-100"><CircleCheck className="size-5 shrink-0 text-brand-300" aria-hidden /> {x}</li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
