# Campus One — Frontend (maquette fonctionnelle)

Frontend de la plateforme de mobilité étudiante Campus One : **site vitrine**, **espace candidat** et **back-office**.
Aucun backend : toutes les données sont fictives (`src/lib/mocks`) et les actions sont simulées (notifications, états, délais). Les écrans servent à valider les parcours avant le développement de l'API.

## Lancer le projet

Prérequis : Node.js 20 ou plus et npm.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
npm start        # sert le build
```

Une seule application Next.js, donc un seul déploiement :

| Espace | URL | Accès |
|---|---|---|
| Site vitrine | `/` | Public |
| Espace candidat | `/mon-espace` | Session candidat (`/connexion`) |
| Back-office | `/admin` | Session collaborateur (`/admin/connexion`), non indexé par les moteurs de recherche |

## Architecture

```
src/
  app/
    (public)/       Site vitrine : accueil, formations, services, contact…
    (auth)/         Connexion, inscription, code 2FA, mot de passe oublié (candidats)
    (candidat)/     /mon-espace : tableau de bord, candidatures, documents, paiements…
    admin/          Back-office : layout dédié, /admin/connexion, (app)/ écrans protégés
  components/
    ui/             Design system partagé (tokens aux couleurs du logo, boutons, champs, badges, timeline, dialogues, toasts)
    site/           Composants du site vitrine
    espace/         Composants de l'espace candidat
    admin/          Composants du back-office
  lib/
    mocks/          Données fictives typées — à remplacer par les appels API
    session.ts      Session candidat simulée
    admin/          Session et permissions (RBAC) du back-office simulées
public/             Logos, favicons et photos
```

Stack : Next.js 15 (App Router), React 19, Tailwind CSS 4, lucide-react (icônes), motion (animations).

## Parcours à tester

**Vitrine** — accueil (recherche multicritère, chiffres animés, parcours, témoignages, galerie), catalogue filtrable,
fiche formation avec CTA fixe, questionnaire d'orientation en 8 questions, contact avec prise de rendez-vous, bouton WhatsApp flottant.

**Candidat** — `/mon-espace` est protégé : sans session, redirection vers `/connexion`, puis retour à la page demandée.
- Compte de démonstration : `aminata.diallo@exemple.com` / `Campus2026`, code 2FA `123456` (bouton « Remplir automatiquement » sur la page).
- Mauvais identifiants ou mauvais code : message d'erreur, 3 essais pour le code. L'inscription crée une session au nom saisi.
- Statut du dossier visible en permanence dans l'en-tête, timeline sur le tableau de bord.
- Candidature en 5 étapes : validation à la sortie du champ, sauvegarde automatique du brouillon, récapitulatif modifiable.
- Documents : dépôt par glisser-déposer, contrôle PDF et taille, progression, analyse de sécurité, motif de rejet, historique des versions.
- Paiements : règlement en agence ou dépôt bancaire (RIB copiable, référence unique, envoi du bordereau → « en attente de validation »). Carte / mobile money affiché « bientôt » (Semoa, phase 6).
- Remarques actionnables, messagerie, prise de rendez-vous, profil.

**Back-office** — protégé de la même façon : `/connexion` → MFA (TOTP) → tableau de bord « à traiter aujourd'hui ».
- Un compte de démonstration par rôle (Administrateur, Gestionnaire simple, Superviseur, Comptabilité, Direction), mot de passe `BackOffice2026`, code MFA `123456`.
- Connectez-vous en « Gestionnaire simple » (Claire Mensah) : le menu, les boutons et les dossiers visibles s'adaptent aux permissions. Le menu utilisateur permet aussi de changer de compte.
- Dossiers : filtres persistants, vues rapides, tri, actions en masse, raccourcis `/`, `j`/`k`, `x`, `Entrée`, `?`.
- Fiche dossier : validation / rejet des pièces (motif obligatoire), passage manuel d'étape, remarques candidat, notes internes, paiement hors ligne.
- Parcours d'étapes : éditeur par filière (glisser-déposer ou flèches, étapes internes, emails, pièces requises, aperçu candidat en direct).
- Bordereaux : rapprochement en 3 vérifications avant validation. Campagnes (duplication d'une année sur l'autre), catalogue, types de documents, partenaires, rôles et permissions, journal d'audit.

## Hypothèses à valider avec Campus One

- **Contenus fictifs** : établissements, témoignages, chiffres, coordonnées (Lomé), RIB et montants en FCFA sont des exemples à remplacer.
- **Photos** : banque d'images Unsplash (licence libre), dans `public/images`.
- **Témoignages** : avatars à initiales, pas de visages associés à des citations inventées ; à remplacer par de vrais témoignages avec consentement.
- **Logo** : pictogramme extrait du logo officiel (fond rendu transparent) ; le nom « Campus One » est composé en texte pour rester net et décliner une version claire. Un fichier vectoriel (SVG) officiel améliorerait la netteté.
- Les sessions simulées, le brouillon de candidature et les filtres utilisent le stockage local du navigateur ; en production, sessions par cookie httpOnly posées par l'API.
