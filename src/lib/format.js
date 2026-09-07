export function formatPrice(price) {
  if (!price || price === 0) return "Gratuit";
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
}

export function courseProgress(modules = []) {
  const sections = modules.flatMap((m) => m.sections || []);
  if (sections.length === 0) return 0;
  const done = sections.filter((s) => s.completed).length;
  return Math.round((done / sections.length) * 100);
}

export function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}
