"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, MapPin, Pause, Play } from "lucide-react";
import { Avatar, buttonClasses } from "@/components/ui";

const slides = [
  { src: "/images/paris-seine.jpg", alt: "Paris, la Seine et la tour Eiffel au coucher du soleil", place: "Paris, France" },
  { src: "/images/amphitheater.jpg", alt: "Amphithéâtre universitaire", place: "Vos futurs amphithéâtres" },
  { src: "/images/students-talk.jpg", alt: "Étudiants échangeant autour d'une table", place: "Une vie étudiante riche" },
];

const DURATION = 7000;

/**
 * Ligne frontière : un tracé pointillé, comme une frontière sur une carte, se dessine
 * sous le mot puis s'efface — la frontière ne tient pas.
 */
function BorderLine({ reduce }: { reduce: boolean }) {
  const dashes = "repeating-linear-gradient(90deg, currentColor 0 9px, transparent 9px 17px)";

  if (reduce) {
    return <span aria-hidden className="absolute inset-x-0 -bottom-[0.08em] h-[0.06em] rounded-full opacity-70" style={{ backgroundImage: dashes }} />;
  }

  return (
    <motion.span
      aria-hidden
      className="absolute inset-x-0 -bottom-[0.08em] h-[0.06em] rounded-full"
      style={{ backgroundImage: dashes }}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 100%)"] }}
      transition={{ duration: 5.4, times: [0, 0.28, 0.7, 1], ease: [0.22, 1, 0.36, 1], repeat: Infinity, repeatDelay: 0.6 }}
    />
  );
}

export function Hero() {
  const ref = React.useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [i, setI] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);

  // Profondeur : l'image descend plus lentement que le contenu au défilement.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "22%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  // Le passage à l'image suivante est déclenché par la fin de la barre de progression (CSS) :
  // la pause fige ainsi la barre et le diaporama au même instant.
  const nextSlide = () => setI((v) => (v + 1) % slides.length);

  const slide = slides[i]!;

  return (
    <section ref={ref} className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-navy-950 pb-28 pt-16 lg:min-h-[min(88vh,820px)] lg:pb-36">
      {/* Image plein cadre : fondu enchaîné + zoom lent (effet Ken Burns) */}
      <motion.div style={{ y }} className="absolute inset-0 -z-10" aria-hidden>
        <AnimatePresence initial={false}>
          <motion.img
            key={slide.src}
            src={slide.src}
            alt=""
            className="absolute inset-0 size-full object-cover"
            initial={{ opacity: 0, scale: reduce ? 1 : 1.12 }}
            animate={{ opacity: 1, scale: reduce ? 1 : 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.4, ease: "easeInOut" }, scale: { duration: (DURATION + 1400) / 1000, ease: "linear" } }}
          />
        </AnimatePresence>
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/90 via-navy-950/60 to-navy-950/10" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-navy-950/70 to-transparent" aria-hidden />

      <motion.div style={{ y: textY, opacity: fade }} className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <span className="size-1.5 rounded-full bg-brand-300" aria-hidden />
            Candidatures ouvertes · Rentrée 2027
          </span>
          <h1 className="mt-6 animate-fade-up text-4xl font-bold text-balance text-white [animation-delay:80ms] sm:text-5xl lg:text-6xl">
            Votre avenir n'a pas{" "}
            <span className="relative inline-block whitespace-nowrap text-brand-300">
              de frontières.
              <BorderLine reduce={!!reduce} />
            </span>
          </h1>
          <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-navy-100 [animation-delay:160ms]">
            Construisez votre projet d'études à l'international avec Campus One. Un seul interlocuteur, de l'orientation jusqu'à votre installation en France.
          </p>
          <div className="mt-8 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <Link href="/formations" className={buttonClasses({ size: "lg" })}>
              Trouver ma formation
              <ArrowRight className="size-5" aria-hidden />
            </Link>
            <Link href="/candidater" className={buttonClasses({ size: "lg", className: "border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20" })}>
              Déposer ma candidature
            </Link>
          </div>
          <div className="mt-10 flex animate-fade-up items-center gap-4 [animation-delay:320ms]">
            <div className="flex -space-x-2">
              {["Aïcha Koné", "Mawuli Agbéko", "Fatou Ndiaye", "Jean Tchouaméni"].map((n) => (
                <Avatar key={n} name={n} className="ring-2 ring-navy-950" />
              ))}
            </div>
            <p className="text-sm text-navy-100">
              <span className="font-semibold text-white">1 200+ étudiants</span> accompagnés depuis 2019
            </p>
          </div>
        </div>
      </motion.div>

      {/* Lieu affiché + contrôle du diaporama (pause obligatoire pour un contenu animé) */}
      <div className="absolute right-4 top-5 flex items-center gap-3 sm:bottom-24 sm:right-6 sm:top-auto lg:bottom-32 lg:right-8">
        <p className="hidden items-center gap-1.5 text-sm font-medium text-white/90 sm:flex" aria-live="polite">
          <MapPin className="size-4 text-brand-300" aria-hidden />
          {slide.place}
        </p>
        <div className="flex items-center gap-1.5" role="group" aria-label="Choisir une image">
          {slides.map((s, k) => (
            <button
              key={s.src}
              onClick={() => setI(k)}
              aria-label={s.place}
              aria-current={k === i}
              className="relative h-1 w-8 overflow-hidden rounded-full bg-white/30"
            >
              {k === i && (
                <span
                  key={i}
                  onAnimationEnd={nextSlide}
                  className="absolute inset-0 origin-left bg-white"
                  style={
                    reduce
                      ? undefined
                      : { animation: `hero-progress ${DURATION}ms linear forwards`, animationPlayState: playing ? "running" : "paused" }
                  }
                />
              )}
            </button>
          ))}
        </div>
        {!reduce && (
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex size-8 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/15"
            aria-label={playing ? "Mettre le diaporama en pause" : "Reprendre le diaporama"}
          >
            {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </button>
        )}
      </div>
    </section>
  );
}
