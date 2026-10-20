import React from "react";

/**
 * Accessible Segmented Tabs / Filter Tabs component.
 * Adheres to WCAG AA, Anti-AI-Slop, and mobile-responsive layout standards.
 *
 * @param {Object} props
 * @param {Array<{ id: string, label: string, count?: number|string, icon?: React.ComponentType, badgeColor?: string }>} props.tabs - Tab options
 * @param {string} props.activeTab - Currently selected tab id
 * @param {(id: string) => void} props.onChange - Selection callback
 * @param {"pill"|"underline"} [props.variant="pill"] - Visual style variant
 * @param {"sm"|"md"} [props.size="sm"] - Size preset
 * @param {boolean} [props.fullWidth=false] - Whether tabs should expand to fill container width
 * @param {string} [props.className=""] - Additional outer container classes
 * @param {string} [props.ariaLabel="Filter options"] - Accessible label for the tablist
 */
export default function SegmentedTabs({
  tabs = [],
  activeTab,
  onChange,
  variant = "pill",
  size = "sm",
  fullWidth = false,
  className = "",
  ariaLabel = "Filter options",
}) {
  if (!tabs || tabs.length === 0) return null;

  const isUnderline = variant === "underline";

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex items-center overflow-x-auto scrollbar-none ${
        isUnderline
          ? "border-b border-slate-200/90 gap-1 sm:gap-2"
          : "bg-slate-100 p-1 rounded-xl gap-1 shadow-2xs"
      } ${fullWidth ? "w-full" : "inline-flex"} ${className}`}
    >
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;
        const Icon = tab.icon;
        const hasCount = tab.count !== undefined && tab.count !== null;

        const sizeClasses =
          size === "md"
            ? "px-3.5 py-2 text-xs sm:text-sm min-h-[42px]"
            : "px-3 py-1.5 text-xs min-h-[36px]";

        const buttonStyle = isUnderline
          ? isSelected
            ? "border-b-2 border-teal-700 text-teal-900 font-bold bg-teal-50/20"
            : "border-b-2 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50/60 font-semibold"
          : isSelected
          ? "bg-white text-slate-900 shadow-2xs font-bold"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium";

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isSelected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange && onChange(tab.id)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1 shrink-0 ${
              fullWidth ? "flex-1" : ""
            } ${sizeClasses} ${buttonStyle}`}
          >
            {Icon && (
              <Icon
                className={`w-3.5 h-3.5 shrink-0 ${
                  isSelected ? "text-teal-700" : "text-slate-400"
                }`}
                aria-hidden="true"
              />
            )}

            <span>{tab.label}</span>

            {hasCount && (
              <span
                className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold tabular-nums transition-colors ${
                  isSelected
                    ? isUnderline
                      ? "bg-teal-100 text-teal-900"
                      : "bg-slate-900 text-white"
                    : "bg-slate-200/80 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
