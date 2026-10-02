import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Compass, Filter } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import CategoryFilters from "../../PublicPages/components/explore/CategoryFilters";
import DirectorySearchResults from "../../PublicPages/components/explore/DirectorySearchResults";
import { businessService } from "../../../services/businessService";

const CATEGORIES = [
  "Food & Beverage",
  "Technology",
  "Health & Wellness",
  "Retail",
  "Automotive",
  "Professional Services",
];

const SAMPLE_DIRECTORY = [
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
  {
    id: "sample-5",
    name: "Apex Auto Repair & Detailing",
    slug: "apex-auto-repair",
    category: "Automotive",
    description: "Complete vehicle maintenance, computer diagnostics, and ceramic coating.",
    address: "204 C5 Road, Pasig City",
    image_url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
    is_verified: true,
    rating_breakdown: { average_rating: 4.6, total_reviews: 31 },
  },
  {
    id: "sample-6",
    name: "Craft & Loom Artisan Goods",
    slug: "craft-and-loom",
    category: "Retail",
    description: "Locally handcrafted textiles, sustainable woven baskets, and home decor.",
    address: "77 Maginhawa St., Quezon City",
    image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80",
    is_verified: true,
    rating_breakdown: { average_rating: 4.9, total_reviews: 22 },
  },
];

export default function BusinessExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";

  const [searchInput, setSearchInput] = useState(searchParam);

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard-businesses", searchParam, categoryParam],
    queryFn: () =>
      businessService.getBusinesses({
        search: searchParam || undefined,
        category: categoryParam || undefined,
        limit: 30,
      }),
    staleTime: 30000,
  });

  const apiBusinesses = response?.success && Array.isArray(response.data) ? response.data : [];

  const displayBusinesses =
    apiBusinesses.length > 0
      ? apiBusinesses
      : !isLoading && !searchParam && !categoryParam
      ? SAMPLE_DIRECTORY
      : apiBusinesses;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      nextParams.set("search", searchInput.trim());
    } else {
      nextParams.delete("search");
    }
    setSearchParams(nextParams);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("search");
    setSearchParams(nextParams);
  };

  const handleCategorySelect = (category) => {
    const nextParams = new URLSearchParams(searchParams);
    if (category) {
      nextParams.set("category", category);
    } else {
      nextParams.delete("category");
    }
    setSearchParams(nextParams);
  };

  return (
    <DashboardLayout
      title="Directory Explorer"
      description="Inspect active business profiles, explore industry ratings, and review customer sentiment across the platform."
    >
      <div className="space-y-6">
        {/* Search Bar Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search directory by business name or keyword..."
              aria-label="Search directory"
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search text"
                className="absolute right-20 p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Content Layout with Category Filter + Results Grid */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Category Filter Column */}
          <aside className="w-full lg:w-56 shrink-0 bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <CategoryFilters
              categories={CATEGORIES}
              selectedCategory={categoryParam}
              onSelectCategory={handleCategorySelect}
            />
          </aside>

          {/* Results Grid */}
          <div className="flex-1 w-full min-w-0">
            <DirectorySearchResults
              businesses={displayBusinesses}
              isLoading={isLoading}
              isError={isError}
              onRetry={refetch}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
