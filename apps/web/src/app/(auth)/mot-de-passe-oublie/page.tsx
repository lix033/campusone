"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, MailCheck } from "lucide-react";
import { Button, Field, Input } from "@campus-one/ui";

export default function ForgotPage() {
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  return (
    <div className="animate-fade-up">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        {sent ? <MailCheck className="size-7" aria-hidden /> : <KeyRound className="size-7" aria-hidden />}
      </span>
      {sent ? (
        <>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-navy-900">Consultez votre boîte mail</h1>
          <p className="mt-2 text-muted">Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation valable 30 minutes. Pensez à vérifier vos courriers indésirables.</p>
        </>
      ) : (
        <>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-navy-900">Mot de passe oublié</h1>
          <p className="mt-2 text-muted">Indiquez votre email : nous vous enverrons un lien pour choisir un nouveau mot de passe.</p>
          <form
            noValidate
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const email = String(new FormData(e.currentTarget).get("email") ?? "");
              if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Saisissez une adresse email valide.");
              setError("");
              setLoading(true);
              setTimeout(() => setSent(true), 800);
            }}
          >
            <Field label="Email" htmlFor="email" error={error}>
              <Input id="email" name="email" type="email" autoComplete="email" error={error} />
            </Field>
            <Button type="submit" size="lg" className="w-full" loading={loading}>Envoyer le lien</Button>
          </form>
        </>
      )}
      <Link href="/connexion" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700">
        <ArrowLeft className="size-4" aria-hidden /> Retour à la connexion
      </Link>
    </div>
  );
}
