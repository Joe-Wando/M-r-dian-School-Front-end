import { useState } from "react";
import { Send, Mail, MapPin, CheckCircle2, Clock } from "lucide-react";
import api from "../api";
import { useMutation } from "../hooks/useMutation";
import Field from "../components/ui/Field";
import PageHeader from "../components/ui/PageHeader";
import { Starburst, Underlined } from "../components/ui/Decor";

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
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Parlons de <Underlined>ton projet</Underlined>
          </>
        }
        subtitle="Une question sur un cours, un projet de collaboration, ou juste envie d'echanger écrivez moi."
      />

      <section className="px-4 pt-8 md:px-8">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-navy/10 lg:grid-cols-5">
          <aside className="relative overflow-hidden bg-navy p-8 text-white sm:p-12 lg:col-span-2">
            <h2 className="text-2xl font-bold leading-[1.25] sm:text-3xl">Coordonnees</h2>
            <ul className="mt-8 space-y-5 text-sm font-medium">
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sun">
                  <Mail size={16} />
                </span>
                <span className="break-all">jonathan6wando@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sun">
                  <MapPin size={16} />
                </span>
                Dakar, Sénégal
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sun">
                  <Clock size={16} />
                </span>
                Reponse generalement sous 24 a 48h
              </li>
            </ul>
            <Starburst className="relative mt-12 h-28 w-28 rotate-12 lg:absolute lg:-bottom-4 lg:right-6 lg:mt-0 lg:h-32 lg:w-32">
              Reponse sous 48h
            </Starburst>
          </aside>

          <form onSubmit={onSubmit} className="flex flex-col gap-5 p-6 sm:p-10 lg:col-span-3 lg:p-12" noValidate>
            {sent && (
              <p className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <CheckCircle2 size={16} /> Message envoye — reponse generalement sous 24 a 48h.
              </p>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
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
            </div>
            <Field label="Message" error={errors.message} required>
              <textarea
                rows={6}
                className="field resize-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </Field>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="btn-primary self-start !px-8 !py-4" disabled={loading}>
              <Send size={15} /> {loading ? "Envoi…" : "Envoyer"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
