import { Link } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import Logo from "../Logo";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../lib/format";

/**
 * Coquille dediee au dashboard admin : distincte du site public
 * (pas de Navbar/Footer marketing), pour bien marquer l'espace de gestion.
 */
export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-full bg-slate-100">
      <header className="flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-900 px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <Logo variant="icon" to="/admin" muted />
          <span className="text-sm font-semibold tracking-tight text-white">
            Meredian <span className="font-normal text-slate-400">— Admin</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white"
          >
            <ArrowLeft size={14} /> Retour au site
          </Link>
          <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-xs font-medium text-white">
              {initials(user?.name)}
            </span>
            <button
              onClick={logout}
              aria-label="Se deconnecter"
              className="text-slate-400 hover:text-white"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
