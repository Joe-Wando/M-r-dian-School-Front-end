import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({ message = "Une erreur est survenue.", onRetry }) {
  return (
    <div className="mx-auto my-10 flex max-w-md flex-col items-center gap-3 card p-8 text-center">
      <AlertCircle size={22} className="text-red-500" />
      <p className="text-sm text-navy">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline !px-4 !py-2">
          <RefreshCw size={14} /> Reessayer
        </button>
      )}
    </div>
  );
}
