// Données fictives du back-office. Déterministes (pas d'aléatoire) pour éviter les écarts SSR / client.

import { formations, etablissements } from "./catalog";

export const agents = [
  { id: "u1", name: "Claire Mensah", email: "c.mensah@campus-one.com", role: "Conseiller / Agent", active: true, load: 38 },
  { id: "u2", name: "Koffi Adjéi", email: "k.adjei@campus-one.com", role: "Conseiller / Agent", active: true, load: 42 },
  { id: "u3", name: "Sarah Lemoine", email: "s.lemoine@campus-one.com", role: "Responsable admissions", active: true, load: 21 },
  { id: "u4", name: "Yawa Amouzou", email: "y.amouzou@campus-one.com", role: "Conseiller / Agent", active: true, load: 35 },
  { id: "u5", name: "Didier Kpodar", email: "d.kpodar@campus-one.com", role: "Comptabilité", active: true, load: 0 },
  { id: "u6", name: "Nadia Bello", email: "n.bello@campus-one.com", role: "Superviseur", active: true, load: 12 },
  { id: "u7", name: "Marc Folly", email: "m.folly@campus-one.com", role: "Administrateur", active: true, load: 0 },
  { id: "u8", name: "Estelle Gnassingbé", email: "e.gnassingbe@campus-one.com", role: "Direction", active: false, load: 0 },
];

const names = [
  "Aminata Diallo", "Kossi Mensah", "Fatou Ndiaye", "Yao Kouassi", "Mariam Traoré", "Komi Agbeko", "Awa Koné",
  "Ibrahim Sanogo", "Esther Adjovi", "Jean-Marc Tchatchoua", "Nadège Ekra", "Moussa Cissé", "Grâce Mbemba",
  "Rachid Ouédraogo", "Clarisse Houngbo", "Serge Akakpo", "Mariama Bah", "Élodie Nkoulou", "Abdoulaye Sow",
  "Prisca Lawson", "Olivier Dossou", "Sandrine Amégan", "Cheikh Fall", "Josiane Kaboré", "Hervé Zinsou",
  "Aïssatou Barry", "Paul-Henri Essomba", "Linda Agossou",
];
const countries = ["Togo", "Côte d'Ivoire", "Sénégal", "Cameroun", "Bénin", "Mali", "Burkina Faso", "Guinée", "Gabon"];

export const pipelineSteps = [
  "Projet défini",
  "Candidature déposée",
  "Dossier étudié",
  "Entretien",
  "Admission obtenue",
  "Campus France",
  "Visa",
  "Logement",
  "Arrivée",
];

export type AdminDossier = {
  id: string;
  candidate: string;
  email: string;
  phone: string;
  country: string;
  formation: string;
  formationSlug: string;
  school: string;
  campaign: string;
  step: string;
  stepIndex: number;
  agent: string;
  completeness: number;
  payment: "non_paye" | "en_attente" | "paye" | "exonere";
  docsToReview: number;
  priority: "haute" | "normale" | "basse";
  updatedAt: string;
  deadline?: string;
  partner?: string;
};

const days = ["18/09", "18/09", "17/09", "17/09", "16/09", "15/09", "15/09", "14/09", "12/09", "11/09", "10/09", "08/09"];
const payments: AdminDossier["payment"][] = ["paye", "en_attente", "non_paye", "paye", "paye", "exonere", "non_paye"];

