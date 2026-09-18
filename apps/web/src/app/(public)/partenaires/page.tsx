import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Handshake, House, MapPin, Plane, ShieldCheck, Wallet } from "lucide-react";
import { buttonClasses } from "@campus-one/ui";
import { etablissements, formations } from "@campus-one/mocks";
import { Container, PageHero, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = { title: "Nos partenaires" };

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Nos partenaires"
        title="Des établissements avec lesquels nous travaillons réellement"
        text="Nous ne présentons que les écoles et universités avec lesquelles Campus One dispose d'un partenariat effectif."
        image="/images/amphitheater.jpg"
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {etablissements.map((e, i) => {
              const count = formations.filter((f) => f.school === e.slug).length;
              return (
                <Reveal key={e.slug} delay={(i % 3) * 0.08}>
                  <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft transition-shadow hover:shadow-lift">
                    <div className="flex items-center gap-4">
                      <span className="flex size-14 items-center justify-center rounded-2xl bg-navy-900 text-lg font-extrabold text-white">{e.short.slice(0, 2)}</span>
                      <div>
                        <h2 className="font-bold text-navy-900">{e.name}</h2>
                        <p className="flex items-center gap-1 text-sm text-muted"><MapPin className="size-3.5" aria-hidden /> {e.city} · {e.type}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted">{e.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {e.diplomas.map((d) => <span key={d} className="rounded-md bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-700">{d}</span>)}
                    </div>
                    <Link href={`/formations?etablissement=${e.slug}`} className={buttonClasses({ variant: "outline", size: "sm", className: "mt-auto self-start" })} style={{ marginTop: "1.5rem" }}>
                      Voir les formations disponibles ({count}) <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>
      <section className="bg-surface py-20">
        <Container>
          <SectionHeading eyebrow="Au-delà des écoles" title="Un réseau pour chaque étape de votre installation" align="center" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: House, t: "Logement", d: "Résidences étudiantes et bailleurs partenaires." },
              { icon: ShieldCheck, t: "Assurance", d: "Assurance santé et habitation adaptées aux étudiants." },
              { icon: Wallet, t: "Financement", d: "Garants, prêts étudiants et ouverture de compte." },
              { icon: Plane, t: "Voyage", d: "Tarifs étudiants et accueil à l'aéroport." },
            ].map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 0.06} className="rounded-2xl bg-white p-6 shadow-soft">
                <Icon className="size-7 text-brand-500" aria-hidden />
                <p className="mt-4 font-bold text-navy-900">{t}</p>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl border border-line bg-white p-8 sm:flex-row">
            <div className="flex items-center gap-4">
              <Handshake className="size-10 shrink-0 text-brand-500" aria-hidden />
              <div>
                <p className="font-bold text-navy-900">Vous êtes un établissement ou un agent d'orientation ?</p>
                <p className="text-sm text-muted">Devenez partenaire et suivez les candidats que vous orientez grâce à votre code partenaire.</p>
              </div>
            </div>
            <Link href="/contact" className={buttonClasses()}><Building2 className="size-4" aria-hidden /> Devenir partenaire</Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
