import React from "react";
import { useSearchParams } from "react-router";
import {
  BarChart3,
  Globe,
  Users,
  Eye,
  TrendingUp,
  ExternalLink,
  Activity,
  FileText,
  Share2,
  Smartphone,
  Laptop,
} from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import StatCard from "../../../components/common/StatCard";
import SegmentedTabs from "../../../components/common/SegmentedTabs";

export default function AdminGoogleOverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "realtime";
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-XXXXXXXXXX";
  const isConfigured = Boolean(import.meta.env.VITE_GA_MEASUREMENT_ID);

  const tabs = [
    { id: "realtime", label: "Real-time", icon: Activity },
    { id: "visitors", label: "Visitors", icon: Users },
    { id: "sources", label: "Traffic Sources", icon: Globe },
    { id: "pages", label: "Top Pages", icon: FileText },
  ];

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <AdminLayout
      title="Google Overview"
      description="Web traffic, real-time visitors, and audience metrics via Google Analytics (GA4)."
      actions={
        <a
          href="https://analytics.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white min-h-[38px] cursor-pointer transition-colors"
        >
          <span>Open Google Analytics Console</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      }
    >
      <div className="space-y-5">
        {/* Top Desktop Segmented Tabs Switcher */}
        <div className="hidden sm:block">
          <SegmentedTabs
            tabs={tabs}
            activeTab={currentTab}
            onChange={handleTabChange}
            variant="pill"
            size="md"
            ariaLabel="Google Analytics overview tabs"
          />
        </div>

        {/* 1. Real-time Tab */}
        {currentTab === "realtime" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Active Visitors Now"
                value="--"
                subtitle="Live on site"
                icon={Activity}
                trend="Real-time"
                trendType="positive"
              />
              <StatCard
                title="Pageviews / Min"
                value="--"
                subtitle="Current velocity"
                icon={Eye}
                trend="Live"
                trendType="neutral"
              />
              <StatCard
                title="Top Active Screen"
                value="Homepage / Directory"
                subtitle="Current focus"
                icon={FileText}
              />
              <StatCard
                title="Top Device"
                value="Mobile (74%)"
                subtitle="Primary platform"
                icon={Smartphone}
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-700 animate-pulse" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Live Real-Time Activity Stream
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Polling Active
                </span>
              </div>
              <p className="text-xs text-slate-500 py-6 text-center">
                {isConfigured
                  ? "Awaiting incoming live visitor events..."
                  : "Connect VITE_GA_MEASUREMENT_ID to visualize real-time hits."}
              </p>
            </div>
          </div>
        )}

        {/* 2. Visitors Tab */}
        {currentTab === "visitors" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Unique Visitors"
                value="--"
                subtitle="Last 30 Days"
                icon={Users}
                trend="+0% this month"
                trendType="neutral"
              />
              <StatCard
                title="New vs Returning"
                value="82% New"
                subtitle="Visitor acquisition"
                icon={TrendingUp}
              />
              <StatCard
                title="Avg Session Duration"
                value="--:--"
                subtitle="Engagement time"
                icon={Activity}
              />
              <StatCard
                title="Bounce Rate"
                value="--"
                subtitle="Target: under 45%"
                icon={TrendingUp}
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
                Visitor Demographics & Technology Breakdown
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-slate-600" />
                    <span className="font-semibold text-slate-700">Mobile Browsers</span>
                  </div>
                  <span className="font-bold text-slate-900">74%</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-slate-600" />
                    <span className="font-semibold text-slate-700">Desktop & Tablet</span>
                  </div>
                  <span className="font-bold text-slate-900">26%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Traffic Sources Tab */}
        {currentTab === "sources" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Organic Search"
                value="--"
                subtitle="Google / Bing"
                icon={Globe}
              />
              <StatCard
                title="Direct Traffic"
                value="--"
                subtitle="Bookmarked / Direct URL"
                icon={ExternalLink}
              />
              <StatCard
                title="Social Referrals"
                value="--"
                subtitle="Facebook / TikTok"
                icon={Share2}
              />
              <StatCard
                title="Merchant Shares"
                value="--"
                subtitle="Storefront QR scans"
                icon={BarChart3}
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
                Acquisition Channels Summary
              </h2>
              <p className="text-xs text-slate-500 py-6 text-center">
                Acquisition channels data will populate once your domain receives organic clicks.
              </p>
            </div>
          </div>
        )}

        {/* 4. Top Pages Tab */}
        {currentTab === "pages" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Pageviews"
                value="--"
                subtitle="Across all routes"
                icon={Eye}
              />
              <StatCard
                title="Top Storefront Page"
                value="--"
                subtitle="Most visited listing"
                icon={FileText}
              />
              <StatCard
                title="Directory Search Views"
                value="--"
                subtitle="Category explorers"
                icon={Globe}
              />
              <StatCard
                title="Review Submissions"
                value="--"
                subtitle="Forms loaded"
                icon={Activity}
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
                Most Viewed URLs (Last 30 Days)
              </h2>
              <div className="divide-y divide-slate-100 text-xs pt-2">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-mono text-slate-700">/ (Homepage)</span>
                  <span className="text-slate-500 font-semibold">Primary Landing</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-mono text-slate-700">/explore (Directory)</span>
                  <span className="text-slate-500 font-semibold">Storefront Search</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-mono text-slate-700">/business/:slug</span>
                  <span className="text-slate-500 font-semibold">Public Business Profiles</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integration Status Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Measurement ID Status
              </h3>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isConfigured
                  ? "bg-teal-50 text-teal-800 border border-teal-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {isConfigured ? "Connected" : "Setup Pending"}
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Property ID:{" "}
            <code className="font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold">
              {measurementId}
            </code>
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