export const dossiers: AdminDossier[] = names.map((name, i) => {
  const f = formations[i % formations.length]!;
  const stepIndex = [4, 2, 1, 5, 3, 6, 2, 1, 7, 4, 0, 2, 5, 8, 3, 1, 2, 6, 4, 1, 3, 5, 2, 0, 7, 2, 4, 1][i]!;
  const completeness = [78, 55, 30, 92, 70, 100, 48, 22, 100, 81, 10, 60, 88, 100, 74, 35, 52, 95, 80, 28, 66, 90, 45, 12, 100, 58, 76, 33][i]!;
  const slug = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]+/g, ".");
  return {
    id: `CO-2026-${String(142 + i * 7).padStart(4, "0")}`,
    candidate: name,
    email: `${slug}@exemple.com`,
    phone: `+228 9${i % 10} ${String(10 + i).padStart(2, "0")} ${String(30 + i).padStart(2, "0")} ${String(40 + i).padStart(2, "0")}`,
    country: i === 0 ? "Togo" : countries[i % countries.length]!,
    formation: f.title,
    formationSlug: f.slug,
    school: etablissements.find((e) => e.slug === f.school)!.name,
    campaign: i % 9 === 8 ? "France 2027-2028" : "France 2026-2027",
    step: pipelineSteps[stepIndex]!,
    stepIndex,
    agent: agents[[0, 1, 3][i % 3]!]!.name,
    completeness,
    payment: payments[i % payments.length]!,
    docsToReview: [2, 1, 0, 0, 3, 0, 1, 2, 0, 1, 0, 4, 0, 0, 1, 2, 0, 0, 1, 3, 0, 0, 2, 0, 0, 1, 0, 2][i]!,
    priority: i % 5 === 0 ? "haute" : i % 3 === 0 ? "basse" : "normale",
    updatedAt: days[i % days.length]!,
    deadline: i % 4 === 0 ? ["22/09", "25/09", "30/09", "03/10", "10/10", "15/10", "20/10"][i / 4]! : undefined,
    partner: i % 6 === 0 ? "PART-LOME-07" : undefined,
  };
});

export const campaigns = [
  { id: "c1", name: "France 2026-2027", destination: "France", status: "ouverte" as const, opens: "01/02/2026", closes: "30/09/2026", dossiers: 486, formations: 42, admitted: 128 },
  { id: "c2", name: "France 2027-2028", destination: "France", status: "brouillon" as const, opens: "01/11/2026", closes: "30/06/2027", dossiers: 3, formations: 38, admitted: 0 },
  { id: "c3", name: "France 2025-2026", destination: "France", status: "fermee" as const, opens: "01/02/2025", closes: "30/09/2025", dossiers: 612, formations: 35, admitted: 204 },
  { id: "c4", name: "France 2024-2025", destination: "France", status: "archivee" as const, opens: "01/02/2024", closes: "30/09/2024", dossiers: 398, formations: 30, admitted: 131 },
];

export const workflows = [
  {
    id: "w1",
    name: "Parcours Master — France",
    appliesTo: ["Master 1", "Master 2", "MBA"],
    formations: 18,
    steps: [
      { id: "s1", label: "Projet défini", visible: true, notify: false, docs: [] as string[] },
      { id: "s2", label: "Candidature déposée", visible: true, notify: true, docs: ["Passeport", "CV", "Diplômes"] },
      { id: "s3", label: "Dossier étudié", visible: true, notify: true, docs: [] },
      { id: "s4", label: "Entretien", visible: true, notify: true, docs: [] },
      { id: "s5", label: "Admission obtenue", visible: true, notify: true, docs: ["Lettre d'admission"] },
      { id: "s6", label: "Campus France", visible: true, notify: true, docs: ["Attestation TCF"] },
      { id: "s7", label: "Visa", visible: true, notify: true, docs: ["Justificatif de ressources"] },
      { id: "s8", label: "Logement", visible: true, notify: false, docs: [] },
      { id: "s9", label: "Arrivée", visible: true, notify: true, docs: [] },
    ],
  },
  {
    id: "w2",
    name: "Parcours Bachelor / BTS — France",
    appliesTo: ["BTS", "Bachelor"],
    formations: 16,
    steps: [
      { id: "b1", label: "Projet défini", visible: true, notify: false, docs: [] },
      { id: "b2", label: "Candidature déposée", visible: true, notify: true, docs: ["Passeport", "Relevés du baccalauréat"] },
      { id: "b3", label: "Test de positionnement", visible: true, notify: true, docs: [] },
      { id: "b4", label: "Admission obtenue", visible: true, notify: true, docs: [] },
      { id: "b5", label: "Campus France", visible: true, notify: true, docs: [] },
      { id: "b6", label: "Visa", visible: true, notify: true, docs: [] },
      { id: "b7", label: "Arrivée", visible: true, notify: true, docs: [] },
    ],
  },
  {
    id: "w3",
    name: "Licence universitaire",
    appliesTo: ["Licence 3"],
    formations: 8,
    steps: [
      { id: "l1", label: "Projet défini", visible: true, notify: false, docs: [] },
      { id: "l2", label: "Candidature déposée", visible: true, notify: true, docs: [] },
      { id: "l3", label: "Commission pédagogique", visible: false, notify: false, docs: [] },
      { id: "l4", label: "Admission obtenue", visible: true, notify: true, docs: [] },
      { id: "l5", label: "Visa", visible: true, notify: true, docs: [] },
    ],
  },
];

