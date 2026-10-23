import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

/**
 * Reusable accessible modal dialog base following WCAG AA and Anti-AI-Slop standards.
 * Guaranteed vertical and horizontal centering with zero unwanted top white space.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {function} props.onClose - Callback invoked when close is triggered
 * @param {string|React.ReactNode} [props.title] - Modal heading
 * @param {string|React.ReactNode} [props.description] - Subtitle under title
 * @param {React.ReactNode} [props.icon] - Header icon
 * @param {string} [props.titleId="modal-dialog-title"] - Custom id for aria-labelledby
 * @param {string} [props.maxWidth="max-w-md"] - Tailwind max width class
 * @param {boolean} [props.showCloseButton=true] - Whether to show close button
 * @param {boolean} [props.closeOnBackdrop=true] - Whether clicking the backdrop calls onClose
 * @param {boolean} [props.closeOnEscape=true] - Whether pressing Escape calls onClose
 * @param {boolean} [props.isProcessing=false] - Disables close when an async mutation is in flight
 * @param {string} [props.className=""] - Additional class names for the card container
 * @param {string} [props.headerClassName=""] - Additional class names for header
 * @param {React.ReactNode} [props.headerContent] - Fully custom header override
 * @param {React.ReactNode} props.children - Modal body content
 */
export default function BaseModal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  titleId = "modal-dialog-title",
  maxWidth = "max-w-md",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  isProcessing = false,
  className = "",
  headerClassName = "",
  headerContent,
  children,
}) {
  useBodyScrollLock(isOpen);
  const cardRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  // Accessible keyboard handling: Escape to close and Tab focus trapping within dialog
  useEffect(() => {
    if (!isOpen) return;

    if (typeof document !== "undefined") {
      previouslyFocusedElement.current = document.activeElement;
    }

    const card = cardRef.current;
    if (!card) return;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Move initial focus into modal
    const focusableElements = Array.from(card.querySelectorAll(focusableSelector)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement
    );

    if (focusableElements.length > 0) {
      const timer = setTimeout(() => {
        focusableElements[0]?.focus();
      }, 10);
      return () => clearTimeout(timer);
    } else {
      card.setAttribute("tabindex", "-1");
      card.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (closeOnEscape && !isProcessing) {
          onClose();
        }
        return;
      }

      if (e.key === "Tab") {
        const currentFocusables = Array.from(card.querySelectorAll(focusableSelector)).filter(
          (el) => el.offsetParent !== null || el === document.activeElement
        );

        if (currentFocusables.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = currentFocusables[0];
        const lastElement = currentFocusables[currentFocusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !card.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !card.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (
        previouslyFocusedElement.current &&
        typeof previouslyFocusedElement.current.focus === "function"
      ) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isOpen, closeOnEscape, isProcessing, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop && !isProcessing) {
      onClose();
    }
  };

  const hasTitleOrCustomHeader = Boolean(headerContent || title);
  const hasCustomPadding = /\bp-\d+|\bpx-\d+|\bpy-\d+/.test(className);

  const modalNode = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      className="fixed inset-0 z-[100] isolate"
    >
      {/* 1. Backdrop overlay: strictly fixed to 100vw x 100vh, covers all sticky headers/navbars, never scrolls */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-150"
        aria-hidden="true"
        onClick={handleBackdropClick}
      />

      {/* 2. Scroll container: fixed to viewport, handles vertical & horizontal centering without moving backdrop */}
      <div
        className="fixed inset-0 overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <div className="flex min-h-full items-center justify-center p-3.5 sm:p-4 text-center">
          <div
            ref={cardRef}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${maxWidth} transform rounded-xl sm:rounded-2xl bg-white text-left shadow-2xl border border-slate-200/90 transition-all animate-in fade-in zoom-in-95 duration-150 my-auto ${
              hasCustomPadding ? "" : "p-4 sm:p-6"
            } ${className}`}
          >
            {/* Case 1: Custom Header Override */}
            {headerContent}

            {/* Case 2: Standard Modal Header with Title */}
            {!headerContent && title && (
              <div
                className={`flex items-start justify-between gap-3 pb-3 sm:pb-3.5 border-b border-slate-100 ${headerClassName}`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
                  <div className="min-w-0">
                    <h2
                      id={titleId}
                      className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug truncate"
                    >
                      {title}
                    </h2>
                    {description && (
                      <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isProcessing}
                    aria-label="Close dialog"
                    className="p-2 text-slate-400 hover:text-slate-700 active:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed -mr-1.5 -mt-1.5"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}

            {/* Case 3: No Title, but Show Close Button (Floating top-right to prevent blank header bar) */}
            {!hasTitleOrCustomHeader && showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                aria-label="Close dialog"
                className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-2 text-slate-400 hover:text-slate-700 active:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            )}

            {/* Modal Body Content */}
            <div className={hasTitleOrCustomHeader ? "pt-3 sm:pt-3.5 flex-1 min-h-0 flex flex-col" : "flex-1 min-h-0 flex flex-col"}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return modalNode;
  }

  return createPortal(modalNode, document.body);
}
