import React from "react";
import { Link } from "react-router";

/**
 * Unified Navbar Brand Logo Component
 *
 * @param {Object} props
 * @param {string} [props.to="/"] - Target navigation path
 * @param {string} [props.badgeText] - Optional portal label (e.g., "Owner Portal", "Founder Hub")
 * @param {Function} [props.onClick] - Optional click handler (e.g., close mobile drawer)
 * @param {string} [props.className=""] - Extra wrapper styling
 */
export default function NavbarBrandLogo({
  to = "/",
  badgeText,
  onClick,
  className = "",
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 sm:gap-2.5 focus:outline-none focus:ring-2 focus:ring-teal-700 rounded-lg p-1 min-h-[44px] min-w-0 ${className}`}
      aria-label={badgeText ? `SpillRate ${badgeText}` : "SpillRate Home"}
    >
      <img
        src="/logo.png"
        alt="SpillRate Logo"
        className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
      />
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
          Spill<span className="text-teal-700">Rate</span>
        </span>
        {badgeText && (
          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200/90 rounded-full shrink-0">
            {badgeText}
          </span>
        )}
      </div>
    </Link>
  );
}
