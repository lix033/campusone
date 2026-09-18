"use client";

import * as React from "react";
import { X } from "lucide-react";
import { contact } from "@campus-one/mocks";
import { WhatsAppIcon } from "./whatsapp-icon";

export function WhatsAppButton() {
  const [open, setOpen] = React.useState(false);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShown(true), 2500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {shown && open && (
        <div className="w-72 animate-toast-in rounded-2xl border border-line bg-white p-4 shadow-lift">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-navy-900">Besoin d'aide ?</p>
            <button onClick={() => setOpen(false)} className="rounded p-0.5 text-slate-400 hover:text-navy-900" aria-label="Fermer">
              <X className="size-4" />
            </button>
          </div>
          <p className="mt-1 text-sm text-muted">Discutez avec un conseiller Campus One. Réponse en moins d'une heure en journée.</p>
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-semibold text-white hover:brightness-95"
          >
            <WhatsAppIcon className="size-4" />
            Démarrer la discussion
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="group flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform hover:scale-105"
        aria-label="Besoin d'aide ? Discutez avec un conseiller Campus One sur WhatsApp"
        aria-expanded={open}
      >
        <span className="absolute size-14 animate-ping rounded-full bg-[#25D366] opacity-20 [animation-duration:2.5s]" aria-hidden />
        <WhatsAppIcon className="relative size-7" />
      </button>
    </div>
  );
}
