import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useBodyScrollLock } from "../../../../hooks/useBodyScrollLock";

export default function ReviewPhotoModal({ imageUrl, alt = "Review photo", onClose }) {
  useBodyScrollLock(Boolean(imageUrl));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged review photo"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo preview"
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <X className="w-5 h-5" />
        </button>
        <img
          src={imageUrl}
          alt={alt}
          className="w-full max-h-[80vh] object-contain bg-slate-950"
        />
      </div>
    </div>
  );
}