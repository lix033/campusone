"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, CircleCheck, Compass } from "lucide-react";
import { Button, Input, Progress, buttonClasses, cn } from "@campus-one/ui";
import { formations } from "@campus-one/mocks";
import { Container } from "./section";
import { FormationCard } from "./formation-card";

const questions = [
  { id: "diplome", q: "Quel est votre dernier diplôme obtenu ?", options: ["Baccalauréat", "BTS / DUT (Bac+2)", "Licence (Bac+3)", "Master 1 (Bac+4)", "Master 2 ou plus"] },
  { id: "domaine", q: "Dans quel domaine avez-vous étudié ?", options: ["Commerce, gestion, économie", "Informatique, mathématiques", "Sciences, ingénierie", "Droit, sciences politiques", "Santé, biologie", "Lettres, communication"] },
  { id: "resultats", q: "Comment décririez-vous vos résultats académiques ?", options: ["Excellents (plus de 15/20)", "Bons (13 à 15/20)", "Corrects (11 à 13/20)", "Moyens (moins de 11/20)"] },
  { id: "experience", q: "Avez-vous une expérience professionnelle ?", options: ["Aucune", "Stages uniquement", "Moins de 2 ans", "Plus de 2 ans"] },
  { id: "metier", q: "Quel métier souhaitez-vous exercer ?", free: true, placeholder: "Par exemple : data analyst, chef de projet export…" },
  { id: "pays", q: "Dans quel pays souhaitez-vous étudier ?", options: ["France", "Belgique", "Canada", "Je suis ouvert(e)"] },
  { id: "budget", q: "Quel budget annuel pour les frais de scolarité ?", options: ["Moins de 5 000 €", "5 000 à 8 000 €", "8 000 à 12 000 €", "Plus de 12 000 €"] },
  { id: "langue", q: "Quel est votre niveau de français ?", options: ["Langue maternelle / C2", "C1", "B2", "B1 ou moins"] },
] as const;

export function Orientation() {
  const [step, setStep] = React.useState(-1);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [dir, setDir] = React.useState(1);
  const done = step >= questions.length;
  const q = questions[step];

  const go = (d: number) => {
    setDir(d);
    setStep((s) => s + d);
  };

  if (step === -1)
    return (
      <Container className="max-w-3xl py-20 text-center">
        <span className="mx-auto flex size-16 animate-fade-up items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Compass className="size-8" aria-hidden /></span>
        <h1 className="mt-6 animate-fade-up text-3xl font-bold tracking-tight text-navy-900 sm:text-5xl">Je ne sais pas quelle formation choisir</h1>
        <p className="mx-auto mt-5 max-w-xl animate-fade-up text-lg text-muted">Répondez à 8 questions courtes. Nous vous proposons immédiatement quelques pistes, puis un conseiller affine la sélection sous 48 heures.</p>
        <ul className="mx-auto mt-8 flex max-w-lg flex-col gap-2 text-left text-sm text-muted sm:flex-row sm:justify-center sm:gap-6">
          {["Environ 4 minutes", "Sans engagement", "Réponses modifiables"].map((x) => (
            <li key={x} className="flex items-center gap-2"><CircleCheck className="size-4 text-emerald-500" aria-hidden /> {x}</li>
          ))}
        </ul>
        <Button size="lg" className="mt-10" onClick={() => go(1)}>Commencer <ArrowRight className="size-5" aria-hidden /></Button>
      </Container>
    );

  if (done) {
    const picks = formations.filter((f) => f.status === "Ouvert").slice(0, 3);
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-2xl animate-fade-up text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CircleCheck className="size-7" aria-hidden /></span>
          <h1 className="mt-5 text-3xl font-bold text-navy-900">Voici de premières pistes pour vous</h1>
          <p className="mt-3 text-muted">Ces formations correspondent à votre profil. Un conseiller vous contactera sous 48 heures pour affiner cette sélection.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {picks.map((f, i) => (
            <div key={f.slug} className="animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}><FormationCard f={f} /></div>
          ))}
        </div>
        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/inscription" className={buttonClasses({ size: "lg" })}>Créer mon espace pour être recontacté</Link>
          <Button variant="outline" size="lg" onClick={() => { setAnswers({}); setStep(-1); }}>Recommencer</Button>
        </div>
      </Container>
    );
  }

  const value = answers[q!.id] ?? "";
  return (
    <Container className="max-w-2xl py-12 sm:py-20">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-navy-900">Question {step + 1} sur {questions.length}</span>
        <span className="text-muted">{Math.round((step / questions.length) * 100)} %</span>
      </div>
      <Progress value={((step + 1) / questions.length) * 100} className="mt-3" label="Progression du questionnaire" />
      <div className="relative mt-10 min-h-[380px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.fieldset
            key={step}
            initial={{ opacity: 0, x: 30 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 * dir }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <legend className="text-2xl font-bold text-navy-900 sm:text-3xl">{q!.q}</legend>
            {"free" in q! ? (
              <div className="mt-8">
                <label htmlFor="free" className="sr-only">{q!.q}</label>
                <Input id="free" autoFocus value={value} placeholder={q!.placeholder} onChange={(e) => setAnswers((a) => ({ ...a, [q!.id]: e.target.value }))} className="h-14 text-base" />
                <p className="mt-2 text-sm text-muted">Pas encore d'idée précise ? Vous pouvez passer cette question.</p>
              </div>
            ) : (
              <div className="mt-8 grid gap-3" role="radiogroup">
                {q!.options.map((o) => (
                  <button
                    key={o}
                    role="radio"
                    aria-checked={value === o}
                    onClick={() => {
                      setAnswers((a) => ({ ...a, [q!.id]: o }));
                      setTimeout(() => go(1), 220);
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border px-5 py-4 text-left font-medium transition-all",
                      value === o ? "border-brand-500 bg-brand-50 text-navy-900 ring-4 ring-brand-100" : "border-line text-navy-800 hover:border-brand-300 hover:bg-surface",
                    )}
                  >
                    {o}
                    <span className={cn("flex size-5 items-center justify-center rounded-full border-2", value === o ? "border-brand-500 bg-brand-500" : "border-slate-300")} aria-hidden>
                      {value === o && <span className="size-2 rounded-full bg-white" />}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.fieldset>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex justify-between border-t border-line pt-6">
        <Button variant="ghost" onClick={() => go(-1)}><ArrowLeft className="size-4" aria-hidden /> Précédent</Button>
        <Button onClick={() => go(1)} variant={value ? "primary" : "outline"}>
          {step === questions.length - 1 ? "Voir mes résultats" : value ? "Suivant" : "Passer"} <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    </Container>
  );
}
