import { CheckCircle2 } from "lucide-react";
import Logo from "../Logo";
import { Starburst, Underlined } from "./Decor";

const PERKS = ["Cours gratuits pour demarrer", "Suivi de ta progression", "Mentorat et corrections a la demande"];

/** Cadre commun Connexion / Inscription : colonne navy inspirante + formulaire. */
export default function AuthShell({ title, children }) {
  return (
    <div className="px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-navy/10 md:grid-cols-5">
        <aside className="relative hidden overflow-hidden bg-navy p-10 text-white md:col-span-2 md:flex md:flex-col md:justify-between">
          <div>
            <p className="font-display text-3xl font-bold leading-[1.25]">
              Apprends <Underlined>a ton rythme</Underlined>
            </p>
            <ul className="mt-10 space-y-4 text-sm font-medium">
              {PERKS.map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="shrink-0 text-sun" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <Starburst className="relative mt-10 h-28 w-28 self-end rotate-12">Bienvenue</Starburst>
        </aside>

        <div className="flex flex-col gap-6 p-6 sm:p-10 md:col-span-3 md:p-12">
          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mist">
              <Logo variant="icon" to={null} />
            </span>
            <h1 className="text-2xl font-bold text-navy sm:text-3xl">{title}</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
