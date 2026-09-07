import { useState } from "react";
import { Plus, Trash2, ChevronDown, X } from "lucide-react";
import Modal from "../ui/Modal";
import SectionIcon from "../course/SectionIcon";
import SectionEditorModal from "./SectionEditorModal";
import api from "../../api";
import { useApi } from "../../hooks/useApi";
import { useMutation } from "../../hooks/useMutation";
import Spinner from "../ui/Spinner";
import ErrorState from "../ui/ErrorState";
import { SECTION_TYPES } from "../../lib/theme";

const NEW_SECTION = { title: "", type: "reading", practical: false, duration: "" };

function isFilled(s) {
  if (s.type === "reading") return !!(s.body && s.body.trim());
  if (s.type === "video") return !!(s.video_url && s.video_url.trim());
  if (s.type === "image") return !!(s.photos && s.photos.length);
  if (s.type === "quiz") return !!(s.questions && s.questions.length);
  return false;
}

export default function ModuleManagerModal({ course, onClose }) {
  const { data: modules, loading, error, reload, setData } = useApi(
    () => api.getCourseModules(course.id),
    [course.id]
  );
  const [expanded, setExpanded] = useState(null);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [drafts, setDrafts] = useState({}); // moduleId -> NEW_SECTION
  const [editing, setEditing] = useState(null); // { moduleId, section }

  const addModule = useMutation(api.createModule);
  const delModule = useMutation(api.deleteModule);
  const addSection = useMutation(api.createSection);
  const delSection = useMutation(api.deleteSection);
  const saveSection = useMutation(api.updateSection);

  function draftFor(id) {
    return drafts[id] || NEW_SECTION;
  }
  function setDraft(id, patch) {
    setDrafts((d) => ({ ...d, [id]: { ...draftFor(id), ...patch } }));
  }

  async function onAddModule() {
    if (!newModuleTitle.trim()) return;
    const mod = await addModule.mutate(course.id, { title: newModuleTitle.trim() });
    setData((m) => [...(m || []), { ...mod, sections: mod.sections || [] }]);
    setNewModuleTitle("");
  }

  async function onDeleteModule(id) {
    await delModule.mutate(id);
    setData((m) => m.filter((x) => x.id !== id));
  }

  async function onAddSection(moduleId) {
    const draft = draftFor(moduleId);
    if (!draft.title.trim()) return;
    const section = await addSection.mutate(moduleId, draft);
    setData((m) =>
      m.map((mod) =>
        mod.id === moduleId ? { ...mod, sections: [...mod.sections, section] } : mod
      )
    );
    setDraft(moduleId, NEW_SECTION);
  }

  async function onDeleteSection(moduleId, sectionId) {
    await delSection.mutate(sectionId);
    setData((m) =>
      m.map((mod) =>
        mod.id === moduleId
          ? { ...mod, sections: mod.sections.filter((s) => s.id !== sectionId) }
          : mod
      )
    );
  }

  async function onSaveSectionContent(data) {
    const updated = await saveSection.mutate(editing.section.id, data);
    setData((m) =>
      m.map((mod) =>
        mod.id === editing.moduleId
          ? {
              ...mod,
              sections: mod.sections.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)),
            }
          : mod
      )
    );
    setEditing(null);
  }

  return (
    <Modal title={`Modules — ${course.title}`} size="lg" onClose={onClose}>
      <p className="border-b border-line px-6 py-2 text-xs text-gray-400">
        Modele : {course.template || "non defini"}
      </p>

      <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto p-6">
        {loading && <Spinner />}
        {error && <ErrorState message={error} onRetry={reload} />}

        {modules?.map((m, i) => {
          const isOpen = expanded === m.id;
          const draft = draftFor(m.id);
          return (
            <div key={m.id} className="rounded-md border border-line">
              <div className="flex items-center justify-between px-3 py-2.5">
                <button
                  onClick={() => setExpanded(isOpen ? null : m.id)}
                  className="flex flex-1 items-center gap-2 text-left text-sm"
                >
                  <ChevronDown
                    size={14}
                    className="text-gray-400"
                    style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                  />
                  Module {i + 1} — {m.title}
                  <span className="text-xs text-gray-400">
                    ({m.sections.length} section{m.sections.length > 1 ? "s" : ""})
                  </span>
                </button>
                <button
                  onClick={() => onDeleteModule(m.id)}
                  aria-label="Supprimer le module"
                  className="text-gray-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {isOpen && (
                <div className="flex flex-col gap-2 border-t border-gray-100 px-3 pb-3">
                  {m.sections.map((s) => (
                    <div key={s.id} className="mt-2 flex items-center gap-2 text-xs text-gray-700">
                      <SectionIcon type={s.type} />
                      <button
                        onClick={() => setEditing({ moduleId: m.id, section: s })}
                        className="flex-1 text-left hover:underline"
                      >
                        {s.title}
                      </button>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                          isFilled(s)
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isFilled(s) ? "Rempli" : "Vide"}
                      </span>
                      {s.practical && (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                          Pratique
                        </span>
                      )}
                      <span className="text-gray-400">{s.duration}</span>
                      <button
                        onClick={() => onDeleteSection(m.id, s.id)}
                        aria-label="Supprimer la section"
                        className="text-gray-400"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                  {m.sections.length === 0 && (
                    <p className="mt-2 text-xs text-gray-400">Aucune section pour l'instant.</p>
                  )}

                  <div className="mt-2 flex flex-col gap-2 rounded-md bg-ground p-2.5">
                    <input
                      className="field !text-xs"
                      placeholder="Titre de la section"
                      value={draft.title}
                      onChange={(e) => setDraft(m.id, { title: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <select
                        className="field flex-1 !text-xs"
                        value={draft.type}
                        onChange={(e) => setDraft(m.id, { type: e.target.value })}
                      >
                        {SECTION_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <input
                        className="field w-32 !text-xs"
                        placeholder="Duree"
                        value={draft.duration}
                        onChange={(e) => setDraft(m.id, { duration: e.target.value })}
                      />
                    </div>
                    {draft.type === "video" && (
                      <label className="flex items-center gap-2 text-xs text-gray-700">
                        <input
                          type="checkbox"
                          checked={draft.practical}
                          onChange={(e) => setDraft(m.id, { practical: e.target.checked })}
                        />
                        Video pratique obligatoire
                      </label>
                    )}
                    <button
                      onClick={() => onAddSection(m.id)}
                      className="btn-primary self-start !px-3 !py-2 !text-xs"
                      disabled={addSection.loading}
                    >
                      <Plus size={13} /> Ajouter la section
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {modules?.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-400">Aucun module pour l'instant.</p>
        )}
      </div>

      <div className="flex gap-2 border-t border-line px-6 py-4">
        <input
          className="field flex-1"
          placeholder="Titre du nouveau module"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
        />
        <button onClick={onAddModule} className="btn-primary !px-3 !py-2.5" disabled={addModule.loading}>
          <Plus size={14} /> Ajouter
        </button>
      </div>

      {editing && (
        <SectionEditorModal
          section={editing.section}
          saving={saveSection.loading}
          onClose={() => setEditing(null)}
          onSave={onSaveSectionContent}
        />
      )}
    </Modal>
  );
}
