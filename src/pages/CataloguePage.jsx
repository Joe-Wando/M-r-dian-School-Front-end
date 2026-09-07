import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ExternalLink, PlayCircle } from "lucide-react";
import api from "../api";
import { useApi } from "../hooks/useApi";
import CourseCard from "../components/CourseCard";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
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
      <header className="border-b border-line bg-white px-4 pb-6 pt-10 md:px-8">
        <h1 className="text-2xl font-semibold md:text-3xl">Catalogue de cours</h1>
        <p className="mt-1.5 text-sm text-muted">
          Histoire, Droit, Informatique et Ressources Humaines
          {courses ? ` — ${courses.length} cours disponibles, gratuits et payants.` : "."}
        </p>
      </header>

      <div className="flex flex-col gap-4 border-b border-line bg-white px-4 py-5 md:px-8">
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
          <label className="flex max-w-xs items-center gap-2 rounded-md border border-line-strong bg-ground px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => patch({ q: e.target.value })}
              placeholder="Rechercher un cours"
              className="w-full bg-transparent text-sm outline-none"
              aria-label="Rechercher un cours"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-400">Niveau :</span>
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

      {filiere && (
        <div className="border-b border-line bg-white px-4 py-6 md:px-8">
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex aspect-video w-full shrink-0 items-center justify-center rounded-lg bg-ink md:aspect-square md:w-56">
              <PlayCircle size={36} className="text-white" />
            </div>
            <div className="flex-1">
              <span
                className="rounded-full px-2 py-1 text-xs font-medium"
                style={{ background: catStyle(activeCat).tint, color: catStyle(activeCat).text }}
              >
                {activeCat}
              </span>
              <p className="mt-2 max-w-2xl text-sm text-gray-700">{filiere.intro}</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(filiere.levels).map(([lvl, text]) => (
                  <div key={lvl} className="rounded-md border border-line p-3">
                    <p className="mb-1 text-xs font-semibold text-accent">{lvl}</p>
                    <p className="text-xs text-muted">{text}</p>
                  </div>
                ))}
              </div>
              {filiere.certification && (
                <div className="mt-4 flex items-center gap-2 rounded-md bg-accent-soft px-3 py-2 text-xs text-accent">
                  <ExternalLink size={13} />
                  {filiere.certification}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-6 md:px-8">
        {loading && <Spinner />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {courses && filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">
            Aucun cours ne correspond a cette recherche.
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      className={`rounded-full border font-medium transition-colors ${
        small ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
      }`}
      style={{
        borderColor: active ? color || "#0056D2" : "#D1D5DB",
        background: active ? color || "#0056D2" : "white",
        color: active ? "white" : "#374151",
      }}
    >
      {children}
    </button>
  );
}
