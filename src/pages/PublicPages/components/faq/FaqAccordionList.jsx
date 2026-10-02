import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordionList({ items = [] }) {
  const [openIndices, setOpenIndices] = useState([0]); // First item open by default

  const toggleIndex = (index) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        const headingId = `faq-heading-${idx}`;
        const contentId = `faq-content-${idx}`;

        return (
          <div
            key={item.question}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-colors"
          >
            <h3>
              <button
                id={headingId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggleIndex(idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[48px]"
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
                className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100"
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