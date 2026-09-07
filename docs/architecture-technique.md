# Architecture technique — Plateforme Meredian

**Version :** 0.1 — Juillet 2026
Base sur le cahier des charges (v0.1) et les prototypes valides.

---

## 1. Stack

| Couche | Technologie |
|---|---|
| Frontend | React + Tailwind CSS (ce depot) |
| Backend | Node.js + Express (API REST) |
| Base de donnees | PostgreSQL |
| ORM | Prisma |
| Authentification | JWT |
| Paiement | Naboopay (API + webhooks) |
| Stockage video | Cloudflare Stream / Mux / Bunny Stream (a trancher) |
| Stockage fichiers | Compatible S3 |
| Deploiement | Vercel (frontend) + Railway/Render (backend + PostgreSQL) |

---

## 2. Schema de base de donnees (resume)

- **users** : `id`, `name`, `email` (unique), `password_hash`, `role` (`user` | `admin`), `created_at`.
- **courses** : `id`, `code`, `title`, `category` (`Histoire`|`Droit`|`Informatique`|`RH`),
  `level` (`L1`|`L2`|`L3`|`Formation Pro`), `template` (`Theorique illustre`|`Pratique guidee`|`Mixte`),
  `is_free`, `price` (FCFA, 0 si gratuit), `duration`, `description`, `pdf_resource_url`.
- **modules** : `id`, `course_id`, `title`, `order_index`.
- **sections** : `id`, `module_id`, `title`, `type` (`reading`|`image`|`video`|`quiz`),
  `order_index`, `duration`, `practical` (bool), `body`, `video_url`.
- **section_photos** : `id`, `section_id`, `url`, `caption`, `order_index`.
- **quiz_questions** : `id`, `section_id`, `question`, `options` (jsonb), `correct_index`, `order_index`.
- **enrollments** : `id`, `user_id`, `course_id`, `enrolled_at`.
- **section_completions** : `id`, `user_id`, `section_id`, `completed_at`.
  *(progression = sections completees / total, calculee a la volee.)*
- **payments** : `id`, `user_id`, `item_type` (`course`|`mentoring`|`correction`), `item_id`,
  `amount`, `naboopay_reference`, `status` (`pending`|`confirmed`|`failed`) — **confirme
  uniquement via webhook serveur**.
- **mentoring_bookings** : `id`, `user_id`, `duration_minutes` (30|60), `price`, `scheduled_at`,
  `meeting_link`, `status` (`pending`|`confirmed`|`completed`|`cancelled`).
- **qa_sessions** : `id`, `topic`, `scheduled_at`, `duration_minutes`, `max_spots`.
- **qa_registrations** : `id`, `session_id`, `user_id`.
- **work_submissions** : `id`, `user_id`, `file_url`, `note`, `status`
  (`pending`|`in_review`|`completed`), `price`, `created_at`.
- **profile** (ligne unique) : `id`, `bio`, `cv_url`, `pitch_video_url`, `location`, `email_contact`.
- **skills** : `id`, `category`, `name`.
- **works** : `id`, `title`, `category`, `description`, `link`.
- **contact_messages** : `id`, `name`, `email`, `message`, `is_read`, `created_at`.

---

## 3. Endpoints

### Authentification
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Catalogue (public)
- `GET /courses` — filtres `?category=&level=&query=`
- `GET /courses/:id`
- `GET /courses/:id/modules` — structure complete avec sections

### Cours (admin — middleware `requireAdmin`)
- `POST /courses` · `PATCH /courses/:id` · `DELETE /courses/:id`
- `POST /courses/:id/modules` · `PATCH /modules/:id` · `DELETE /modules/:id`
- `POST /modules/:id/sections` · `PATCH /sections/:id` · `DELETE /sections/:id`

### Progression (connecte)
- `POST /courses/:id/enroll`
- `GET /users/me/courses` — cours suivis + progression
- `POST /sections/:id/complete`

### Paiements
- `POST /payments/checkout` — initie un paiement Naboopay (course | mentoring | correction)
- `POST /payments/webhook` — confirmation Naboopay, **seule source de verite**

### Accompagnement
- `GET /mentoring/slots` · `POST /mentoring/bookings`
- `GET /qa-sessions` · `POST /qa-sessions/:id/register`
- `POST /work-submissions`

### Vitrine et contact
- `GET /profile` · `PATCH /profile` (admin)
- `POST /contact` · `GET /admin/contact-messages` (admin)

### Statistiques admin
- `GET /admin/stats` — cours publies, ventes, revenu, messages non lus

> Le frontend ajoute un `GET /filieres` (bandeaux d'introduction par matiere). Cote mock il est
> servi depuis `src/api/mock/data.js`; a integrer cote backend ou a remplacer par un contenu
> statique selon le choix d'implementation.

---

## 4. Securite

- Mots de passe chiffres (bcrypt/argon2).
- JWT verifie a chaque requete sensible.
- Middleware `requireAdmin` sur toutes les routes de gestion — **verifie cote serveur**, jamais
  seulement cote interface.
- HTTPS obligatoire.
- Statut de paiement confirme uniquement via le **webhook Naboopay signe**.
- Sauvegardes regulieres de la base.

---

## 5. A trancher

- Service d'hebergement video.
- Hebergement backend (Railway vs Render).
- Lien(s) de certification externe pour la filiere Informatique.
- Design des emails transactionnels.
