// Données fictives du site vitrine. Les établissements sont inventés.

export type Level = "Bachelor" | "Licence 3" | "Master 1" | "Master 2" | "BTS" | "MBA";
export type FormationStatus = "Ouvert" | "Bientôt disponible" | "Candidatures closes";

export type Etablissement = {
  slug: string;
  name: string;
  short: string;
  city: string;
  type: string;
  description: string;
  diplomas: string[];
  founded: number;
};

export type Formation = {
  slug: string;
  title: string;
  school: string; // slug établissement
  city: string;
  cities?: string[];
  country: string;
  level: Level;
  domain: string;
  diploma: string;
  duration: string;
  rhythm: string;
  intake: string;
  fees: number; // € / an
  language: string;
  status: FormationStatus;
  seats: number;
  image: string;
  summary: string;
  recognition: string;
  requirements: { diploma: string; academic: string; language: string };
  documents: string[];
  program: { title: string; items: string[] }[];
  careers: string[];
  further: string[];
};

export const etablissements: Etablissement[] = [
  {
    slug: "horizon-business-school",
    name: "Horizon Business School",
    short: "HBS",
    city: "Paris",
    type: "École de commerce",
    description: "École de management post-bac tournée vers l'international, avec un réseau de 40 universités partenaires.",
    diplomas: ["Bachelor", "Master 1", "Master 2", "MBA"],
    founded: 1994,
  },
  {
    slug: "ecole-nova-ingenieurs",
    name: "École Nova d'Ingénieurs",
    short: "Nova",
    city: "Lyon",
    type: "École d'ingénieurs",
    description: "Formations d'ingénieurs et masters spécialisés en informatique, data et industrie du futur.",
    diplomas: ["Licence 3", "Master 1", "Master 2"],
    founded: 1988,
  },
  {
    slug: "universite-atlantique",
    name: "Université Atlantique",
    short: "UA",
    city: "Nantes",
    type: "Université",
    description: "Université pluridisciplinaire reconnue pour ses parcours en droit, économie et sciences.",
    diplomas: ["Licence 3", "Master 1", "Master 2"],
    founded: 1962,
  },
  {
    slug: "institut-delta-digital",
    name: "Institut Delta Digital",
    short: "Delta",
    city: "Lille",
    type: "École du numérique",
    description: "Écoles des métiers du numérique : développement, cybersécurité, design produit et marketing digital.",
    diplomas: ["BTS", "Bachelor", "Master 2"],
    founded: 2008,
  },
  {
    slug: "campus-lumiere",
    name: "Campus Lumière",
    short: "Lumière",
    city: "Bordeaux",
    type: "Groupe d'enseignement privé",
    description: "Groupe multi-campus (Bordeaux, Toulouse, Montpellier) spécialisé en hôtellerie, tourisme et communication.",
    diplomas: ["BTS", "Bachelor", "Master 1", "Master 2"],
    founded: 2001,
  },
  {
    slug: "ecole-meridienne-sante",
    name: "École Méridienne de Santé",
    short: "Méridienne",
    city: "Toulouse",
    type: "École paramédicale",
    description: "Formations en management de la santé, santé publique et biotechnologies.",
    diplomas: ["Bachelor", "Master 1", "Master 2"],
    founded: 1999,
  },
];

const defaultDocs = [
  "Passeport en cours de validité",
  "Curriculum vitae",
  "Diplômes obtenus",
  "Relevés de notes des deux dernières années",
  "Attestation de niveau de français (TCF, DELF) si requis",
  "Lettre de motivation",
];

