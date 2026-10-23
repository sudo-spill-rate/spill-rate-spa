import React from "react";

const TREND_VARIANTS = {
  positive: "bg-teal-50 text-teal-800 border-teal-200/80",
  warning: "bg-amber-50 text-amber-800 border-amber-200/80",
  danger: "bg-red-50 text-red-800 border-red-200/80",
  neutral: "bg-slate-100 text-slate-700 border-slate-200/80",
};

/**
 * Reusable Metric / Stat Card component.
 * Adheres to WCAG AA contrast standards, Anti-AI-Slop typography, and responsive layout rhythm.
 *
 * @param {Object} props
 * @param {string|React.ReactNode} props.title - Metric heading / title
 * @param {string|number|React.ReactNode} props.value - Primary stat number / display
 * @param {string|React.ReactNode} [props.subtitle] - Supporting description or caption
 * @param {React.ReactNode} [props.secondaryValue] - Inline secondary label next to value (e.g. "/ 5 quota")
 * @param {React.ComponentType} [props.icon] - Optional Lucide icon component
 * @param {string} [props.trend] - Optional trend or status badge pill text (e.g. "+5% new")
 * @param {"positive"|"warning"|"danger"|"neutral"} [props.trendType="neutral"] - Badge color palette
 * @param {string} [props.className=""] - Additional container classes
 * @param {React.ReactNode} [props.children] - Additional child content
 */
export default function StatCard({
  title,
  value,
  subtitle,
  secondaryValue,
  icon: Icon,
  trend,
  trendType = "neutral",
  className = "",
  children,
}) {
  const trendClass = TREND_VARIANTS[trendType] || TREND_VARIANTS.neutral;

  // Detect whether value is a number/short metric vs long text title
  const isTextualValue =
    typeof value === "string" &&
    (value.length > 7 || (isNaN(Number(value)) && !value.includes("%")));

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/90 p-2.5 sm:p-4 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between h-full min-h-[92px] sm:min-h-[105px] ${className}`}
    >
      <div>
        {/* Header: Title + Optional Icon / Trend Pill */}
        <div className="flex items-center justify-between gap-1.5 mb-0.5 sm:mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            {Icon && (
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
              </div>
            )}
            <h3
              className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate"
              title={typeof title === "string" ? title : undefined}
            >
              {title}
            </h3>
          </div>

          {trend && (
            <span
              className={`text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.2 rounded-full border shrink-0 ${trendClass}`}
            >
              {trend}
            </span>
          )}
        </div>

        {/* Metric Value: Fixed baseline-aligned container (h-7 sm:h-8) to guarantee equal height */}
        <div className="h-7 sm:h-8 flex items-center mt-0.5 sm:mt-1">
          {isTextualValue ? (
            <div
              className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight line-clamp-2 leading-snug break-words"
              title={String(value)}
            >
              {value}
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <div className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums leading-none">
                {value}
              </div>
              {secondaryValue && (
                <div className="shrink-0 text-[10px] sm:text-xs text-slate-500 font-medium">
                  {secondaryValue}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Subtitle / Description Footer with tight white space */}
      {(subtitle || children) && (
        <div className="mt-1.5 sm:mt-2 pt-1 sm:pt-1.5 border-t border-slate-100 text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 flex items-center justify-between">
          <span className="truncate">{subtitle}</span>
          {children}
        </div>
      )}
    </div>
  );
}
