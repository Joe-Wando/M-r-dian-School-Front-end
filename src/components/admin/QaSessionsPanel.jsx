import { useState } from "react";
import { Plus } from "lucide-react";
import api from "../../api";
import { useApi } from "../../hooks/useApi";
import Spinner from "../ui/Spinner";
import ErrorState from "../ui/ErrorState";
import QaSessionFormModal from "./QaSessionFormModal";

export default function QaSessionsPanel() {
  const sessions = useApi(() => api.qaSessions(), []);
  const [creating, setCreating] = useState(false);

  return (
    <div className="px-4 py-6 md:px-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">
          Sessions Q&R
        </p>
        <button onClick={() => setCreating(true)} className="btn-primary !px-3 !py-2">
          <Plus size={14} /> Creer une session
        </button>
      </div>

      {sessions.loading && <Spinner />}
      {sessions.error && <ErrorState message={sessions.error} onRetry={sessions.reload} />}

      {sessions.data && sessions.data.length === 0 && (
        <p className="text-sm text-gray-400">Aucune session a venir.</p>
      )}

      {sessions.data && sessions.data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="bg-ground text-left text-muted">
                <th className="px-4 py-2.5 font-medium">Date</th>
                <th className="px-4 py-2.5 font-medium">Sujet</th>
                <th className="px-4 py-2.5 font-medium">Duree</th>
                <th className="px-4 py-2.5 font-medium">Places</th>
              </tr>
            </thead>
            <tbody>
              {sessions.data.map((s) => (
                <tr key={s.id} className="border-t border-gray-100">
                  <td className="px-4 py-2.5 text-muted">
                    {s.date} · {s.time}
                  </td>
                  <td className="px-4 py-2.5 font-medium">{s.topic}</td>
                  <td className="px-4 py-2.5">{s.duration_minutes} min</td>
                  <td className="px-4 py-2.5">
                    {s.spots_left} / {s.max_spots}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {creating && (
        <QaSessionFormModal
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            sessions.reload();
          }}
        />
      )}
    </div>
  );
}
