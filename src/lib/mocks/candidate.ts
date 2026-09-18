// Données fictives de l'espace candidat (compte de démonstration).

export type DocStatus = "a_fournir" | "depose" | "en_verification" | "a_corriger" | "valide";

export const docStatusLabel: Record<DocStatus, string> = {
  a_fournir: "À fournir",
  depose: "Déposé",
  en_verification: "En vérification",
  a_corriger: "À corriger",
  valide: "Validé",
};

export const docStatusTone: Record<DocStatus, "neutral" | "info" | "warning" | "danger" | "success"> = {
  a_fournir: "neutral",
  depose: "info",
  en_verification: "warning",
  a_corriger: "danger",
  valide: "success",
};

export type CandidateDocument = {
  id: string;
  type: string;
  required: boolean;
  status: DocStatus;
  file?: string;
  size?: string;
  uploadedAt?: string;
  version?: number;
  reason?: string;
  maxMb: number;
};

export type StepState = "done" | "current" | "upcoming";

export const me = {
  firstName: "Aminata",
  lastName: "Diallo",
  email: "aminata.diallo@exemple.com",
  phone: "+228 91 23 45 67",
  birthDate: "2002-04-14",
  nationality: "Togolaise",
  country: "Togo",
  city: "Lomé",
  partnerCode: "PART-LOME-07",
  advisor: { name: "Claire Mensah", role: "Conseillère admissions", email: "c.mensah@campus-one.com" },
};

export type CandidateApplication = {
  id: string;
  campaign: string;
  formation: string;
  formationSlug: string;
  school: string;
  city: string;
  submittedAt?: string;
  status: "brouillon" | "en_cours" | "admis" | "cloture";
  currentStep: string;
  completeness: number;
  steps: { label: string; date?: string; status: StepState }[];
};

export const myApplications: CandidateApplication[] = [
  {
    id: "CO-2026-0142",
    campaign: "France 2026-2027",
    formation: "Master Management International",
    formationSlug: "master-management-international",
    school: "Horizon Business School",
    city: "Paris",
    submittedAt: "3 juin 2026",
    status: "admis",
    currentStep: "Campus France",
    completeness: 78,
    steps: [
      { label: "Projet défini", date: "12 mai", status: "done" },
      { label: "Candidature déposée", date: "3 juin", status: "done" },
      { label: "Dossier étudié", date: "24 juin", status: "done" },
      { label: "Admission obtenue", date: "18 juil.", status: "done" },
      { label: "Campus France", date: "En cours", status: "current" },
      { label: "Visa", status: "upcoming" },
      { label: "Logement", status: "upcoming" },
      { label: "Arrivée", status: "upcoming" },
    ],
  },
  {
    id: "CO-2026-0187",
    campaign: "France 2026-2027",
    formation: "Master Data Science & Intelligence Artificielle",
    formationSlug: "master-data-science-ia",
    school: "École Nova d'Ingénieurs",
    city: "Lyon",
    submittedAt: "21 juin 2026",
    status: "en_cours",
    currentStep: "Dossier étudié",
    completeness: 64,
    steps: [
      { label: "Projet défini", date: "12 mai", status: "done" },
      { label: "Candidature déposée", date: "21 juin", status: "done" },
      { label: "Dossier étudié", date: "En cours", status: "current" },
      { label: "Entretien", status: "upcoming" },
      { label: "Admission", status: "upcoming" },
      { label: "Campus France", status: "upcoming" },
      { label: "Visa", status: "upcoming" },
      { label: "Arrivée", status: "upcoming" },
    ],
  },
  {
    id: "CO-2027-0009",
    campaign: "France 2027-2028",
    formation: "MBA Finance d'entreprise",
    formationSlug: "mba-finance",
    school: "Horizon Business School",
    city: "Paris",
    status: "brouillon",
    currentStep: "Brouillon — étape 3 sur 5",
    completeness: 40,
    steps: [
      { label: "Projet défini", status: "current" },
      { label: "Candidature déposée", status: "upcoming" },
      { label: "Dossier étudié", status: "upcoming" },
      { label: "Admission", status: "upcoming" },
    ],
  },
];

export const myDocuments: CandidateDocument[] = [
  { id: "d1", type: "Passeport", required: true, status: "valide", file: "passeport_diallo.pdf", size: "1,2 Mo", uploadedAt: "02/06/2026", version: 1, maxMb: 10 },
  { id: "d2", type: "Curriculum vitae", required: true, status: "valide", file: "CV_Aminata_Diallo.pdf", size: "380 Ko", uploadedAt: "02/06/2026", version: 2, maxMb: 10 },
  { id: "d3", type: "Diplôme de Licence", required: true, status: "valide", file: "licence_gestion.pdf", size: "2,4 Mo", uploadedAt: "02/06/2026", version: 1, maxMb: 20 },
  {
    id: "d4",
    type: "Relevés de notes (L2 et L3)",
    required: true,
    status: "a_corriger",
    file: "releves_L3.pdf",
    size: "1,8 Mo",
    uploadedAt: "02/06/2026",
    version: 1,
    reason: "Le relevé du semestre 6 est manquant. Merci de fournir un seul PDF regroupant les semestres 3 à 6.",
    maxMb: 20,
  },
  { id: "d5", type: "Attestation TCF (niveau B2)", required: true, status: "en_verification", file: "TCF_B2_2026.pdf", size: "640 Ko", uploadedAt: "14/09/2026", version: 1, maxMb: 10 },
  { id: "d6", type: "Lettre de motivation", required: true, status: "depose", file: "lettre_motivation_HBS.pdf", size: "210 Ko", uploadedAt: "16/09/2026", version: 3, maxMb: 10 },
  { id: "d7", type: "Justificatif de ressources", required: true, status: "a_fournir", maxMb: 10 },
  { id: "d8", type: "Lettre de recommandation", required: false, status: "a_fournir", maxMb: 10 },
];

