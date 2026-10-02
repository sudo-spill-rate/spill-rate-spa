import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Search, Building2, ShieldCheck, Scale, MessageSquare } from "lucide-react";

export default function LandingHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/explore");
    }
  };

  const quickCategories = [
    { label: "Restaurants & Dining", category: "Food & Beverage" },
    { label: "Cafes & Bakeries", category: "Food & Beverage" },
    { label: "IT & Technology", category: "Technology" },
    { label: "Health & Wellness", category: "Health" },
    { label: "Retail Stores", category: "Retail" },
  ];

  return (
    <section className="bg-slate-50 border-b border-slate-200 pt-12 pb-14 sm:pt-18 sm:pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Find and review local businesses you can trust.
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Unfiltered customer feedback protected by device cooldowns. Read genuine community ratings or manage your official business profile.
        </p>

        {/* Hero Search Box: Main Focal Point */}
        <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-stretch gap-2 p-2 bg-white rounded-xl shadow-xs border border-slate-300 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/20 transition-all"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" aria-hidden="true" />
              <label htmlFor="hero-business-search" className="sr-only">
                Search businesses by name, category, or service
              </label>
              <input
                id="hero-business-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search establishments, dining, or services..."
                className="w-full pl-11 pr-4 py-3 text-slate-900 placeholder-slate-400 bg-transparent text-sm sm:text-base focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center px-6 py-3 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-sm sm:text-base rounded-lg transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              Search Directory
            </button>
          </form>

          {/* Quick Filter Categories */}
          <div className="mt-4 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap text-left">
            <span className="text-xs text-slate-500 font-medium">Browse:</span>
            {quickCategories.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  navigate(`/explore?category=${encodeURIComponent(item.category)}`)
                }
                className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[32px]"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Merchant Callout */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600">
          <span>Are you a business owner?</span>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 font-semibold text-teal-700 hover:text-teal-900 underline focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-0.5"
          >
            <Building2 className="w-4 h-4" />
            <span>Register or claim your listing</span>
          </Link>
        </div>

        {/* Grounded Trust Commitments Bar: Refined inline pillars instead of bulky cards */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200/90 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Device Cooldowns</h2>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Prevents coordinated review-bombing and repetitive spam from the same hardware.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Mathematical Scores</h2>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Direct arithmetic averages. No establishment can pay to suppress or delete reviews.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Verified Merchant Replies</h2>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Official owners can respond publicly to resolve customer inquiries and feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}