import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({ message = "Une erreur est survenue.", onRetry }) {
  return (
    <div className="mx-auto my-10 flex max-w-md flex-col items-center gap-3 rounded-lg border border-line bg-white p-6 text-center">
      <AlertCircle size={22} className="text-red-500" />
      <p className="text-sm text-gray-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline !px-3 !py-2">
          <RefreshCw size={14} /> Reessayer
        </button>
      )}
    </div>
  );
}
