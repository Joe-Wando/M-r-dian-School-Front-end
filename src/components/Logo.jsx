import { Link } from "react-router-dom";

/**
 * Charte Meredian :
 *  - variant "icon"  -> le repere circulaire seul (navigation, favicon...)
 *  - variant "word"  -> icone + "Meredian" (footer / une fois sur l'accueil)
 * Le wordmark n'apparait jamais deux fois sur le meme ecran.
 */
export default function Logo({ variant = "icon", to = "/", className = "", muted = false }) {
  const size = variant === "word" ? 24 : 32;
  const img = (
    <img
      src="/logo-meridian.svg"
      alt="Meredian"
      width={size}
      height={size}
      className="shrink-0"
      style={muted ? { filter: "grayscale(1) opacity(0.6)" } : undefined}
    />
  );

  const content =
    variant === "word" ? (
      <span className="flex items-center gap-2">
        {img}
        <span
          className="text-base font-semibold tracking-tight"
          style={{ color: muted ? "#6B7280" : "#1A1A1A" }}
        >
          Meredian
        </span>
      </span>
    ) : (
      img
    );

  if (!to) return <span className={className}>{content}</span>;

  return (
    <Link to={to} aria-label="Meredian, accueil" className={`inline-flex items-center ${className}`}>
      {content}
    </Link>
  );
}
