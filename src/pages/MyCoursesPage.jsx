import { Link } from "react-router-dom";
import api from "../api";
import { useApi } from "../hooks/useApi";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import CategoryBadge from "../components/ui/CategoryBadge";

export default function MyCoursesPage() {
  const { data, loading, error, reload } = useApi(() => api.myCourses(), []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <h1 className="text-2xl font-semibold md:text-3xl">Mes cours</h1>
      <p className="mt-1.5 text-sm text-muted">Reprends la ou tu t'es arrete.</p>

      {loading && <Spinner />}
      {error && <ErrorState message={error} onRetry={reload} />}

      {data && data.length === 0 && (
        <div className="mt-8 rounded-lg border border-line bg-white p-8 text-center text-sm text-muted">
          Tu n'es inscrit a aucun cours pour l'instant.{" "}
          <Link to="/catalogue" className="font-medium text-accent">
            Parcourir le catalogue
          </Link>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {data.map(({ course, progress }) => (
            <Link
              key={course.id}
              to={`/cours/${course.id}/apprendre`}
              className="flex flex-col gap-2 rounded-lg border border-line bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <CategoryBadge category={course.category} level={course.level} />
                <span className="text-xs font-medium text-muted">{progress}%</span>
              </div>
              <p className="font-semibold">{course.title}</p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
