import { useState } from "react";
import api from "../../api";
import { useMutation } from "../../hooks/useMutation";
import Modal from "../ui/Modal";
import Field from "../ui/Field";

const EMPTY = { topic: "", scheduledAt: "", durationMinutes: 60, maxSpots: 20 };

export default function QaSessionFormModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const create = useMutation(api.createQaSession);

  function set(patch) {
    setForm((f) => ({ ...f, ...patch }));
  }

  function validate() {
    const e = {};
    if (form.topic.trim().length < 3) e.topic = "Sujet trop court.";
    if (!form.scheduledAt) e.scheduledAt = "Choisis une date.";
    else if (new Date(form.scheduledAt).getTime() <= Date.now()) e.scheduledAt = "Doit etre dans le futur.";
    if (!form.durationMinutes || Number(form.durationMinutes) < 15) e.durationMinutes = "Minimum 15 min.";
    if (!form.maxSpots || Number(form.maxSpots) < 1) e.maxSpots = "Minimum 1 place.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const created = await create.mutate({
      topic: form.topic,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      durationMinutes: form.durationMinutes,
      maxSpots: form.maxSpots,
    });
    onCreated(created);
  }

  return (
    <Modal title="Creer une session Q&R" onClose={onClose} size="sm">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 p-6">
          <Field label="Sujet" error={errors.topic} required>
            <input className="field" value={form.topic} onChange={(e) => set({ topic: e.target.value })} />
          </Field>

          <Field label="Date et heure" error={errors.scheduledAt} required>
            <input
              type="datetime-local"
              className="field"
              value={form.scheduledAt}
              onChange={(e) => set({ scheduledAt: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Duree (min)" error={errors.durationMinutes}>
              <input
                type="number"
                min="15"
                className="field"
                value={form.durationMinutes}
                onChange={(e) => set({ durationMinutes: e.target.value })}
              />
            </Field>
            <Field label="Places max" error={errors.maxSpots}>
              <input
                type="number"
                min="1"
                className="field"
                value={form.maxSpots}
                onChange={(e) => set({ maxSpots: e.target.value })}
              />
            </Field>
          </div>

          {create.error && <p className="text-sm text-red-600">{create.error}</p>}
        </div>

        <div className="px-6 pb-6">
          <button type="submit" className="btn-primary w-full" disabled={create.loading}>
            {create.loading ? "Creation…" : "Creer la session"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
