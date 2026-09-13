import { useState } from "react";
import { Pencil } from "lucide-react";
import api from "../../api";
import { useApi } from "../../hooks/useApi";
import Spinner from "../ui/Spinner";
import ErrorState from "../ui/ErrorState";
import { formatPrice } from "../../lib/format";
import BookingEditModal from "./BookingEditModal";

const STATUS_LABELS = {
  pending: { label: "En attente", bg: "#F3F4F6", color: "#6B7280" },
  confirmed: { label: "Confirmee", bg: "#DBEAFE", color: "#1D4ED8" },
  completed: { label: "Terminee", bg: "#D1FAE5", color: "#047857" },
  cancelled: { label: "Annulee", bg: "#FEE2E2", color: "#B91C1C" },
};

function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] || STATUS_LABELS.pending;
  return (
    <span className="rounded-full px-2 py-1 text-xs font-medium" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })} · ${d.toLocaleTimeString(
    "fr-FR",
    { hour: "2-digit", minute: "2-digit" }
  )}`;
}

export default function MentoringPanel() {
  const bookings = useApi(() => api.adminListBookings(), []);
  const [editing, setEditing] = useState(null);

  return (
    <div className="px-4 py-6 md:px-8">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
        Reservations de mentorat
      </p>

      {bookings.loading && <Spinner />}
      {bookings.error && <ErrorState message={bookings.error} onRetry={bookings.reload} />}

      {bookings.data && bookings.data.length === 0 && (
        <p className="text-sm text-gray-400">Aucune reservation pour l'instant.</p>
      )}

      {bookings.data && bookings.data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-ground text-left text-muted">
                <th className="px-4 py-2.5 font-medium">Etudiant</th>
                <th className="px-4 py-2.5 font-medium">Creneau</th>
                <th className="px-4 py-2.5 font-medium">Duree</th>
                <th className="px-4 py-2.5 font-medium">Prix</th>
                <th className="px-4 py-2.5 font-medium">Statut</th>
                <th className="px-4 py-2.5 font-medium">Lien</th>
                <th className="px-4 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.data.map((b) => (
                <tr key={b.id} className="border-t border-gray-100">
                  <td className="px-4 py-2.5">
                    <p className="font-medium">{b.student_name}</p>
                    <p className="text-xs text-muted">{b.student_email}</p>
                  </td>
                  <td className="px-4 py-2.5 text-muted">{formatDateTime(b.scheduled_at)}</td>
                  <td className="px-4 py-2.5">{b.duration_minutes} min</td>
                  <td className="px-4 py-2.5">{formatPrice(b.price)}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-2.5 text-xs text-muted">
                    {b.meeting_link || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => setEditing(b)}
                      className="flex items-center gap-1.5 text-xs font-medium text-accent"
                    >
                      <Pencil size={13} /> Editer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <BookingEditModal
          booking={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            bookings.setData((list) =>
              list.map((x) => (x.id === updated.id ? { ...x, ...updated } : x))
            );
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
