import { Wave } from "./Decor";

/**
 * Bandeau navy en tete des pages interieures, termine par une vague
 * vers le fond creme. `children` s'affiche sous le sous-titre (actions, meta…).
 */
export default function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <header>
      <div className="relative overflow-hidden bg-navy px-4 pb-10 pt-12 md:px-8 md:pt-16">
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          {eyebrow && <p className="eyebrow mb-4 !text-sun">{eyebrow}</p>}
          <h1 className="max-w-3xl text-3xl font-bold leading-[1.15] text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
      <Wave flip className="-mt-px text-navy" />
    </header>
  );
}
