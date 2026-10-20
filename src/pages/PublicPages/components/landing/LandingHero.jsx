import React from "react";
import { Link } from "react-router";
import { Compass, Building2 } from "lucide-react";
import PublicPageHeader from "../layout/PublicPageHeader";

export default function LandingHero() {
  return (
    <PublicPageHeader
      title="Find and review local businesses you can trust."
      description="Discover authentic community ratings and unfiltered reviews for local establishments across your neighborhood. Share your experience in seconds without creating an account, or browse our daily featured selections."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Overview" },
      ]}
    >
      <Link
        to="/explore"
        className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors min-h-[44px] inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-xs"
      >
        <Compass className="w-4 h-4 text-teal-400" />
        <span>Browse Directory</span>
      </Link>
      <Link
        to="/dashboard/business/new"
        className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs sm:text-sm rounded-lg transition-colors min-h-[44px] inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
      >
        <Building2 className="w-4 h-4 text-slate-500" />
        <span>Register Your Business</span>
      </Link>
    </PublicPageHeader>
  );
}