export const formations: Formation[] = [
  {
    slug: "master-management-international",
    title: "Master Management International",
    school: "horizon-business-school",
    city: "Paris",
    country: "France",
    level: "Master 2",
    domain: "Commerce & Management",
    diploma: "Master — Grade de Master (Bac+5)",
    duration: "2 ans",
    rhythm: "Temps plein, stage de 6 mois",
    intake: "Septembre 2027",
    fees: 11900,
    language: "Français / Anglais",
    status: "Ouvert",
    seats: 12,
    image: "/images/paris.jpg",
    summary:
      "Un programme pour piloter le développement d'entreprises à l'international : stratégie, négociation interculturelle, finance d'entreprise et management d'équipes multiculturelles.",
    recognition: "Diplôme visé par l'État, grade de Master",
    requirements: {
      diploma: "Licence (Bac+3) en gestion, économie, commerce ou équivalent",
      academic: "Moyenne générale d'au moins 12/20 sur les deux dernières années",
      language: "Français B2 minimum, anglais B1 recommandé",
    },
    documents: defaultDocs,
    program: [
      { title: "Semestre 1", items: ["Stratégie internationale", "Finance d'entreprise", "Marketing global", "Droit des affaires internationales"] },
      { title: "Semestre 2", items: ["Négociation interculturelle", "Supply chain mondiale", "Projet de conseil en entreprise"] },
      { title: "Semestre 3", items: ["Management d'équipes multiculturelles", "Business development Afrique-Europe", "Data pour décideurs"] },
      { title: "Semestre 4", items: ["Stage de 6 mois en entreprise", "Mémoire professionnel"] },
    ],
    careers: ["Business developer international", "Chef de projet export", "Consultant en stratégie", "Responsable grands comptes"],
    further: ["MBA spécialisé", "Doctorat en sciences de gestion"],
  },
  {
    slug: "master-data-science-ia",
    title: "Master Data Science & Intelligence Artificielle",
    school: "ecole-nova-ingenieurs",
    city: "Lyon",
    country: "France",
    level: "Master 2",
    domain: "Informatique & Data",
    diploma: "Master of Science (Bac+5)",
    duration: "2 ans",
    rhythm: "Temps plein ou alternance en 2e année",
    intake: "Septembre 2027",
    fees: 9800,
    language: "Français",
    status: "Ouvert",
    seats: 8,
    image: "/images/students-laptop.jpg",
    summary:
      "Former des spécialistes capables de concevoir, entraîner et déployer des modèles d'apprentissage automatique en entreprise, avec une forte dimension projet.",
    recognition: "Titre RNCP niveau 7",
    requirements: {
      diploma: "Licence en informatique, mathématiques ou statistiques",
      academic: "Bon niveau en mathématiques et programmation (Python)",
      language: "Français B2",
    },
    documents: defaultDocs,
    program: [
      { title: "1re année", items: ["Statistiques avancées", "Machine learning", "Bases de données distribuées", "Projet data"] },
      { title: "2e année", items: ["Deep learning", "MLOps et mise en production", "Éthique de l'IA", "Stage ou alternance"] },
    ],
    careers: ["Data scientist", "Ingénieur machine learning", "Data engineer", "Consultant IA"],
    further: ["Doctorat en informatique", "Mastère spécialisé"],
  },
  {
    slug: "bachelor-marketing-digital",
    title: "Bachelor Marketing Digital & E-commerce",
    school: "institut-delta-digital",
    city: "Lille",
    cities: ["Lille", "Paris"],
    country: "France",
    level: "Bachelor",
    domain: "Communication & Marketing",
    diploma: "Bachelor (Bac+3), titre RNCP niveau 6",
    duration: "3 ans",
    rhythm: "Temps plein, stages chaque année",
    intake: "Septembre 2027",
    fees: 7400,
    language: "Français",
    status: "Ouvert",
    seats: 20,
    image: "/images/team-work.jpg",
    summary:
      "Acquérir les compétences opérationnelles du marketing digital : acquisition, réseaux sociaux, contenu, analytics et gestion d'une boutique en ligne.",
    recognition: "Titre RNCP niveau 6",
    requirements: {
      diploma: "Baccalauréat ou équivalent",
      academic: "Dossier scolaire et entretien de motivation",
      language: "Français B2",
    },
    documents: defaultDocs,
    program: [
      { title: "Année 1", items: ["Fondamentaux du marketing", "Culture digitale", "Création de contenu"] },
      { title: "Année 2", items: ["SEO / SEA", "Social media management", "E-commerce"] },
      { title: "Année 3", items: ["Data marketing", "Stratégie de marque", "Projet professionnel"] },
    ],
    careers: ["Chargé de marketing digital", "Community manager", "Traffic manager", "E-commerce manager"],
    further: ["Master marketing", "MSc Digital Business"],
  },
  {
    slug: "licence-droit-international",
    title: "Licence 3 Droit — Parcours International",
    school: "universite-atlantique",
    city: "Nantes",
    country: "France",
    level: "Licence 3",
    domain: "Droit & Sciences politiques",
    diploma: "Licence (Bac+3), diplôme national",
    duration: "1 an",
    rhythm: "Temps plein",
    intake: "Septembre 2027",
    fees: 3770,
    language: "Français",
    status: "Bientôt disponible",
    seats: 15,
    image: "/images/library.jpg",
    summary: "Une année de spécialisation en droit international public et privé, droit européen et contentieux internationaux.",
    recognition: "Diplôme national",
    requirements: {
      diploma: "Deux années validées en droit (L2)",
      academic: "Moyenne d'au moins 11/20",
      language: "Français C1 recommandé",
    },
    documents: defaultDocs,
    program: [{ title: "Enseignements", items: ["Droit international public", "Droit de l'Union européenne", "Contentieux international", "Anglais juridique"] }],
    careers: ["Poursuite en Master", "Juriste junior", "Assistant en organisation internationale"],
    further: ["Master Droit international", "Master Droit des affaires"],
  },
  {
    slug: "master-cybersecurite",
    title: "Master Expert en Cybersécurité",
    school: "institut-delta-digital",
    city: "Lille",
    country: "France",
    level: "Master 2",
    domain: "Informatique & Data",
    diploma: "Titre RNCP niveau 7 (Bac+5)",
    duration: "2 ans",
    rhythm: "Alternance possible",
    intake: "Octobre 2027",
    fees: 8900,
    language: "Français",
    status: "Ouvert",
    seats: 10,
    image: "/images/documents.jpg",
    summary: "Protéger les systèmes d'information : audit, sécurité offensive et défensive, gouvernance et conformité.",
    recognition: "Titre RNCP niveau 7",
    requirements: {
      diploma: "Bac+3 en informatique ou réseaux",
      academic: "Connaissances en systèmes et réseaux",
      language: "Français B2",
    },
    documents: defaultDocs,
    program: [
      { title: "1re année", items: ["Sécurité des réseaux", "Cryptographie appliquée", "Tests d'intrusion"] },
      { title: "2e année", items: ["SOC et réponse à incident", "Gouvernance et RGPD", "Projet de fin d'études"] },
    ],
    careers: ["Analyste SOC", "Pentester", "Consultant cybersécurité", "RSSI adjoint"],
    further: ["Mastère spécialisé", "Certifications professionnelles"],
  },
  {
    slug: "bts-tourisme",
    title: "BTS Tourisme",
    school: "campus-lumiere",
    city: "Bordeaux",
    cities: ["Bordeaux", "Toulouse"],
    country: "France",
    level: "BTS",
    domain: "Hôtellerie & Tourisme",
    diploma: "BTS (Bac+2), diplôme d'État",
    duration: "2 ans",
    rhythm: "Temps plein, 12 semaines de stage",
    intake: "Septembre 2027",
    fees: 5200,
    language: "Français",
    status: "Ouvert",
    seats: 18,
    image: "/images/plane.jpg",
    summary: "Concevoir et vendre des prestations touristiques, accueillir une clientèle internationale et gérer l'information touristique.",
    recognition: "Diplôme d'État",
    requirements: { diploma: "Baccalauréat", academic: "Dossier scolaire", language: "Français B2, anglais B1" },
    documents: defaultDocs,
    program: [{ title: "Enseignements", items: ["Gestion de la relation client", "Élaboration d'une prestation touristique", "Tourisme et territoires", "Langues vivantes"] }],
    careers: ["Conseiller voyages", "Agent d'accueil touristique", "Assistant chef de produit"],
    further: ["Bachelor Tourisme", "Licence professionnelle"],
  },
  {
    slug: "master-sante-publique",
    title: "Master Management de la Santé",
    school: "ecole-meridienne-sante",
    city: "Toulouse",
    country: "France",
    level: "Master 1",
    domain: "Santé",
    diploma: "Master (Bac+4/5)",
    duration: "2 ans",
    rhythm: "Temps plein",
    intake: "Septembre 2027",
    fees: 8200,
    language: "Français",
    status: "Ouvert",
    seats: 14,
    image: "/images/lecture.jpg",
    summary: "Piloter des établissements et des programmes de santé : organisation des soins, économie de la santé et qualité.",
    recognition: "Titre RNCP niveau 7",
    requirements: { diploma: "Licence santé, biologie ou gestion", academic: "Moyenne d'au moins 12/20", language: "Français B2" },
    documents: defaultDocs,
    program: [{ title: "Enseignements", items: ["Économie de la santé", "Systèmes de santé comparés", "Qualité et gestion des risques", "Stage"] }],
    careers: ["Cadre de santé", "Chargé de mission ARS", "Coordinateur de programmes"],
    further: ["Doctorat", "MBA santé"],
  },
  {
    slug: "mba-finance",
    title: "MBA Finance d'entreprise",
    school: "horizon-business-school",
    city: "Paris",
    country: "France",
    level: "MBA",
    domain: "Commerce & Management",
    diploma: "MBA (Bac+5/6)",
    duration: "18 mois",
    rhythm: "Temps plein",
    intake: "Janvier 2027",
    fees: 14500,
    language: "Anglais",
    status: "Candidatures closes",
    seats: 0,
    image: "/images/amphitheater.jpg",
    summary: "Programme intensif pour professionnels : finance de marché, fusions-acquisitions, private equity.",
    recognition: "Accréditation internationale",
    requirements: { diploma: "Bac+4 et 2 ans d'expérience", academic: "Entretien de sélection", language: "Anglais C1" },
    documents: defaultDocs,
    program: [{ title: "Modules", items: ["Corporate finance", "M&A", "Private equity", "Leadership"] }],
    careers: ["Analyste M&A", "Directeur financier", "Chargé d'investissement"],
    further: ["Doctorat professionnel (DBA)"],
  },
  {
    slug: "master-genie-industriel",
    title: "Master Génie Industriel & Logistique",
    school: "ecole-nova-ingenieurs",
    city: "Lyon",
    country: "France",
    level: "Master 1",
    domain: "Ingénierie",
    diploma: "Master (Bac+5)",
    duration: "2 ans",
    rhythm: "Temps plein",
    intake: "Septembre 2027",
    fees: 9100,
    language: "Français",
    status: "Ouvert",
    seats: 9,
    image: "/images/group-study.jpg",
    summary: "Optimiser la production et les flux logistiques : lean management, planification, industrie 4.0.",
    recognition: "Titre RNCP niveau 7",
    requirements: { diploma: "Licence sciences ou technologie", academic: "Bases en mathématiques", language: "Français B2" },
    documents: defaultDocs,
    program: [{ title: "Enseignements", items: ["Lean management", "Recherche opérationnelle", "Industrie 4.0", "Projet industriel"] }],
    careers: ["Ingénieur méthodes", "Responsable logistique", "Chef de projet industriel"],
    further: ["Doctorat", "Mastère spécialisé"],
  },
  {
    slug: "bachelor-communication",
    title: "Bachelor Communication & Médias",
    school: "campus-lumiere",
    city: "Bordeaux",
    country: "France",
    level: "Bachelor",
    domain: "Communication & Marketing",
    diploma: "Bachelor (Bac+3)",
    duration: "3 ans",
    rhythm: "Temps plein",
    intake: "Septembre 2027",
    fees: 6900,
    language: "Français",
    status: "Ouvert",
    seats: 16,
    image: "/images/students-talk.jpg",
    summary: "Stratégie de communication, relations presse, production de contenus et communication événementielle.",
    recognition: "Titre RNCP niveau 6",
    requirements: { diploma: "Baccalauréat", academic: "Entretien de motivation", language: "Français B2" },
    documents: defaultDocs,
    program: [{ title: "Enseignements", items: ["Stratégie de communication", "Relations presse", "Production audiovisuelle", "Événementiel"] }],
    careers: ["Chargé de communication", "Attaché de presse", "Chef de projet événementiel"],
    further: ["Master communication"],
  },
];

