import React from "react";

const TREND_VARIANTS = {
  positive: "bg-teal-50 text-teal-800 border-teal-200/80",
  warning: "bg-amber-50 text-amber-800 border-amber-200/80",
  danger: "bg-red-50 text-red-800 border-red-200/80",
  neutral: "bg-slate-100 text-slate-700 border-slate-200/80",
};

/**
 * Reusable Metric / Stat Card component.
 * Adheres to WCAG AA contrast standards, Anti-AI-Slop typography and responsive layout rhythm.
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

  return (
    <div
      className={`bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors ${className}`}
    >
      <div>
        {/* Header: Title + Optional Icon / Trend Pill */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            {Icon && (
              <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
            )}
            <h3 className="text-xs font-semibold text-slate-600 truncate">
              {title}
            </h3>
          </div>

          {trend && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${trendClass}`}
            >
              {trend}
            </span>
          )}
        </div>

        {/* Metric Value */}
        <div className="flex items-baseline gap-1 mt-1">
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums leading-none">
            {value}
          </div>
          {secondaryValue && (
            <div className="shrink-0">{secondaryValue}</div>
          )}
        </div>
      </div>

      {/* Subtitle / Description Footer */}
      {(subtitle || children) && (
        <div className="mt-2 pt-2 border-t border-slate-100/90 text-[11px] sm:text-xs text-slate-500 line-clamp-1">
          {subtitle}
          {children}
        </div>
      )}
    </div>
  );
}
