import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api from "../api";
import { useApi } from "../hooks/useApi";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import CategoryBadge from "../components/ui/CategoryBadge";
import PageHeader from "../components/ui/PageHeader";
import { Underlined } from "../components/ui/Decor";

export default function MyCoursesPage() {
  const { data, loading, error, reload } = useApi(() => api.myCourses(), []);

  return (
    <div>
      <PageHeader
        eyebrow="Mon espace"
        title={<Underlined>Mes cours</Underlined>}
        subtitle="Reprends la ou tu t'es arrete."
      />

      <div className="mx-auto max-w-4xl px-4 py-6 md:px-8">
        {loading && <Spinner />}
        {error && <ErrorState message={error} onRetry={reload} />}

        {data && data.length === 0 && (
          <div className="card flex flex-col items-center gap-5 p-10 text-center">
            <p className="text-muted">Tu n'es inscrit a aucun cours pour l'instant.</p>
            <Link to="/catalogue" className="btn-primary">
              Parcourir le catalogue <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {data && data.length > 0 && (
          <div className="flex flex-col gap-4">
            {data.map(({ course, progress }) => (
              <Link
                key={course.id}
                to={`/cours/${course.id}/apprendre`}
                className="group card flex flex-col gap-3 p-6 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <CategoryBadge category={course.category} level={course.level} />
                  <span className="font-display text-sm font-bold text-accent">{progress}%</span>
                </div>
                <p className="font-display text-lg font-semibold text-navy">{course.title}</p>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-mist">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-navy"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
