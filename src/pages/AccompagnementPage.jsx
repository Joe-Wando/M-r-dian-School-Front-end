import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, FileCheck2, Radio, Clock, ArrowUpRight, Calendar, CheckCircle2 } from "lucide-react";
import api from "../api";
import { useApi } from "../hooks/useApi";
import { useMutation } from "../hooks/useMutation";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import Modal from "../components/ui/Modal";
import Field from "../components/ui/Field";
import PageHeader from "../components/ui/PageHeader";
import { Underlined } from "../components/ui/Decor";
import { formatPrice } from "../lib/format";
import { CORRECTION_PRICE } from "../api/mock/data";

export default function AccompagnementPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const slots = useApi(() => api.mentoringSlots(), []);
  const sessions = useApi(() => api.qaSessions(), []);

  const [booking, setBooking] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const createBooking = useMutation(api.createBooking);
  const registerQa = useMutation(api.registerQa);
  const submitWork = useMutation(api.submitWork);

  function guard(action) {
    if (!isAuthenticated) {
      navigate("/connexion", { state: { from: { pathname: "/accompagnement" } } });
      return;
    }
    action();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Accompagnement personnel"
        title={
          <>
            Avance plus vite, <Underlined>bien entoure</Underlined>
          </>
        }
        subtitle="Au-dela des cours, un suivi individuel pour avancer plus vite : mentorat, retours sur tes travaux, et sessions de questions en direct."
      />

      {/* Mentorat */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <SectionTitle icon={Users} n={1}>Mentorat 1-a-1</SectionTitle>
        <p className="mb-8 max-w-2xl text-muted">
          Reserve un creneau individuel, en visio, pour avancer sur ce qui te bloque vraiment.
        </p>
        {slots.loading && <Spinner />}
        {slots.error && <ErrorState message={slots.error} onRetry={slots.reload} />}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {slots.data?.map((opt) => (
            <div key={opt.id} className="card flex flex-col gap-4 p-7 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 font-display text-xs font-semibold text-accent">
                  <Clock size={13} /> {opt.label}
                </span>
                <span className="font-display text-2xl font-bold text-navy">{formatPrice(opt.price)}</span>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-muted">{opt.description}</p>
              <button
                onClick={() => guard(() => setBooking(opt))}
                className="btn-primary mt-1"
              >
                Reserver ce creneau <ArrowUpRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Correction de travaux */}
      <section className="px-4 py-4 md:px-8">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-mist px-5 py-12 sm:px-10">
        <SectionTitle icon={FileCheck2} n={2}>Correction de travaux</SectionTitle>
        <p className="mb-8 max-w-2xl text-muted">
          Envoie un devoir, un memoire, un projet de code ou une note de synthese : retour detaille
          sous 48h.
        </p>
        <WorkSubmissionForm
          price={CORRECTION_PRICE}
          onSubmit={(payload) =>
            guard(async () => {
              await submitWork.mutate(payload);
              setFeedback("Ton travail a bien ete envoye pour correction.");
            })
          }
          loading={submitWork.loading}
          error={submitWork.error}
        />
        </div>
      </section>

      {/* Sessions Q&R */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <SectionTitle icon={Radio} n={3}>Sessions Q&R en direct</SectionTitle>
        <p className="mb-8 max-w-2xl text-muted">
          Des creneaux collectifs en visio pour poser tes questions en direct, gratuits pour les
          inscrits.
        </p>
        {sessions.loading && <Spinner />}
        {sessions.error && <ErrorState message={sessions.error} onRetry={sessions.reload} />}
        <div className="flex flex-col gap-3">
          {sessions.data?.map((s) => (
            <div
              key={s.id}
              className="card flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6 md:p-6"
            >
              <div className="flex w-full shrink-0 items-center gap-3 font-display text-sm font-semibold text-navy md:w-52">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sun/25 text-navy">
                  <Calendar size={16} />
                </span>
                {s.date}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-navy">{s.topic}</p>
                <p className="mt-1 text-xs font-medium text-muted">
                  {s.time} · {s.spots_left} places restantes
                </p>
              </div>
              <button
                onClick={() =>
                  guard(async () => {
                    await registerQa.mutate(s.id);
                    setFeedback(`Inscription confirmee pour « ${s.topic} ».`);
                    sessions.reload();
                  })
                }
                disabled={registerQa.loading || s.spots_left <= 0}
                className="btn-outline shrink-0 !py-2.5"
              >
                S'inscrire
              </button>
            </div>
          ))}
        </div>
      </section>

      {booking && (
        <Modal title={`Reserver — ${booking.label}`} size="sm" onClose={() => setBooking(null)}>
          <div className="p-6">
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-emerald-600">
              <CheckCircle2 size={16} /> Creneau disponible cette semaine
            </p>
            <p className="text-sm text-muted">
              Tu seras redirige vers le paiement Naboopay, puis tu recevras un lien de visio apres
              confirmation.
            </p>
            {createBooking.error && (
              <p className="mt-3 text-sm text-red-600">{createBooking.error}</p>
            )}
            <button
              onClick={async () => {
                await createBooking.mutate({ option_id: booking.id });
                setBooking(null);
                setFeedback("Demande de mentorat enregistree — paiement a finaliser.");
              }}
              disabled={createBooking.loading}
              className="btn-primary mt-5 w-full"
            >
              Continuer — {formatPrice(booking.price)}
            </button>
          </div>
        </Modal>
      )}

      {feedback && (
        <Modal title="C'est note" size="sm" onClose={() => setFeedback(null)}>
          <div className="p-6">
            <p className="flex items-center gap-2 text-sm text-navy">
              <CheckCircle2 size={16} className="text-emerald-600" /> {feedback}
            </p>
            <button onClick={() => setFeedback(null)} className="btn-primary mt-5 w-full">
              Fermer
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SectionTitle({ icon: Icon, n, children }) {
  return (
    <div className="mb-4 flex items-center gap-4">
      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy text-white">
        <Icon size={22} />
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-sun font-display text-[11px] font-bold text-navy">
          {n}
        </span>
      </span>
      <h2 className="text-2xl font-bold text-navy sm:text-3xl">{children}</h2>
    </div>
  );
}

function WorkSubmissionForm({ price, onSubmit, loading, error }) {
  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!file) return;
    onSubmit({ file, note });
  }

  return (
    <form onSubmit={handleSubmit} className="card flex max-w-2xl flex-col gap-5 p-6 sm:p-8">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-accent/30 bg-accent-soft/40 p-8 text-center transition hover:border-accent">
        <FileCheck2 size={26} className="text-accent" />
        <span className="font-display text-sm font-semibold text-navy">
          {file ? file.name : "Depose ton fichier ici"}
        </span>
        <span className="text-xs text-muted">PDF, Word, ou fichier de code — 10 Mo max</span>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.zip,.txt,.js,.py,.c,.java"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>
      {touched && !file && <p className="-mt-3 text-xs text-red-600">Choisis un fichier a envoyer.</p>}

      <Field label="Contexte" hint="Un mot sur ce que tu attends de cette correction.">
        <textarea
          rows={3}
          className="field resize-none"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-display text-lg font-bold text-navy">
          {formatPrice(price)} <span className="text-sm font-medium text-muted">/ correction</span>
        </span>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Envoi…" : "Envoyer pour correction"}
        </button>
      </div>
    </form>
  );
}
