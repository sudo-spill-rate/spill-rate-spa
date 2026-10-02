import React from "react";
import { CheckCircle2, ShieldAlert, Scale, UserCheck } from "lucide-react";

export default function TrustStats() {
  const commitments = [
    {
      icon: ShieldAlert,
      title: "Zero Pay-to-Remove Policy",
      detail:
        "Unlike commercial directory platforms, no business can pay a subscription to suppress, alter, or remove negative feedback.",
    },
    {
      icon: CheckCircle2,
      title: "Device Cooldown Safeguard",
      detail:
        "Cooldown intervals prevent multiple rapid submissions from the same device, safeguarding businesses against orchestrated spam.",
    },
    {
      icon: Scale,
      title: "Direct Arithmetic Scoring",
      detail:
        "Overall ratings are exact arithmetic averages across confirmed reviews. No secret algorithms promote favored sponsors.",
    },
    {
      icon: UserCheck,
      title: "Verified Representative Responses",
      detail:
        "Business owners undergo account verification before gaining permission to post official responses on customer comments.",
    },
  ];

  return (
    <section className="bg-slate-100/80 border-t border-slate-200 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
            Integrity Safeguards
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How We Protect Review Authenticity
          </p>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            We rely on transparent platform policies rather than inflated marketing numbers to deliver real trust.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {commitments.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{c.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{c.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}