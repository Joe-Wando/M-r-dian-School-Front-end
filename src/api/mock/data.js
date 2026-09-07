// Donnees de demonstration — reprises telles quelles du prototype valide.
// Servent tant que le backend (architecture-technique.md) n'est pas deploye.

export const seedCourses = [
  { id: "HIS-101", code: "HIS-101", category: "Histoire", level: "L1", title: "Les grandes ruptures du XXe siecle", description: "Des guerres mondiales a la decolonisation : comprendre un siecle qui a redessine les frontieres et les idees.", duration: "4h30", is_free: true, price: 0, template: "Theorique illustre" },
  { id: "HIS-105", code: "HIS-105", category: "Histoire", level: "L1", title: "Introduction a l'historiographie", description: "Comment se construit le savoir historique : sources, methode critique, ecoles de pensee.", duration: "3h", is_free: false, price: 8000, template: "Theorique illustre" },
  { id: "HIS-201", code: "HIS-201", category: "Histoire", level: "L2", title: "Histoire de la Rome antique", description: "De la fondation legendaire a la chute de l'Empire : institutions, societe, heritage.", duration: "6h", is_free: false, price: 12000, template: "Theorique illustre" },
  { id: "HIS-204", code: "HIS-204", category: "Histoire", level: "L2", title: "Histoire des institutions africaines precoloniales", description: "Royaumes, empires et systemes de gouvernance avant la colonisation : une histoire trop souvent effacee.", duration: "6h", is_free: false, price: 12000, template: "Theorique illustre" },
  { id: "HIS-210", code: "HIS-210", category: "Histoire", level: "L2", title: "Histoire des civilisations medievales", description: "Feodalite, echanges, foi et pouvoir : l'Europe et ses voisins entre le Ve et le XVe siecle.", duration: "5h30", is_free: false, price: 11000, template: "Theorique illustre" },
  { id: "HIS-301", code: "HIS-301", category: "Histoire", level: "L3", title: "Histoire de la Revolution francaise", description: "1789 et ses suites : rupture politique, sociale et symbolique dont l'echo traverse encore le present.", duration: "5h", is_free: false, price: 14000, template: "Theorique illustre" },
  { id: "HIS-305", code: "HIS-305", category: "Histoire", level: "L3", title: "Histoire des relations internationales contemporaines", description: "Des traites de paix aux organisations mondiales : la fabrique de l'ordre international depuis 1945.", duration: "6h30", is_free: false, price: 15000, template: "Theorique illustre" },
  { id: "HIS-310", code: "HIS-310", category: "Histoire", level: "L3", title: "Histoire de la Guerre froide", description: "Blocs, crises, equilibre de la terreur : anatomie d'un conflit qui n'a jamais eu lieu directement.", duration: "5h", is_free: false, price: 13000, template: "Theorique illustre" },
  { id: "DRO-101", code: "DRO-101", category: "Droit", level: "L1", title: "Introduction generale au droit", description: "Les fondations : sources du droit, hierarchie des normes, organisation judiciaire.", duration: "4h", is_free: true, price: 0, template: "Theorique illustre" },
  { id: "DRO-110", code: "DRO-110", category: "Droit", level: "L1", title: "Introduction au droit des contrats", description: "Les bases essentielles pour comprendre, lire et negocier un contrat en toute confiance.", duration: "5h", is_free: true, price: 0, template: "Theorique illustre" },
  { id: "DRO-205", code: "DRO-205", category: "Droit", level: "L2", title: "Droit constitutionnel", description: "Separation des pouvoirs, regimes politiques, controle de constitutionnalite — le socle du droit public.", duration: "6h", is_free: false, price: 13000, template: "Theorique illustre" },
  { id: "DRO-210", code: "DRO-210", category: "Droit", level: "L2", title: "Droit des obligations", description: "Contrats, responsabilite civile, engagements : le coeur du droit prive patrimonial.", duration: "7h", is_free: false, price: 14000, template: "Theorique illustre" },
  { id: "DRO-215", code: "DRO-215", category: "Droit", level: "L2", title: "Droit penal general", description: "Infraction, responsabilite, sanction : les principes qui structurent le droit repressif.", duration: "6h30", is_free: false, price: 14000, template: "Theorique illustre" },
  { id: "DRO-305", code: "DRO-305", category: "Droit", level: "L3", title: "Droit du travail applique", description: "Contrats, licenciements, litiges : un cours concret pour salaries, RH et futurs juristes.", duration: "8h", is_free: false, price: 18000, template: "Mixte" },
  { id: "DRO-310", code: "DRO-310", category: "Droit", level: "L3", title: "Droit administratif", description: "L'action de l'administration, ses actes, ses limites : comprendre le droit public en pratique.", duration: "7h", is_free: false, price: 16000, template: "Theorique illustre" },
  { id: "DRO-315", code: "DRO-315", category: "Droit", level: "L3", title: "Droit des affaires", description: "Societes commerciales, concurrence, contrats d'affaires : le droit au service de l'entreprise.", duration: "7h30", is_free: false, price: 17000, template: "Theorique illustre" },
  { id: "DRO-320", code: "DRO-320", category: "Droit", level: "L3", title: "Libertes fondamentales", description: "Droits de l'Homme, controle du pouvoir, protections constitutionnelles et internationales.", duration: "5h", is_free: false, price: 13000, template: "Theorique illustre" },
  { id: "INF-101", code: "INF-101", category: "Informatique", level: "L1", title: "Algorithmique 1 — Les fondamentaux", description: "Variables, boucles, conditions, fonctions : penser comme un algorithme avant de coder.", duration: "6h", is_free: true, price: 0, template: "Pratique guidee" },
  { id: "INF-105", code: "INF-105", category: "Informatique", level: "L1", title: "Programmation en langage C", description: "Le langage qui a forge l'informatique moderne : pointeurs, memoire, rigueur.", duration: "8h", is_free: false, price: 15000, template: "Pratique guidee" },
  { id: "INF-201", code: "INF-201", category: "Informatique", level: "L2", title: "Algorithmique 2 — Structures de donnees avancees", description: "Listes chainees, arbres, graphes : structurer la donnee pour des programmes efficaces.", duration: "7h", is_free: false, price: 16000, template: "Pratique guidee" },
  { id: "INF-210", code: "INF-210", category: "Informatique", level: "L2", title: "Java oriente objet", description: "Classes, heritage, polymorphisme : construire des programmes robustes et reutilisables.", duration: "8h30", is_free: false, price: 17000, template: "Pratique guidee" },
  { id: "INF-120", code: "INF-120", category: "Informatique", level: "L2", title: "Bases de donnees relationnelles avec PostgreSQL", description: "Modeliser, interroger et optimiser une base de donnees comme un professionnel.", duration: "7h", is_free: false, price: 15000, template: "Pratique guidee" },
  { id: "INF-301", code: "INF-301", category: "Informatique", level: "L3", title: "Python pour l'analyse de donnees", description: "Pandas, NumPy, visualisation : transformer des donnees brutes en informations exploitables.", duration: "7h30", is_free: false, price: 16000, template: "Pratique guidee" },
  { id: "INF-310", code: "INF-310", category: "Informatique", level: "L3", title: "Introduction a la Data Science", description: "Statistiques appliquees, premiers modeles predictifs, methodologie d'un projet data.", duration: "9h", is_free: false, price: 19000, template: "Mixte" },
  { id: "INF-P01", code: "INF-P01", category: "Informatique", level: "Formation Pro", title: "Git & GitHub pour debutants", description: "Versionner son code sereinement, collaborer sans ecraser le travail des autres.", duration: "2h30", is_free: true, price: 0, template: "Pratique guidee" },
  { id: "INF-P02", code: "INF-P02", category: "Informatique", level: "Formation Pro", title: "Developpement Front-End avec React", description: "Composants, etat, interactions : construire des interfaces web modernes et reactives.", duration: "10h", is_free: false, price: 22000, template: "Pratique guidee" },
  { id: "INF-P03", code: "INF-P03", category: "Informatique", level: "Formation Pro", title: "Developpement Back-End avec Node.js", description: "API REST, gestion de serveur, connexion a une base de donnees : le back-end de A a Z.", duration: "10h", is_free: false, price: 22000, template: "Pratique guidee" },
  { id: "RH-P01", code: "RH-P01", category: "RH", level: "Formation Pro", title: "Fondamentaux de la gestion des talents", description: "Comprendre les enjeux RH modernes : retention, motivation, montee en competences.", duration: "3h", is_free: true, price: 0, template: "Theorique illustre" },
  { id: "RH-P02", code: "RH-P02", category: "RH", level: "Formation Pro", title: "Recrutement et evaluation des competences", description: "Structurer un processus de recrutement juste, efficace et aligne avec la strategie de l'entreprise.", duration: "5h30", is_free: false, price: 14000, template: "Theorique illustre" },
  { id: "RH-P03", code: "RH-P03", category: "RH", level: "Formation Pro", title: "Gestion de la paie", description: "Bulletins, cotisations, obligations legales : les fondamentaux d'une paie fiable.", duration: "6h", is_free: false, price: 15000, template: "Mixte" },
  { id: "RH-P04", code: "RH-P04", category: "RH", level: "Formation Pro", title: "Formation et developpement des competences", description: "Construire un plan de formation qui fait grandir les equipes et l'entreprise.", duration: "4h30", is_free: false, price: 12000, template: "Theorique illustre" },
  { id: "RH-P05", code: "RH-P05", category: "RH", level: "Formation Pro", title: "Communication interne et marque employeur", description: "Federer en interne, attirer en externe : la communication au service des RH.", duration: "4h", is_free: false, price: 11000, template: "Theorique illustre" },
  { id: "RH-P06", code: "RH-P06", category: "RH", level: "Formation Pro", title: "Gestion des conflits en entreprise", description: "Desamorcer les tensions, arbitrer avec justesse, restaurer un climat de travail sain.", duration: "3h30", is_free: false, price: 10000, template: "Theorique illustre" },
  { id: "RH-P07", code: "RH-P07", category: "RH", level: "Formation Pro", title: "Droit social pour les RH", description: "Le droit du travail vu du cote RH : ce qu'il faut savoir au quotidien.", duration: "5h", is_free: false, price: 13000, template: "Mixte" },
];

