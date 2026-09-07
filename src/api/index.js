import { client } from "./client";

const unwrap = (p) => p.then((r) => r.data);

/* ------------------------------------------------------------------ *
 * Adaptateurs backend NestJS <-> contrat du frontend.
 *
 * Le backend renvoie du camelCase et quelques formes structurees
 * differentes (cf. architecture-technique.md + README backend §"Details
 * d'integration frontend"). Ces mappers traduisent dans les deux sens,
 * de facon explicite (pas de transformation de cles automatique, pour ne
 * pas casser les objets de donnees type `levels` / `options`).
 * ------------------------------------------------------------------ */

const CODE_PREFIX = { Histoire: "HIS", Droit: "DRO", Informatique: "INF", RH: "RH" };
const genCourseCode = (category) =>
  `${CODE_PREFIX[category] || "NEW"}-${Math.floor(100 + Math.random() * 900)}`;

function mapCourseOut(c = {}) {
  return {
    ...c,
    is_free: c.is_free ?? c.isFree ?? false,
    pdf_resource_url: c.pdf_resource_url ?? c.pdfResourceUrl ?? null,
  };
}

function mapCourseIn(p = {}) {
  const out = {};
  if (p.code != null && p.code !== "") out.code = p.code;
  if (p.title != null) out.title = p.title;
  if (p.category != null) out.category = p.category;
  if (p.level != null) out.level = p.level;
  if (p.template != null) out.template = p.template;
  if (p.is_free != null || p.isFree != null) out.isFree = p.is_free ?? p.isFree;
  if (p.price != null && p.price !== "") out.price = Number(p.price) || 0;
  if (p.duration != null) out.duration = p.duration;
  if (p.description != null) out.description = p.description;
  if (p.pdf_resource_url != null || p.pdfResourceUrl != null)
    out.pdfResourceUrl = p.pdf_resource_url ?? p.pdfResourceUrl;
  return out;
}

function mapSectionOut(s = {}) {
  return {
    ...s,
    order_index: s.order_index ?? s.orderIndex ?? 0,
    video_url: s.video_url ?? s.videoUrl ?? "",
    body: s.body ?? "",
    photos: s.photos ?? [],
    questions: (s.questions ?? s.quiz ?? []).map((q) => ({
      ...q,
      correct_index: q.correct_index ?? q.correctIndex ?? 0,
    })),
    completed: !!s.completed,
  };
}

function mapModuleOut(m = {}) {
  return {
    ...m,
    order_index: m.order_index ?? m.orderIndex ?? 0,
    status: m.status ?? "current",
    sections: (m.sections ?? []).map(mapSectionOut),
  };
}

function mapSectionIn(p = {}) {
  const out = {};
  if (p.title != null) out.title = p.title;
  if (p.type != null) out.type = p.type;
  if (p.duration != null) out.duration = p.duration;
  if (p.practical != null) out.practical = p.practical;
  if (p.body != null) out.body = p.body;
  if (p.video_url != null || p.videoUrl != null) out.videoUrl = p.video_url ?? p.videoUrl;
  if (p.photos != null) {
    out.photos = p.photos
      .filter((ph) => ph && String(ph.url || "").trim())
      .map((ph, i) => ({ url: ph.url, caption: ph.caption || "", orderIndex: i }));
  }
  if (p.questions != null || p.quiz != null) {
    out.quiz = (p.questions ?? p.quiz)
      .filter((q) => q && String(q.question || "").trim())
      .map((q, i) => {
        const options = (q.options || []).map((o) => o ?? "");
        const ci = q.correct_index ?? q.correctIndex ?? 0;
        return {
          question: q.question,
          options,
          correctIndex: Math.min(Math.max(0, ci), Math.max(0, options.length - 1)),
          orderIndex: i,
        };
      });
  }
  return out;
}

function mapModuleIn(p = {}) {
  const out = {};
  if (p.title != null) out.title = p.title;
  if (p.order_index != null || p.orderIndex != null)
    out.orderIndex = p.order_index ?? p.orderIndex;
  return out;
}

