import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
      <p className="text-5xl font-semibold text-accent">404</p>
      <p className="text-sm text-muted">Cette page n'existe pas ou a ete deplacee.</p>
      <Link to="/" className="btn-primary">
        Retour a l'accueil
      </Link>
    </div>
  );
}
