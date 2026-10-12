import { Link } from "react-router-dom";
import { PlayCircle, MapPin, Mail, Download, GraduationCap, Briefcase, ArrowUpRight } from "lucide-react";
import api from "../api";
import { useApi } from "../hooks/useApi";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import { catStyle } from "../lib/theme";
import PageHeader from "../components/ui/PageHeader";
import { Underlined } from "../components/ui/Decor";

export default function ProfilPage() {
  const { data: profile, loading, error, reload } = useApi(() => api.getProfile(), []);

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!profile) return null;

  const skillsByCat = groupBy(profile.skills || [], "category");

  return (
    <div>
      <PageHeader eyebrow="A propos" title={profile.name} subtitle={profile.bio}>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative flex aspect-video w-full shrink-0 -rotate-2 items-center justify-center overflow-hidden rounded-3xl border-4 border-white/90 bg-gradient-to-br from-accent to-navy-dark shadow-2xl shadow-black/30 md:w-64">
            <PlayCircle size={44} strokeWidth={1.5} className="text-white" />
            <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/15 px-2.5 py-0.5 font-display text-[10px] font-semibold text-white">
              Pitch — 45 sec
            </span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-3 text-sm font-medium text-white/80">
              {profile.location && (
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                  <MapPin size={14} className="text-sun" /> {profile.location}
                </span>
              )}
              {profile.email_contact && (
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                  <Mail size={14} className="text-sun" /> {profile.email_contact}
                </span>
              )}
            </div>
          </div>
          {profile.cv_url && (
            <a href={profile.cv_url} download className="btn-accent shrink-0">
              <Download size={15} /> Telecharger le CV
            </a>
          )}
        </div>
      </PageHeader>

      <Section title="Parcours">
        <div className="card flex flex-col px-6 py-2 sm:px-8">
          {(profile.timeline || []).map((item, i) => (
            <div key={i} className="flex gap-4 border-t border-line py-5 first:border-t-0 md:gap-8">
              <span className="w-28 shrink-0 pt-1 font-display text-xs font-semibold text-accent">{item.year}</span>
              <div className="flex items-start gap-3">
                {item.type === "formation" ? (
                  <GraduationCap size={16} className="mt-0.5 text-blue-700" />
                ) : (
                  <Briefcase size={16} className="mt-0.5 text-emerald-600" />
                )}
                <div>
                  <p className="text-base font-semibold text-navy">{item.title}</p>
                  <p className="text-sm text-muted">{item.place}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Competences">
        <div className="card grid grid-cols-1 gap-x-10 gap-y-6 p-6 sm:p-8 md:grid-cols-2">
          {Object.entries(skillsByCat).map(([cat, skills]) => (
            <div key={cat}>
              <p className="mb-3 font-display text-xs font-bold tracking-wide" style={{ color: catStyle(cat).text }}>
                {cat.toUpperCase()}
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s.name}
                    className="rounded-full px-3.5 py-1.5 text-sm font-medium"
                    style={{ background: catStyle(cat).tint, color: catStyle(cat).text }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Travaux et realisations">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {(profile.works || []).map((w) => (
            <a
              key={w.id}
              href={w.link || "#"}
              className="group card flex flex-col gap-3 p-6 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full px-3 py-1 font-display text-[11px] font-semibold"
                  style={{ background: catStyle(w.category).tint, color: catStyle(w.category).text }}
                >
                  {w.category}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white transition group-hover:bg-accent">
                  <ArrowUpRight size={15} />
                </span>
              </div>
              <p className="font-display text-lg font-semibold text-navy">{w.title}</p>
              <p className="text-sm text-muted">{w.description}</p>
            </a>
          ))}
        </div>
      </Section>

      <section className="px-4 pb-4 pt-6 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 rounded-[2.5rem] bg-accent px-8 py-10 text-center md:flex-row md:text-left">
          <p className="font-display text-2xl font-bold text-white">
            Une question, <Underlined>un projet</Underlined> en tete ?
          </p>
          <Link to="/contact" className="btn-primary shrink-0 !bg-white !text-navy hover:!bg-sun">
            Voir la page Contact
          </Link>
        </div>
      </section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <h2 className="text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    (acc[item[key]] ||= []).push(item);
    return acc;
  }, {});
}
