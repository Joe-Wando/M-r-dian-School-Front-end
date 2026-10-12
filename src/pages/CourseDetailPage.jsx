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
import PageHeader from "../components/ui/PageHeader";

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
    <div>
      <PageHeader
        title={course.title}
        subtitle={course.description}
      >
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm font-medium text-white/80">
          <CategoryBadge category={course.category} level={course.level} />
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
            <BarChart3 size={14} className="text-sun" /> {course.level}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
            <Clock size={14} className="text-sun" /> {course.duration}
          </span>
          {course.template && (
            <span className="rounded-full bg-white/10 px-3 py-1.5">Modele : {course.template}</span>
          )}
        </div>
      </PageHeader>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-4 md:px-8 lg:grid-cols-[1fr_22rem]">
        <div>
          <button
            onClick={() => navigate("/catalogue")}
            className="btn-outline !px-4 !py-2.5"
          >
            <ArrowLeft size={15} /> Retour au catalogue
          </button>

          {course.category === "Informatique" && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl bg-accent-soft px-4 py-3 text-xs font-medium text-accent">
              <ExternalLink size={14} className="shrink-0" />
              En fin de parcours, tu seras oriente vers une certification professionnelle externe si tu
              souhaites aller plus loin.
            </div>
          )}

          <p className="mt-6 text-sm text-muted">
            Deja inscrit ?{" "}
            <Link to={`/cours/${id}/apprendre`} className="font-semibold text-accent">
              Ouvrir la lecture du cours
            </Link>
          </p>
        </div>

        <div className="card relative overflow-hidden p-7 lg:-mt-24">
          <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-sun" />
          <p className="eyebrow">{course.is_free ? "Acces libre" : "Cours complet"}</p>
          <p className="mt-2 font-display text-3xl font-bold text-navy">{formatPrice(course.price)}</p>
          {(enroll.error || checkout.error) && (
            <p className="mt-2 text-sm text-red-600">{enroll.error || checkout.error}</p>
          )}
          <button onClick={onStart} className="btn-primary mt-6 w-full !py-4" disabled={busy}>
            {busy
              ? "…"
              : course.is_free
                ? "Acceder au cours"
                : `Acheter — ${formatPrice(course.price)}`}
          </button>
          {!course.is_free && (
            <p className="mt-3 text-center text-xs text-muted">Paiement securise via Naboopay</p>
          )}
        </div>
      </div>
    </div>
  );
}
