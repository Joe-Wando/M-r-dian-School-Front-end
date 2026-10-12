import { Fragment } from "react";
import { Link } from "react-router-dom";
import { PlayCircle, Users, FileCheck2, Radio, Star, ArrowRight } from "lucide-react";
import api from "../api";
import { useApi } from "../hooks/useApi";
import CourseCard from "../components/CourseCard";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import { SpeedLines, Starburst, Swirl, Underlined, Wave } from "../components/ui/Decor";
import { CATEGORY_NAMES } from "../lib/theme";

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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-[#0a3a8f]">
        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-accent/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-24 pt-14 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:pb-32 lg:pt-20">
          <div className="animate-rise-in text-center lg:text-left">
            <h1 className="text-[1.9rem] font-bold leading-[1.25] text-white sm:text-[2.6rem] lg:text-[2.75rem]">
              Apprends l'Histoire, le Droit, l'Informatique et les RH{" "}
              <Underlined>a ton rythme</Underlined>.
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-base font-medium text-white/80 sm:text-lg lg:mx-0">
              Des cours clairs, du contenu gratuit pour demarrer, et un accompagnement humain
              (mentorat, corrections, sessions en direct) quand tu veux aller plus loin.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link to="/catalogue" className="btn-accent whitespace-nowrap !px-8 !py-4">
                Explorer le catalogue
              </Link>
              <Link to="/accompagnement" className="btn-ghost-light whitespace-nowrap !px-8 !py-4">
                Decouvrir l'accompagnement
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="relative flex aspect-video w-full rotate-2 items-center justify-center overflow-hidden rounded-[2rem] border-4 border-white/90 bg-gradient-to-br from-accent to-navy-dark shadow-2xl shadow-black/30 transition hover:rotate-0">
              <PlayCircle size={56} strokeWidth={1.5} className="text-white" />
              <span className="absolute bottom-3 right-3 rounded-full bg-white/15 px-3 py-1 font-display text-[11px] font-semibold text-white backdrop-blur">
                Pitch — 45 sec
              </span>
            </div>
            <Starburst className="absolute -bottom-12 -left-2 h-28 w-28 sm:-left-8 -rotate-12 animate-float sm:h-32 sm:w-32">
              Contenu gratuit pour demarrer
            </Starburst>
            <SpeedLines className="absolute -left-8 -top-10 h-14 w-16 -scale-x-100 text-sun" />
          </div>
        </div>
        <Wave className="absolute -bottom-px left-0 text-ground" />
      </section>

      {/* Cours gratuits */}
      <section className="px-4 py-16 md:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:items-end md:text-left">
            <div>
              <p className="eyebrow">Sans engagement</p>
              <h2 className="mt-3 text-3xl font-bold leading-[1.2] text-navy sm:text-4xl">
                Pour commencer, <Underlined color="text-accent">gratuitement</Underlined>
              </h2>
            </div>
            <Link to="/catalogue" className="btn-outline shrink-0">
              Voir tout le catalogue <ArrowRight size={15} />
            </Link>
          </div>
          {loading && <Spinner />}
          {error && <ErrorState message={error} onRetry={reload} />}
          {freeCourses && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {freeCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bande des matieres */}
      <section aria-label="Matieres" className="relative overflow-hidden bg-accent py-14 sm:py-16">
        <Starburst fill="fill-white/10" className="absolute -left-16 top-1/2 h-48 w-48 -translate-y-1/2" />
        <Starburst fill="fill-white/10" className="absolute -right-16 top-1/2 h-48 w-48 -translate-y-1/2" />
        <ul className="relative mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-4 lg:flex lg:items-center lg:justify-center lg:gap-12">
          {CATEGORY_NAMES.map((name, i) => (
            <Fragment key={name}>
              {i > 0 && <span aria-hidden className="hidden h-12 w-px bg-white/30 lg:block" />}
              <li className="text-center">
                <Link
                  to={`/catalogue?category=${name}`}
                  className="font-display text-3xl font-extrabold text-white transition hover:text-sun sm:text-4xl lg:text-5xl"
                >
                  {name}
                </Link>
              </li>
            </Fragment>
          ))}
        </ul>
      </section>

      {/* Au-dela des cours */}
      <section className="px-4 py-16 md:px-8 lg:py-24">
        <div className="relative mx-auto max-w-6xl rounded-[2.5rem] bg-mist px-5 py-14 sm:px-10 lg:py-20">
          <Swirl className="absolute right-8 top-8 hidden h-14 w-12 text-accent md:block" />
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold leading-[1.2] text-navy sm:text-4xl">
              Au-dela des cours, <Underlined>un vrai suivi</Underlined>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              Quand tu veux aller plus loin, quelqu'un est la pour t'accompagner.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TEASERS.map((item, i) => (
              <div key={item.title} className="card relative p-7 transition hover:-translate-y-1 hover:shadow-xl">
                <span className="absolute right-6 top-5 font-display text-5xl font-extrabold text-navy/5">
                  {i + 1}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                  <item.icon size={22} />
                </span>
                <p className="mt-5 font-display text-lg font-semibold text-navy">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/accompagnement" className="btn-primary">
              Voir l'accompagnement en detail <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Temoignage */}
      <section className="px-4 pb-8 md:px-8">
        <figure className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-navy px-8 py-12 text-center sm:px-16">
          <span aria-hidden className="absolute left-6 top-0 font-display text-[9rem] leading-none text-white/10">
            “
          </span>
          <div className="flex justify-center gap-1 text-sun">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <blockquote className="relative mt-6 font-display text-xl font-semibold leading-relaxed text-white sm:text-2xl">
            Le mentorat m'a fait gagner des mois sur mon projet — bien plus efficace qu'un cours seul.
          </blockquote>
          <figcaption className="mt-6 text-sm font-medium text-white/60">Aicha K., etudiante L3</figcaption>
        </figure>
      </section>
    </div>
  );
}
