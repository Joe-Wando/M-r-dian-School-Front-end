import { Link } from "react-router-dom";
import { Starburst, Swirl } from "../components/ui/Decor";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-24 text-center">
      <div className="relative">
        <p className="font-display text-8xl font-extrabold text-navy">404</p>
        <Starburst className="absolute -right-14 -top-8 h-20 w-20 rotate-12">Oups</Starburst>
        <Swirl className="absolute -left-12 bottom-0 h-12 w-10 text-accent" />
      </div>
      <p className="text-muted">Cette page n'existe pas ou a ete deplacee.</p>
      <Link to="/" className="btn-primary">
        Retour a l'accueil
      </Link>
    </div>
  );
}
