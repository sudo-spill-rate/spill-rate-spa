import React from "react";

const TREND_VARIANTS = {
  positive: "bg-teal-50 text-teal-800 border-teal-200/80",
  warning: "bg-amber-50 text-amber-800 border-amber-200/80",
  danger: "bg-red-50 text-red-800 border-red-200/80",
  neutral: "bg-slate-100 text-slate-700 border-slate-200/80",
};

/**
 * High-Density Mobile Key-Value Metrics List.
 * Replaces cramped 2x2 grids on small screens with a full-width telemetry row layout.
 *
 * @param {Object} props
 * @param {Array<{
 *   title: string,
 *   value: string|number,
 *   subtitle?: string,
 *   icon?: React.ComponentType,
 *   trend?: string,
 *   trendType?: "positive"|"warning"|"danger"|"neutral"
 * }>} props.items - List of metrics to display
 * @param {string} [props.className] - Additional wrapper class names
 */
export default function MobileMetricsList({ items = [], className = "" }) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={`sm:hidden bg-white rounded-xl border border-slate-200/90 p-2.5 shadow-2xs space-y-1.5 ${className}`}
      aria-label="Key telemetry summary"
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        const trendClass = TREND_VARIANTS[item.trendType] || TREND_VARIANTS.neutral;

        return (
          <div
            key={idx}
            className="flex items-center justify-between py-2 px-2.5 rounded-lg bg-slate-50/70 border border-slate-200/80 gap-3"
          >
            {/* Left Column: Icon + Full Label + Subtext without ellipsis */}
            <div className="flex items-center gap-2.5 min-w-0">
              {Icon && (
                <div className="w-7 h-7 rounded-md bg-white border border-slate-200/80 flex items-center justify-center shrink-0 text-slate-600">
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
              )}
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-800 block leading-tight">
                  {item.title}
                </span>
                {item.subtitle && (
                  <span className="text-[10px] text-slate-500 block mt-0.5 leading-tight">
                    {item.subtitle}
                  </span>
                )}
              </div>
            </div>

            {/* Right Column: Bold Numerical Value + Status Badge */}
            <div
              className="flex items-center gap-1.5 shrink-0 text-right max-w-[55%]"
              title={
                item.tooltip ||
                (typeof item.value === "string" || typeof item.value === "number"
                  ? String(item.value)
                  : undefined)
              }
            >
              <span className="text-sm font-bold text-slate-900 tabular-nums truncate">
                {item.value}
              </span>
              {item.trend && (
                <span
                  className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full border shrink-0 ${trendClass}`}
                >
                  {item.trend}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