export const levels: Level[] = ["BTS", "Bachelor", "Licence 3", "Master 1", "Master 2", "MBA"];
export const domains = [...new Set(formations.map((f) => f.domain))];
export const cities = [...new Set(formations.flatMap((f) => f.cities ?? [f.city]))].sort();

export function schoolOf(f: Formation) {
  return etablissements.find((e) => e.slug === f.school)!;
}

export const destinations = [
  { slug: "france", name: "France", status: "active" as const, image: "/images/paris-seine.jpg", formations: formations.length, cost: "de 3 800 à 15 000 € / an", living: "650 à 1 100 € / mois" },
  { slug: "belgique", name: "Belgique", status: "soon" as const },
  { slug: "canada", name: "Canada", status: "soon" as const },
  { slug: "allemagne", name: "Allemagne", status: "soon" as const },
  { slug: "royaume-uni", name: "Royaume-Uni", status: "soon" as const },
];

export const keyFigures = [
  { value: 250, suffix: "+", label: "formations référencées" },
  { value: 40, suffix: "", label: "écoles partenaires" },
  { value: 5, suffix: "", label: "destinations à terme" },
  { value: 1200, suffix: "+", label: "étudiants accompagnés" },
];

export const journey = [
  { id: "orientation", label: "Orientation", text: "Un conseiller analyse votre profil et votre projet professionnel." },
  { id: "admission", label: "Admission", text: "Nous montons et suivons vos candidatures auprès des écoles." },
  { id: "campus-france", label: "Campus France", text: "Préparation du dossier et de l'entretien lorsque la procédure s'applique." },
  { id: "visa", label: "Visa", text: "Accompagnement à la constitution du dossier de visa étudiant." },
  { id: "logement", label: "Logement", text: "Recherche de logement, garant et assurance habitation." },
  { id: "installation", label: "Installation", text: "Accueil, démarches administratives et suivi à l'arrivée." },
];

