import React from "react";

export default function CategoryFilters({
  categories = [],
  selectedCategory = "",
  onSelectCategory,
}) {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1 hidden lg:block">
        Filter by Category
      </h2>

      {/* Responsive layout: horizontal scroll pills on mobile, clean vertical stack on desktop */}
      <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 pb-1 lg:pb-0 scrollbar-none -mx-0.5 px-0.5">
        <button
          type="button"
          onClick={() => onSelectCategory("")}
          className={`px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-left transition-colors whitespace-nowrap min-h-[38px] flex items-center justify-between shrink-0 lg:shrink focus:outline-none focus:ring-2 focus:ring-teal-600 ${
            !selectedCategory
              ? "bg-slate-900 text-white font-semibold"
              : "bg-white lg:bg-transparent text-slate-700 hover:bg-slate-100 border lg:border-0 border-slate-200"
          }`}
        >
          <span>All Categories</span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-left transition-colors whitespace-nowrap min-h-[38px] flex items-center justify-between shrink-0 lg:shrink focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                isSelected
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-white lg:bg-transparent text-slate-700 hover:bg-slate-100 border lg:border-0 border-slate-200"
              }`}
            >
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}