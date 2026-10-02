import React from "react";
import { Target, Compass, HeartHandshake, Shield } from "lucide-react";

export default function MissionVision() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To empower local consumers with honest, unedited feedback while providing businesses with a fair platform to build community trust.",
    },
    {
      icon: Compass,
      title: "Our Vision",
      description:
        "A local marketplace where reputations are built on actual service quality rather than advertising spend or review suppression.",
    },
    {
      icon: Shield,
      title: "Spam-Resistant Design",
      description:
        "We implement device-level cooldown periods to curb duplicate feedback, automated bot campaigns, and malicious review-bombing.",
    },
    {
      icon: HeartHandshake,
      title: "Constructive Dialogue",
      description:
        "We believe criticism should be an opportunity to improve. Verified owners have the tools to reply directly and make things right.",
    },
  ];

  return (
    <section className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
            Purpose & Direction
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Guiding Principles Behind Every Review
          </p>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            TrustRate was built as an antidote to paywalled reputation platforms. We prioritize mathematical fairness, transparent ratings, and community accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{v.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}