export const documentTypes = [
  { id: "t1", name: "Passeport", required: true, maxMb: 10, profiles: ["Tous"], usage: 486 },
  { id: "t2", name: "Curriculum vitae", required: true, maxMb: 10, profiles: ["Tous"], usage: 471 },
  { id: "t3", name: "Diplômes obtenus", required: true, maxMb: 20, profiles: ["Tous"], usage: 455 },
  { id: "t4", name: "Relevés de notes", required: true, maxMb: 20, profiles: ["Tous"], usage: 448 },
  { id: "t5", name: "Attestation de langue (TCF / DELF)", required: true, maxMb: 10, profiles: ["Master", "Licence"], usage: 302 },
  { id: "t6", name: "Lettre de motivation", required: true, maxMb: 10, profiles: ["Tous"], usage: 466 },
  { id: "t7", name: "Justificatif de ressources", required: true, maxMb: 10, profiles: ["Procédure visa"], usage: 190 },
  { id: "t8", name: "Lettre de recommandation", required: false, maxMb: 10, profiles: ["Master", "MBA"], usage: 88 },
  { id: "t9", name: "Attestation d'hébergement", required: false, maxMb: 10, profiles: ["Procédure visa"], usage: 64 },
];

export const permissionGroups = [
  { group: "Dossiers", items: [
    { id: "dossiers.read", label: "Consulter les dossiers" },
    { id: "dossiers.read_all", label: "Voir tous les dossiers (pas seulement les siens)" },
    { id: "dossiers.edit", label: "Modifier un dossier" },
    { id: "dossiers.step", label: "Changer l'étape d'un dossier" },
    { id: "dossiers.assign", label: "Affecter / réaffecter" },
    { id: "dossiers.complete", label: "Valider la complétude finale" },
  ] },
  { group: "Documents", items: [
    { id: "docs.review", label: "Valider / rejeter une pièce" },
    { id: "docs.download_zip", label: "Téléchargement groupé (ZIP)" },
  ] },
  { group: "Paiements", items: [
    { id: "payments.read", label: "Consulter les paiements" },
    { id: "payments.record", label: "Enregistrer un paiement hors ligne" },
    { id: "payments.validate", label: "Valider les bordereaux" },
  ] },
  { group: "Configuration", items: [
    { id: "config.workflows", label: "Configurer les parcours d'étapes" },
    { id: "config.catalog", label: "Gérer le catalogue de formations" },
    { id: "config.campaigns", label: "Gérer les campagnes" },
    { id: "config.roles", label: "Gérer les rôles et utilisateurs" },
  ] },
  { group: "Pilotage", items: [
    { id: "reports.read", label: "Tableaux de bord consolidés" },
    { id: "reports.export", label: "Exporter (CSV / Excel)" },
    { id: "audit.read", label: "Consulter le journal d'audit" },
  ] },
];

const all = permissionGroups.flatMap((g) => g.items.map((i) => i.id));