export const seedModulesByCourse = {
  "HIS-101": [
    { id: "HIS-101-m1", title: "Le monde avant la rupture", order_index: 0, status: "done", sections: [
      { id: "HIS-101-m1-s1", title: "L'ordre europeen en 1900", type: "image", duration: "12 photos", order_index: 0, photos: [] },
      { id: "HIS-101-m1-s2", title: "Tensions et rivalites imperiales", type: "reading", duration: "8 min", order_index: 1, body: "Contenu de lecture a rediger." },
    ] },
    { id: "HIS-101-m2", title: "Les deux guerres mondiales", order_index: 1, status: "done", sections: [
      { id: "HIS-101-m2-s1", title: "La Premiere Guerre mondiale : causes et bouleversements", type: "image", duration: "15 photos", order_index: 0, photos: [] },
      { id: "HIS-101-m2-s2", title: "La Seconde Guerre mondiale : un basculement global", type: "image", duration: "18 photos", order_index: 1, photos: [] },
      { id: "HIS-101-m2-s3", title: "Cartes et bilans chiffres", type: "reading", duration: "10 min", order_index: 2, body: "" },
    ] },
    { id: "HIS-101-m3", title: "La decolonisation", order_index: 2, status: "current", sections: [
      { id: "HIS-101-m3-s1", title: "Les mouvements d'independance en Afrique et en Asie", type: "image", duration: "14 photos", order_index: 0, photos: [] },
      { id: "HIS-101-m3-s2", title: "Etude de cas : l'independance de l'Inde", type: "reading", duration: "12 min", order_index: 1, body: "" },
      { id: "HIS-101-m3-s3", title: "Chronologie commentee", type: "quiz", duration: "1 evaluation", order_index: 2, questions: [] },
    ] },
    { id: "HIS-101-m4", title: "Un siecle qui redessine le monde", order_index: 3, status: "locked", sections: [
      { id: "HIS-101-m4-s1", title: "Guerre froide et nouvel ordre mondial", type: "image", duration: "10 photos", order_index: 0, photos: [] },
      { id: "HIS-101-m4-s2", title: "Synthese et mise en perspective", type: "reading", duration: "8 min", order_index: 1, body: "" },
    ] },
  ],
  "INF-105": [
    { id: "INF-105-m1", title: "Comprendre le langage C", order_index: 0, status: "done", sections: [
      { id: "INF-105-m1-s1", title: "Pourquoi apprendre le C ?", type: "reading", duration: "6 min", order_index: 0, body: "" },
      { id: "INF-105-m1-s2", title: "Syntaxe de base et compilation", type: "reading", duration: "8 min", order_index: 1, body: "" },
    ] },
    { id: "INF-105-m2", title: "Premiers programmes", order_index: 1, status: "done", sections: [
      { id: "INF-105-m2-s1", title: "Ecrire et compiler son premier programme", type: "video", practical: true, duration: "14 min", order_index: 0, video_url: "" },
      { id: "INF-105-m2-s2", title: "Boucles et conditions en pratique", type: "video", practical: true, duration: "16 min", order_index: 1, video_url: "" },
    ] },
    { id: "INF-105-m3", title: "Manipuler la memoire", order_index: 2, status: "current", sections: [
      { id: "INF-105-m3-s1", title: "Comprendre les pointeurs", type: "reading", duration: "9 min", order_index: 0, body: "" },
      { id: "INF-105-m3-s2", title: "Debugger un pointeur en direct", type: "video", practical: true, duration: "18 min", order_index: 1, video_url: "" },
      { id: "INF-105-m3-s3", title: "Exercice note", type: "quiz", duration: "1 evaluation", order_index: 2, questions: [] },
    ] },
    { id: "INF-105-m4", title: "Projet guide", order_index: 3, status: "locked", sections: [
      { id: "INF-105-m4-s1", title: "Construire un petit programme complet", type: "video", practical: true, duration: "22 min", order_index: 0, video_url: "" },
    ] },
  ],
};

