"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CircleAlert, Info, Lock, Mail, ShieldCheck, Smartphone } from "lucide-react";
import { Avatar, Button, Field, Input, Logo, cn } from "@/components/ui";
import { roles } from "@/lib/mocks";
import { DEMO_PASSWORD, DEMO_TOTP, demoUsers, useSession, type RoleId } from "@/lib/admin/permissions";

function LoginFlow() {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/admin";
  const session = useSession();
  const [step, setStep] = React.useState<"password" | "mfa">("password");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [pendingRole, setPendingRole] = React.useState<RoleId | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [authError, setAuthError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (session.ready && session.role) router.replace(next);
  }, [session.ready, session.role, next, router]);

  const pick = (r: RoleId) => {
    setEmail(demoUsers[r].email);
    setPassword(DEMO_PASSWORD);
    setErrors({});
    setAuthError("");
  };

  function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!email.trim()) err.email = "Saisissez votre email professionnel.";
    if (!password) err.password = "Saisissez votre mot de passe.";
    setErrors(err);
    setAuthError("");
    if (Object.keys(err).length) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const role = (Object.keys(demoUsers) as RoleId[]).find((r) => demoUsers[r].email === email.trim().toLowerCase());
      if (!role || password !== DEMO_PASSWORD) {
        setAuthError("Identifiants incorrects. Après 5 tentatives, le compte est verrouillé 15 minutes.");
        return;
      }
      setPendingRole(role);
      setStep("mfa");
    }, 600);
  }

  function submitCode(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) return setErrors({ code: "Le code doit contenir 6 chiffres." });
    setLoading(true);
    setTimeout(() => {
      if (code !== DEMO_TOTP) {
        setLoading(false);
        setCode("");
        setErrors({ code: "Code incorrect ou expiré. Utilisez le code actuellement affiché dans votre application." });
        return;
      }
      session.signIn(pendingRole!);
      router.push(next);
    }, 500);
  }

  if (step === "mfa")
    return (
      <>
        <button onClick={() => { setStep("password"); setCode(""); setErrors({}); }} className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy-900">
          <ArrowLeft className="size-4" aria-hidden /> Changer de compte
        </button>
        <span className="mt-5 flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Smartphone className="size-6" aria-hidden /></span>
        <h1 className="mt-4 text-2xl font-bold text-navy-900">Vérification en deux étapes</h1>
        <p className="mt-1 text-sm text-muted">
          {demoUsers[pendingRole!].name}, saisissez le code à 6 chiffres affiché dans votre application d'authentification.
        </p>
        <form className="mt-6 space-y-4" onSubmit={submitCode} noValidate>
          <Field label="Code de vérification" htmlFor="totp" error={errors.code}>
            <Input id="totp" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" autoFocus className="text-center font-mono text-xl tracking-[0.5em]" error={errors.code} />
          </Field>
          <Button type="submit" size="lg" className="w-full" loading={loading}>Se connecter</Button>
          <p className="flex items-center justify-center gap-2 text-xs text-muted"><Info className="size-4" aria-hidden /> Démonstration : code <span className="font-mono font-semibold text-navy-900">{DEMO_TOTP}</span></p>
        </form>
      </>
    );

  return (
    <>
      <h1 className="mt-8 text-2xl font-bold text-navy-900">Connexion collaborateur</h1>
      <p className="mt-1 text-sm text-muted">Accès réservé aux équipes Campus One.</p>

      <fieldset className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/50 p-3">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-brand-700">Comptes de démonstration</legend>
        <div className="grid gap-1.5">
          {roles.map((r) => {
            const u = demoUsers[r.id];
            const on = email === u.email;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => pick(r.id)}
                aria-pressed={on}
                className={cn("flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors", on ? "bg-white shadow-soft ring-1 ring-brand-300" : "hover:bg-white/70")}
              >
                <Avatar name={u.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-navy-900">{u.name}</span>
                  <span className="block text-xs text-muted">{r.name}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 px-1 text-xs text-muted">Mot de passe commun : <span className="font-mono font-semibold text-navy-900">{DEMO_PASSWORD}</span></p>
      </fieldset>

      <form className="mt-6 space-y-4" onSubmit={submitPassword} noValidate>
        {authError && (
          <p className="flex gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-800" role="alert">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden /> {authError}
          </p>
        )}
        <Field label="Email professionnel" htmlFor="email" error={errors.email}>
          <Input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="size-4.5" />} error={errors.email} />
        </Field>
        <Field label="Mot de passe" htmlFor="pwd" error={errors.password}>
          <Input id="pwd" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="size-4.5" />} error={errors.password} />
        </Field>
        <Button type="submit" size="lg" className="w-full" loading={loading}>Continuer</Button>
      </form>
    </>
  );
}

export default function BackofficeLogin() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-navy-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgb(62_134_245/0.25),transparent)]" aria-hidden />
      <main id="contenu" className="relative w-full max-w-md animate-fade-up rounded-3xl bg-white p-8 shadow-lift sm:p-10">
        <Logo suffix="Back-office" />
        <React.Suspense>
          <LoginFlow />
        </React.Suspense>
        <p className="mt-8 flex items-center gap-2 border-t border-line pt-5 text-xs text-muted"><ShieldCheck className="size-4 text-emerald-600" aria-hidden /> Session expirée après 30 minutes d'inactivité. Connexions journalisées.</p>
      </main>
    </div>
  );
}
