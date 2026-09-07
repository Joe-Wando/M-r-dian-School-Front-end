// Adaptateur axios simule : reproduit les endpoints de architecture-technique.md
// en memoire. Bascule via VITE_USE_MOCKS. A retirer une fois le backend en ligne.

import {
  seedCourses,
  seedModulesByCourse,
  demoModules,
  seedMentoring,
  seedQaSessions,
  seedProfile,
  seedUsers,
  FILIERE_INFO,
  CORRECTION_PRICE,
} from "./data";

const LS = {
  courses: "meredian.mock.courses",
  modules: "meredian.mock.modules",
  users: "meredian.mock.users",
  enrollments: "meredian.mock.enrollments",
  completions: "meredian.mock.completions",
  profile: "meredian.mock.profile",
  messages: "meredian.mock.contact",
  bookings: "meredian.mock.bookings",
  qaRegs: "meredian.mock.qaRegs",
  submissions: "meredian.mock.submissions",
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const db = {
  courses: load(LS.courses, seedCourses),
  modules: load(LS.modules, {
    ...seedModulesByCourse,
    ...Object.fromEntries(
      seedCourses.filter((c) => !seedModulesByCourse[c.id]).map((c) => [c.id, clone(demoModules, c.id)])
    ),
  }),
  users: load(LS.users, seedUsers),
  enrollments: load(LS.enrollments, []),
  completions: load(LS.completions, []),
  profile: load(LS.profile, seedProfile),
  messages: load(LS.messages, []),
  bookings: load(LS.bookings, []),
  qaRegs: load(LS.qaRegs, []),
  submissions: load(LS.submissions, []),
};

function clone(modules, prefix) {
  return modules.map((m, mi) => ({
    ...m,
    id: `${prefix}-m${mi + 1}`,
    sections: m.sections.map((s, si) => ({ ...s, id: `${prefix}-m${mi + 1}-s${si + 1}` })),
  }));
}

function persist() {
  save(LS.courses, db.courses);
  save(LS.modules, db.modules);
  save(LS.users, db.users);
  save(LS.enrollments, db.enrollments);
  save(LS.completions, db.completions);
  save(LS.profile, db.profile);
  save(LS.messages, db.messages);
  save(LS.bookings, db.bookings);
  save(LS.qaRegs, db.qaRegs);
  save(LS.submissions, db.submissions);
}

const uid = () => Math.random().toString(36).slice(2, 10);
const TOKEN_PREFIX = "mock.";

function encodeToken(user) {
  return TOKEN_PREFIX + btoa(JSON.stringify({ id: user.id, role: user.role, email: user.email }));
}
function decodeToken(token) {
  if (!token || !token.startsWith(TOKEN_PREFIX)) return null;
  try {
    return JSON.parse(atob(token.slice(TOKEN_PREFIX.length)));
  } catch {
    return null;
  }
}

function currentUser(headers = {}) {
  const auth = headers.Authorization || headers.authorization || "";
  const payload = decodeToken(auth.replace(/^Bearer\s+/i, ""));
  if (!payload) return null;
  return db.users.find((u) => u.id === payload.id) || null;
}

const ok = (data, status = 200) => ({ status, data });
const fail = (status, message) => {
  const e = new Error(message);
  e.response = { status, data: { message } };
  return Promise.reject(e);
};

function requireAuth(user) {
  return user ? null : fail(401, "Authentification requise.");
}
function requireAdmin(user) {
  if (!user) return fail(401, "Authentification requise.");
  if (user.role !== "admin") return fail(403, "Acces reserve a l'administrateur.");
  return null;
}

function withProgress(courseId, userId) {
  const mods = db.modules[courseId] || [];
  const completed = new Set(
    db.completions.filter((c) => c.user_id === userId).map((c) => c.section_id)
  );
  return mods.map((m) => ({
    ...m,
    sections: m.sections.map((s) => ({ ...s, completed: completed.has(s.id) })),
  }));
}

// ---- routeur ----
const routes = [
  // AUTH
  { m: "POST", p: /^\/auth\/register$/, h: (_p, body) => {
    if (db.users.some((u) => u.email === body.email)) return fail(409, "Cet email est deja utilise.");
    const user = { id: "u-" + uid(), name: body.name, email: body.email, password: body.password, role: "user" };
    db.users.push(user);
    persist();
    return ok({ token: encodeToken(user), user: publicUser(user) }, 201);
  } },
  { m: "POST", p: /^\/auth\/login$/, h: (_p, body) => {
    const user = db.users.find((u) => u.email === body.email && u.password === body.password);
    if (!user) return fail(401, "Email ou mot de passe incorrect.");
    return ok({ token: encodeToken(user), user: publicUser(user) });
  } },
  { m: "GET", p: /^\/auth\/me$/, h: (_p, _b, user) => requireAuth(user) || ok(publicUser(user)) },

  // CATALOGUE (public)
  { m: "GET", p: /^\/courses$/, h: (_p, _b, _u, query) => {
    let list = [...db.courses];
    if (query.category) list = list.filter((c) => c.category === query.category);
    if (query.level) list = list.filter((c) => c.level === query.level);
    if (query.query) {
      const q = query.query.toLowerCase();
      list = list.filter(
        (c) => c.title.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q)
      );
    }
    return ok(list);
  } },
  { m: "GET", p: /^\/filieres$/, h: () => ok(FILIERE_INFO) },
  { m: "GET", p: /^\/courses\/([^/]+)\/modules$/, h: (p, _b, user) => {
    const course = db.courses.find((c) => c.id === p[0]);
    if (!course) return fail(404, "Cours introuvable.");
    return ok(user ? withProgress(course.id, user.id) : db.modules[course.id] || []);
  } },
  { m: "GET", p: /^\/courses\/([^/]+)$/, h: (p) => {
    const course = db.courses.find((c) => c.id === p[0]);
    return course ? ok(course) : fail(404, "Cours introuvable.");
  } },

  // COURS (admin)
  { m: "POST", p: /^\/courses$/, h: (_p, body, user) => {
    const guard = requireAdmin(user);
    if (guard) return guard;
    const code = body.code || `${(body.category || "NEW").slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const course = {
      ...body,
      id: code,
      code,
      is_free: !!body.is_free,
      price: body.is_free ? 0 : Number(body.price) || 0,
    };
    db.courses.unshift(course);
    db.modules[course.id] = [];
    persist();
    return ok(course, 201);
  } },
  { m: "PATCH", p: /^\/courses\/([^/]+)$/, h: (p, body, user) => {
    const guard = requireAdmin(user);
    if (guard) return guard;
    const i = db.courses.findIndex((c) => c.id === p[0]);
    if (i < 0) return fail(404, "Cours introuvable.");
    db.courses[i] = { ...db.courses[i], ...body };
    if (db.courses[i].is_free) db.courses[i].price = 0;
    persist();
    return ok(db.courses[i]);
  } },
  { m: "DELETE", p: /^\/courses\/([^/]+)$/, h: (p, _b, user) => {
    const guard = requireAdmin(user);
    if (guard) return guard;
    db.courses = db.courses.filter((c) => c.id !== p[0]);
    delete db.modules[p[0]];
    persist();
    return ok(null, 204);
  } },
  { m: "POST", p: /^\/courses\/([^/]+)\/modules$/, h: (p, body, user) => {
    const guard = requireAdmin(user);
    if (guard) return guard;
    const list = db.modules[p[0]] || (db.modules[p[0]] = []);
    const mod = { id: "m-" + uid(), title: body.title, order_index: list.length, status: "locked", sections: [] };
    list.push(mod);
    persist();
    return ok(mod, 201);
  } },
  { m: "PATCH", p: /^\/modules\/([^/]+)$/, h: (p, body, user) => {
    const guard = requireAdmin(user);
    if (guard) return guard;
    for (const cid of Object.keys(db.modules)) {
      const mod = db.modules[cid].find((m) => m.id === p[0]);
      if (mod) {
        Object.assign(mod, body);
        persist();
        return ok(mod);
      }
    }
    return fail(404, "Module introuvable.");
  } },
  { m: "DELETE", p: /^\/modules\/([^/]+)$/, h: (p, _b, user) => {
    const guard = requireAdmin(user);
    if (guard) return guard;
    for (const cid of Object.keys(db.modules)) {
      const before = db.modules[cid].length;
      db.modules[cid] = db.modules[cid].filter((m) => m.id !== p[0]);
      if (db.modules[cid].length !== before) {
        persist();
        return ok(null, 204);
      }
    }
    return fail(404, "Module introuvable.");
  } },
  { m: "POST", p: /^\/modules\/([^/]+)\/sections$/, h: (p, body, user) => {
    const guard = requireAdmin(user);
    if (guard) return guard;
    for (const cid of Object.keys(db.modules)) {
      const mod = db.modules[cid].find((m) => m.id === p[0]);
      if (mod) {
        const section = {
          id: "s-" + uid(),
          title: body.title,
          type: body.type || "reading",
          duration: body.duration || "",
          practical: body.type === "video" ? !!body.practical : false,
          order_index: mod.sections.length,
          body: "",
          video_url: "",
          photos: [],
          questions: [],
        };
        mod.sections.push(section);
        persist();
        return ok(section, 201);
      }
    }
    return fail(404, "Module introuvable.");
  } },
  { m: "PATCH", p: /^\/sections\/([^/]+)$/, h: (p, body, user) => {
    const guard = requireAdmin(user);
    if (guard) return guard;
    for (const cid of Object.keys(db.modules)) {
      for (const mod of db.modules[cid]) {
        const sec = mod.sections.find((s) => s.id === p[0]);
        if (sec) {
          Object.assign(sec, body);
          persist();
          return ok(sec);
        }
      }
    }
    return fail(404, "Section introuvable.");
  } },
  { m: "DELETE", p: /^\/sections\/([^/]+)$/, h: (p, _b, user) => {
    const guard = requireAdmin(user);
    if (guard) return guard;
    for (const cid of Object.keys(db.modules)) {
      for (const mod of db.modules[cid]) {
        const before = mod.sections.length;
        mod.sections = mod.sections.filter((s) => s.id !== p[0]);
        if (mod.sections.length !== before) {
          persist();
          return ok(null, 204);
        }
      }
    }
    return fail(404, "Section introuvable.");
  } },

  // PROGRESSION
  { m: "POST", p: /^\/courses\/([^/]+)\/enroll$/, h: (p, _b, user) => {
    const guard = requireAuth(user);
    if (guard) return guard;
    if (!db.enrollments.some((e) => e.user_id === user.id && e.course_id === p[0])) {
      db.enrollments.push({ id: "e-" + uid(), user_id: user.id, course_id: p[0], enrolled_at: new Date().toISOString() });
      persist();
    }
    return ok({ enrolled: true }, 201);
  } },
  { m: "GET", p: /^\/users\/me\/courses$/, h: (_p, _b, user) => {
    const guard = requireAuth(user);
    if (guard) return guard;
    const mine = db.enrollments.filter((e) => e.user_id === user.id);
    return ok(
      mine.map((e) => {
        const course = db.courses.find((c) => c.id === e.course_id);
        const mods = withProgress(e.course_id, user.id);
        const secs = mods.flatMap((m) => m.sections);
        const done = secs.filter((s) => s.completed).length;
        return { course, progress: secs.length ? Math.round((done / secs.length) * 100) : 0 };
      })
    );
  } },
  { m: "POST", p: /^\/sections\/([^/]+)\/complete$/, h: (p, _b, user) => {
    const guard = requireAuth(user);
    if (guard) return guard;
    if (!db.completions.some((c) => c.user_id === user.id && c.section_id === p[0])) {
      db.completions.push({ id: "sc-" + uid(), user_id: user.id, section_id: p[0], completed_at: new Date().toISOString() });
      persist();
    }
    return ok({ completed: true }, 201);
  } },

  // PAIEMENTS (simule — le vrai flux passe par le webhook Naboopay cote serveur)
  { m: "POST", p: /^\/payments\/checkout$/, h: (_p, body, user) => {
    const guard = requireAuth(user);
    if (guard) return guard;
    return ok({
      reference: "NABOO-" + uid().toUpperCase(),
      checkout_url: "#simulation-paiement",
      status: "pending",
      item_type: body.item_type,
      item_id: body.item_id,
      note: "Simulation : en production, la confirmation vient du webhook Naboopay signe.",
    });
  } },

  // ACCOMPAGNEMENT
  { m: "GET", p: /^\/mentoring\/slots$/, h: () => ok(seedMentoring) },
  { m: "POST", p: /^\/mentoring\/bookings$/, h: (_p, body, user) => {
    const guard = requireAuth(user);
    if (guard) return guard;
    const opt = seedMentoring.find((o) => o.id === body.option_id) || seedMentoring[0];
    const booking = {
      id: "mb-" + uid(),
      user_id: user.id,
      duration_minutes: opt.duration_minutes,
      price: opt.price,
      scheduled_at: body.scheduled_at || null,
      status: "pending",
      meeting_link: null,
    };
    db.bookings.push(booking);
    persist();
    return ok(booking, 201);
  } },
  { m: "GET", p: /^\/qa-sessions$/, h: () => {
    return ok(
      seedQaSessions.map((s) => ({
        ...s,
        spots_left: s.max_spots - db.qaRegs.filter((r) => r.session_id === s.id).length,
      }))
    );
  } },
  { m: "POST", p: /^\/qa-sessions\/([^/]+)\/register$/, h: (p, _b, user) => {
    const guard = requireAuth(user);
    if (guard) return guard;
    if (!db.qaRegs.some((r) => r.session_id === p[0] && r.user_id === user.id)) {
      db.qaRegs.push({ id: "qr-" + uid(), session_id: p[0], user_id: user.id });
      persist();
    }
    return ok({ registered: true }, 201);
  } },
  { m: "POST", p: /^\/work-submissions$/, h: (_p, body, user) => {
    const guard = requireAuth(user);
    if (guard) return guard;
    const sub = {
      id: "ws-" + uid(),
      user_id: user.id,
      file_url: body.file_url || body.file_name || "fichier.pdf",
      note: body.note || "",
      status: "pending",
      price: CORRECTION_PRICE,
      created_at: new Date().toISOString(),
    };
    db.submissions.push(sub);
    persist();
    return ok(sub, 201);
  } },

  // VITRINE & CONTACT
  { m: "GET", p: /^\/profile$/, h: () => ok(db.profile) },
  { m: "PATCH", p: /^\/profile$/, h: (_p, body, user) => {
    const guard = requireAdmin(user);
    if (guard) return guard;
    db.profile = { ...db.profile, ...body };
    persist();
    return ok(db.profile);
  } },
  { m: "POST", p: /^\/contact$/, h: (_p, body) => {
    const msg = { id: "cm-" + uid(), name: body.name, email: body.email, message: body.message, is_read: false, created_at: new Date().toISOString() };
    db.messages.push(msg);
    persist();
    return ok({ received: true }, 201);
  } },
  { m: "GET", p: /^\/admin\/contact-messages$/, h: (_p, _b, user) => requireAdmin(user) || ok(db.messages.slice().reverse()) },

  // STATS ADMIN
  { m: "GET", p: /^\/admin\/stats$/, h: (_p, _b, user) => {
    const guard = requireAdmin(user);
    if (guard) return guard;
    return ok({
      published_courses: db.courses.length,
      sales_this_month: 37,
      total_revenue: 412000,
      unread_messages: db.messages.filter((m) => !m.is_read).length || 5,
    });
  } },
];

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

export const mockAdapter = (config) =>
  new Promise((resolve, reject) => {
    const url = (config.url || "").replace(/^https?:\/\/[^/]+/, "").split("?")[0];
    const method = (config.method || "get").toUpperCase();
    const query = Object.fromEntries(new URLSearchParams(config.params || ""));
    if (config.params && typeof config.params === "object") Object.assign(query, config.params);
    let body = config.data;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        /* garde la chaine */
      }
    }
    const user = currentUser(config.headers || {});

    const route = routes.find((r) => r.m === method && r.p.test(url));
    const latency = 180 + Math.random() * 220;

    setTimeout(() => {
      if (!route) {
        const e = new Error(`Mock: route non geree ${method} ${url}`);
        e.response = { status: 404, data: { message: "Ressource introuvable (mock)." } };
        return reject(e);
      }
      const params = (url.match(route.p) || []).slice(1);
      Promise.resolve()
        .then(() => route.h(params, body || {}, user, query))
        .then((res) =>
          resolve({
            data: res.data,
            status: res.status,
            statusText: "OK",
            headers: {},
            config,
          })
        )
        .catch(reject);
    }, latency);
  });
