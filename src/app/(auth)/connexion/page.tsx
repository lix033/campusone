"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleAlert, Eye, EyeOff, Info, Lock, Mail } from "lucide-react";
import { Button, Field, Input } from "@/components/ui";
import { demoAccount, setPendingSession, useSession } from "@/lib/session";

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/mon-espace";
  const session = useSession();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [authError, setAuthError] = React.useState("");

  // Déjà connecté : on renvoie directement vers la destination.
  React.useEffect(() => {
    if (session) router.replace(next);
  }, [session, next, router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!email.trim()) err.email = "Saisissez votre adresse email.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) err.email = "Format attendu : nom@exemple.com";
    if (!password) err.password = "Saisissez votre mot de passe.";
    setErrors(err);
    setAuthError("");
    if (Object.keys(err).length) return;
    setLoading(true);
    setTimeout(() => {
      if (email.trim().toLowerCase() !== demoAccount.email || password !== demoAccount.password) {
        setLoading(false);
        setAuthError("Email ou mot de passe incorrect. Vérifiez vos informations et réessayez.");
        return;
      }
      setPendingSession({ firstName: "Aminata", lastName: "Diallo", email: demoAccount.email });
      router.push(`/verification?next=${encodeURIComponent(next)}`);
    }, 700);
  }

  return (
    <>
      <div className="mt-6 flex gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-4 text-sm">
        <Info className="mt-0.5 size-4.5 shrink-0 text-brand-600" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy-900">Compte de démonstration</p>
          <p className="mt-0.5 break-all text-muted">{demoAccount.email} · {demoAccount.password}</p>
          <button
            type="button"
            onClick={() => { setEmail(demoAccount.email); setPassword(demoAccount.password); setErrors({}); setAuthError(""); }}
            className="mt-2 font-semibold text-brand-700 hover:text-brand-800"
          >
            Remplir automatiquement
          </button>
        </div>
      </div>

      <form noValidate className="mt-6 space-y-5" onSubmit={submit}>
        {authError && (
          <p className="flex gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-800" role="alert">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden /> {authError}
          </p>
        )}
        <Field label="Email" htmlFor="email" error={errors.email}>
          <Input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="size-4.5" />} error={errors.email} />
        </Field>
        <Field label="Mot de passe" htmlFor="password" error={errors.password}>
          <div className="relative">
            <Input id="password" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="size-4.5" />} error={errors.password} className="pr-11" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-navy-900" aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
              {show ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
            </button>
          </div>
        </Field>
        <div className="flex justify-end">
          <Link href="/mot-de-passe-oublie" className="text-sm font-medium text-brand-600 hover:text-brand-700">Mot de passe oublié ?</Link>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={loading}>Se connecter</Button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="animate-fade-up">
      <h1 className="text-3xl font-bold tracking-tight text-navy-900">Bon retour parmi nous</h1>
      <p className="mt-2 text-muted">Connectez-vous pour suivre vos candidatures.</p>
      <React.Suspense>
        <LoginForm />
      </React.Suspense>
      <p className="mt-8 text-center text-sm text-muted">
        Pas encore de compte ? <Link href="/inscription" className="font-semibold text-brand-600 hover:text-brand-700">Créer mon espace</Link>
      </p>
    </div>
  );
}
