import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import Logo from "../Logo";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../lib/format";

const LINKS = [
  { label: "Accueil", to: "/" },
  { label: "Catalogue", to: "/catalogue" },
  { label: "Accompagnement", to: "/accompagnement" },
  { label: "A propos", to: "/profil" },
  { label: "Contact", to: "/contact" },
];

// Pages qui commencent par un bandeau navy : la barre s'y fond tant qu'on n'a pas defile.
const DARK_TOP = [/^\/$/, /^\/catalogue$/, /^\/accompagnement$/, /^\/profil$/, /^\/contact$/, /^\/mes-cours$/, /^\/cours\/[^/]+$/];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const dark = DARK_TOP.some((re) => re.test(pathname)) && !scrolled && !mobileOpen;
  const links = isAdmin ? [...LINKS, { label: "Tableau de bord", to: "/admin" }] : LINKS;

  function onSearch(e) {
    e.preventDefault();
    navigate(`/catalogue?q=${encodeURIComponent(q.trim())}`);
    setMobileOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        dark ? "bg-navy" : "border-b border-navy/10 bg-ground/95 shadow-sm backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <button
            className={`flex h-10 w-10 items-center justify-center rounded-full border lg:hidden ${
              dark ? "border-white/30 text-white" : "border-navy/15 text-navy"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {/* Charte : navigation = icone seule, pas de mot a cote */}
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md">
            <Logo variant="icon" />
          </span>
        </div>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `group relative font-display text-[13px] font-semibold transition ${
                  dark ? "text-white hover:text-sun" : "text-navy hover:text-accent"
                } ${isActive ? "" : "opacity-90"}`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-[3px] rounded-full transition-all duration-300 ${
                      dark ? "bg-sun" : "bg-accent"
                    } ${isActive ? "w-full" : "w-0 group-hover:w-1/2"}`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <form
            onSubmit={onSearch}
            className={`hidden items-center gap-2 rounded-full px-4 py-2.5 xl:flex ${
              dark ? "bg-white/10 text-white" : "bg-mist text-navy"
            }`}
          >
            <Search size={15} className="opacity-60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un cours"
              className={`w-40 bg-transparent text-sm outline-none ${
                dark ? "placeholder:text-white/50" : "placeholder:text-navy/40"
              }`}
              aria-label="Rechercher un cours"
            />
          </form>

          {isAdmin && (
            <Link
              to="/admin"
              className="hidden items-center gap-1.5 rounded-full bg-sun px-3 py-2 font-display text-xs font-semibold text-navy sm:flex"
            >
              <LayoutDashboard size={13} /> Admin
            </Link>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/mes-cours"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-display text-sm font-semibold text-white ring-2 ring-white/60"
                title={user?.name}
              >
                {initials(user?.name)}
              </Link>
              <button
                onClick={logout}
                aria-label="Se deconnecter"
                className={dark ? "text-white/70 hover:text-white" : "text-muted hover:text-navy"}
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/connexion"
                className={`hidden rounded-full px-4 py-2.5 font-display text-[13px] font-semibold transition sm:inline-flex ${
                  dark ? "text-white hover:bg-white/10" : "text-navy hover:bg-mist"
                }`}
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="rounded-full bg-accent px-5 py-2.5 font-display text-[13px] font-semibold text-white shadow-lg shadow-accent/25 transition hover:-translate-y-0.5"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-4.5rem)] overflow-y-auto px-4 pb-6 lg:hidden">
          <form onSubmit={onSearch} className="mb-3 flex items-center gap-2 rounded-full bg-mist px-4 py-3">
            <Search size={15} className="text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un cours"
              className="w-full bg-transparent text-sm outline-none"
              aria-label="Rechercher un cours"
            />
          </form>
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `block rounded-2xl px-4 py-3 font-display text-sm font-semibold ${
                      isActive ? "bg-accent-soft text-navy" : "text-navy/80"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          {!isAuthenticated && (
            <Link to="/connexion" className="btn-outline mt-4 w-full">
              Connexion
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
