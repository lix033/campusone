"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Avatar, cn } from "@campus-one/ui";
import { testimonials } from "@campus-one/mocks";

export function Testimonials() {
  const [i, setI] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const n = testimonials.length;
  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 7000);
    return () => clearInterval(t);
  }, [paused, n]);
  const t = testimonials[i]!;

  return (
    <div
      className="grid gap-10 lg:grid-cols-12 lg:items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative lg:col-span-5">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
          <img src="/images/graduation.jpg" alt="Étudiants diplômés lançant leur toque" className="size-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" aria-hidden />
          <div className="absolute inset-x-6 bottom-6 text-white">
            <p className="text-4xl font-bold">96 %</p>
            <p className="mt-1 text-sm text-navy-100">des étudiants accompagnés recommandent Campus One à leurs proches</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7" aria-roledescription="carrousel" aria-label="Témoignages d'étudiants">
        <Quote className="size-12 text-brand-200" aria-hidden />
        <div className="relative mt-4 min-h-[260px] sm:min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
            >
              <div className="flex gap-0.5" aria-label={`${t.rating} sur 5`}>
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} className="size-4 fill-amber-400 text-amber-400" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-4 text-xl leading-relaxed font-medium text-navy-900 text-pretty sm:text-2xl">« {t.quote} »</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar name={t.name} size="lg" />
                <div>
                  <p className="font-semibold text-navy-900">{t.name}</p>
                  <p className="text-sm text-muted">{t.program} · {t.origin}</p>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <div className="flex gap-2">
            <button onClick={() => setI((i - 1 + n) % n)} className="flex size-11 items-center justify-center rounded-full border border-line text-navy-900 transition-colors hover:border-navy-300 hover:bg-navy-50" aria-label="Témoignage précédent">
              <ChevronLeft className="size-5" />
            </button>
            <button onClick={() => setI((i + 1) % n)} className="flex size-11 items-center justify-center rounded-full border border-line text-navy-900 transition-colors hover:border-navy-300 hover:bg-navy-50" aria-label="Témoignage suivant">
              <ChevronRight className="size-5" />
            </button>
          </div>
          <div className="flex gap-1.5" role="tablist" aria-label="Choisir un témoignage">
            {testimonials.map((x, k) => (
              <button
                key={x.name}
                role="tab"
                aria-selected={k === i}
                aria-label={`Témoignage de ${x.name}`}
                onClick={() => setI(k)}
                className={cn("h-1.5 rounded-full transition-all duration-300", k === i ? "w-8 bg-brand-500" : "w-3 bg-navy-100 hover:bg-navy-200")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
