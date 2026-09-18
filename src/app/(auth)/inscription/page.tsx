"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Eye, EyeOff } from "lucide-react";
import { Button, Checkbox, Field, Input, cn } from "@/components/ui";
import { setPendingSession } from "@/lib/session";

const rules = [
  { label: "8 caractères minimum", test: (p: string) => p.length >= 8 },
  { label: "Une majuscule", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Un chiffre", test: (p: string) => /\d/.test(p) },
];

function SignupForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/mon-espace";
  const [pwd, setPwd] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const score = rules.filter((r) => r.test(pwd)).length;

  return (
    <form
      noValidate
      className="mt-8 grid gap-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
        const err: Record<string, string> = {};
        if (!d.firstName?.trim()) err.firstName = "Indiquez votre prénom.";
        if (!d.lastName?.trim()) err.lastName = "Indiquez votre nom.";
        if (!/^\S+@\S+\.\S+$/.test(d.email ?? "")) err.email = "Saisissez une adresse email valide.";
        if (score < rules.length) err.password = "Le mot de passe ne respecte pas encore tous les critères.";
        if (!d.terms) err.terms = "Vous devez accepter les conditions pour créer votre compte.";
        setErrors(err);
        if (Object.keys(err).length) return;
        setLoading(true);
        setPendingSession({ firstName: d.firstName!.trim(), lastName: d.lastName!.trim(), email: d.email!.trim() });
        setTimeout(() => router.push(`/verification?mode=signup&next=${encodeURIComponent(next)}`), 800);
      }}
    >
      <Field label="Prénom" htmlFor="firstName" required error={errors.firstName}>
        <Input id="firstName" name="firstName" autoComplete="given-name" error={errors.firstName} />
      </Field>
      <Field label="Nom" htmlFor="lastName" required error={errors.lastName}>
        <Input id="lastName" name="lastName" autoComplete="family-name" error={errors.lastName} />
      </Field>
      <Field label="Email" htmlFor="email" required error={errors.email} className="sm:col-span-2" hint="Un code de vérification vous sera envoyé à cette adresse.">
        <Input id="email" name="email" type="email" autoComplete="email" error={errors.email} />
      </Field>
      <Field label="Téléphone / WhatsApp" htmlFor="phone" optional className="sm:col-span-2">
        <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+228 90 00 00 00" />
      </Field>
      <Field label="Mot de passe" htmlFor="password" required error={errors.password} className="sm:col-span-2">
        <div className="relative">
          <Input id="password" name="password" type={show ? "text" : "password"} autoComplete="new-password" value={pwd} onChange={(e) => setPwd(e.target.value)} error={errors.password} className="pr-11" aria-describedby="pwd-rules" />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-navy-900" aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
            {show ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
          </button>
        </div>
        <div className="mt-2 flex gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i < score ? (score === 3 ? "bg-emerald-500" : "bg-amber-400") : "bg-navy-100")} />
          ))}
        </div>
        <ul id="pwd-rules" className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {rules.map((r) => {
            const ok = r.test(pwd);
            return (
              <li key={r.label} className={cn("flex items-center gap-1 text-xs", ok ? "text-emerald-600" : "text-muted")}>
                <Check className={cn("size-3.5", !ok && "opacity-30")} aria-hidden /> {r.label}
                <span className="sr-only">{ok ? "respecté" : "non respecté"}</span>
              </li>
            );
          })}
        </ul>
      </Field>
      <Field label="Code partenaire" htmlFor="partner" optional className="sm:col-span-2" hint="Si un agent ou un établissement vous a orienté vers Campus One.">
        <Input id="partner" name="partner" placeholder="Ex. PART-LOME-07" className="uppercase" />
      </Field>
      <div className="space-y-3 sm:col-span-2">
        <Checkbox id="terms" name="terms" label={<>J'accepte les <a href="#" className="font-medium text-brand-600 underline-offset-2 hover:underline">conditions d'utilisation</a> et la <a href="#" className="font-medium text-brand-600 underline-offset-2 hover:underline">politique de confidentialité</a>.</>} />
        {errors.terms && <p className="text-sm text-rose-600" role="alert">{errors.terms}</p>}
        <Checkbox id="news" name="news" label="Je souhaite recevoir des conseils et actualités par email." />
      </div>
      <Button type="submit" size="lg" loading={loading} className="w-full sm:col-span-2">Créer mon compte</Button>
    </form>
  );
}

export default function SignupPage() {
  return (
    <div className="animate-fade-up">
      <h1 className="text-3xl font-bold tracking-tight text-navy-900">Créer mon espace</h1>
      <p className="mt-2 text-muted">Suivez vos candidatures, déposez vos documents et échangez avec votre conseiller.</p>
      <React.Suspense>
        <SignupForm />
      </React.Suspense>
      <p className="mt-8 text-center text-sm text-muted">
        Déjà inscrit ? <Link href="/connexion" className="font-semibold text-brand-600 hover:text-brand-700">Se connecter</Link>
      </p>
    </div>
  );
}
