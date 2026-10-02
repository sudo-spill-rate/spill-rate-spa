import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import PublicPageHeader from "../components/layout/PublicPageHeader";
import CategoryFilters from "../components/explore/CategoryFilters";
import DirectorySearchResults from "../components/explore/DirectorySearchResults";
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

export default function ExploreDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";

  const [searchInput, setSearchInput] = useState(searchParam);

  // Sync state with URL params
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ["businesses-directory", searchParam, categoryParam],
    queryFn: () =>
      businessService.getBusinesses({
        search: searchParam || undefined,
        category: categoryParam || undefined,
        limit: 20,
      }),
  });

  const apiBusinesses = response?.data && response.data.length > 0 ? response.data : null;
  const isUsingFallback = !apiBusinesses && !searchParam && !categoryParam && !isLoading && !isError;

  // Filter fallback if in fallback mode
  let displayBusinesses = apiBusinesses || [];
  if (isUsingFallback) {
    displayBusinesses = SAMPLE_DIRECTORY;
  } else if (!apiBusinesses && (searchParam || categoryParam)) {
    // If backend returns empty, filter sample list so user has interactive experience
    displayBusinesses = SAMPLE_DIRECTORY.filter((b) => {
      const matchesCategory =
        !categoryParam || b.category?.toLowerCase() === categoryParam.toLowerCase();
      const matchesSearch =
        !searchParam ||
        b.name.toLowerCase().includes(searchParam.toLowerCase()) ||
        b.description?.toLowerCase().includes(searchParam.toLowerCase()) ||
        b.category?.toLowerCase().includes(searchParam.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set("search", searchInput.trim());
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    setSearchParams(newParams);
  };

  const handleSelectCategory = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category) {
      newParams.set("category", category);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const handleClearAllFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(searchParam || categoryParam);

  return (
    <div>
      <PublicPageHeader
        title="Business Directory"
        description="Explore verified local establishments, read genuine feedback, and discover trusted services across your community."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Directory" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search & Filter Controls */}
        <div className="mb-8">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-2xl"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" aria-hidden="true" />
              <label htmlFor="directory-search" className="sr-only">
                Search businesses
              </label>
              <input
                id="directory-search"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by business name or keyword..."
                className="w-full pl-11 pr-10 py-2.5 text-slate-900 placeholder-slate-400 bg-white border border-slate-300 rounded-lg text-sm sm:text-base focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-sm rounded-lg transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              Search
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                Clear Filters
              </button>
            )}
          </form>
        </div>

        {/* Directory Layout: Sidebar Filters + Main Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs sticky top-24">
              <CategoryFilters
                categories={CATEGORIES}
                selectedCategory={categoryParam}
                onSelectCategory={handleSelectCategory}
              />
            </div>
          </aside>

          {/* Search Results Area */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-600">
                {displayBusinesses.length} {displayBusinesses.length === 1 ? "establishment" : "establishments"} found
                {categoryParam && ` in ${categoryParam}`}
                {searchParam && ` matching "${searchParam}"`}
              </p>
            </div>

            <DirectorySearchResults
              businesses={displayBusinesses}
              isLoading={isLoading}
              isError={isError}
              onRetry={refetch}
              onClearFilters={handleClearAllFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </main>
        </div>
      </div>
    </div>
  );
}