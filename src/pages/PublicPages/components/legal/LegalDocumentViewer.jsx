import React from "react";
import { Link } from "react-router";
import PublicPageHeader from "../layout/PublicPageHeader";

export default function LegalDocumentViewer({
  title,
  lastUpdated,
  description,
  breadcrumbs = [],
  sections = [],
}) {
  return (
    <article itemScope itemType="https://schema.org/WebPage" className="bg-slate-50 min-h-screen">
      <PublicPageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        compact={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <main className="bg-white p-5 sm:p-8 lg:p-10 rounded-2xl border border-slate-200/90 shadow-xs">
          {lastUpdated && (
            <p className="text-xs text-slate-500 mb-6 pb-4 border-b border-slate-100">
              Last updated: {lastUpdated}
            </p>
          )}

          <div className="space-y-7 sm:space-y-8">
            {sections.map((section, idx) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 pb-6 sm:pb-7 border-b border-slate-100 last:border-0 last:pb-0"
              >
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 tracking-tight mb-3">
                  <span className="text-slate-400 mr-2">{idx + 1}.</span>
                  {section.heading}
                </h2>

                <div className="text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3">
                  {section.paragraphs &&
                    section.paragraphs.map((p, pIdx) => <p key={pIdx}>{p}</p>)}

                  {section.list && (
                    <ul className="space-y-2 mt-3 pl-1">
                      {section.list.map((item, itemIdx) => {
                        const colonIndex = item.indexOf(":");
                        const hasPrefix = colonIndex > 0 && colonIndex < 35;
                        const title = hasPrefix ? item.slice(0, colonIndex + 1) : "";
                        const content = hasPrefix ? item.slice(colonIndex + 1) : item;

                        return (
                          <li key={itemIdx} className="flex items-start gap-2">
                            <span className="text-teal-700 font-bold shrink-0 mt-0.5">•</span>
                            <span>
                              {hasPrefix && (
                                <strong className="font-semibold text-slate-900 mr-1">
                                  {title}
                                </strong>
                              )}
                              {content}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </section>
            ))}

            {/* End-of-document footer note */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
              <span>Terms apply to all users and visitors of SpillRate.</span>
              <Link
                to="/contact"
                className="font-medium text-teal-700 hover:text-teal-800 transition-colors inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded py-2 min-h-[44px]"
              >
                Have questions? Contact our team →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </article>
  );
}