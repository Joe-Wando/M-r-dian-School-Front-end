/** Champ de formulaire natif avec label + message d'erreur. */
export default function Field({ label, error, hint, children, required }) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      {label && (
        <span className="font-display text-[11px] font-semibold uppercase tracking-wide text-navy">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="text-xs text-muted">{hint}</span>}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
