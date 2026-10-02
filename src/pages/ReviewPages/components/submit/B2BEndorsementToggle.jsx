import React from "react";
import { Building2 } from "lucide-react";

export default function B2BEndorsementToggle({
  isB2B = false,
  onToggle,
  businessId = "",
  onBusinessIdChange,
  disabled = false,
}) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
      <div className="flex items-start gap-3">
        <input
          id="b2b-toggle"
          type="checkbox"
          checked={isB2B}
          disabled={disabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="mt-1 w-4 h-4 rounded text-teal-700 border-slate-300 focus:ring-teal-600 cursor-pointer"
        />
        <label htmlFor="b2b-toggle" className="text-xs sm:text-sm text-slate-800 cursor-pointer select-none">
          <span className="font-semibold block">Business-to-Business (B2B) Endorsement</span>
          <span className="text-xs text-slate-500 block mt-0.5 leading-relaxed">
            Check this if you represent a corporate client, supplier, or commercial partner reviewing this establishment.
          </span>
        </label>
      </div>

      {isB2B && (
        <div className="pt-2 border-t border-slate-200 space-y-1.5 animate-in fade-in">
          <label htmlFor="b2b-business-id" className="block text-xs font-semibold text-slate-700">
            Your Business ID or Name
          </label>
          <div className="relative flex items-center">
            <Building2 className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="b2b-business-id"
              type="text"
              value={businessId}
              disabled={disabled}
              onChange={(e) => onBusinessIdChange(e.target.value)}
              placeholder="e.g. Acme Supplies Corp"
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}