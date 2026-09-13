import { useState } from "react";
import { Download, FileCheck2 } from "lucide-react";
import api from "../../api";
import { useMutation } from "../../hooks/useMutation";
import Modal from "../ui/Modal";
import Field from "../ui/Field";

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "in_review", label: "En correction" },
  { value: "completed", label: "Terminee" },
];

export default function WorkReviewModal({ submission, onClose, onSaved }) {
  const [status, setStatus] = useState(submission.status || "pending");
  const [feedback, setFeedback] = useState(submission.feedback || "");
  const [feedbackFile, setFeedbackFile] = useState(null);

  const review = useMutation(api.adminReviewWorkSubmission);

  async function handleSubmit(e) {
    e.preventDefault();
    const updated = await review.mutate(submission.id, { status, feedback, feedbackFile });
    onSaved(updated);
  }

  return (
    <Modal title={`Examiner — ${submission.student_name}`} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto p-6">
          <button
            type="button"
            onClick={() => api.downloadWorkSubmissionFile(submission.id, "original")}
            className="flex w-fit items-center gap-1.5 rounded-md border border-line-strong px-3 py-2 text-sm font-medium text-accent"
          >
            <Download size={14} /> Telecharger le fichier original ({submission.original_file_name})
          </button>

          {submission.note && (
            <p className="rounded-md bg-ground px-3 py-2 text-sm text-gray-700">{submission.note}</p>
          )}

          <Field label="Statut">
            <select className="field" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Feedback" hint="Visible par l'etudiant.">
            <textarea
              rows={4}
              className="field resize-none"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </Field>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-line-strong p-6 text-center">
            <FileCheck2 size={22} className="text-gray-400" />
            <span className="text-sm font-medium">
              {feedbackFile ? feedbackFile.name : "Joindre le fichier corrige (optionnel)"}
            </span>
            <span className="text-xs text-gray-400">PDF, Word, ou fichier de code — 10 Mo max</span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.zip,.txt,.js,.py,.c,.java"
              onChange={(e) => setFeedbackFile(e.target.files?.[0] || null)}
            />
          </label>
          {submission.feedback_file_name && !feedbackFile && (
            <button
              type="button"
              onClick={() => api.downloadWorkSubmissionFile(submission.id, "feedback")}
              className="flex w-fit items-center gap-1.5 text-xs text-accent"
            >
              <Download size={12} /> Fichier corrige deja envoye : {submission.feedback_file_name}
            </button>
          )}

          {review.error && <p className="text-sm text-red-600">{review.error}</p>}
        </div>

        <div className="px-6 pb-6">
          <button type="submit" className="btn-primary w-full" disabled={review.loading}>
            {review.loading ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
