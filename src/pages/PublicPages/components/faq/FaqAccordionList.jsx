import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordionList({ items = [] }) {
  // Store expanded question keys, default open first item
  const [openItems, setOpenItems] = useState(
    items.length > 0 ? [items[0].question] : []
  );

  const toggleItem = (question) => {
    setOpenItems((prev) =>
      prev.includes(question)
        ? prev.filter((q) => q !== question)
        : [...prev, question]
    );
  };

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openItems.includes(item.question);
        const headingId = `faq-heading-${idx}`;
        const contentId = `faq-content-${idx}`;

        return (
          <div
            key={item.question}
            className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs transition-colors"
          >
            <h3>
              <button
                id={headingId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggleItem(item.question)}
                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-teal-700" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>

            {isOpen && (
              <div
                id={contentId}
                role="region"
                aria-labelledby={headingId}
                className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 whitespace-pre-line space-y-3"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}