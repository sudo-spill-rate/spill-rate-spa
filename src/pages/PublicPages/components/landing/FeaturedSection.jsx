import React, { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, MapPin, CheckCircle2, Building, AlertCircle } from "lucide-react";
import { businessService } from "../../../../services/businessService";

const FALLBACK_BUSINESSES = [
  {
    id: "sample-1",
    name: "Kape Balangay Artisanal Roastery",
    slug: "kape-balangay",
    category: "Food & Beverage",
    description: "Specialty Philippine coffee beans, pour-overs, and freshly baked pastries.",
    address: "123 Rizal St., Poblacion, Makati City",
    image_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80",
    is_verified: true,
    rating_breakdown: { average_rating: 4.9, total_reviews: 48 },
  },
  {
    id: "sample-2",
    name: "Nexus Cloud & Cyber Solutions",
    slug: "nexus-cloud-solutions",
    category: "Technology",
    description: "Enterprise IT support, cloud migrations, and network security for SMEs.",
    address: "88 Ortigas Ave., Pasig City",
    image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
    is_verified: true,
    rating_breakdown: { average_rating: 4.8, total_reviews: 26 },
  },
  {
    id: "sample-3",
    name: "Verde Wellness & Botanical Spa",
    slug: "verde-wellness-spa",
    category: "Health & Wellness",
    description: "Therapeutic massages, natural aromatherapy, and organic skin treatments.",
    address: "45 Bonifacio High St., Taguig City",
    image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80",
    is_verified: true,
    rating_breakdown: { average_rating: 5.0, total_reviews: 39 },
  },
  {
    id: "sample-4",
    name: "Panaderia dela Luna",
    slug: "panaderia-dela-luna",
    category: "Food & Beverage",
    description: "Traditional sourdough pandesal, artisanal Spanish breads, and hot cocoa.",
    address: "12 Luna St., Quezon City",
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    is_verified: false,
    rating_breakdown: { average_rating: 4.7, total_reviews: 19 },
  },
];

function BusinessCard({ biz }) {
  const [imgError, setImgError] = useState(false);

  // Strictly respect real rating, never fabricate 4.8 if null or 0 (R-17 compliance)
  const rawAvg = biz?.rating_breakdown?.average_rating ?? biz?.average_rating;
  const hasRating = typeof rawAvg === "number" && rawAvg > 0;
  const reviewCount = biz?.rating_breakdown?.total_reviews ?? biz?.total_reviews ?? 0;
  const businessHref = `/business/${biz.slug || biz.id}`;

  return (
    <article className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-colors">
      {/* Image Cover */}
      <Link to={businessHref} className="relative h-44 w-full bg-slate-100 block overflow-hidden focus:outline-none focus:ring-2 focus:ring-teal-600">
        {biz.image_url && !imgError ? (
          <img
            src={biz.image_url}
            alt={`Photo of ${biz.name}`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
            <Building className="w-10 h-10" />
          </div>
        )}

        {/* Category Tag */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-slate-800 shadow-xs border border-slate-200/60">
          {biz.category || "General"}
        </span>

        {/* Verified Badge */}
        {biz.is_verified && (
          <span
            title="Verified Establishment"
            className="absolute top-3 right-3 p-1 rounded-md bg-teal-700 text-white shadow-xs flex items-center gap-1 text-[11px] px-2 font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified</span>
          </span>
        )}
      </Link>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            {hasRating ? (
              <>
                <div className="flex items-center text-amber-600">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="ml-1 text-sm font-bold text-slate-900">
                    {Number(rawAvg).toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-normal">
                  ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                </span>
              </>
            ) : (
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                No reviews yet
              </span>
            )}
          </div>

          {/* Business Name */}
          <h3 className="font-bold text-base text-slate-900 line-clamp-1">
            <Link
              to={businessHref}
              className="hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
            >
              {biz.name}
            </Link>
          </h3>

          {/* Address */}
          {biz.address && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{biz.address}</span>
            </p>
          )}

          {/* Description */}
          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {biz.description || "Local establishment offering products and services."}
          </p>
        </div>

        {/* Action Link */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <Link
            to={businessHref}
            className="w-full flex items-center justify-center py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-teal-700 hover:text-white text-slate-800 font-semibold text-xs sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
          >
            Read Reviews and Rate
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedSection() {
  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ["featured-businesses"],
    queryFn: () => businessService.getBusinesses({ limit: 4 }),
    staleTime: 1000 * 60 * 5,
  });

  const apiBusinesses = response?.data && response.data.length > 0 ? response.data : null;
  const businesses = apiBusinesses || FALLBACK_BUSINESSES;
  const isUsingFallback = !apiBusinesses && !isLoading && !isError;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1.5">
            Community Spotlight
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Featured Establishments
          </p>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 max-w-xl">
            Local businesses with active community feedback and transparent rating breakdowns.
          </p>
        </div>
        <Link
          to="/explore"
          className="inline-flex items-center text-sm font-semibold text-teal-700 hover:text-teal-900 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-1"
        >
          View Full Directory
        </Link>
      </div>

      {isUsingFallback && (
        <div className="mb-6 p-3 bg-slate-100 rounded-lg text-xs text-slate-600 border border-slate-200">
          Showing sample community profiles. Real directory entries appear as businesses register.
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs animate-pulse"
            >
              <div className="h-44 bg-slate-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-5 w-3/4 bg-slate-200 rounded" />
                <div className="h-4 w-1/2 bg-slate-200 rounded" />
                <div className="h-9 w-full bg-slate-200 rounded-lg mt-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <p className="text-base font-semibold text-slate-900">Unable to load featured businesses</p>
          <p className="text-sm text-slate-600 mt-1 mb-4">Please verify your connection and try again.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Data Cards Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {businesses.map((biz) => (
            <BusinessCard key={biz.id} biz={biz} />
          ))}
        </div>
      )}
    </section>
  );
}