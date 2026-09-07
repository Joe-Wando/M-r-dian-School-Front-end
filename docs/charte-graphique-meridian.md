# Charte graphique — Meredian

**Version :** 0.1
**Principe directeur :** la marque s'efface derriere le contenu. Meredian n'est pas la pour se
faire remarquer, mais pour accompagner discretement.

---

## 1. Philosophie de marque

Meredian n'est pas une entreprise qui cherche a imposer son nom — c'est un repere personnel,
discret, qui structure et accompagne sans jamais prendre toute la place.

- **On ne repete pas le nom partout.** Une seule mention suffit souvent par page.
- **L'icone prime sur le mot.** Le mark (le repere circulaire) suffit a signer la marque ;
  le mot complet « Meredian » est reserve a de rares moments.
- **Pas de slogan, pas d'emphase.** Aucun texte « Bienvenue sur Meredian ! ».

---

## 2. Le logo

### 2.1 Deux niveaux d'usage

| Niveau | Ou | Ce qu'on affiche |
|---|---|---|
| **Icone seule** | Navigation, favicon, chargement, notifications | Le mark circulaire uniquement, en petit, sans texte |
| **Wordmark complet** | Pied de page, une fois sur l'accueil, documents officiels | Icone + « Meredian » |

Le wordmark complet **n'apparait jamais deux fois sur le meme ecran**.

### 2.2 Taille et espace de protection

- Taille minimale de l'icone seule : 20px de haut.
- Espace de protection : au moins la moitie de la hauteur du logo.
- Le wordmark ne descend jamais sous 14px.

### 2.3 Couleur du logo

- Version standard : trait bleu `#0056D2` sur fond clair.
- Version discrete : trait gris `#6B7280` quand le logo doit s'effacer (pied de page, filigrane).
- Jamais de fond colore derriere le logo.

---

## 3. Palette de couleurs

| Usage | Couleur |
|---|---|
| Fond principal | `#F9FAFB` / blanc |
| Texte principal | `#1A1A1A` |
| Texte secondaire | `#6B7280` |
| Accent principal | `#0056D2` |
| Bordures | `#E5E7EB` / `#D1D5DB` |

Couleurs par matiere (orientent dans le contenu, pas la marque) :

| Matiere | Trait | Fond teinte |
|---|---|---|
| Histoire | `#B45309` | `#FEF3C7` |
| Droit | `#1D4ED8` | `#DBEAFE` |
| Informatique | `#059669` | `#D1FAE5` |
| RH | `#A21CAF` | `#FAE8FF` |

---

## 4. Typographie

- **Police unique** : Inter (ou systeme par defaut si indisponible).
- Deux graisses : normal (400) et medium/semi-bold (500-600) pour les titres.
- Le nom « Meredian » s'ecrit toujours en majuscule initiale simple.

---

## 5. Ton et discours

- On ne parle jamais de « la marque Meredian » dans les textes visibles.
- Pas de messages de bienvenue appuyes, pas de pop-up de presentation de marque.

---

## 6. Application dans ce frontend

- La navigation n'affiche que l'icone (`<Logo variant="icon" />`).
- Le wordmark complet (`<Logo variant="word" muted />`) apparait une seule fois, en pied de page.
- Aucun autre ecran n'affiche le nom complet.
