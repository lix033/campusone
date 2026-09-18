import * as React from "react";
import { cn } from "@campus-one/ui";
import { Reveal } from "./reveal";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-600", className)}>
      <span className="h-px w-6 bg-brand-400" aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  className,
  light,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}) {
  return (
    <Reveal className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow && <Eyebrow className={cn(light && "text-brand-300")}>{eyebrow}</Eyebrow>}
      <h2 className={cn("mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl", light ? "text-white" : "text-navy-900")}>{title}</h2>
      {text && <p className={cn("mt-4 text-lg leading-relaxed text-pretty", light ? "text-navy-200" : "text-muted")}>{text}</p>}
    </Reveal>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  image,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      {image && (
        <>
          <img src={image} alt="" className="absolute inset-0 size-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" aria-hidden />
        </>
      )}
      <Container className="relative py-16 sm:py-24">
        <div className="max-w-2xl animate-fade-up">
          <Eyebrow className="text-brand-300">{eyebrow}</Eyebrow>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl">{title}</h1>
          {text && <p className="mt-5 text-lg leading-relaxed text-navy-200">{text}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
