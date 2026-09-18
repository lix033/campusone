import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { buttonClasses } from "@/components/ui";
import { articles } from "@/lib/mocks";
import { Container } from "@/components/site/section";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: articles.find((a) => a.slug === slug)?.title };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  return (
    <article className="pb-20">
      <Container className="max-w-3xl pt-12">
        <Link href="/actualites" className="inline-flex items-center gap-2 text-sm text-muted hover:text-navy-900"><ArrowLeft className="size-4" aria-hidden /> Toutes les actualités</Link>
        <p className="mt-8 text-sm font-semibold text-brand-600">{a.category}</p>
        <h1 className="mt-3 animate-fade-up text-3xl font-bold tracking-tight text-navy-900 sm:text-5xl">{a.title}</h1>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted">{a.date} · <Clock className="size-4" aria-hidden /> {a.read} de lecture</p>
      </Container>
      <Container className="mt-10 max-w-5xl">
        <img src={a.image} alt="" className="aspect-[2/1] w-full animate-fade-up rounded-3xl object-cover" />
      </Container>
      <Container className="mt-12 max-w-3xl space-y-6 text-lg leading-relaxed text-navy-800">
        <p className="text-xl text-muted">{a.excerpt}</p>
        <p>Contenu de démonstration. Dans la version finale, cet article sera administré depuis le back-office et optimisé pour le référencement naturel (titres structurés, métadonnées, liens internes vers les formations concernées).</p>
        <h2 className="pt-4 text-2xl font-bold text-navy-900">Les points essentiels</h2>
        <ul className="list-disc space-y-2 pl-6 marker:text-brand-500">
          <li>Anticipez : la plupart des démarches prennent plusieurs semaines.</li>
          <li>Préparez vos documents au format PDF, lisibles et complets.</li>
          <li>Faites relire votre dossier par votre conseiller avant chaque envoi.</li>
        </ul>
        <p>Votre conseiller Campus One peut vous accompagner sur chacun de ces points depuis votre espace personnel.</p>
        <div className="!mt-12 rounded-3xl bg-brand-50 p-8">
          <p className="text-xl font-bold text-navy-900">Besoin d'un accompagnement personnalisé ?</p>
          <p className="mt-2 text-base text-muted">Un conseiller étudie votre projet gratuitement.</p>
          <Link href="/contact#rendez-vous" className={buttonClasses({ className: "mt-5" })}>Prendre rendez-vous <ArrowRight className="size-4" aria-hidden /></Link>
        </div>
      </Container>
    </article>
  );
}
