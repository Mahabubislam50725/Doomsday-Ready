import { AlertCircle, X } from "lucide-react";

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 bg-red-950/60 border border-red-800/60 rounded-xl px-4 py-3">
      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
      <p className="text-red-300 text-sm flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-500 hover:text-red-300 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