export const howItWorks = [
  { n: "01", title: "Diagnostic & orientation", text: "Entretien individuel pour comprendre votre parcours, vos objectifs et votre budget.", duration: "Semaine 1" },
  { n: "02", title: "Sélection des formations", text: "Nous vous proposons une sélection de formations cohérentes avec votre profil.", duration: "Semaines 1 à 2" },
  { n: "03", title: "Candidature", text: "Vous déposez votre dossier en ligne ; nous vérifions chaque pièce avant envoi.", duration: "Semaines 2 à 4" },
  { n: "04", title: "Admission", text: "Suivi des réponses des établissements, préparation aux entretiens de sélection.", duration: "Selon l'école" },
  { n: "05", title: "Campus France", text: "Préparation du dossier et de l'entretien, lorsque la procédure s'applique à votre pays.", duration: "4 à 8 semaines" },
  { n: "06", title: "Dossier de visa", text: "Accompagnement à la préparation du dossier de visa, sans garantie d'obtention.", duration: "2 à 6 semaines" },
  { n: "07", title: "Préparation du départ", text: "Logement, assurance, transport et démarches préparatoires avant le voyage.", duration: "1 à 2 mois" },
  { n: "08", title: "Installation & suivi", text: "Accueil à l'arrivée, ouverture de compte, titre de séjour et suivi pendant la première année.", duration: "Première année" },
];

