# Meredian — Frontend

Frontend de **Meredian**, plateforme personnelle qui combine :

- un **catalogue de cours** en ligne (Histoire, Droit, Informatique, RH — gratuits et payants) ;
- un **espace d'accompagnement** (mentorat, correction de travaux, sessions Q&R) ;
- une **vitrine professionnelle** (parcours, competences, travaux, pitch video) ;
- un **tableau de bord admin** (CRUD cours / modules / sections, prix, messages).

Construit a partir du prototype valide (`plateforme-app-prototype.jsx`) : meme design, meme
logique, mais transforme en application reelle — vrai routing, composants separes, appels API,
authentification JWT, formulaires natifs.

---

## Stack

| | |
|---|---|
| Build | Vite |
| UI | React 18 + React Router 6 |
| Styles | Tailwind CSS (tokens de la charte dans `tailwind.config.js` + `src/lib/theme.js`) |
| HTTP | axios (`src/api/client.js`) + hooks `useApi` / `useMutation` |
| Etat global | Context API — `AuthContext` (session JWT) et `CartContext` (panier / paiements en attente) |
| Icones | lucide-react |

Pas de Redux (inutile ici), pas de TypeScript (le prototype de reference est en JSX).

---

## Lancer le projet en local

Pre-requis : Node 18+ et npm.

```bash
npm install
cp .env.example .env      # sous Windows PowerShell : copy .env.example .env
npm run dev               # http://localhost:5173
```

### Variables d'environnement (`.env`)

| Variable | Role | Defaut |
|---|---|---|
| `VITE_API_URL` | URL du backend NestJS, **prefixe `/api` inclus**. | `http://localhost:4000/api` |
| `VITE_USE_MOCKS` | `false` = appels reels vers `VITE_API_URL` (backend requis). `true` = couche de donnees simulee en memoire, aucun backend. | `false` |

**Par defaut le frontend est branche sur le backend NestJS.** Le lancer :

```bash
# dans le repo backend
npm run start:dev        # http://localhost:4000, apres migrate + seed
```

Le backend accepte l'origine `http://localhost:5173` (CORS). La traduction entre le
contrat du frontend (snake_case, cf. `docs/architecture-technique.md`) et l'API
NestJS (camelCase, quelques formes differentes) est faite dans `src/api/index.js`.

Pour developper sans backend, mettre `VITE_USE_MOCKS=true` : la couche mock
(`src/api/mock/`) reproduit tous les endpoints avec persistance `localStorage`.

### Comptes de demonstration

| Contexte | Role | Email | Mot de passe |
|---|---|---|---|
| Backend (seed) | Admin | `admin@meredian.io` | valeur de `ADMIN_PASSWORD` (`.env` du backend) |
| Backend (seed) | Utilisateur | `etudiant@meredian.io` | `Etudiant!2026` |
| Mode mock | Admin | `admin@meredian.dev` | `admin1234` |
| Mode mock | Utilisateur | `demo@meredian.dev` | `demo1234` |

### Autres commandes

```bash
npm run build     # build de production dans dist/
npm run preview   # sert le build
npm run lint      # ESLint
```

---

## Structure

```
src/
├── main.jsx                  # point d'entree, providers (Router, Auth, Cart)
├── App.jsx                   # table de routage
├── api/
│   ├── client.js             # instance axios, injection du token, gestion 401
│   ├── index.js              # une fonction par endpoint (api.listCourses, api.login…)
│   └── mock/                 # backend simule (data.js + handlers.js) — VITE_USE_MOCKS
├── context/
│   ├── AuthContext.jsx       # login / register / logout, restauration de session
│   └── CartContext.jsx       # prestations en attente de paiement
├── hooks/
│   ├── useApi.js             # lecture : { data, loading, error, reload }
│   └── useMutation.js        # ecriture : { mutate, loading, error }
├── lib/
│   ├── theme.js              # couleurs par matiere, niveaux, modeles de cours
│   └── format.js             # formatPrice, progression, initiales
├── components/
│   ├── Logo.jsx              # icone seule / wordmark (regles de la charte)
│   ├── RouteGuards.jsx       # RequireAuth, RequireAdmin
│   ├── CourseCard.jsx
│   ├── layout/               # Navbar, Footer, Layout
│   ├── ui/                   # Spinner, ErrorState, Modal, Field, CategoryBadge
│   ├── course/               # CourseSidebar, SectionContent, UpsellCard, SectionIcon
│   └── admin/                # CourseFormModal, ModuleManagerModal, SectionEditorModal
└── pages/
    ├── HomePage.jsx
    ├── CataloguePage.jsx           # filtres matiere/niveau + recherche (dans l'URL)
    ├── CourseDetailPage.jsx        # /cours/:id
    ├── CoursePlayerPage.jsx        # /cours/:id/apprendre (protege)
    ├── AccompagnementPage.jsx
    ├── ProfilPage.jsx
    ├── ContactPage.jsx
    ├── MyCoursesPage.jsx           # /mes-cours (protege)
    ├── LoginPage.jsx · RegisterPage.jsx · NotFoundPage.jsx
    └── admin/AdminDashboardPage.jsx  # /admin (protege par role)
```

