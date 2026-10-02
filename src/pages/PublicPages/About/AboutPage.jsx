import React from "react";
import { Link } from "react-router";
import PublicPageHeader from "../components/layout/PublicPageHeader";
import MissionVision from "../components/about/MissionVision";
import TrustStats from "../components/about/TrustStats";

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
      />

      {/* Story & Background Section */}
      <section className="py-10 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
              Our Origin
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why We Started TrustRate
            </p>
            <div className="mt-6 space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>
                In an era where online business reputations can be bought, buried, or manipulated by bot rings, finding dependable local recommendations has become increasingly difficult. Many directory platforms monetize by offering businesses paid tools to conceal unfavorable reviews or artificially inflate ratings.
              </p>
              <p>
                TrustRate was created to counter that dynamic. We believe that genuine customer experiences deserve to be heard, and that honest small and medium-sized enterprises thrive when feedback is constructive and transparent.
              </p>
              <p>
                By combining straightforward arithmetic review averages with device-level cooldown safeguards, we ensure that every community review reflects a real visit while preventing coordinated spam campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <MissionVision />

      {/* Trust Safeguards & Principles */}
      <TrustStats />

      {/* Community Call to Action */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Support Honest Local Commerce
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Whether you are looking for your next neighborhood cafe or managing a local service business, join a community that values truthful feedback.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/explore"
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-sm transition-colors min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              Browse Directory
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg font-semibold text-sm transition-colors min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}