export const demoModules = [
  { id: "demo-m1", title: "Introduction", order_index: 0, status: "done", sections: [
    { id: "demo-m1-s1", title: "Presentation du cours", type: "video", duration: "8 min", order_index: 0, video_url: "" },
    { id: "demo-m1-s2", title: "Notions cles", type: "video", duration: "12 min", order_index: 1, video_url: "" },
  ] },
  { id: "demo-m2", title: "Approfondissement", order_index: 1, status: "done", sections: [
    { id: "demo-m2-s1", title: "Concepts avances", type: "video", duration: "14 min", order_index: 0, video_url: "" },
    { id: "demo-m2-s2", title: "Support de lecture", type: "reading", duration: "10 min", order_index: 1, body: "" },
  ] },
  { id: "demo-m3", title: "Mise en pratique", order_index: 2, status: "current", sections: [
    { id: "demo-m3-s1", title: "Etude de cas guidee", type: "video", duration: "16 min", order_index: 0, video_url: "" },
    { id: "demo-m3-s2", title: "Application concrete", type: "video", duration: "18 min", order_index: 1, video_url: "" },
    { id: "demo-m3-s3", title: "Exercice note", type: "quiz", duration: "1 evaluation", order_index: 2, questions: [] },
  ] },
  { id: "demo-m4", title: "Pour aller plus loin", order_index: 3, status: "locked", sections: [
    { id: "demo-m4-s1", title: "Cas complexes", type: "video", duration: "11 min", order_index: 0, video_url: "" },
    { id: "demo-m4-s2", title: "Ressources complementaires", type: "reading", duration: "9 min", order_index: 1, body: "" },
  ] },
];

