"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { useToast } from "@campus-one/ui";

export function NewsletterForm() {
  const toast = useToast();
  const [email, setEmail] = React.useState("");
  return (
    <form
      className="mt-3 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          toast({ title: "Adresse email invalide", description: "Vérifiez le format, par exemple nom@exemple.com.", tone: "error" });
          return;
        }
        setEmail("");
        toast({ title: "Inscription confirmée", description: "Vous recevrez nos prochains conseils par email." });
      }}
    >
      <label htmlFor="newsletter" className="sr-only">Adresse email</label>
      <input
        id="newsletter"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre email"
        className="h-10 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-navy-300 focus:border-brand-400 focus:outline-none"
      />
      <button className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white hover:bg-brand-600" aria-label="S'inscrire">
        <ArrowRight className="size-4" />
      </button>
    </form>
  );
}
