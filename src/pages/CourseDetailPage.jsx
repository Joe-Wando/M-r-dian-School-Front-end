import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, BarChart3, Clock, ExternalLink } from "lucide-react";
import api from "../api";
import { useApi } from "../hooks/useApi";
import { useMutation } from "../hooks/useMutation";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import CategoryBadge from "../components/ui/CategoryBadge";
import { formatPrice } from "../lib/format";

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: course, loading, error, reload } = useApi(() => api.getCourse(id), [id]);
  const enroll = useMutation(api.enroll);
  const checkout = useMutation(api.checkout);

  async function onStart() {
    if (!isAuthenticated) {
      navigate("/connexion", { state: { from: { pathname: `/cours/${id}` } } });
      return;
    }
    if (course.is_free) {
      await enroll.mutate(id);
      navigate(`/cours/${id}/apprendre`);
    } else {
      const res = await checkout.mutate({ item_type: "course", item_id: id, amount: course.price });
      window.alert(
        `Paiement initie (ref ${res.reference}).\n${res.note || "Redirection vers Naboopay dans la vraie app."}`
      );
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!course) return null;

  const busy = enroll.loading || checkout.loading;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <button
        onClick={() => navigate("/catalogue")}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-muted"
      >
        <ArrowLeft size={15} /> Retour au catalogue
      </button>

      <CategoryBadge category={course.category} level={course.level} />
      <h1 className="mt-3 text-2xl font-semibold md:text-3xl">{course.title}</h1>
      <p className="mt-3 text-sm text-muted">{course.description}</p>

      <div className="mt-5 flex gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <BarChart3 size={13} /> {course.level}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={13} /> {course.duration}
        </span>
        {course.template && <span>Modele : {course.template}</span>}
      </div>

      <div className="mt-6 rounded-lg border border-line bg-white p-5">
        <p className="text-xl font-semibold">{formatPrice(course.price)}</p>
        {(enroll.error || checkout.error) && (
          <p className="mt-2 text-sm text-red-600">{enroll.error || checkout.error}</p>
        )}
        <button onClick={onStart} className="btn-primary mt-4 w-full" disabled={busy}>
          {busy
            ? "…"
            : course.is_free
              ? "Acceder au cours"
              : `Acheter — ${formatPrice(course.price)}`}
        </button>
        {!course.is_free && (
          <p className="mt-2 text-center text-xs text-muted">Paiement securise via Naboopay</p>
        )}
      </div>

      {course.category === "Informatique" && (
        <div className="mt-6 flex items-center gap-2 rounded-md bg-accent-soft px-3 py-2.5 text-xs text-accent">
          <ExternalLink size={13} />
          En fin de parcours, tu seras oriente vers une certification professionnelle externe si tu
          souhaites aller plus loin.
        </div>
      )}

      <p className="mt-8 text-sm text-muted">
        Deja inscrit ?{" "}
        <Link to={`/cours/${id}/apprendre`} className="font-medium text-accent">
          Ouvrir la lecture du cours
        </Link>
      </p>
    </div>
  );
}
