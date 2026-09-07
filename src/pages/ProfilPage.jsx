import { Link } from "react-router-dom";
import { PlayCircle, MapPin, Mail, Download, GraduationCap, Briefcase, ArrowUpRight } from "lucide-react";
import api from "../api";
import { useApi } from "../hooks/useApi";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import { catStyle } from "../lib/theme";

export default function ProfilPage() {
  const { data: profile, loading, error, reload } = useApi(() => api.getProfile(), []);

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!profile) return null;

  const skillsByCat = groupBy(profile.skills || [], "category");

  return (
    <div>
      <header className="border-b border-line bg-white px-4 pb-8 pt-12 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          <div className="relative flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink md:w-56">
            <PlayCircle size={40} className="text-white" />
            <span className="absolute bottom-2 left-2 rounded-full bg-white/15 px-2 py-0.5 text-[10px] text-white">
              Pitch — 45 sec
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold md:text-4xl">{profile.name}</h1>
            <p className="mt-2 max-w-xl text-base text-muted">{profile.bio}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-400">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {profile.location}
                </span>
              )}
              {profile.email_contact && (
                <span className="flex items-center gap-1">
                  <Mail size={14} /> {profile.email_contact}
                </span>
              )}
            </div>
          </div>
          {profile.cv_url && (
            <a href={profile.cv_url} download className="btn-primary shrink-0 !py-2.5">
              <Download size={15} /> Telecharger le CV
            </a>
          )}
        </div>
      </header>

      <Section title="Parcours">
        <div className="flex flex-col">
          {(profile.timeline || []).map((item, i) => (
            <div key={i} className="flex gap-4 border-t border-gray-100 py-3.5 md:gap-8">
              <span className="w-28 shrink-0 pt-1 text-xs text-gray-400">{item.year}</span>
              <div className="flex items-start gap-3">
                {item.type === "formation" ? (
                  <GraduationCap size={16} className="mt-0.5 text-blue-700" />
                ) : (
                  <Briefcase size={16} className="mt-0.5 text-emerald-600" />
                )}
                <div>
                  <p className="text-base font-medium">{item.title}</p>
                  <p className="text-sm text-muted">{item.place}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Competences">
        <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
          {Object.entries(skillsByCat).map(([cat, skills]) => (
            <div key={cat}>
              <p className="mb-2 text-xs font-semibold" style={{ color: catStyle(cat).text }}>
                {cat.toUpperCase()}
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s.name}
                    className="rounded-full px-3 py-1.5 text-sm"
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {(profile.works || []).map((w) => (
            <a
              key={w.id}
              href={w.link || "#"}
              className="flex flex-col gap-2 rounded-lg border border-line p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full px-2 py-1 text-xs font-medium"
                  style={{ background: catStyle(w.category).tint, color: catStyle(w.category).text }}
                >
                  {w.category}
                </span>
                <ArrowUpRight size={15} className="text-gray-400" />
              </div>
              <p className="text-base font-semibold">{w.title}</p>
              <p className="text-sm text-muted">{w.description}</p>
            </a>
          ))}
        </div>
      </Section>

      <section className="flex items-center justify-between bg-white px-4 py-8 md:px-8">
        <p className="text-sm text-muted">Une question, un projet en tete ?</p>
        <Link
          to="/contact"
          className="rounded-md border border-accent px-4 py-2 text-sm font-medium text-accent"
        >
          Voir la page Contact
        </Link>
      </section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="border-b border-line bg-white px-4 py-8 md:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    (acc[item[key]] ||= []).push(item);
    return acc;
  }, {});
}
