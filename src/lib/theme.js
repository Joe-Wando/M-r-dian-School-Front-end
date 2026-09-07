// Design system Meredian — tokens partages (charte-graphique-meridian.md)

export const COLORS = {
  ground: "#F9FAFB",
  ink: "#1A1A1A",
  muted: "#6B7280",
  accent: "#0056D2",
  line: "#E5E7EB",
  lineStrong: "#D1D5DB",
};

// Couleurs par matiere — orientent dans le contenu, pas la marque.
export const CATEGORIES = {
  Histoire: { color: "#B45309", tint: "#FEF3C7", text: "#92400E" },
  Droit: { color: "#1D4ED8", tint: "#DBEAFE", text: "#1E40AF" },
  Informatique: { color: "#059669", tint: "#D1FAE5", text: "#047857" },
  RH: { color: "#A21CAF", tint: "#FAE8FF", text: "#86198F" },
};

export const CATEGORY_NAMES = Object.keys(CATEGORIES);

export const LEVELS = ["L1", "L2", "L3", "Formation Pro"];

export const COURSE_TEMPLATES = ["Theorique illustre", "Pratique guidee", "Mixte"];

export const SECTION_TYPES = [
  { value: "reading", label: "Lecture (texte)" },
  { value: "image", label: "Photo / galerie" },
  { value: "video", label: "Video" },
  { value: "quiz", label: "Quiz / evaluation" },
];

export function catStyle(name) {
  return CATEGORIES[name] || { color: COLORS.muted, tint: "#F3F4F6", text: COLORS.muted };
}
