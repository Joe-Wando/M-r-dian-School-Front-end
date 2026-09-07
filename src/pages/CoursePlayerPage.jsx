import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileDown, ExternalLink } from "lucide-react";
import api from "../api";
import { useApi } from "../hooks/useApi";
import { useMutation } from "../hooks/useMutation";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import CategoryBadge from "../components/ui/CategoryBadge";
import CourseSidebar from "../components/course/CourseSidebar";
import SectionContent from "../components/course/SectionContent";
import UpsellCard from "../components/course/UpsellCard";

export default function CoursePlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: course, loading: lc, error: ec, reload: rc } = useApi(() => api.getCourse(id), [id]);
  const {
    data: modules,
    loading: lm,
    error: em,
    reload: rm,
    setData: setModules,
  } = useApi(() => api.getCourseModules(id), [id]);

  const checkout = useMutation(api.checkout);
  const complete = useMutation(api.completeSection);
  const [active, setActive] = useState(null);

  const firstPlayable = useMemo(() => {
    if (!modules) return null;
    const mod = modules.find((m) => m.status !== "locked") || modules[0];
    return mod ? { module: mod, section: mod.sections[0] } : null;
  }, [modules]);

  useEffect(() => {
    if (!active && firstPlayable) setActive(firstPlayable);
  }, [active, firstPlayable]);

  if (lc || lm) return <Spinner />;
  if (ec) return <ErrorState message={ec} onRetry={rc} />;
  if (em) return <ErrorState message={em} onRetry={rm} />;
  if (!course || !modules || !active) return null;

  async function onComplete(section) {
    await complete.mutate(section.id);
    setModules((mods) =>
      mods.map((m) => ({
        ...m,
        sections: m.sections.map((s) => (s.id === section.id ? { ...s, completed: true } : s)),
      }))
    );
    setActive((a) => ({ ...a, section: { ...a.section, completed: true } }));
  }

  async function onBuy() {
    const res = await checkout.mutate({ item_type: "course", item_id: id, amount: course.price });
    window.alert(`Paiement initie (ref ${res.reference}).\n${res.note || ""}`);
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-muted"
        >
          <ArrowLeft size={15} /> Retour
        </button>
        <CategoryBadge category={course.category} level={course.level} />
      </div>

      <div className="flex flex-col lg:flex-row">
        <CourseSidebar
          title={course.title}
          modules={modules}
          activeSectionId={active.section?.id}
          onSelect={(module, section) => setActive({ module, section })}
        />

        <main className="max-w-3xl flex-1 px-4 py-8 md:px-10">
          <SectionContent
            module={active.module}
            section={active.section}
            onComplete={onComplete}
            completing={complete.loading}
          />

          {course.pdf_resource_url !== null && (
            <a
              href={course.pdf_resource_url || "#"}
              className="btn-outline mt-6 w-fit !px-4 !py-2.5"
              download
            >
              <FileDown size={15} /> Telecharger le support PDF du cours
            </a>
          )}

          {course.category === "Informatique" && (
            <div className="mt-6 flex items-center gap-2 rounded-md bg-accent-soft px-3 py-2.5 text-xs text-accent">
              <ExternalLink size={13} />
              En fin de parcours, tu seras oriente vers une certification professionnelle externe si
              tu souhaites aller plus loin.
            </div>
          )}
        </main>

        <aside className="flex w-full shrink-0 flex-col gap-5 px-4 py-8 md:px-6 lg:w-80">
          <UpsellCard course={course} onBuy={onBuy} busy={checkout.loading} />
          {checkout.error && <p className="text-sm text-red-600">{checkout.error}</p>}
        </aside>
      </div>
    </div>
  );
}
