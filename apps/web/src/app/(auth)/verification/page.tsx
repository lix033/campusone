"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Info, MailCheck } from "lucide-react";
import { Button, cn, useToast } from "@campus-one/ui";
import { confirmSession, demoAccount, getPendingSession } from "@/lib/session";

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  return `${user!.slice(0, 1)}•••••@${domain}`;
}

function Otp() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/mon-espace";
  const signup = sp.get("mode") === "signup";
  const toast = useToast();
  const [email, setEmail] = React.useState<string | null>(null);
  const [code, setCode] = React.useState<string[]>(Array(6).fill(""));
  const [error, setError] = React.useState("");
  const [attempts, setAttempts] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [timer, setTimer] = React.useState(45);
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Sans étape mot de passe préalable, on revient à la connexion.
  React.useEffect(() => {
    const pending = getPendingSession();
    if (!pending) router.replace(`/connexion?next=${encodeURIComponent(next)}`);
    else setEmail(pending.email);
    refs.current[0]?.focus();
  }, [next, router]);
  React.useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const verify = (digits: string[]) => {
    if (digits.join("").length < 6) return setError("Saisissez les 6 chiffres du code.");
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (digits.join("") !== demoAccount.code) {
        const n = attempts + 1;
        setAttempts(n);
        setLoading(false);
        setCode(Array(6).fill(""));
        refs.current[0]?.focus();
        setError(n >= 3 ? "Trop de tentatives. Demandez un nouveau code." : `Code incorrect. Il vous reste ${3 - n} essai${3 - n > 1 ? "s" : ""}.`);
        return;
      }
      confirmSession();
      toast({ title: signup ? "Compte créé" : "Connexion réussie", description: signup ? "Bienvenue sur votre espace Campus One." : undefined });
      router.push(next);
    }, 600);
  };

  const locked = attempts >= 3;

  const update = (i: number, v: string) => {
    const digits = v.replace(/\D/g, "");
    if (!digits && v) return;
    const nextCode = [...code];
    if (digits.length > 1) {
      digits.slice(0, 6 - i).split("").forEach((d, k) => (nextCode[i + k] = d));
      setCode(nextCode);
      refs.current[Math.min(5, i + digits.length)]?.focus();
      if (nextCode.every(Boolean)) verify(nextCode);
      return;
    }
    nextCode[i] = digits;
    setCode(nextCode);
    if (digits && i < 5) refs.current[i + 1]?.focus();
    if (nextCode.every(Boolean)) verify(nextCode);
  };

  return (
    <>
      <p className="mt-2 text-muted">
        Nous avons envoyé un code à 6 chiffres à <span className="font-semibold text-navy-900">{email ? maskEmail(email) : "votre adresse"}</span>. Il expire dans 10 minutes.
      </p>
      <form onSubmit={(e) => { e.preventDefault(); verify(code); }} className="mt-8">
        <fieldset disabled={locked || loading}>
          <legend className="text-sm font-medium text-navy-900">Code de vérification</legend>
          <div className="mt-3 flex gap-2 sm:gap-3">
            {code.map((c, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                value={c}
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={6}
                aria-label={`Chiffre ${i + 1}`}
                aria-invalid={!!error || undefined}
                onChange={(e) => update(i, e.target.value)}
                onKeyDown={(e) => e.key === "Backspace" && !c && i > 0 && refs.current[i - 1]?.focus()}
                className={cn(
                  "h-14 w-full min-w-0 rounded-xl border text-center text-xl font-bold text-navy-900 transition-colors focus:outline-none focus:ring-4 disabled:opacity-50",
                  error ? "border-rose-300 focus:ring-rose-100" : "border-line focus:border-brand-400 focus:ring-brand-100",
                  c && !error && "border-brand-300 bg-brand-50/50",
                )}
              />
            ))}
          </div>
        </fieldset>
        {error && <p className="mt-2 text-sm text-rose-600" role="alert">{error}</p>}
        <Button type="submit" size="lg" className="mt-6 w-full" loading={loading} disabled={locked}>Vérifier</Button>
        <p className="mt-6 text-center text-sm text-muted">
          Vous n'avez rien reçu ?{" "}
          {timer > 0 && !locked ? (
            <span>Nouveau code possible dans {timer} s</span>
          ) : (
            <button type="button" onClick={() => { setTimer(45); setAttempts(0); setError(""); setCode(Array(6).fill("")); toast({ title: "Nouveau code envoyé", tone: "info" }); }} className="font-semibold text-brand-600 hover:text-brand-700">Renvoyer le code</button>
          )}
        </p>
        <p className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-surface p-3 text-xs text-muted">
          <Info className="size-4 shrink-0" aria-hidden /> Démonstration : le code reçu est <span className="font-mono font-semibold text-navy-900">{demoAccount.code}</span>
        </p>
      </form>
    </>
  );
}

export default function VerificationPage() {
  return (
    <div className="animate-fade-up">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><MailCheck className="size-7" aria-hidden /></span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-navy-900">Vérifiez votre email</h1>
      <React.Suspense><Otp /></React.Suspense>
    </div>
  );
}