function mapFiliereOut(f = {}) {
  return {
    category: f.category,
    intro: f.intro ?? "",
    levels: f.levels ?? {},
    certification: f.certification ?? f.certificationText ?? null,
    video_url: f.video_url ?? f.videoUrl ?? null,
    certification_url: f.certification_url ?? f.certificationUrl ?? null,
  };
}

function mapQaOut(s = {}) {
  const start = s.scheduledAt || s.scheduled_at ? new Date(s.scheduledAt || s.scheduled_at) : null;
  const minutes = s.durationMinutes ?? s.duration_minutes ?? 0;
  const fmtTime = (d) => d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const date = start
    ? start.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    : "";
  const time = start
    ? `${fmtTime(start)}${minutes ? " — " + fmtTime(new Date(start.getTime() + minutes * 60000)) : ""}`
    : "";
  return {
    ...s,
    date,
    time,
    scheduled_at: s.scheduledAt ?? s.scheduled_at ?? null,
    duration_minutes: minutes,
    max_spots: s.maxSpots ?? s.max_spots ?? 0,
    spots_left: s.spotsLeft ?? s.spots_left ?? 0,
  };
}

function mapProfileOut(r = {}) {
  const p = r.profile ?? r ?? {};
  return {
    ...p,
    name: p.name || "Meredian",
    bio: p.bio ?? "",
    location: p.location ?? "",
    email_contact: p.email_contact ?? p.emailContact ?? "",
    cv_url: p.cv_url ?? p.cvUrl ?? "",
    pitch_video_url: p.pitch_video_url ?? p.pitchVideoUrl ?? "",
    timeline: p.timeline ?? [],
    skills: r.skills ?? p.skills ?? [],
    works: r.works ?? p.works ?? [],
  };
}

function mapProfileIn(p = {}) {
  const out = {};
  if (p.name != null) out.name = p.name;
  if (p.headline != null) out.headline = p.headline;
  if (p.bio != null) out.bio = p.bio;
  if (p.location != null) out.location = p.location;
  if (p.email_contact != null || p.emailContact != null)
    out.emailContact = p.email_contact ?? p.emailContact;
  if (p.cv_url != null || p.cvUrl != null) out.cvUrl = p.cv_url ?? p.cvUrl;
  if (p.pitch_video_url != null || p.pitchVideoUrl != null)
    out.pitchVideoUrl = p.pitch_video_url ?? p.pitchVideoUrl;
  if (p.timeline != null) out.timeline = p.timeline;
  return out;
}

function mapStatsOut(s = {}) {
  return {
    published_courses: s.published_courses ?? s.coursesPublished ?? 0,
    sales_this_month: s.sales_this_month ?? s.salesThisMonth ?? s.sales ?? 0,
    total_revenue: s.total_revenue ?? s.revenue ?? 0,
    unread_messages: s.unread_messages ?? s.unreadMessages ?? 0,
  };
}

function mapAuthOut(r = {}) {
  return { token: r.token ?? r.accessToken, user: r.user };
}

