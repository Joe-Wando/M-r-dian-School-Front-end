import { CheckCircle2 } from "lucide-react";
import { formatPrice } from "../../lib/format";

export default function UpsellCard({ course, onBuy, busy }) {
  if (course.is_free) {
    return (
      <div className="rounded-lg bg-emerald-600 p-5 text-white">
        <p className="text-lg font-semibold">Ce cours est gratuit</p>
        <ul className="mt-4 flex flex-col gap-2.5 text-sm">
          {[
            "Acces a toutes les videos et exercices",
            "Support de cours telechargeable",
            "Aucune inscription payante requise",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-200" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-accent p-5 text-white">
      <p className="text-lg font-semibold">Debloquer le cours complet</p>
      <ul className="mt-4 flex flex-col gap-2.5 text-sm">
        {[
          "Acces a tous les modules et exercices notes",
          "Support de cours telechargeable",
          "Suivi de ta progression",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-blue-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xl font-semibold">{formatPrice(course.price)}</p>
      <button
        onClick={onBuy}
        disabled={busy}
        className="mt-4 w-full rounded-md bg-white py-2.5 text-sm font-medium text-accent disabled:opacity-60"
      >
        {busy ? "…" : "Acheter via Naboopay"}
      </button>
    </div>
  );
}
