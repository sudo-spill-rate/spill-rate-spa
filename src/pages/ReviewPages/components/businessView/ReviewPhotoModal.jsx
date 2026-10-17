import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useBodyScrollLock } from "../../../../hooks/useBodyScrollLock";

export default function ReviewPhotoModal({
  imageUrl,
  imageUrls = [],
  initialIndex = 0,
  alt = "Review photo",
  onClose,
}) {
  const gallery =
    Array.isArray(imageUrls) && imageUrls.length > 0
      ? imageUrls
      : imageUrl
      ? [imageUrl]
      : [];

  const [currentIndex, setCurrentIndex] = useState(() =>
    initialIndex >= 0 && initialIndex < gallery.length ? initialIndex : 0
  );

  useBodyScrollLock(gallery.length > 0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && gallery.length > 1) {
        setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight" && gallery.length > 1) {
        setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, gallery.length]);

  if (gallery.length === 0) return null;

  const activeSrc = gallery[currentIndex] || gallery[0];
  const hasMultiple = gallery.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged review photo"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Counter Badge (for 2 or 3+ photos) */}
        {hasMultiple && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-xs font-semibold">
            {currentIndex + 1} / {gallery.length}
          </div>
        )}

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo preview"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Previous Photo Button */}
        {hasMultiple && (
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
            }
            aria-label="Previous photo"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Next Photo Button */}
        {hasMultiple && (
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
            }
            aria-label="Next photo"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <img
          src={activeSrc}
          alt={`${alt} ${currentIndex + 1}`}
          className="w-full max-h-[80vh] object-contain bg-slate-950 mx-auto"
        />
      </div>
    </div>
  );
}