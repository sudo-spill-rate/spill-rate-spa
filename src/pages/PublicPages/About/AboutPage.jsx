import React from "react";
import { Link } from "react-router";
import PublicPageHeader from "../components/layout/PublicPageHeader";

const FEATURES = [
  {
    title: "Frictionless Customer Reviews",
    description:
      "At TrustRate, we firmly believe that submitting an informative and honest customer review should be completely open, effortless, and accessible to every member of the neighborhood without navigating tedious digital obstacles, forced mobile application installations, or lengthy account registration screens. Unlike conventional rating directories that aggressively demand personal user accounts, social media logins, mandatory password creations, private credit cards, or invasive tracking permissions before accepting your opinion, our platform allows you to share authentic firsthand feedback in just a matter of seconds. When reviewing any local establishment across our public directory, you simply enter your preferred display name, select an honest star score from one to five, write your firsthand feedback of up to five hundred characters, and optionally attach up to two real photographs to showcase your authentic customer experience. By completely eliminating mandatory passwords, phone number verifications, and cumbersome email confirmation links for everyday reviewers, we encourage honest, spontaneous, and genuine community participation from real patrons who want to highlight outstanding neighborhood talent or offer constructive suggestions for ongoing service improvement. This completely frictionless approach ensures that our community directory truly reflects the living pulse of neighborhood commerce, allowing authentic customer voices to be heard clearly by everyone without technical intimidation, artificial delays, corporate roadblocks, or unnecessary registration fatigue.",
  },
  {
    title: "24-Hour Device Anti-Spam Cooldown",
    description:
      "To keep our community directory truthful, balanced, and fair without forcing everyday visitors to create accounts, remember complex passwords, or surrender personal data, TrustRate implements an intelligent automated twenty-four-hour device cooldown system across our entire public review network. Instead of harvesting invasive personal tracking cookies, phone numbers, location trackers, or monitoring your private browsing history across the web, our protective engine safely verifies submission frequency by checking anonymous browser device identifiers alongside temporary network connection patterns. Whenever a customer successfully submits a rating and feedback message for a specific storefront, an automatic twenty-four-hour cooling period is immediately activated on that device for that particular business, ensuring that no single visitor can repeatedly flood the feed with duplicate scores in a single afternoon. This automated buffer provides essential protection for hardworking local entrepreneurs and independent service providers, effectively stopping coordinated review-bombing campaigns, malicious competitor sabotage, emotional spam flurries, and fraudulent reputation manipulation before they can unfairly distort neighborhood public perception. By pairing an open, accessible review policy with an objective device-level cooling window, we safeguard community integrity and maintain total respect for user privacy, consumer freedom, and honest local market competition across all neighborhood categories without invasive surveillance.",
  },
  {
    title: "B2B Endorsements Network",
    description:
      "TrustRate introduces an innovative Business-to-Business endorsement system that allows registered local merchants, independent contractors, creative agencies, and service providers to officially support, recommend, and publicly vouch for neighboring commercial partners within their shared community. Whether it is an artisanal neighborhood bakery endorsing a dependable local dairy supplier, a corporate technology consultancy praising an event catering company, or a boutique salon recommending a talented interior craftsman, these endorsements showcase real professional relationships built on consistent quality and mutual reliability. When an authenticated business owner leaves an endorsement on another commercial profile, the review prominently displays their verified company name, direct link to their official storefront, and verified business logo directly within the public community feedback feed for all prospective clients to see. This transparent business endorsement network strengthens local supply chains, fosters collaborative solidarity among independent shopkeepers, and helps everyday consumers discover reputable commercial partners that local business owners personally depend on and trust with their own daily operations. By bridging professional business collaboration with everyday consumer feedback, our platform creates a vibrant, interconnected local economy where high-quality services, mutual respect, and trustworthy partnerships are celebrated by both patrons and fellow entrepreneurs alike across the entire region.",
  },
  {
    title: "Merchant Ownership & Pinning Tools",
    description:
      "Local entrepreneurs, shopkeepers, restaurant managers, and clinic operators can claim or register up to five commercial storefronts completely free of charge by signing in securely with their official Google account on the TrustRate Business Portal. Google authentication serves as a verified administrative credential that guarantees only authorized company representatives can edit business addresses, update telephone numbers, adjust operating schedules, upload official storefront photos, and oversee their public commercial listing without confusion. Once a storefront is successfully registered, business owners gain full access to a dedicated merchant management dashboard equipped with powerful, intuitive tools designed to highlight exceptional service, respond professionally to inquiries, and engage respectfully with their neighborhood clientele. Among these core capabilities is our review pinning feature, which allows verified owners to select up to three outstanding, detailed, or helpful customer reviews and permanently display them prominently at the very top of their public feedback feed for every browsing visitor to admire. These complimentary management tools give independent business owners total control over their digital narrative, enabling them to celebrate loyal customers, provide transparent context during misunderstandings, and actively build long-term neighborhood trust without ever paying expensive marketing subscriptions or hidden platform fees.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <PublicPageHeader
        title="About TrustRate"
        description="We are building an open, honest ratings platform designed to bridge local communities and neighborhood establishments through verified customer reviews."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
        compact={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <main className="bg-white p-5 sm:p-8 lg:p-10 rounded-2xl border border-slate-200/90 shadow-xs space-y-8">
          {/* Story & Origin Section */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1.5">
              Our Origin
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-4">
              Why We Started TrustRate
            </h3>

            <div className="text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3.5">
              <p>
                TrustRate was built to make finding dependable neighborhood businesses simple, completely transparent, and mutually accountable for every member of the local community. In many modern review platforms, sharing genuine feedback has become increasingly frustrating because casual visitors are forced through mandatory account sign-ups, while overall ratings are quietly influenced by commercial advertising deals. We believe that submitting an authentic customer review should be completely open and frictionless, allowing everyday patrons to share their firsthand experiences in seconds without mandatory registration hurdles. At the same time, hardworking local shopkeepers, neighborhood cafes, medical clinics, and independent service providers deserve an honorable public reputation that cannot be bought, suppressed, or manipulated by aggressive competitors. TrustRate solves both challenges by combining open community submissions with smart device-level verification that stops repetitive spam and coordinated review-bombing before it can distort local opinion.
              </p>
              <p>
                Instead of demanding intrusive personal data or tracking your private browsing history across the web, our system checks submission timing per browser device to keep feedback balanced and truthful. Every star score on our directory is calculated as an exact mathematical average of approved customer evaluations, completely free from opaque algorithmic tampering, sponsored ranking boosts, or paid score manipulation. We also bridge local commerce through official B2B endorsements, enabling registered business owners to publicly vouch for trusted local suppliers, creative partners, and neighboring craftsmen who deliver outstanding service. Verified entrepreneurs can claim or register up to five commercial storefronts using Google authentication, giving them dedicated management tools to pin helpful community reviews and showcase top customer service moments. Whether you are discovering a hidden neighborhood dining spot or building an independent family enterprise, TrustRate stands as an open community directory where real service quality always speaks for itself.
              </p>
            </div>
          </section>

          {/* Key Platform Features */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1.5">
              Platform Features
            </h2>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-6">
              How the TrustRate Ecosystem Works
            </h3>

            <div className="space-y-6 sm:space-y-7">
              {FEATURES.map((feature, idx) => (
                <div
                  key={feature.title}
                  className="pb-6 sm:pb-7 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                    <span className="text-slate-400 mr-2">{idx + 1}.</span>
                    {feature.title}
                  </h4>
                  <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* End-of-page footer note */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
            <span>TrustRate connects local communities through honest customer feedback.</span>
            <Link
              to="/contact"
              className="font-medium text-teal-700 hover:text-teal-800 transition-colors inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
            >
              Have questions? Contact our team →
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}