export const services = [
  { id: "orientation", icon: "compass", title: "Orientation académique", text: "Bilan de profil, choix de filière et d'établissement adaptés à votre projet et à votre budget." },
  { id: "admission", icon: "file-check", title: "Admission", text: "Constitution, vérification et suivi de vos candidatures auprès des établissements." },
  { id: "campus-france", icon: "landmark", title: "Accompagnement Campus France", text: "Préparation du dossier en ligne et entraînement à l'entretien." },
  { id: "visa", icon: "stamp", title: "Dossier de visa", text: "Liste de pièces, relecture et préparation du rendez-vous consulaire." },
  { id: "logement", icon: "house", title: "Logement étudiant", text: "Résidences partenaires, garant, assurance habitation et état des lieux." },
  { id: "voyage", icon: "plane", title: "Voyage", text: "Conseils sur les billets, bagages et formalités de départ." },
  { id: "installation", icon: "key", title: "Installation", text: "Accueil, compte bancaire, sécurité sociale, titre de séjour." },
  { id: "suivi", icon: "heart-handshake", title: "Suivi après l'arrivée", text: "Un conseiller reste votre interlocuteur pendant votre première année." },
];

export const testimonials = [
  {
    name: "Aïcha Koné",
    origin: "Abidjan, Côte d'Ivoire",
    program: "Master Management International — Paris",
    quote:
      "J'avais peur de me perdre entre Campus France, le visa et le logement. Mon conseillère m'a guidée à chaque étape, et je voyais l'avancement de mon dossier en temps réel.",
    rating: 5,
  },
  {
    name: "Mawuli Agbéko",
    origin: "Lomé, Togo",
    program: "Master Data Science & IA — Lyon",
    quote:
      "Le dépôt des documents en ligne m'a fait gagner des semaines. Quand une pièce n'allait pas, je savais exactement quoi corriger et pourquoi.",
    rating: 5,
  },
  {
    name: "Fatou Ndiaye",
    origin: "Dakar, Sénégal",
    program: "Bachelor Marketing Digital — Lille",
    quote:
      "Ma famille pouvait suivre les étapes avec moi. Le jour de mon arrivée, quelqu'un m'attendait pour les premières démarches. Je me suis sentie accompagnée.",
    rating: 5,
  },
  {
    name: "Jean-Paul Tchouaméni",
    origin: "Douala, Cameroun",
    program: "Master Génie Industriel — Lyon",
    quote:
      "Un seul interlocuteur du début à la fin. L'entretien Campus France s'est très bien passé grâce aux simulations préparées ensemble.",
    rating: 5,
  },
];