export const roles = [
  { id: "admin", name: "Administrateur", system: true, users: 1, description: "Accès complet, y compris configuration système.", permissions: all },
  {
    id: "gestionnaire",
    name: "Gestionnaire simple",
    system: true,
    users: 3,
    description: "Gestion courante des dossiers et candidats, sans configuration.",
    permissions: ["dossiers.read", "dossiers.edit", "dossiers.step", "docs.review", "payments.read"],
  },
  {
    id: "superviseur",
    name: "Superviseur",
    system: false,
    users: 1,
    description: "Supervise les agents, réaffecte les dossiers.",
    permissions: ["dossiers.read", "dossiers.read_all", "dossiers.edit", "dossiers.step", "dossiers.assign", "docs.review", "payments.read", "reports.read", "audit.read"],
  },
  {
    id: "compta",
    name: "Comptabilité",
    system: false,
    users: 1,
    description: "Paiements, bordereaux et reçus.",
    permissions: ["dossiers.read", "dossiers.read_all", "payments.read", "payments.record", "payments.validate", "reports.export"],
  },
  { id: "direction", name: "Direction", system: false, users: 1, description: "Indicateurs consolidés.", permissions: ["dossiers.read_all", "dossiers.read", "reports.read", "reports.export"] },
];

export const partners = [
  { id: "pa1", name: "Edu Conseil Lomé", contact: "Kodjo Afanou", email: "contact@educonseil-exemple.tg", code: "PART-LOME-07", candidates: 34, active: true },
  { id: "pa2", name: "Horizon Études Abidjan", contact: "Aya Konan", email: "aya@horizon-exemple.ci", code: "PART-ABJ-02", candidates: 21, active: true },
  { id: "pa3", name: "Cabinet Teranga Orientation", contact: "Modou Diop", email: "m.diop@teranga-exemple.sn", code: "PART-DKR-11", candidates: 17, active: true },
  { id: "pa4", name: "Mbolo Campus", contact: "Rita Ndong", email: "rita@mbolo-exemple.ga", code: "PART-LBV-03", candidates: 6, active: false },
];

export const bordereaux = [
  { id: "bd1", dossier: "CO-2026-0149", candidate: "Kossi Mensah", amount: 350000, declared: "15/09/2026", bank: "Banque Atlantique Exemple", reference: "CO-0149-CF", file: "bordereau_mensah.jpg", sinceHours: 52 },
  { id: "bd2", dossier: "CO-2026-0184", candidate: "Awa Koné", amount: 150000, declared: "16/09/2026", bank: "Banque Atlantique Exemple", reference: "CO-0184-FD", file: "bordereau_kone.pdf", sinceHours: 30 },
  { id: "bd3", dossier: "CO-2026-0233", candidate: "Nadège Ekra", amount: 150000, declared: "17/09/2026", bank: "Banque Atlantique Exemple", reference: "CO-0233-FD", file: "bordereau_ekra.pdf", sinceHours: 18 },
  { id: "bd4", dossier: "CO-2026-0282", candidate: "Clarisse Houngbo", amount: 350000, declared: "18/09/2026", bank: "Banque Atlantique Exemple", reference: "CO-0282-CF", file: "scan_depot.jpg", sinceHours: 3 },
];

export const recentPayments = [
  { id: "rp1", candidate: "Yao Kouassi", dossier: "CO-2026-0163", label: "Frais de dossier", amount: 150000, method: "Agence", date: "18/09/2026", by: "Didier Kpodar", receipt: "REC-2026-0512" },
  { id: "rp2", candidate: "Grâce Mbemba", dossier: "CO-2026-0226", label: "Accompagnement Campus France", amount: 350000, method: "Dépôt bancaire", date: "17/09/2026", by: "Didier Kpodar", receipt: "REC-2026-0511" },
  { id: "rp3", candidate: "Serge Akakpo", dossier: "CO-2026-0247", label: "Frais de dossier", amount: 150000, method: "Agence", date: "16/09/2026", by: "Didier Kpodar", receipt: "REC-2026-0509" },
];

