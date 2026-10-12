import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ title, onClose, children, size = "md" }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const maxW = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-xl" }[size] || "max-w-lg";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(11,31,77,0.55)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxW} overflow-hidden rounded-3xl bg-white shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <span className="font-display text-sm font-semibold text-navy">{title}</span>
          <button onClick={onClose} aria-label="Fermer" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-mist">
            <X size={18} className="text-muted" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
