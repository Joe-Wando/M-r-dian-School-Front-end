import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import Logo from "../Logo";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../lib/format";

const LINKS = [
  { label: "Accueil", to: "/" },
  { label: "Catalogue de cours", to: "/catalogue" },
  { label: "Accompagnement", to: "/accompagnement" },
  { label: "A propos", to: "/profil" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const links = isAdmin ? [...LINKS, { label: "Tableau de bord", to: "/admin" }] : LINKS;

  function onSearch(e) {
    e.preventDefault();
    navigate(`/catalogue?q=${encodeURIComponent(q.trim())}`);
    setMobileOpen(false);
  }

  return (
    <div>
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-line bg-white px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          {/* Charte : navigation = icone seule, pas de mot a cote */}
          <Logo variant="icon" />
        </div>

        <form
          onSubmit={onSearch}
          className="hidden max-w-md flex-1 items-center gap-2 rounded-md bg-gray-100 px-3 py-2 md:flex"
        >
          <Search size={16} className="text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un cours"
            className="w-full bg-transparent text-sm outline-none"
            aria-label="Rechercher un cours"
          />
        </form>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-accent" : "text-gray-700 hover:text-ink"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden items-center gap-1.5 rounded-full border border-accent bg-accent-soft px-2.5 py-1.5 text-xs font-medium text-accent sm:flex"
            >
              <LayoutDashboard size={12} /> Admin
            </Link>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/mes-cours"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-medium text-white"
                title={user?.name}
              >
                {initials(user?.name)}
              </Link>
              <button onClick={logout} aria-label="Se deconnecter" className="text-muted hover:text-ink">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/connexion" className="text-sm font-medium text-gray-700 hover:text-ink">
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </header>

      {mobileOpen && (
        <div className="flex flex-col border-b border-line bg-white md:hidden">
          <form onSubmit={onSearch} className="flex items-center gap-2 border-b border-line px-4 py-3">
            <Search size={16} className="text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un cours"
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `border-t border-line px-4 py-3 text-left text-sm font-medium ${isActive ? "text-accent" : "text-gray-700"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
