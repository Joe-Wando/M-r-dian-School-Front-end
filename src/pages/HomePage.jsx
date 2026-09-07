import { Link } from "react-router-dom";
import { PlayCircle, Users, FileCheck2, Radio, Star } from "lucide-react";
import api from "../api";
import { useApi } from "../hooks/useApi";
import CourseCard from "../components/CourseCard";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";

const TEASERS = [
  { icon: Users, title: "Mentorat 1-a-1", desc: "Un creneau individuel pour debloquer ce qui te bloque vraiment." },
  { icon: FileCheck2, title: "Correction de travaux", desc: "Un retour detaille sur tes devoirs, memoires ou projets." },
  { icon: Radio, title: "Sessions Q&R en direct", desc: "Pose tes questions en direct, gratuitement, en petit groupe." },
];

export default function HomePage() {
  const { data: freeCourses, loading, error, reload } = useApi(
    () => api.listCourses().then((list) => list.filter((c) => c.is_free).slice(0, 3)),
    []
  );

  return (
    <div>
      <section className="border-b border-line bg-white px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 md:flex-row">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Apprends l'Histoire, le Droit, l'Informatique et les RH — a ton rythme, avec un
              accompagnement humain.
            </h1>
            <p className="mt-4 text-base text-muted">
              Des cours clairs, du contenu gratuit pour demarrer, et un accompagnement personnel
              (mentorat, corrections, sessions en direct) quand tu veux aller plus loin.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/catalogue" className="btn-primary">
                Explorer le catalogue
              </Link>
              <Link to="/accompagnement" className="btn-outline">
                Decouvrir l'accompagnement
              </Link>
            </div>
          </div>
          <div className="relative flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink md:w-80">
            <PlayCircle size={40} className="text-white" />
            <span className="absolute bottom-2 left-2 rounded-full bg-white/15 px-2 py-0.5 text-[10px] text-white">
              Pitch — 45 sec
            </span>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white px-4 py-10 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">
              Pour commencer, gratuitement
            </p>
            <Link to="/catalogue" className="text-sm font-medium text-accent">
              Voir tout le catalogue →
            </Link>
          </div>
          {loading && <Spinner />}
          {error && <ErrorState message={error} onRetry={reload} />}
          {freeCourses && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {freeCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-line bg-white px-4 py-10 md:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted">
            Au-dela des cours
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {TEASERS.map((item) => (
              <div key={item.title} className="card p-4">
                <item.icon size={20} className="text-accent" />
                <p className="mt-2 text-base font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link to="/accompagnement" className="mt-5 inline-block text-sm font-medium text-accent">
            Voir l'accompagnement en detail →
          </Link>
        </div>
      </section>

      <section className="bg-white px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 rounded-lg border border-line p-6 md:flex-row md:items-center">
          <div className="flex shrink-0 items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <div>
            <p className="text-sm text-gray-700">
              « Le mentorat m'a fait gagner des mois sur mon projet — bien plus efficace qu'un cours
              seul. »
            </p>
            <p className="mt-2 text-xs text-gray-400">— Aicha K., etudiante L3</p>
          </div>
        </div>
      </section>
    </div>
  );
}
