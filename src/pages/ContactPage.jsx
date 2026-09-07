import { useState } from "react";
import { Send, Mail, MapPin, CheckCircle2 } from "lucide-react";
import api from "../api";
import { useMutation } from "../hooks/useMutation";
import Field from "../components/ui/Field";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const { mutate, loading, error } = useMutation(api.sendContact);

  function validate() {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Indique ton nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide.";
    if (form.message.trim().length < 10) e.message = "Message trop court (10 caracteres min).";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    await mutate(form);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div>
      <header className="border-b border-line bg-white px-4 pb-6 pt-10 md:px-8">
        <h1 className="text-2xl font-semibold md:text-3xl">Contact</h1>
        <p className="mt-1.5 max-w-xl text-sm text-muted">
          Une question sur un cours, un projet de collaboration, ou juste envie d'echanger — ecris-moi.
        </p>
      </header>

      <div className="flex flex-col gap-10 bg-white px-4 py-8 md:flex-row md:px-8">
        <form onSubmit={onSubmit} className="flex max-w-lg flex-1 flex-col gap-4" noValidate>
          {sent && (
            <p className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <CheckCircle2 size={16} /> Message envoye — reponse generalement sous 24 a 48h.
            </p>
          )}
          <Field label="Nom" error={errors.name} required>
            <input
              className="field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Email" error={errors.email} required>
            <input
              type="email"
              className="field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Message" error={errors.message} required>
            <textarea
              rows={5}
              className="field resize-none"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary self-start" disabled={loading}>
            <Send size={14} /> {loading ? "Envoi…" : "Envoyer"}
          </button>
        </form>

        <div className="flex w-full shrink-0 flex-col gap-4 md:w-64">
          <div className="rounded-lg border border-line p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Coordonnees
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-700">
              <Mail size={14} /> contact@exemple.com
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-sm text-gray-700">
              <MapPin size={14} /> Zurich, Suisse
            </p>
          </div>
          <div className="rounded-lg border border-line p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Delai de reponse
            </p>
            <p className="text-sm text-gray-700">Generalement sous 24 a 48h.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
