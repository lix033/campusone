import type { AdminDossier } from "@campus-one/mocks";

export const paymentLabel: Record<AdminDossier["payment"], string> = {
  non_paye: "Non payé",
  en_attente: "En attente",
  paye: "Payé",
  exonere: "Exonéré",
};

export const paymentTone = { non_paye: "danger", en_attente: "warning", paye: "success", exonere: "neutral" } as const;

export const priorityTone = { haute: "danger", normale: "neutral", basse: "info" } as const;
