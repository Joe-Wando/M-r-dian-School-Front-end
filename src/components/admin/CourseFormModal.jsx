import { useState } from "react";
import Modal from "../ui/Modal";
import Field from "../ui/Field";
import { CATEGORY_NAMES, LEVELS, COURSE_TEMPLATES } from "../../lib/theme";

const EMPTY = {
  title: "",
  category: "Informatique",
  level: "L1",
  template: "Theorique illustre",
  price: "",
  duration: "",
  is_free: false,
  description: "",
};

export default function CourseFormModal({ course, onClose, onSubmit, saving, error }) {
  const [form, setForm] = useState(course ? { ...EMPTY, ...course } : EMPTY);
  const [errors, setErrors] = useState({});

  function set(patch) {
    setForm((f) => ({ ...f, ...patch }));
  }

  function validate() {
    const e = {};
    if (form.title.trim().length < 3) e.title = "Titre trop court.";
    if (!form.is_free && (!form.price || Number(form.price) <= 0))
      e.price = "Indique un prix (ou coche « gratuit »).";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      price: form.is_free ? 0 : Number(form.price) || 0,
    });
  }

  return (
    <Modal title={course ? `Modifier — ${course.code || course.id}` : "Ajouter un cours"} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto p-6">
          <Field label="Titre du cours" error={errors.title} required>
            <input
              className="field"
              value={form.title}
              onChange={(e) => set({ title: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Matiere">
              <select
                className="field"
                value={form.category}
                onChange={(e) => set({ category: e.target.value })}
              >
                {CATEGORY_NAMES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Niveau">
              <select
                className="field"
                value={form.level}
                onChange={(e) => set({ level: e.target.value })}
              >
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Modele de cours">
            <select
              className="field"
              value={form.template}
              onChange={(e) => set({ template: e.target.value })}
            >
              {COURSE_TEMPLATES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Prix (FCFA)" error={errors.price}>
              <input
                type="number"
                min="0"
                className="field"
                disabled={form.is_free}
                value={form.is_free ? 0 : form.price}
                onChange={(e) => set({ price: e.target.value })}
              />
            </Field>
            <Field label="Duree" hint="ex : 5h">
              <input
                className="field"
                value={form.duration}
                onChange={(e) => set({ duration: e.target.value })}
              />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.is_free}
              onChange={(e) => set({ is_free: e.target.checked, price: e.target.checked ? 0 : form.price })}
            />
            Cours gratuit
          </label>

          <Field label="Description">
            <textarea
              rows={3}
              className="field resize-none"
              value={form.description}
              onChange={(e) => set({ description: e.target.value })}
            />
          </Field>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="px-6 pb-6">
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? "Enregistrement…" : course ? "Enregistrer les modifications" : "Publier le cours"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
