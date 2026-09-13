import { useState } from "react";
import { Download, FileCheck2 } from "lucide-react";
import api from "../../api";
import { useApi } from "../../hooks/useApi";
import Spinner from "../ui/Spinner";
import ErrorState from "../ui/ErrorState";
import { formatPrice } from "../../lib/format";
import WorkReviewModal from "./WorkReviewModal";

const STATUS_LABELS = {
  pending: { label: "En attente", bg: "#F3F4F6", color: "#6B7280" },
  in_review: { label: "En correction", bg: "#FEF3C7", color: "#92400E" },
  completed: { label: "Terminee", bg: "#D1FAE5", color: "#047857" },
};

function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] || STATUS_LABELS.pending;
  return (
    <span
      className="rounded-full px-2 py-1 text-xs font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

export default function CorrectionsPanel() {
  const submissions = useApi(() => api.adminListWorkSubmissions(), []);
  const [reviewing, setReviewing] = useState(null);

  return (
    <div className="px-4 py-6 md:px-8">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
        Corrections de travaux
      </p>

      {submissions.loading && <Spinner />}
      {submissions.error && <ErrorState message={submissions.error} onRetry={submissions.reload} />}

      {submissions.data && submissions.data.length === 0 && (
        <p className="text-sm text-gray-400">Aucune soumission pour l'instant.</p>
      )}

      {submissions.data && submissions.data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-ground text-left text-muted">
                <th className="px-4 py-2.5 font-medium">Etudiant</th>
                <th className="px-4 py-2.5 font-medium">Fichier</th>
                <th className="px-4 py-2.5 font-medium">Note</th>
                <th className="px-4 py-2.5 font-medium">Statut</th>
                <th className="px-4 py-2.5 font-medium">Prix</th>
                <th className="px-4 py-2.5 font-medium">Deposee le</th>
                <th className="px-4 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.data.map((s) => (
                <tr key={s.id} className="border-t border-gray-100 align-top">
                  <td className="px-4 py-2.5">
                    <p className="font-medium">{s.student_name}</p>
                    <p className="text-xs text-muted">{s.student_email}</p>
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => api.downloadWorkSubmissionFile(s.id, "original")}
                      className="flex items-center gap-1.5 text-accent"
                    >
                      <Download size={13} /> {s.original_file_name}
                    </button>
                  </td>
                  <td className="max-w-[220px] px-4 py-2.5 text-muted">{s.note || "—"}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-2.5">{formatPrice(s.price)}</td>
                  <td className="px-4 py-2.5 text-muted">
                    {new Date(s.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => setReviewing(s)}
                      className="flex items-center gap-1.5 text-xs font-medium text-accent"
                    >
                      <FileCheck2 size={13} /> Examiner
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reviewing && (
        <WorkReviewModal
          submission={reviewing}
          onClose={() => setReviewing(null)}
          onSaved={(updated) => {
            submissions.setData((list) =>
              list.map((x) => (x.id === updated.id ? { ...x, ...updated } : x))
            );
            setReviewing(null);
          }}
        />
      )}
    </div>
  );
}
