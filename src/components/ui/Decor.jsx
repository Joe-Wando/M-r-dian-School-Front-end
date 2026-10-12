/* Elements decoratifs (SVG) : vagues, macaron, soulignes au pinceau… */

/** Trois traits obliques (effet de mouvement) */
export function SpeedLines({ className = "" }) {
  return (
    <svg viewBox="0 0 80 60" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
      <path d="M10 50 70 18" />
      <path d="M22 58 74 30" />
      <path d="M6 36 56 8" />
    </svg>
  );
}

/** Spirale */
export function Swirl({ className = "" }) {
  return (
    <svg viewBox="0 0 60 70" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
      <path d="M30 66C12 60 6 40 14 26 22 12 44 10 50 24 56 38 42 48 32 42 24 37 28 26 36 28" />
    </svg>
  );
}

/** Mot souligne d'un trait de pinceau */
export function Underlined({ children, color = "text-sun" }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        aria-hidden
        className={`absolute -bottom-2 left-0 h-3 w-full ${color}`}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
      >
        <path d="M3 8C50 3 150 2 197 6" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 5 }} />
      </svg>
    </span>
  );
}

/** Vague de separation entre deux sections — la couleur suit `className` (text-*) */
export function Wave({ className = "", flip = false }) {
  return (
    <svg
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      aria-hidden
      className={`block h-10 w-full sm:h-16 lg:h-20 ${flip ? "rotate-180" : ""} ${className}`}
      fill="currentColor"
    >
      <path d="M0 60C240 10 480 0 720 30s480 70 720 20v50H0Z" />
    </svg>
  );
}

const STARBURST_POINTS = Array.from({ length: 36 }, (_, i) => {
  const angle = (i * Math.PI) / 18;
  const r = i % 2 === 0 ? 50 : 42;
  return `${(50 + r * Math.cos(angle)).toFixed(2)},${(50 + r * Math.sin(angle)).toFixed(2)}`;
}).join(" ");

/** Macaron dentele avec texte */
export function Starburst({ children, className = "", fill = "fill-sun" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 h-full w-full">
        <polygon points={STARBURST_POINTS} className={fill} />
      </svg>
      {children && (
        <span className="relative px-[18%] text-center font-display text-[0.7rem] font-bold uppercase leading-tight text-navy sm:text-xs">
          {children}
        </span>
      )}
    </div>
  );
}
