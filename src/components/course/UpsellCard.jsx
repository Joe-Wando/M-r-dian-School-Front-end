import { CheckCircle2 } from "lucide-react";
import { formatPrice } from "../../lib/format";
import { Starburst } from "../ui/Decor";

export default function UpsellCard({ course, onBuy, busy }) {
  if (course.is_free) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-emerald-600 p-6 text-white">
        <p className="font-display text-lg font-bold">Ce cours est gratuit</p>
        <ul className="mt-5 flex flex-col gap-3 text-sm font-medium">
          {[
            "Acces a toutes les videos et exercices",
            "Support de cours telechargeable",
            "Aucune inscription payante requise",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-200" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-navy p-6 text-white">
      <Starburst fill="fill-white/5" className="absolute -right-10 -top-10 h-36 w-36" />
      <p className="relative font-display text-lg font-bold">Debloquer le cours complet</p>
      <ul className="relative mt-5 flex flex-col gap-3 text-sm font-medium">
        {[
          "Acces a tous les modules et exercices notes",
          "Support de cours telechargeable",
          "Suivi de ta progression",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-sun" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 font-display text-2xl font-bold">{formatPrice(course.price)}</p>
      <button onClick={onBuy} disabled={busy} className="btn-accent mt-4 w-full">
        {busy ? "…" : "Acheter via Naboopay"}
      </button>
    </div>
  );
}
