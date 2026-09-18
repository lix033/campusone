import Link from "next/link";
import {
  ArrowRight,
  Compass,
  GraduationCap,
  House,
  Landmark,
  MapPinned,
  Plane,
  ShieldCheck,
  Stamp,
} from "lucide-react";
import { buttonClasses } from "@campus-one/ui";
import { articles, etablissements, faq, formations, journey, keyFigures, services } from "@campus-one/mocks";
import { Container, Eyebrow, SectionHeading } from "@/components/site/section";
import { Counter, Reveal } from "@/components/site/reveal";
import { SearchBar } from "@/components/site/search-bar";
import { Hero } from "@/components/site/hero";
import { FormationCard } from "@/components/site/formation-card";
import { Testimonials } from "@/components/site/testimonials";
import { Faq } from "@/components/site/faq";
import { serviceIcons } from "@/lib/icons";

const journeyIcons = [Compass, GraduationCap, Landmark, Stamp, House, MapPinned];

export default function HomePage() {
  return (
    <>
      <Hero />
      <Container className="relative z-10 -mt-16 lg:-mt-20">
        <Reveal>
          <SearchBar />
        </Reveal>
      </Container>

      {/* Chiffres clés */}
      <section aria-label="Chiffres clés" className="py-20">
        <Container>
          <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
            {keyFigures.map((k, i) => (
              <Reveal key={k.label} delay={i * 0.08} className="flex flex-col border-l border-line px-6">
                <dt className="order-2 mt-1 text-sm text-muted">{k.label}</dt>
                <dd className="text-4xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">
                  <Counter to={k.value} suffix={k.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* Parcours */}
      <section className="bg-surface py-24">
        <Container>
          <SectionHeading
            eyebrow="Le concept ONE"
            title="Un parcours complet, un seul interlocuteur"
            text="De la première réflexion jusqu'à votre arrivée, chaque étape est suivie dans votre espace personnel."
            align="center"
          />
          <ol className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
            <li className="absolute left-[8%] right-[8%] top-7 hidden h-px bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 lg:block" aria-hidden />
            {journey.map((s, i) => {
              const Icon = journeyIcons[i]!;
              return (
                <Reveal as="li" key={s.id} delay={i * 0.1} className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
                  <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-white text-brand-600 shadow-soft">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-brand-600">0{i + 1}</p>
                    <p className="mt-1 font-bold text-navy-900">{s.label}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
          <div className="mt-14 text-center">
            <Link href="/comment-ca-marche" className="inline-flex items-center gap-2 font-semibold text-brand-600 hover:text-brand-700">
              Découvrir le parcours en détail <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Container>
      </section>

      {/* Formations à la une */}
      <section className="py-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Catalogue" title="Formations à la une" text="Une sélection de programmes ouverts pour la rentrée 2027." />
            <Reveal>
              <Link href="/formations" className={buttonClasses({ variant: "outline" })}>
                Voir tout le catalogue <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {formations
              .filter((f) => f.status === "Ouvert")
              .slice(0, 3)
              .map((f, i) => (
                <Reveal key={f.slug} delay={i * 0.1} className="relative">
                  <FormationCard f={f} />
                </Reveal>
              ))}
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="bg-navy-950 py-24 text-white">
        <Container className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading
              light
              eyebrow="Accompagnement à 360°"
              title="Tout ce dont vous avez besoin pour partir sereinement"
              text="Nos conseillers prennent en charge chaque démarche avec vous, et vous tiennent informé à chaque avancée."
            />
            <Reveal className="relative mt-10 overflow-hidden rounded-3xl">
              <img src="/images/advisor.jpg" alt="Conseiller accompagnant des étudiants" className="aspect-[4/3] w-full object-cover" loading="lazy" />
            </Reveal>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {services.map((s, i) => {
              const Icon = serviceIcons[s.icon]!;
              return (
                <Reveal key={s.id} delay={(i % 2) * 0.08 + Math.floor(i / 2) * 0.05}>
                  <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-brand-400/40 hover:bg-white/[0.06]">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <p className="mt-4 font-semibold">{s.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-navy-200">{s.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Orientation */}
      <section className="py-24">
        <Container>
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-brand-500 px-6 py-14 sm:px-14">
            <div className="absolute -right-24 -top-24 size-80 rounded-full bg-white/10" aria-hidden />
            <div className="absolute -bottom-32 right-40 size-72 rounded-full bg-navy-900/15" aria-hidden />
            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <p className="text-sm font-semibold text-brand-100">Orientation personnalisée</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Vous ne savez pas quelle formation choisir ?</h2>
                <p className="mt-4 max-w-2xl text-lg text-brand-50">
                  Répondez à 8 questions sur votre parcours et vos envies. Un conseiller vous propose une sélection de formations adaptées sous 48 heures.
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <Link href="/orientation" className={buttonClasses({ variant: "white", size: "lg" })}>
                  Commencer le questionnaire
                  <ArrowRight className="size-5" aria-hidden />
                </Link>
                <p className="mt-3 text-sm text-brand-100">Environ 4 minutes · gratuit</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Galerie */}
      <section className="pb-24">
        <Container>
          <SectionHeading eyebrow="Vivre l'expérience" title="La France, votre nouveau campus" text="Des villes étudiantes dynamiques, des établissements reconnus et une vie culturelle riche." />
          <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
            {[
              { src: "/images/paris-seine.jpg", alt: "Paris, la Seine et la tour Eiffel", label: "Paris", cls: "col-span-2 row-span-2" },
              { src: "/images/amphitheater.jpg", alt: "Amphithéâtre universitaire", label: "Universités", cls: "" },
              { src: "/images/students-talk.jpg", alt: "Étudiants échangeant autour d'une table", label: "Vie étudiante", cls: "" },
              { src: "/images/library-aisle.jpg", alt: "Allée de bibliothèque", label: "Bibliothèques", cls: "" },
              { src: "/images/plane.jpg", alt: "Aile d'avion au-dessus des nuages", label: "Le départ", cls: "" },
            ].map((g, i) => (
              <Reveal key={g.src} delay={i * 0.06} className={`group relative overflow-hidden rounded-2xl ${g.cls}`}>
                <img src={g.src} alt={g.alt} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent" aria-hidden />
                <span className="absolute bottom-4 left-4 text-sm font-semibold text-white">{g.label}</span>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Témoignages */}
      <section className="bg-surface py-24">
        <Container>
          <Eyebrow>Témoignages</Eyebrow>
          <h2 className="mt-3 mb-12 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">Ils ont franchi le pas avec nous</h2>
          <Testimonials />
        </Container>
      </section>

      {/* Partenaires */}
      <section className="py-20" aria-labelledby="partenaires-title">
        <Container>
          <p id="partenaires-title" className="text-center text-sm font-semibold text-muted">Des établissements partenaires dans toute la France</p>
        </Container>
        <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <ul className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
            {[...etablissements, ...etablissements].map((e, i) => (
              <li key={i} aria-hidden={i >= etablissements.length} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-6 py-4">
                <span className="flex size-10 items-center justify-center rounded-xl bg-navy-50 text-sm font-extrabold text-navy-700">{e.short.slice(0, 2)}</span>
                <span>
                  <span className="block whitespace-nowrap font-semibold text-navy-900">{e.name}</span>
                  <span className="block text-xs text-muted">{e.city}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Actualités */}
      <section className="py-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Conseils" title="Guides et actualités" />
            <Reveal>
              <Link href="/actualites" className="inline-flex items-center gap-2 font-semibold text-brand-600 hover:text-brand-700">
                Tous les articles <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {articles.slice(0, 3).map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.08}>
                <Link href={`/actualites/${a.slug}`} className="group block">
                  <div className="aspect-[3/2] overflow-hidden rounded-2xl">
                    <img src={a.image} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  </div>
                  <p className="mt-5 text-xs font-semibold text-brand-600">{a.category} · {a.read} de lecture</p>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-navy-900 group-hover:text-brand-700">{a.title}</h3>
                  <p className="mt-2 text-sm text-muted">{a.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-surface py-24">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Questions fréquentes" title="Vous vous posez des questions ?" text="Nos conseillers répondent aussi sur WhatsApp, du lundi au samedi." />
            <Reveal className="mt-8 flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
              <ShieldCheck className="size-8 shrink-0 text-brand-500" aria-hidden />
              <p className="text-sm text-muted">Vos documents sont stockés de façon sécurisée et ne sont consultés que par votre conseiller.</p>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-8">
            <Faq items={faq} />
          </Reveal>
        </Container>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden bg-navy-950 py-24">
        <img src="/images/paris-night.jpg" alt="" className="absolute inset-0 size-full object-cover opacity-25" loading="lazy" />
        <Container className="relative text-center">
          <Reveal>
            <Plane className="mx-auto size-10 text-brand-300" aria-hidden />
            <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-bold tracking-tight text-balance text-white sm:text-5xl">
              Prêt à construire votre projet d'études ?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-navy-200">Créez votre espace en 2 minutes et déposez votre première candidature.</p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/candidater" className={buttonClasses({ size: "lg" })}>Déposer ma candidature</Link>
              <Link href="/contact" className={buttonClasses({ variant: "white", size: "lg" })}>Parler à un conseiller</Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
