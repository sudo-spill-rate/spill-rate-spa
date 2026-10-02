import React from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

export default function PublicPageHeader({ title, description, breadcrumbs = [], children }) {
  return (
    <div className="bg-white border-b border-slate-200/80 py-6 sm:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-3 sm:mb-4">
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

        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="mt-2 sm:mt-2.5 text-xs sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
        {children && (
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}