export const FILIERE_INFO = {
  Histoire: {
    intro: "Vous voici plonges dans l'etude du temps long : comprendre le present a la lumiere du passe.",
    levels: {
      L1: "Poser les bases : reperes chronologiques et methode historique.",
      L2: "Approfondir : civilisations, institutions et societes a travers les ages.",
      L3: "Analyser des enjeux contemporains a la lumiere de l'histoire recente.",
    },
  },
  Droit: {
    intro: "Vos premiers pas dans le raisonnement juridique : rigueur, logique, argumentation.",
    levels: {
      L1: "Les fondations du droit : sources, institutions, vocabulaire juridique.",
      L2: "Le coeur de la matiere : droit public et droit prive approfondis.",
      L3: "Specialisation : droit applique a des situations professionnelles concretes.",
    },
  },
  Informatique: {
    intro: "Vous voici en train de faire vos premiers pas en informatique. Prenez le temps d'apprendre les bases : elles vous serviront toute votre carriere.",
    levels: {
      L1: "Les fondamentaux : algorithmique et premiers langages de programmation.",
      L2: "Structurer sa pensee : structures de donnees, bases de donnees, programmation orientee objet.",
      L3: "Se specialiser : data, analyse, projets concrets.",
      "Formation Pro": "Des competences directement applicables en entreprise : outils, frameworks, bonnes pratiques.",
    },
    certification: "Cette filiere peut t'orienter vers une certification professionnelle externe reconnue.",
  },
  RH: {
    intro: "Des competences RH concretes, pensees pour le terrain : recrutement, paie, gestion des equipes.",
    levels: {
      "Formation Pro": "Des modules pratiques, independants les uns des autres, a suivre selon tes besoins du moment.",
    },
  },
};

