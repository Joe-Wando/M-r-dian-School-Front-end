# Logo

`logo-meridian.svg` est une reconstitution vectorielle du mark Meredian (repere circulaire,
fleche orange, coque bleue, badge de validation), conforme a la charte : trait `#0056D2`,
fond clair, aucun fond colore.

Pour utiliser le fichier source fourni par le studio :

1. Deposer `logo-meridian.png` (ou `.svg`) dans ce dossier `public/`.
2. Mettre a jour la reference dans `index.html` (`<link rel="icon" …>`) et dans
   `src/components/Logo.jsx` (`src="/logo-meridian.svg"`).

Le composant `Logo` gere deja les deux usages de la charte : `variant="icon"` (navigation) et
`variant="word"` (icone + « Meredian », pied de page uniquement).
