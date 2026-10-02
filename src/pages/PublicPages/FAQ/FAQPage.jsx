import React, { useState } from "react";
import { Link } from "react-router";
import PublicPageHeader from "../components/layout/PublicPageHeader";
import FaqAccordionList from "../components/faq/FaqAccordionList";

const FAQ_DATA = [
  {
    category: "integrity",
    question: "How does device-level cooldown prevent duplicate review spam?",
    answer:
      "When a review is submitted, TrustRate registers a temporary, privacy-respecting cryptographic identifier for the submitting device. If subsequent reviews for the same establishment are attempted within a set cooling period from that same device, they are flagged and delayed. This effectively deters coordinated review-bombing and automated script submission without collecting invasive tracking data.",
  },
  {
    category: "integrity",
    question: "Can business owners pay to remove or hide negative customer feedback?",
    answer:
      "No. TrustRate operates on a strict zero pay-to-remove policy. All valid community ratings are mathematically preserved. Reviews are only reviewed for removal if they violate our Terms of Service, such as containing explicit hate speech, personal doxxing, or verifiable extortion attempts.",
  },
  {
    category: "integrity",
    question: "How is the overall star rating calculated for each business?",
    answer:
      "TrustRate uses a straightforward arithmetic average of all approved 1 to 5 star ratings. We do not use opaque algorithmic weighting systems that bias results in favor of paying advertisers.",
  },
  {
    category: "owners",
    question: "How do I claim and verify my business profile?",
    answer:
      "Sign in to TrustRate using Google authentication and visit the Business Portal. Select 'Register or Claim Business' and provide proof of operation, such as a business permit, utility bill, or official merchant correspondence. Our moderation team reviews documents within 48 business hours to award the Verified Merchant badge.",
  },
  {
    category: "owners",
    question: "Can verified business owners reply directly to customer reviews?",
    answer:
      "Yes. Once your business profile is verified, you can access your merchant dashboard to post public, official responses to reviews. This provides an opportunity to thank satisfied patrons, clarify misunderstandings, or resolve customer service issues constructively.",
  },
  {
    category: "consumers",
    question: "Do I need to sign in with an account to read or write reviews?",
    answer:
      "Anyone can freely browse the business directory and read existing ratings without creating an account. To submit a new rating and comment, authentication via Google OAuth is required to ensure accountability and pair with our spam-reduction cooldown system.",
  },
  {
    category: "consumers",
    question: "What should I do if a review contains defamatory or abusive content?",
    answer:
      "You can report any review directly through the reporting link on the business profile page, or by contacting our team via the Contact Support page. Our team inspects all reported content against our Community Guidelines.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { key: "all", label: "All Questions" },
    { key: "integrity", label: "Integrity & Anti-Spam" },
    { key: "consumers", label: "For Customers" },
    { key: "owners", label: "For Business Owners" },
  ];

  const filteredFaqs =
    activeCategory === "all"
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => item.category === activeCategory);

  return (
    <div>
      <PublicPageHeader
        title="Frequently Asked Questions"
        description="Clear answers regarding our review verification policies, anti-spam protections, and merchant account procedures."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "FAQ" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((tab) => {
            const isActive = activeCategory === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveCategory(tab.key)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap min-h-[40px] focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Accordion */}
        <FaqAccordionList items={filteredFaqs} />

        {/* Still have questions? */}
        <div className="mt-12 p-6 sm:p-8 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
          <h2 className="text-lg font-bold text-slate-900">
            Still Have Questions?
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            If you cannot find the answer you are looking for, our operational team is happy to assist you directly.
          </p>
          <div className="mt-5">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}