export type Payment = {
  id: string;
  label: string;
  amount: number;
  currency: "FCFA";
  status: "non_paye" | "en_attente" | "paye" | "exonere";
  method?: string;
  date?: string;
  receipt?: string;
  reference: string;
  due?: string;
};

export const paymentStatusLabel = {
  non_paye: "Non payé",
  en_attente: "En attente de validation",
  paye: "Payé",
  exonere: "Exonéré",
} as const;

export const myPayments: Payment[] = [
  { id: "p1", label: "Frais de dossier", amount: 150000, currency: "FCFA", status: "paye", method: "Règlement en agence", date: "3 juin 2026", receipt: "REC-2026-0418", reference: "CO-0142-FD" },
  { id: "p2", label: "Accompagnement Campus France & visa", amount: 350000, currency: "FCFA", status: "non_paye", reference: "CO-0142-CF", due: "30 septembre 2026" },
];

export const bank = {
  holder: "CAMPUS ONE SARL",
  bank: "Banque Atlantique Exemple",
  iban: "TG53 TG00 0000 0000 0000 0000 000",
  bic: "EXMPTGTG",
};

export const myRemarks = [
  {
    id: "r1",
    date: "17 sept. 2026",
    author: "Claire Mensah",
    title: "Relevés de notes incomplets",
    body: "Le relevé du semestre 6 est manquant. Merci de fournir un seul PDF regroupant les semestres 3 à 6.",
    action: { label: "Remplacer le document", href: "/mon-espace/documents" },
    resolved: false,
    replies: [] as { author: string; body: string; date: string }[],
  },
  {
    id: "r2",
    date: "15 sept. 2026",
    author: "Claire Mensah",
    title: "Paiement de l'accompagnement Campus France",
    body: "Pour lancer votre procédure Campus France, merci de régler les frais d'accompagnement avant le 30 septembre.",
    action: { label: "Régler maintenant", href: "/mon-espace/paiements" },
    resolved: false,
    replies: [],
  },
  {
    id: "r3",
    date: "10 sept. 2026",
    author: "Claire Mensah",
    title: "Lettre de motivation à ajuster",
    body: "Précisez votre projet professionnel à 5 ans et le lien avec le programme de HBS.",
    action: { label: "Voir le document", href: "/mon-espace/documents" },
    resolved: true,
    replies: [{ author: "Aminata Diallo", body: "C'est fait, j'ai déposé une nouvelle version ce matin.", date: "16 sept. 2026" }],
  },
];

export const myMessages = [
  { id: "m1", from: "advisor", body: "Bonjour Aminata, félicitations pour votre admission à HBS ! Nous passons maintenant à la procédure Campus France.", time: "18 juil. · 10:12" },
  { id: "m2", from: "me", body: "Merci beaucoup ! Quelles sont les prochaines étapes de mon côté ?", time: "18 juil. · 11:40" },
  { id: "m3", from: "advisor", body: "Je vous ai laissé deux remarques : un relevé à compléter et le paiement de l'accompagnement. Ensuite nous planifions une simulation d'entretien.", time: "15 sept. · 09:05" },
  { id: "m4", from: "me", body: "Très bien, je dépose le relevé du semestre 6 cette semaine.", time: "15 sept. · 14:22", attachment: undefined as string | undefined },
  { id: "m5", from: "advisor", body: "Parfait. Voici le guide de préparation à l'entretien.", time: "16 sept. · 08:47", attachment: "Guide_entretien_Campus_France.pdf" },
];

export const myAppointments = [
  { id: "a1", title: "Simulation d'entretien Campus France", date: "Mardi 23 septembre 2026", time: "10:00 – 10:45", mode: "Google Meet", status: "confirme" as const, with: "Claire Mensah" },
  { id: "a2", title: "Entretien d'orientation", date: "12 mai 2026", time: "14:00 – 14:30", mode: "En agence", status: "passe" as const, with: "Claire Mensah" },
];

export const availableSlots = [
  { day: "Lun. 22 sept.", slots: ["09:00", "10:30", "15:00"] },
  { day: "Mar. 23 sept.", slots: ["14:00", "16:30"] },
  { day: "Mer. 24 sept.", slots: ["09:30", "11:00", "14:30", "16:00"] },
  { day: "Jeu. 25 sept.", slots: [] as string[] },
  { day: "Ven. 26 sept.", slots: ["10:00", "11:30"] },
];

export const myNotifications = [
  { id: "n1", title: "Une pièce est à corriger", text: "Relevés de notes (L2 et L3)", time: "Il y a 1 jour", unread: true },
  { id: "n2", title: "Nouveau message de Claire Mensah", text: "Voici le guide de préparation…", time: "Il y a 2 jours", unread: true },
  { id: "n3", title: "Rendez-vous confirmé", text: "Mardi 23 septembre à 10:00", time: "Il y a 3 jours", unread: false },
];

export function formatFCFA(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n).replace(/ /g, " ") + " FCFA";
}