### Routes

| URL | Page | Acces |
|---|---|---|
| `/` | Accueil | public |
| `/catalogue` | Catalogue (filtres + recherche via query params) | public |
| `/cours/:id` | Fiche cours / achat | public |
| `/cours/:id/apprendre` | Lecture du cours | connecte |
| `/accompagnement` | Mentorat / corrections / Q&R | public (actions : connecte) |
| `/profil` | Vitrine | public |
| `/contact` | Formulaire de contact | public |
| `/mes-cours` | Cours suivis + progression | connecte |
| `/connexion`, `/inscription` | Auth | public |
| `/admin` | Tableau de bord | role `admin` |

---

## Authentification

- `POST /auth/login` / `POST /auth/register` renvoient `{ token, user }`.
- Le token JWT est stocke dans `localStorage` (`meredian.token`) et injecte dans l'entete
  `Authorization: Bearer …` par l'intercepteur axios.
- Au chargement, `AuthContext` appelle `GET /auth/me` pour restaurer la session.
- Une reponse `401` vide la session et redirige vers `/connexion`.
- L'interrupteur « Vue Admin » du prototype est remplace par une **vraie verification de role** :
  `RequireAdmin` cote frontend **pour l'UX seulement** — la protection qui fait foi est le
  middleware `requireAdmin` cote serveur (voir `docs/architecture-technique.md` §4).

---

## Strategie de branches Git

Flux inspire de Git Flow, adapte a un depot solo mais garde propre et review-able.

| Branche | Role | Regles |
|---|---|---|
| `main` | Toujours stable et deployable. | Aucun push direct. Merge uniquement via PR depuis `dev` (release) ou `hotfix/*`. |
| `dev` | Integration. Branche de travail de reference au quotidien. | Recoit les `feature/*` terminees via PR. |
| `feature/<nom-court>` | Une fonctionnalite = une branche, creee depuis `dev`. | Ex. `feature/catalogue-filtres`, `feature/auth-login`, `feature/admin-modules`. Fusionnee dans `dev` via PR une fois testee. |
| `hotfix/<nom-court>` | Correctif urgent en production, cree depuis `main`. | Fusionne dans **`main` ET `dev`**. |
| `release/<version>` | *(optionnel)* Gel de `dev` avant mise en production. | A activer si le rythme de livraison le justifie. |

### Conventions de commit

Prefixe court : `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`.

```
feat: ajoute le filtre par niveau au catalogue
fix: corrige la restauration de session au refresh
docs: precise la config des variables d'environnement
```

### Cycle de travail

```bash
git checkout dev && git pull
git checkout -b feature/ma-fonctionnalite

# … commits …

git push -u origin feature/ma-fonctionnalite
# Ouvrir une Pull Request vers dev sur GitHub, avec une description claire.
# Apres revue : merge (--no-ff) dans dev.

# Pour une mise en production : PR dev -> main, puis tag de version.
```

Les merges vers `dev` et `main` se font en `--no-ff` pour conserver la trace de chaque
fonctionnalite dans l'historique.

> Note : ce depot a ete initialise avec `git` mais sans `gh` CLI disponible localement, donc
> les Pull Requests n'ont pas pu etre ouvertes automatiquement. Les branches `feature/*` sont
> poussees sur `origin` ; les PR vers `dev` sont a ouvrir depuis l'interface GitHub.

---

## Deploiement

- **Frontend** : Vercel (Vite detecte automatiquement). Definir `VITE_API_URL` (URL publique du
  backend) et `VITE_USE_MOCKS=false`.
- **Backend + PostgreSQL** : Railway ou Render (voir `docs/architecture-technique.md`).

---

## Documents de reference

Dans `docs/` :

- `architecture-technique.md` — schema de base de donnees et liste des endpoints.
- `charte-graphique-meridian.md` — usage du logo, palette, typographie, ton.
- `prompt-frontend.md` — cahier des charges de ce chantier.