export const appointmentRequests = [
  { id: "ar1", candidate: "Fatou Ndiaye", subject: "Préparation entretien Campus France", slot: "Lun. 22/09 · 09:00", agent: "Claire Mensah" },
  { id: "ar2", candidate: "Ibrahim Sanogo", subject: "Questions sur le logement", slot: "Mer. 24/09 · 14:30", agent: "Koffi Adjéi" },
  { id: "ar3", candidate: "Mariama Bah", subject: "Entretien d'orientation", slot: "Ven. 26/09 · 10:00", agent: "Yawa Amouzou" },
];

export const weekAgenda = [
  { day: "Lun. 22", items: [{ time: "09:00", who: "Fatou Ndiaye", what: "Préparation Campus France", mode: "Meet", pending: true }, { time: "15:00", who: "Komi Agbeko", what: "Suivi visa", mode: "Agence" }] },
  { day: "Mar. 23", items: [{ time: "10:00", who: "Aminata Diallo", what: "Simulation d'entretien", mode: "Meet" }] },
  { day: "Mer. 24", items: [{ time: "11:00", who: "Esther Adjovi", what: "Point dossier", mode: "Agence" }, { time: "14:30", who: "Ibrahim Sanogo", what: "Logement", mode: "Meet", pending: true }] },
  { day: "Jeu. 25", items: [] },
  { day: "Ven. 26", items: [{ time: "10:00", who: "Mariama Bah", what: "Orientation", mode: "Meet", pending: true }] },
];

export const auditLog = [
  { id: "al1", at: "18/09/2026 09:42", actor: "Claire Mensah", action: "a rejeté la pièce", target: "Relevés de notes — CO-2026-0142", ip: "196.168.12.4", kind: "document" },
  { id: "al2", at: "18/09/2026 09:40", actor: "Claire Mensah", action: "a validé la pièce", target: "Passeport — CO-2026-0142", ip: "196.168.12.4", kind: "document" },
  { id: "al3", at: "18/09/2026 09:12", actor: "Didier Kpodar", action: "a enregistré un paiement hors ligne", target: "150 000 FCFA — CO-2026-0163", ip: "196.168.12.9", kind: "payment" },
  { id: "al4", at: "17/09/2026 17:55", actor: "Marc Folly", action: "a modifié le parcours", target: "Parcours Master — France (ajout de l'étape Entretien)", ip: "196.168.12.2", kind: "config" },
  { id: "al5", at: "17/09/2026 16:31", actor: "Nadia Bello", action: "a réaffecté le dossier", target: "CO-2026-0219 à Koffi Adjéi", ip: "196.168.12.7", kind: "dossier" },
  { id: "al6", at: "17/09/2026 15:04", actor: "Koffi Adjéi", action: "a changé l'étape", target: "CO-2026-0149 : Dossier étudié → Entretien", ip: "196.168.12.5", kind: "dossier" },
  { id: "al7", at: "17/09/2026 11:20", actor: "Marc Folly", action: "a créé le rôle", target: "Comptabilité", ip: "196.168.12.2", kind: "config" },
  { id: "al8", at: "16/09/2026 18:02", actor: "Yawa Amouzou", action: "a téléchargé le dossier complet (ZIP)", target: "CO-2026-0170", ip: "196.168.12.6", kind: "document" },
  { id: "al9", at: "16/09/2026 08:30", actor: "Sarah Lemoine", action: "s'est connectée", target: "MFA validée (TOTP)", ip: "196.168.12.3", kind: "auth" },
];

export const dashboardStats = {
  byStep: pipelineSteps.map((s, i) => ({ step: s, count: [38, 96, 74, 41, 128, 52, 31, 14, 12][i]! })),
  byMonth: [
    { month: "Avr.", value: 42 },
    { month: "Mai", value: 88 },
    { month: "Juin", value: 131 },
    { month: "Juil.", value: 97 },
    { month: "Août", value: 74 },
    { month: "Sept.", value: 54 },
  ],
  topFormations: [
    { name: "Master Management International", count: 64 },
    { name: "Master Data Science & IA", count: 51 },
    { name: "Bachelor Marketing Digital", count: 46 },
    { name: "Master Cybersécurité", count: 38 },
    { name: "BTS Tourisme", count: 27 },
  ],
};
