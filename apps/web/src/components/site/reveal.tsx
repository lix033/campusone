"use client";

import * as React from "react";
import { motion, useInView, animate } from "motion/react";

/** Apparition douce au défilement. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

/** Compteur animé pour les chiffres clés. */
export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  React.useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (node.textContent = new Intl.NumberFormat("fr-FR").format(Math.round(v)) + suffix),
    });
    return () => controls.stop();
  }, [inView, to, suffix]);
  return (
    <span ref={ref} aria-label={`${to}${suffix}`}>
      0{suffix}
    </span>
  );
}
