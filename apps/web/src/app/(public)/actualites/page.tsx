import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@campus-one/mocks";
import { Container, PageHero } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = { title: "Actualités & conseils" };

export default function BlogPage() {
  const [first, ...rest] = articles;
  return (
    <>
      <PageHero eyebrow="Actualités" title="Conseils pour réussir votre projet" text="Campus France, budget, logement, installation : nos guides pratiques rédigés par nos conseillers." />
      <section className="py-16">
        <Container>
          <Reveal>
            <Link href={`/actualites/${first!.slug}`} className="group grid overflow-hidden rounded-3xl border border-line bg-white shadow-soft lg:grid-cols-2">
              <div className="overflow-hidden"><img src={first!.image} alt="" className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105 lg:h-full" /></div>
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <p className="text-sm font-semibold text-brand-600">À la une · {first!.category}</p>
                <h2 className="mt-3 text-2xl font-bold text-navy-900 group-hover:text-brand-700 sm:text-3xl">{first!.title}</h2>
                <p className="mt-3 text-muted">{first!.excerpt}</p>
                <p className="mt-6 text-sm text-muted">{first!.date} · {first!.read} de lecture</p>
              </div>
            </Link>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 0.08}>
                <Link href={`/actualites/${a.slug}`} className="group block">
                  <div className="aspect-[3/2] overflow-hidden rounded-2xl"><img src={a.image} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" /></div>
                  <p className="mt-5 text-xs font-semibold text-brand-600">{a.category} · {a.read}</p>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-navy-900 group-hover:text-brand-700">{a.title}</h3>
                  <p className="mt-2 text-sm text-muted">{a.excerpt}</p>
                  <p className="mt-3 text-xs text-muted">{a.date}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
