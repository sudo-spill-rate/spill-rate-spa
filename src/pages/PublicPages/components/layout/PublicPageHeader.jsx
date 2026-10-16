import React from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

export default function PublicPageHeader({
  title,
  description,
  breadcrumbs = [],
  children,
  compact = false,
  containerClassName = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
}) {
  return (
    <div className={`bg-white border-b border-slate-200/80 ${compact ? "py-3 sm:py-4" : "py-4 sm:py-6 lg:py-7"}`}>
      <div className={containerClassName}>
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2 sm:mb-2.5">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li key={crumb.label} className="flex items-center gap-1.5">
                    {idx > 0 && (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    )}
                    {isLast || !crumb.href ? (
                      <span className="font-medium text-slate-900" aria-current={isLast ? "page" : undefined}>
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        to={crumb.href}
                        className="hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
        {children && (
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}