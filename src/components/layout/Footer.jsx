import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import Logo from "../Logo";
import { Wave } from "../ui/Decor";

const NAV = [
  { label: "Accueil", to: "/" },
  { label: "Catalogue de cours", to: "/catalogue" },
  { label: "Accompagnement", to: "/accompagnement" },
  { label: "A propos", to: "/profil" },
  { label: "Contact", to: "/contact" },
];

const SUBJECTS = ["Histoire", "Droit", "Informatique", "RH"];

const columnTitle = "font-display text-xs font-bold uppercase tracking-widest text-white";

export default function Footer() {
  return (
    <footer className="mt-16 text-white/75">
      <Wave className="text-navy" />
      <div className="-mt-px bg-navy">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 md:px-8">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            {/* Charte : le wordmark complet apparait ici, une seule fois par ecran, en pied de page */}
            <span className="rounded-full bg-white px-4 py-2">
              <Logo variant="word" />
            </span>
            <Link to="/catalogue" className="btn-accent">
              Commencer gratuitement
            </Link>
          </div>

          <div className="mt-12 grid gap-10 text-center sm:grid-cols-3 sm:text-left">
            <nav aria-label="Navigation">
              <h3 className={columnTitle}>Navigation</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {NAV.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="transition hover:text-sun">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h3 className={columnTitle}>Matieres</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {SUBJECTS.map((s) => (
                  <li key={s}>
                    <Link to={`/catalogue?category=${s}`} className="transition hover:text-sun">
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className={columnTitle}>Contact</h3>
              <ul className="mt-5 space-y-4 text-sm">
                <li>
                  <a
                    href="mailto:jonathan6wando@gmail.com"
                    className="inline-flex items-center gap-2 break-all transition hover:text-sun"
                  >
                    <Mail size={15} className="shrink-0 text-sun" /> jonathan6wando@gmail.com
                  </a>
                </li>
                <li className="inline-flex items-center gap-2">
                  <MapPin size={15} className="text-sun" /> Dakar, Senegal
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/45">
            © {new Date().getFullYear()} — Tous droits reserves.
          </div>
        </div>
      </div>
    </footer>
  );
}