export const seedMentoring = [
  { id: "MEN-30", duration_minutes: 30, label: "30 min", description: "Une question precise, un blocage a debloquer rapidement.", price: 8000 },
  { id: "MEN-60", duration_minutes: 60, label: "60 min", description: "Un accompagnement approfondi : projet, orientation, plan de progression.", price: 14000 },
];

export const seedQaSessions = [
  { id: "QA-1", topic: "Bases de donnees & SQL", date: "Jeudi 6 aout", time: "18h00 — 19h00", scheduled_at: "2026-08-06T18:00:00", duration_minutes: 60, max_spots: 12, spots_left: 12 },
  { id: "QA-2", topic: "Droit des contrats — questions d'examen", date: "Mardi 11 aout", time: "19h00 — 20h00", scheduled_at: "2026-08-11T19:00:00", duration_minutes: 60, max_spots: 8, spots_left: 8 },
  { id: "QA-3", topic: "Orientation carriere en informatique", date: "Samedi 15 aout", time: "10h00 — 11h00", scheduled_at: "2026-08-15T10:00:00", duration_minutes: 60, max_spots: 20, spots_left: 20 },
];

export const seedProfile = {
  id: "profile-1",
  name: "[Ton nom]",
  bio: "Etudiant en Genie Informatique, formateur en Histoire, Droit, Informatique et RH. Je construis des ponts entre disciplines — et cette plateforme en est le reflet.",
  headline: "Etudiant en Genie Informatique, formateur en Histoire, Droit, Informatique et RH.",
  location: "Zurich, Suisse",
  email_contact: "contact@exemple.com",
  cv_url: "#",
  pitch_video_url: "",
  timeline: [
    { year: "2024 — present", type: "formation", title: "Licence 2, Genie Informatique", place: "Universite de Zurich" },
    { year: "2023", type: "experience", title: "Stage — Developpement web", place: "Cabinet independant" },
    { year: "2022", type: "formation", title: "Baccalaureat, serie Sciences", place: "Lycee [Nom]" },
  ],
  skills: [
    { category: "Informatique", name: "React" },
    { category: "Informatique", name: "Node.js" },
    { category: "Informatique", name: "PostgreSQL" },
    { category: "Informatique", name: "Python" },
    { category: "Informatique", name: "Git" },
    { category: "Droit", name: "Redaction contractuelle" },
    { category: "Droit", name: "Veille juridique" },
    { category: "RH", name: "Recrutement" },
    { category: "RH", name: "Communication interne" },
    { category: "Histoire", name: "Recherche documentaire" },
    { category: "Histoire", name: "Analyse historique" },
  ],
  works: [
    { id: "TRV-01", category: "Informatique", title: "Plateforme de cours en ligne", description: "Conception et developpement de ce projet meme — catalogue, paiement, vitrine.", link: null },
    { id: "TRV-02", category: "Droit", title: "Note de synthese — droit des contrats", description: "Analyse comparee des clauses resolutoires en droit OHADA.", link: null },
    { id: "TRV-03", category: "Informatique", title: "API de gestion de bibliotheque", description: "API REST avec authentification, developpee en Node.js et PostgreSQL.", link: null },
    { id: "TRV-04", category: "RH", title: "Etude — fidelisation des jeunes talents", description: "Enquete et recommandations pour une PME locale.", link: null },
  ],
};

export const seedUsers = [
  { id: "u-admin", name: "Proprietaire Meredian", email: "admin@meredian.dev", password: "admin1234", role: "admin" },
  { id: "u-demo", name: "Etudiant Demo", email: "demo@meredian.dev", password: "demo1234", role: "user" },
];

export const CORRECTION_PRICE = 6000;