export const articles = [
  {
    slug: "reussir-entretien-campus-france",
    title: "Réussir son entretien Campus France : la méthode en 5 points",
    excerpt: "Les questions qui reviennent, la cohérence du projet et les erreurs qui coûtent cher.",
    category: "Campus France",
    date: "12 septembre 2026",
    read: "7 min",
    image: "/images/advisor.jpg",
  },
  {
    slug: "budget-etudiant-france",
    title: "Quel budget prévoir pour étudier en France en 2027 ?",
    excerpt: "Frais de scolarité, logement, transport, alimentation : notre estimation ville par ville.",
    category: "Budget",
    date: "4 septembre 2026",
    read: "6 min",
    image: "/images/study-desk.jpg",
  },
  {
    slug: "trouver-logement-etudiant",
    title: "Trouver un logement étudiant avant d'arriver",
    excerpt: "Résidences, colocation, garant : comment sécuriser votre logement depuis votre pays.",
    category: "Logement",
    date: "28 août 2026",
    read: "5 min",
    image: "/images/paris-night.jpg",
  },
  {
    slug: "documents-dossier-candidature",
    title: "Les documents indispensables pour votre dossier de candidature",
    excerpt: "La liste complète des pièces, les formats acceptés et les pièges à éviter.",
    category: "Candidature",
    date: "20 août 2026",
    read: "4 min",
    image: "/images/documents.jpg",
  },
  {
    slug: "choisir-son-master",
    title: "Choisir son master en France : université ou école ?",
    excerpt: "Coûts, reconnaissance, insertion professionnelle : les critères pour décider.",
    category: "Orientation",
    date: "9 août 2026",
    read: "8 min",
    image: "/images/amphitheater.jpg",
  },
  {
    slug: "premiers-jours-en-france",
    title: "Vos premiers jours en France : la checklist d'installation",
    excerpt: "Titre de séjour, compte bancaire, sécurité sociale, transports : dans quel ordre s'y prendre.",
    category: "Installation",
    date: "30 juillet 2026",
    read: "6 min",
    image: "/images/paris.jpg",
  },
];

export const faq = [
  {
    q: "Campus One garantit-il l'obtention du visa ?",
    a: "Non. Nous vous accompagnons dans la préparation d'un dossier complet et cohérent, mais la décision appartient exclusivement aux autorités consulaires.",
  },
  {
    q: "Puis-je déposer plusieurs candidatures ?",
    a: "Oui. Un même compte peut porter plusieurs candidatures sur des formations différentes, chacune avec son propre suivi.",
  },
  {
    q: "Comment régler les frais de dossier ?",
    a: "Deux options : règlement en agence, ou dépôt bancaire avec téléversement du bordereau depuis votre espace. Le paiement par carte et mobile money arrivera prochainement.",
  },
  {
    q: "Quels formats de documents sont acceptés ?",
    a: "Uniquement le format PDF, jusqu'à 10 Mo par fichier (20 Mo pour certains documents). Chaque pièce est vérifiée par votre conseiller.",
  },
  {
    q: "Je ne sais pas quelle formation choisir, que faire ?",
    a: "Remplissez notre questionnaire d'orientation : un conseiller vous proposera plusieurs formations adaptées à votre profil sous 48 heures ouvrées.",
  },
];

export const contact = {
  phone: "+228 90 00 00 00",
  whatsapp: "22890000000",
  email: "contact@campus-one.com",
  address: "Boulevard du 13 Janvier, Lomé",
  hours: "Du lundi au vendredi, 8h – 18h · Samedi, 9h – 13h",
};
