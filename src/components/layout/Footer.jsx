import Logo from "../Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* Charte : le wordmark complet apparait ici, une seule fois par ecran, en pied de page */}
        <Logo variant="word" muted />
        <p className="text-xs text-muted">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
