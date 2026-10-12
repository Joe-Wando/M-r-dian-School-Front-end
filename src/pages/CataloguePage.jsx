import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ExternalLink, PlayCircle } from "lucide-react";
import api from "../api";
import { useApi } from "../hooks/useApi";
import CourseCard from "../components/CourseCard";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import PageHeader from "../components/ui/PageHeader";
import { Underlined } from "../components/ui/Decor";
import { CATEGORIES, CATEGORY_NAMES, LEVELS, catStyle } from "../lib/theme";

export default function CataloguePage() {
  const [params, setParams] = useSearchParams();
  const activeCat = params.get("category") || "Tous";
  const activeLevel = params.get("level") || "Tous";
  const query = params.get("q") || "";

  function patch(next) {
    const merged = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => {
      if (!v || v === "Tous") merged.delete(k);
      else merged.set(k, v);
    });
    setParams(merged, { replace: true });
  }

  const { data: courses, loading, error, reload } = useApi(() => api.listCourses(), []);
  const { data: filieres } = useApi(() => api.getFilieres(), []);

  const filtered = useMemo(() => {
    if (!courses) return [];
    return courses.filter((c) => {
      const matchCat = activeCat === "Tous" || c.category === activeCat;
      const matchLevel = activeLevel === "Tous" || c.level === activeLevel;
      const q = query.trim().toLowerCase();
      const matchQuery =
        q === "" ||
        c.title.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q);
      return matchCat && matchLevel && matchQuery;
    });
  }, [courses, activeCat, activeLevel, query]);

  const filiere = activeCat !== "Tous" ? filieres?.[activeCat] : null;

  return (
    <div>
      <PageHeader
        eyebrow="Catalogue"
        title={
          <>
            Trouve <Underlined>ton prochain cours</Underlined>
          </>
        }
        subtitle={`Histoire, Droit, Informatique et Ressources Humaines${
          courses ? ` — ${courses.length} cours disponibles, gratuits et payants.` : "."
        }`}
      >
        <div className="mt-10 flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <FilterPill active={activeCat === "Tous"} onClick={() => patch({ category: "Tous" })}>
                Toutes matieres
              </FilterPill>
              {CATEGORY_NAMES.map((name) => (
                <FilterPill
                  key={name}
                  active={activeCat === name}
                  color={CATEGORIES[name].color}
                  onClick={() => patch({ category: name })}
                >
                  {name}
                </FilterPill>
              ))}
            </div>
            <label className="flex w-full items-center gap-2 rounded-full bg-white px-4 py-3 md:max-w-xs">
              <Search size={16} className="text-muted" />
              <input
                value={query}
                onChange={(e) => patch({ q: e.target.value })}
                placeholder="Rechercher un cours"
                className="w-full bg-transparent text-sm text-navy outline-none placeholder:text-navy/40"
                aria-label="Rechercher un cours"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-display text-xs font-semibold text-white/60">Niveau</span>
            <FilterPill small active={activeLevel === "Tous"} onClick={() => patch({ level: "Tous" })}>
              Tous
            </FilterPill>
            {LEVELS.map((lvl) => (
              <FilterPill
                key={lvl}
                small
                active={activeLevel === lvl}
                onClick={() => patch({ level: lvl })}
              >
                {lvl}
              </FilterPill>
            ))}
          </div>
        </div>
      </PageHeader>

      {filiere && (
        <div className="mx-auto max-w-6xl px-4 pt-6 md:px-8">
          <div className="card flex flex-col gap-6 p-6 md:flex-row md:p-8">
            <div className="flex aspect-video w-full shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-accent to-navy-dark md:aspect-square md:w-56">
              <PlayCircle size={40} strokeWidth={1.5} className="text-white" />
            </div>
            <div className="flex-1">
              <span
                className="rounded-full px-3 py-1 font-display text-[11px] font-semibold"
                style={{ background: catStyle(activeCat).tint, color: catStyle(activeCat).text }}
              >
                {activeCat}
              </span>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy/80">{filiere.intro}</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(filiere.levels).map(([lvl, text]) => (
                  <div key={lvl} className="rounded-2xl bg-mist p-4">
                    <p className="mb-1 font-display text-xs font-semibold text-accent">{lvl}</p>
                    <p className="text-xs text-muted">{text}</p>
                  </div>
                ))}
              </div>
              {filiere.certification && (
                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-accent-soft px-4 py-2.5 text-xs font-medium text-accent">
                  <ExternalLink size={13} />
                  {filiere.certification}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        {loading && <Spinner />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {courses && filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">
            Aucun cours ne correspond a cette recherche.
          </p>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterPill({ active, color, small, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border-2 font-display font-semibold transition ${
        small ? "px-3 py-1 text-[11px]" : "px-4 py-2 text-xs"
      } ${active ? "text-white" : "border-white/25 text-white/85 hover:border-white/60"}`}
      style={active ? { borderColor: color || "#FBBF24", background: color || "#FBBF24", color: color ? "white" : "#0B1F4D" } : undefined}
    >
      {children}
    </button>
  );
}
