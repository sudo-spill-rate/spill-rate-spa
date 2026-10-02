import React from "react";
import { Search, Star, ShieldCheck, MessageSquare } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Search,
      title: "Find Local Establishments",
      description: "Search and filter through local businesses across dining, retail, tech services, and wellness.",
    },
    {
      step: "02",
      icon: Star,
      title: "Share Honest Feedback",
      description: "Submit a 1 to 5 star rating with your firsthand impressions to guide future customers.",
    },
    {
      step: "03",
      icon: ShieldCheck,
      title: "Cooldown Verification",
      description: "Automatic device-level limits ensure feedback comes from real visits rather than automated spam.",
    },
    {
      step: "04",
      icon: MessageSquare,
      title: "Public Merchant Dialogue",
      description: "Verified owners can respond directly to constructive feedback and keep customer trust intact.",
    },
  ];

  return (
    <section className="bg-slate-100/80 border-y border-slate-200 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Platform Workflow
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How TrustRate Protects Authentic Reviews
          </p>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            A balanced community framework where feedback is mathematically fair and protected against manipulation.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-teal-50 text-teal-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold text-slate-400">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}