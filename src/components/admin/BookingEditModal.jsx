import { useState } from "react";
import api from "../../api";
import { useMutation } from "../../hooks/useMutation";
import Modal from "../ui/Modal";
import Field from "../ui/Field";

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmee" },
  { value: "completed", label: "Terminee" },
  { value: "cancelled", label: "Annulee" },
];

export default function BookingEditModal({ booking, onClose, onSaved }) {
  const [status, setStatus] = useState(booking.status || "pending");
  const [meetingLink, setMeetingLink] = useState(booking.meeting_link || "");

  const update = useMutation(api.adminUpdateBooking);

  async function handleSubmit(e) {
    e.preventDefault();
    const updated = await update.mutate(booking.id, { status, meetingLink: meetingLink || undefined });
    onSaved(updated);
  }

  return (
    <Modal title={`Reservation — ${booking.student_name}`} onClose={onClose} size="sm">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 p-6">
          <Field label="Statut">
            <select className="field" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Lien de visio" hint="Ex : https://meet.google.com/xxx-xxxx-xxx">
            <input
              className="field"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </Field>

          {update.error && <p className="text-sm text-red-600">{update.error}</p>}
        </div>

        <div className="px-6 pb-6">
          <button type="submit" className="btn-primary w-full" disabled={update.loading}>
            {update.loading ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
