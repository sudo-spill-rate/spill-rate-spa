import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Share2, Copy, Check, ExternalLink, ChevronDown, X, QrCode } from "lucide-react";
import { useBodyScrollLock } from "../../../../hooks/useBodyScrollLock";
import StorefrontQrModal from "./StorefrontQrModal";

function FacebookIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function ShareStorefrontMenu({
  slug,
  businessName,
  logoUrl,
  isOwner = false,
  iconOnly = false,
  className = "",
  buttonClassName = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  // Lock body scroll only when sheet is open on mobile
  useBodyScrollLock(isOpen);

  const isAlreadyOnPublicPage = Boolean(slug && location.pathname.includes(`/business/${slug}`));
  const publicUrl = typeof window !== "undefined" && slug ? `${window.location.origin}/business/${slug}` : "";

  // Close when clicked outside on desktop
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Handle Share Trigger: Always open custom menu / mobile bottom sheet drawer
  const handleTriggerClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleShareFacebook = () => {
    if (!publicUrl) return;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`;
    window.open(fbUrl, "_blank", "width=626,height=436,noopener,noreferrer");
    setIsOpen(false);
  };

  const handleShareX = () => {
    if (!publicUrl) return;
    const text = `Check out ${businessName || "our storefront"} on SpillRate!`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400,noopener,noreferrer");
    setIsOpen(false);
  };

  const handleCopy = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleOpenQrModal = () => {
    setIsOpen(false);
    setIsQrModalOpen(true);
  };

  return (
    <>
      <div className={`relative ${className || (iconOnly ? "shrink-0" : "w-full sm:w-auto")}`} ref={menuRef}>
        {/* Trigger Button */}
        {iconOnly ? (
          <button
            type="button"
            onClick={handleTriggerClick}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            aria-label="Share"
            title="Share Storefront"
            className={buttonClassName || "p-2 sm:p-2.5 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer inline-flex items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-[38px] sm:min-h-[38px]"}
          >
            <Share2 className="w-4 h-4 text-slate-600" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleTriggerClick}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            className={buttonClassName || "w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-lg transition-colors min-h-[34px] sm:min-h-[36px] shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"}
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
            <span>Share</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        )}

        {/* Share Menu / Drawer */}
        {isOpen && (
          <>
            {/* Mobile Backdrop Overlay (only on small screens < sm) */}
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs sm:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Dialog Container: Bottom Sheet on Mobile, Popover on Desktop */}
            <div
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="share-storefront-title"
              className="fixed inset-x-0 bottom-0 z-50 p-4 bg-white rounded-t-2xl border-t border-slate-200 shadow-2xl sm:absolute sm:inset-auto sm:right-0 sm:bottom-auto sm:mt-1.5 sm:w-64 sm:rounded-xl sm:border sm:border-slate-200 sm:p-1.5 sm:shadow-lg sm:z-40 animate-fade-in"
            >
              {/* Mobile Sheet Header */}
              <div className="flex items-center justify-between pb-3 sm:pb-1.5 px-1 sm:px-2 border-b border-slate-100 sm:border-b-0">
                <span id="share-storefront-title" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Share Storefront
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="sm:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                  aria-label="Close share sheet"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Items List */}
              <div className="space-y-1 pt-2 sm:pt-0">
                {/* Share to Facebook */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleShareFacebook}
                  className="w-full flex items-center gap-3 px-3 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors text-left cursor-pointer min-h-[44px] sm:min-h-[36px]"
                >
                  <span className="w-8 h-8 sm:w-6 sm:h-6 rounded-lg bg-blue-50 text-[#1877F2] flex items-center justify-center shrink-0">
                    <FacebookIcon className="w-4 h-4" />
                  </span>
                  <span>Share to Facebook</span>
                </button>

                {/* Share to X (Twitter) */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleShareX}
                  className="w-full flex items-center gap-3 px-3 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors text-left cursor-pointer min-h-[44px] sm:min-h-[36px]"
                >
                  <span className="w-8 h-8 sm:w-6 sm:h-6 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center shrink-0">
                    <XIcon className="w-3.5 h-3.5" />
                  </span>
                  <span>Share to X</span>
                </button>

                {/* Copy Link */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleCopy}
                  className="w-full flex items-center gap-3 px-3 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors text-left cursor-pointer min-h-[44px] sm:min-h-[36px]"
                >
                  <span className="w-8 h-8 sm:w-6 sm:h-6 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    {copied ? (
                      <Check className="w-4 h-4 text-teal-600" aria-hidden="true" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                    )}
                  </span>
                  <span className={copied ? "text-teal-700 font-bold" : ""}>
                    {copied ? "Link Copied to Clipboard!" : "Copy Public Link"}
                  </span>
                </button>

                {/* Download QR Code (Only visible to verified business owner/founder) */}
                {isOwner && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleOpenQrModal}
                    className="w-full flex items-center gap-3 px-3 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors text-left cursor-pointer min-h-[44px] sm:min-h-[36px]"
                  >
                    <span className="w-8 h-8 sm:w-6 sm:h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                      <QrCode className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                    </span>
                    <span>Download QR Code</span>
                  </button>
                )}

                {!isAlreadyOnPublicPage && (
                  <>
                    <div className="my-1.5 border-t border-slate-100" />

                    {/* Open Public Page */}
                    <Link
                      to={`/business/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2.5 sm:py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors text-left min-h-[44px] sm:min-h-[36px]"
                    >
                      <span>Open Public Page</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* QR Code Modal */}
      <StorefrontQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        publicUrl={publicUrl}
        businessName={businessName}
        logoUrl={logoUrl}
      />
    </>
  );
}

