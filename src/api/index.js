import { client } from "./client";

const unwrap = (p) => p.then((r) => r.data);

export const api = {
  // Auth
  register: (payload) => unwrap(client.post("/auth/register", payload)),
  login: (payload) => unwrap(client.post("/auth/login", payload)),
  me: () => unwrap(client.get("/auth/me")),

  // Catalogue
  listCourses: (params = {}) => unwrap(client.get("/courses", { params })),
  getCourse: (id) => unwrap(client.get(`/courses/${id}`)),
  getCourseModules: (id) => unwrap(client.get(`/courses/${id}/modules`)),
  getFilieres: () => unwrap(client.get("/filieres")),

  // Cours (admin)
  createCourse: (payload) => unwrap(client.post("/courses", payload)),
  updateCourse: (id, payload) => unwrap(client.patch(`/courses/${id}`, payload)),
  deleteCourse: (id) => unwrap(client.delete(`/courses/${id}`)),
  createModule: (courseId, payload) => unwrap(client.post(`/courses/${courseId}/modules`, payload)),
  updateModule: (id, payload) => unwrap(client.patch(`/modules/${id}`, payload)),
  deleteModule: (id) => unwrap(client.delete(`/modules/${id}`)),
  createSection: (moduleId, payload) => unwrap(client.post(`/modules/${moduleId}/sections`, payload)),
  updateSection: (id, payload) => unwrap(client.patch(`/sections/${id}`, payload)),
  deleteSection: (id) => unwrap(client.delete(`/sections/${id}`)),

  // Progression
  enroll: (courseId) => unwrap(client.post(`/courses/${courseId}/enroll`)),
  myCourses: () => unwrap(client.get("/users/me/courses")),
  completeSection: (id) => unwrap(client.post(`/sections/${id}/complete`)),

  // Paiements
  checkout: (payload) => unwrap(client.post("/payments/checkout", payload)),

  // Accompagnement
  mentoringSlots: () => unwrap(client.get("/mentoring/slots")),
  createBooking: (payload) => unwrap(client.post("/mentoring/bookings", payload)),
  qaSessions: () => unwrap(client.get("/qa-sessions")),
  registerQa: (id) => unwrap(client.post(`/qa-sessions/${id}/register`)),
  submitWork: (payload) => unwrap(client.post("/work-submissions", payload)),

  // Vitrine & contact
  getProfile: () => unwrap(client.get("/profile")),
  updateProfile: (payload) => unwrap(client.patch("/profile", payload)),
  sendContact: (payload) => unwrap(client.post("/contact", payload)),
  contactMessages: () => unwrap(client.get("/admin/contact-messages")),

  // Stats
  adminStats: () => unwrap(client.get("/admin/stats")),
};

export default api;
