import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import PublicPageHeader from "../layout/PublicPageHeader";

export default function LegalDocumentViewer({
  title,
  lastUpdated,
  description,
  breadcrumbs = [],
  sections = [],
}) {
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  return (
    <div>
      <PublicPageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Table of Contents */}
          <aside className="lg:col-span-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wide text-slate-900">
                    Document Sections
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Last updated: {lastUpdated}
                  </p>
                </div>
                {/* Mobile toggle button */}
                <button
                  type="button"
                  onClick={() => setMobileTocOpen(!mobileTocOpen)}
                  className="lg:hidden p-1.5 text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
                  aria-label="Toggle document contents"
                  aria-expanded={mobileTocOpen}
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileTocOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* Navigation list (always visible on desktop, toggled on mobile) */}
              <nav
                aria-label="Table of Contents"
                className={`mt-4 pt-3 border-t border-slate-100 ${mobileTocOpen ? "block" : "hidden lg:block"}`}
              >
                <ol className="space-y-2 text-xs sm:text-sm">
                  {sections.map((section, idx) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={() => setMobileTocOpen(false)}
                        className="text-slate-600 hover:text-teal-800 transition-colors block py-1 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
                      >
                        {idx + 1}. {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>

          {/* Document Content */}
          <main className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-xl border border-slate-200 shadow-xs">
            <div className="space-y-10">
              {sections.map((section, idx) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 pt-2 border-b border-slate-100 last:border-0 pb-8 last:pb-0"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                    {idx + 1}. {section.heading}
                  </h2>
                  <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 max-w-prose">
                    {section.paragraphs &&
                      section.paragraphs.map((p, pIdx) => <p key={pIdx}>{p}</p>)}

                    {section.list && (
                      <ul className="list-disc pl-5 space-y-1.5 mt-2">
                        {section.list.map((item, itemIdx) => (
                          <li key={itemIdx}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}