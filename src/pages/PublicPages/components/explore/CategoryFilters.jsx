import React from "react";
import { Check } from "lucide-react";

export default function CategoryFilters({
  categories = [],
  selectedCategory = "",
  onSelectCategory,
}) {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      <div className="flex items-center justify-between mb-1 hidden lg:flex">
        <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Filter by Category
        </h2>
        {selectedCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory("")}
            className="text-[11px] text-teal-700 hover:text-teal-800 font-semibold cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Responsive layout: horizontal scroll pills on mobile, clean vertical stack on desktop */}
      <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 pb-1 lg:pb-0 scrollbar-none -mx-0.5 px-0.5">
        <button
          type="button"
          onClick={() => onSelectCategory("")}
          className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-left transition-colors whitespace-nowrap min-h-[38px] flex items-center justify-between shrink-0 lg:shrink focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer ${
            !selectedCategory
              ? "bg-slate-900 text-white font-semibold shadow-2xs"
              : "bg-white lg:bg-transparent text-slate-700 hover:bg-slate-100 border lg:border-0 border-slate-200"
          }`}
        >
          <span>All Categories</span>
          {!selectedCategory && (
            <span className="hidden lg:inline-block w-1.5 h-1.5 rounded-full bg-teal-400 ml-2" />
          )}
        </button>

        {categories.map((cat) => {
          const catName = typeof cat === "string" ? cat : cat.name;
          const catKey = typeof cat === "string" ? cat : cat.id || cat.slug || cat.name;
          const isSelected = selectedCategory.toLowerCase() === catName.toLowerCase();

          return (
            <button
              key={catKey}
              type="button"
              onClick={() => onSelectCategory(catName)}
              className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-left transition-colors whitespace-nowrap min-h-[38px] flex items-center justify-between shrink-0 lg:shrink focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer ${
                isSelected
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "bg-white lg:bg-transparent text-slate-700 hover:bg-slate-100 border lg:border-0 border-slate-200"
              }`}
            >
              <span>{catName}</span>
              {isSelected && (
                <Check className="w-3.5 h-3.5 text-teal-400 hidden lg:inline-block ml-2 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}