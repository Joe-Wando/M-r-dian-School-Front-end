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
      <header className="border-b border-line bg-white px-4 pb-6 pt-10 md:px-8">
        <h1 className="text-2xl font-semibold md:text-3xl">Accompagnement personnel</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted">
          Au-dela des cours, un suivi individuel pour avancer plus vite : mentorat, retours sur tes
          travaux, et sessions de questions en direct.
        </p>
      </header>

      {/* Mentorat */}
      <section className="border-b border-line bg-white px-4 py-8 md:px-8">
        <SectionTitle icon={Users}>Mentorat 1-a-1</SectionTitle>
        <p className="mb-5 text-sm text-muted">
          Reserve un creneau individuel, en visio, pour avancer sur ce qui te bloque vraiment.
        </p>
        {slots.loading && <Spinner />}
        {slots.error && <ErrorState message={slots.error} onRetry={slots.reload} />}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {slots.data?.map((opt) => (
            <div key={opt.id} className="flex flex-col gap-3 rounded-lg border border-line p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <Clock size={14} /> {opt.label}
                </span>
                <span className="text-lg font-semibold">{formatPrice(opt.price)}</span>
              </div>
              <p className="text-sm text-muted">{opt.description}</p>
              <button
                onClick={() => guard(() => setBooking(opt))}
                className="btn-primary mt-1 !py-2.5"
              >
                Reserver ce creneau <ArrowUpRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Correction de travaux */}
      <section className="border-b border-line bg-white px-4 py-8 md:px-8">
        <SectionTitle icon={FileCheck2}>Correction de travaux</SectionTitle>
        <p className="mb-5 text-sm text-muted">
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
      </section>

      {/* Sessions Q&R */}
      <section className="bg-white px-4 py-8 md:px-8">
        <SectionTitle icon={Radio}>Sessions Q&R en direct</SectionTitle>
        <p className="mb-5 text-sm text-muted">
          Des creneaux collectifs en visio pour poser tes questions en direct, gratuits pour les
          inscrits.
        </p>
        {sessions.loading && <Spinner />}
        {sessions.error && <ErrorState message={sessions.error} onRetry={sessions.reload} />}
        <div className="flex flex-col gap-3">
          {sessions.data?.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-3 rounded-lg border border-line p-4 md:flex-row md:items-center md:gap-6"
            >
              <div className="flex w-full shrink-0 items-center gap-2 text-sm font-medium text-gray-700 md:w-48">
                <Calendar size={14} className="text-accent" /> {s.date}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{s.topic}</p>
                <p className="mt-0.5 text-xs text-gray-400">
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
                className="shrink-0 rounded-md border border-accent px-4 py-2 text-sm font-medium text-accent disabled:opacity-50"
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
            <p className="mb-4 flex items-center gap-2 text-sm text-emerald-600">
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
            <p className="flex items-center gap-2 text-sm text-gray-700">
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

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="mb-1 flex items-center gap-2">
      <Icon size={18} className="text-accent" />
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">{children}</p>
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
    onSubmit({ file_name: file.name, note });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl rounded-lg border border-line p-5">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-line-strong p-6 text-center">
        <FileCheck2 size={22} className="text-gray-400" />
        <span className="text-sm font-medium">
          {file ? file.name : "Depose ton fichier ici"}
        </span>
        <span className="text-xs text-gray-400">PDF, Word, ou fichier de code — 10 Mo max</span>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.zip,.txt,.js,.py,.c,.java"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>
      {touched && !file && <p className="mt-2 text-xs text-red-600">Choisis un fichier a envoyer.</p>}

      <Field label="Contexte" hint="Un mot sur ce que tu attends de cette correction.">
        <textarea
          rows={3}
          className="field resize-none"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Field>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-semibold">{formatPrice(price)} / correction</span>
        <button type="submit" className="btn-primary !px-4 !py-2.5" disabled={loading}>
          {loading ? "Envoi…" : "Envoyer pour correction"}
        </button>
      </div>
    </form>
  );
}
