import React from "react";
import { Search, Star, Scale } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Search,
      title: "Discover Local Businesses",
      description:
        "Browse verified community establishments across dining, retail, tech services, and wellness with transparent ratings.",
    },
    {
      step: "02",
      icon: Star,
      title: "Submit Honest Feedback",
      description:
        "Rate 1 to 5 stars and share firsthand impressions protected by privacy-safe device cooldown safeguards against spam.",
    },
    {
      step: "03",
      icon: Scale,
      title: "Direct Arithmetic Scores",
      description:
        "Scores reflect pure mathematical averages. No establishment can pay to alter, suppress, or delete authentic community reviews.",
    },
  ];

  return (
    <section className="bg-slate-50/70 border-b border-slate-200/80 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching PublicPageHeader style */}
        <div className="mb-5 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            How TrustRate Works
          </h2>
          <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            A transparent review ecosystem designed to keep customer feedback honest and prevent rating manipulation.
          </p>
        </div>

        {/* Steps Grid: Compact horizontal layout on mobile, 3-col grid on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white rounded-xl p-3.5 sm:p-5 lg:p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-start gap-3 sm:block">
                  {/* Step icon and number */}
                  <div className="p-2 sm:p-2.5 rounded-lg bg-teal-50 text-teal-700 shrink-0 sm:mb-4 sm:inline-block">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between sm:mb-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <span className="text-[11px] font-bold text-slate-400">
                        Step {item.step}
                      </span>
                    </div>
                    <p className="mt-1 sm:mt-0 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}