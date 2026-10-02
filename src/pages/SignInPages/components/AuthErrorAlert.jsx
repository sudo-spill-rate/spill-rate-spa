import React from "react";
import { AlertCircle } from "lucide-react";

export default function AuthErrorAlert({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3"
    >
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        <p className="font-semibold text-red-900">Authentication Error</p>
        <p className="mt-0.5 leading-relaxed">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-600 rounded px-1"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}