export const api = {
  // Auth
  register: (payload) => unwrap(client.post("/auth/register", payload)).then(mapAuthOut),
  login: (payload) => unwrap(client.post("/auth/login", payload)).then(mapAuthOut),
  me: () => unwrap(client.get("/auth/me")),

  // Catalogue
  listCourses: (params = {}) =>
    unwrap(client.get("/courses", { params })).then((list) => (list || []).map(mapCourseOut)),
  getCourse: (id) => unwrap(client.get(`/courses/${id}`)).then(mapCourseOut),
  getCourseModules: (id) =>
    unwrap(client.get(`/courses/${id}/modules`)).then((res) =>
      (Array.isArray(res) ? res : (res?.modules ?? [])).map(mapModuleOut)
    ),
  getFilieres: () =>
    unwrap(client.get("/filieres")).then((arr) => {
      if (arr && !Array.isArray(arr)) return arr; // deja un objet (mock)
      return Object.fromEntries((arr || []).map((f) => [f.category, mapFiliereOut(f)]));
    }),

  // Cours (admin)
  createCourse: (payload) => {
    const body = mapCourseIn(payload);
    if (!body.code) body.code = genCourseCode(body.category);
    if (body.isFree) body.price = 0;
    if (body.price == null) body.price = 0;
    return unwrap(client.post("/courses", body)).then(mapCourseOut);
  },
  updateCourse: (id, payload) =>
    unwrap(client.patch(`/courses/${id}`, mapCourseIn(payload))).then(mapCourseOut),
  deleteCourse: (id) => unwrap(client.delete(`/courses/${id}`)),
  createModule: (courseId, payload) =>
    unwrap(client.post(`/courses/${courseId}/modules`, mapModuleIn(payload))).then((m) => ({
      ...mapModuleOut(m),
      sections: [],
    })),
  updateModule: (id, payload) =>
    unwrap(client.patch(`/modules/${id}`, mapModuleIn(payload))).then(mapModuleOut),
  deleteModule: (id) => unwrap(client.delete(`/modules/${id}`)),
  createSection: (moduleId, payload) =>
    unwrap(client.post(`/modules/${moduleId}/sections`, mapSectionIn(payload))).then(mapSectionOut),
  updateSection: (id, payload) =>
    unwrap(client.patch(`/sections/${id}`, mapSectionIn(payload))).then(mapSectionOut),
  deleteSection: (id) => unwrap(client.delete(`/sections/${id}`)),

  // Progression
  enroll: (courseId) => unwrap(client.post(`/courses/${courseId}/enroll`)),
  myCourses: () =>
    unwrap(client.get("/users/me/courses")).then((list) =>
      (list || []).map((x) => ({
        course: mapCourseOut(x.course),
        progress: typeof x.progress === "number" ? x.progress : (x.progress?.percentage ?? 0),
      }))
    ),
  completeSection: (id) => unwrap(client.post(`/sections/${id}/complete`)),

  // Paiements
  checkout: (payload) =>
    unwrap(
      client.post("/payments/checkout", {
        itemType: payload.item_type ?? payload.itemType,
        itemId: payload.item_id ?? payload.itemId,
      })
    ).then((r) => ({
      ...r,
      reference: r.reference ?? r.payment?.naboopayReference ?? "",
      checkout_url: r.checkout_url ?? r.checkoutUrl ?? "#",
      status: r.status ?? r.payment?.status ?? "pending",
      note:
        r.note ??
        (r.mocked
          ? "Simulation : paiement confirme automatiquement (MOCK_PAYMENTS actif cote backend)."
          : ""),
    })),

  // Accompagnement
  mentoringSlots: () =>
    unwrap(client.get("/mentoring/slots")).then((r) => {
      const opts = Array.isArray(r) ? r : (r?.options ?? []);
      return opts.map((o) => ({
        id: o.id ?? `MEN-${o.durationMinutes ?? o.duration_minutes}`,
        label: o.label,
        description: o.description,
        price: o.price,
        duration_minutes: o.durationMinutes ?? o.duration_minutes,
      }));
    }),
  createBooking: (payload) => {
    const raw = String(payload.option_id ?? payload.optionId ?? "");
    const minutes = Number(raw.replace(/\D/g, "")) || payload.durationMinutes || 30;
    return unwrap(client.post("/mentoring/bookings", { durationMinutes: minutes }));
  },
  qaSessions: () =>
    unwrap(client.get("/qa-sessions")).then((list) => (list || []).map(mapQaOut)),
  registerQa: (id) => unwrap(client.post(`/qa-sessions/${id}/register`)),
  submitWork: (payload) =>
    unwrap(
      client.post("/work-submissions", {
        fileUrl:
          payload.file_url ?? payload.fileUrl ?? payload.file_name ?? payload.fileName ?? "document.pdf",
        note: payload.note ?? "",
      })
    ),

  // Vitrine & contact
  getProfile: () => unwrap(client.get("/profile")).then(mapProfileOut),
  updateProfile: (payload) =>
    unwrap(client.patch("/profile", mapProfileIn(payload))).then((p) => mapProfileOut({ profile: p })),
  sendContact: (payload) => unwrap(client.post("/contact", payload)),
  contactMessages: () =>
    unwrap(client.get("/admin/contact-messages")).then((list) =>
      (list || []).map((m) => ({
        ...m,
        created_at: m.created_at ?? m.createdAt,
        is_read: m.is_read ?? m.isRead ?? false,
      }))
    ),

  // Stats
  adminStats: () => unwrap(client.get("/admin/stats")).then(mapStatsOut),
};

export default api;
