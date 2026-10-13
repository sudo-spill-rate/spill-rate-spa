import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Share2, Copy, Check, ExternalLink, ChevronDown } from "lucide-react";

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

export default function ShareStorefrontMenu({ slug, businessName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  const publicUrl = typeof window !== "undefined" && slug ? `${window.location.origin}/business/${slug}` : "";

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
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

  const handleShareFacebook = () => {
    if (!publicUrl) return;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`;
    window.open(fbUrl, "_blank", "width=626,height=436,noopener,noreferrer");
    setIsOpen(false);
  };

  const handleShareX = () => {
    if (!publicUrl) return;
    const text = `Check out ${businessName || "our storefront"} on Balangay!`;
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
      // Fallback if clipboard API denied
    }
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-lg transition-colors min-h-[44px] shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-600"
      >
        <Share2 className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
        <span>Share</span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-56 sm:w-60 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-40"
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Share Storefront
          </div>

          {/* Share to Facebook */}
          <button
            type="button"
            role="menuitem"
            onClick={handleShareFacebook}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-left"
          >
            <span className="text-[#1877F2] shrink-0">
              <FacebookIcon className="w-4 h-4" />
            </span>
            <span>Share to Facebook</span>
          </button>

          {/* Share to X (Twitter) */}
          <button
            type="button"
            role="menuitem"
            onClick={handleShareX}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-left"
          >
            <span className="text-slate-900 shrink-0">
              <XIcon className="w-4 h-4" />
            </span>
            <span>Share to X</span>
          </button>

          {/* Copy Link */}
          <button
            type="button"
            role="menuitem"
            onClick={handleCopy}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-left"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-teal-600 shrink-0" aria-hidden="true" />
                <span className="text-teal-700 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <div className="my-1 border-t border-slate-100" />

          {/* Open Public Page */}
          <Link
            to={`/business/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-left"
          >
            <span>Open Public Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
