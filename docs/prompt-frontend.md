# Cahier des charges — Frontend Meredian

Ce document resume le chantier realise dans ce depot. Reference : le prototype monofichier
`plateforme-app-prototype.jsx` (design et comportement valides).

## Objectif

Transformer le prototype monofichier en projet frontend structure et pret pour la production :

1. **Vrai routing** avec React Router — une URL par page
   (`/`, `/catalogue`, `/cours/:id`, `/accompagnement`, `/profil`, `/contact`, `/admin`…).
2. **Decoupage en composants et fichiers separes** (un composant = un fichier).
3. **Connexion a l'API backend** (`architecture-technique.md`) via un client HTTP avec gestion
   des etats de chargement / erreur. Mocks propres tant que le backend n'est pas deploye.
4. **Authentification reelle** : login / register, token JWT, protection des routes admin par
   role (remplace l'interrupteur « Vue Admin » du prototype).
5. **Formulaires natifs** `<form>` avec validation.

## Pages livrees

- **Accueil** — hero + pitch video, cours gratuits mis en avant, apercu accompagnement, temoignage.
- **Catalogue** — filtres matiere + niveau, recherche, bandeau d'introduction par filiere.
- **Lecture d'un cours** — sidebar modules/sections avec statut, contenu par type
  (video / galerie / lecture / quiz), carte d'upsell si payant, PDF, encart certification (Informatique).
- **Accompagnement** — mentorat (reservation), correction de travaux (upload), sessions Q&R (inscription).
- **Profil / vitrine** — parcours, competences par domaine, travaux, pitch video.
- **Contact** — formulaire dedie.
- **Admin** (role) — CRUD cours (modele de cours, gratuit/payant + prix inline), gestion des
  modules et sections avec editeur de contenu par type.

## Organisation Git

Voir la section « Strategie de branches Git » du `README.md` a la racine.
