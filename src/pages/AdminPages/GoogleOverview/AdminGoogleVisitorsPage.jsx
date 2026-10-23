import React from "react";
import { Link } from "react-router";
import {
  Users,
  UserPlus,
  UserCheck,
  Activity,
  Clock,
  Smartphone,
  Laptop,
  AlertCircle,
  Layers,
} from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import StatCard from "../../../components/common/StatCard";
import MobileMetricsList from "../../../components/common/MobileMetricsList";
import { useGAOverview, useGAVisitors, useGADevices } from "../../../hooks/useGoogleAnalytics";

export default function AdminGoogleVisitorsPage() {
  const {
    data: gaData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    error: overviewError,
    refetch: refetchOverview,
  } = useGAOverview();

  const {
    data: visitorsRaw,
    isLoading: isVisitorsLoading,
    refetch: refetchVisitors,
  } = useGAVisitors(30);

  const {
    data: devicesRaw,
    isLoading: isDevicesLoading,
    refetch: refetchDevices,
  } = useGADevices();

  const isLoading = isOverviewLoading && isVisitorsLoading;

  // Normalized extraction (supports GA4 array, backend single-object, and overview fallback)
  const l30 = gaData?.last_30_days;
  const vOverview = gaData?.visitors;

  const isVisitorsObj = visitorsRaw && typeof visitorsRaw === "object" && !Array.isArray(visitorsRaw);
  const visitorsArray = Array.isArray(visitorsRaw) ? visitorsRaw : [];

  const totalUsers =
    l30?.active_users ??
    (isVisitorsObj ? (visitorsRaw.totalUsers ?? visitorsRaw.total_users) : undefined) ??
    vOverview?.totalUsers ??
    (visitorsArray.length > 0 ? visitorsArray.reduce((acc, v) => acc + (v.active_users || 0), 0) : undefined) ??
    0;

  const newUsers =
    l30?.new_users ??
    (isVisitorsObj ? (visitorsRaw.newUsers ?? visitorsRaw.new_users) : undefined) ??
    vOverview?.newUsers ??
    (visitorsArray.length > 0 ? visitorsArray.reduce((acc, v) => acc + (v.new_users || 0), 0) : undefined) ??
    0;

  const returningUsers = Math.max(0, totalUsers - newUsers);

  const totalPageviews =
    l30?.pageviews ??
    (isVisitorsObj ? (visitorsRaw.totalPageviews ?? visitorsRaw.total_pageviews) : undefined) ??
    gaData?.totalPageviews ??
    (visitorsArray.length > 0 ? visitorsArray.reduce((acc, v) => acc + (v.pageviews || 0), 0) : undefined) ??
    0;

  // Acquisition percentages
  const newUsersPct = totalUsers > 0 ? Math.round((newUsers / totalUsers) * 100) : 0;
  const returningUsersPct = totalUsers > 0 ? Math.max(0, 100 - newUsersPct) : 0;

  // Device percentages computed from devices endpoint (array OR object) or fallback
  const isDevicesObj = devicesRaw && typeof devicesRaw === "object" && !Array.isArray(devicesRaw);
  const devicesArray = Array.isArray(devicesRaw) ? devicesRaw : [];

  let mobilePct = 0;
  let desktopPct = 0;

  if (devicesArray.length > 0) {
    const totalDeviceUsers = devicesArray.reduce((acc, d) => acc + (d.users || 0), 0);
    const mobileDeviceUsers = devicesArray
      .filter((d) => d.device?.toLowerCase() === "mobile")
      .reduce((acc, d) => acc + (d.users || 0), 0);
    mobilePct = totalDeviceUsers > 0 ? Math.round((mobileDeviceUsers / totalDeviceUsers) * 100) : 0;
    desktopPct = Math.max(0, 100 - mobilePct);
  } else if (isDevicesObj && (devicesRaw.mobilePct !== undefined || devicesRaw.desktopPct !== undefined)) {
    mobilePct = typeof devicesRaw.mobilePct === "number" ? devicesRaw.mobilePct : 0;
    desktopPct = typeof devicesRaw.desktopPct === "number" ? devicesRaw.desktopPct : Math.max(0, 100 - mobilePct);
  } else if (vOverview?.mobilePct !== undefined || vOverview?.desktopPct !== undefined) {
    mobilePct = typeof vOverview.mobilePct === "number" ? vOverview.mobilePct : 0;
    desktopPct = typeof vOverview.desktopPct === "number" ? vOverview.desktopPct : Math.max(0, 100 - mobilePct);
  }

  // Pages per user ratio
  const pagesPerUser = totalUsers > 0 ? (totalPageviews / totalUsers).toFixed(1) : "0.0";

  // Formatted duration
  let avgDurationLabel = "0:00";
  if (l30?.avg_session_duration_sec) {
    avgDurationLabel = `${Math.floor(l30.avg_session_duration_sec / 60)}m ${Math.round(l30.avg_session_duration_sec % 60)}s`;
  } else if (isVisitorsObj && (visitorsRaw.avgSessionDuration || visitorsRaw.avg_session_duration)) {
    avgDurationLabel = visitorsRaw.avgSessionDuration || visitorsRaw.avg_session_duration;
  } else if (vOverview?.avgSessionDuration) {
    avgDurationLabel = vOverview.avgSessionDuration;
  }

  // Formatted bounce rate
  let bounceRateLabel = "0%";
  if (l30?.bounce_rate_pct !== undefined) {
    bounceRateLabel = `${l30.bounce_rate_pct}%`;
  } else if (isVisitorsObj && (visitorsRaw.bounceRate !== undefined || visitorsRaw.bounce_rate !== undefined)) {
    const br = visitorsRaw.bounceRate ?? visitorsRaw.bounce_rate;
    bounceRateLabel = typeof br === "string" ? br : `${br}%`;
  } else if (vOverview?.bounceRate) {
    bounceRateLabel = typeof vOverview.bounceRate === "string" ? vOverview.bounceRate : `${vOverview.bounceRate}%`;
  }

  const isError = isOverviewError && totalUsers === 0;

  const visitorMetrics = [
    {
      title: "Total Unique Visitors",
      value: isLoading ? "--" : totalUsers.toLocaleString(),
      subtitle: totalUsers > 0 ? "30-day unique audience" : "Awaiting audience data",
      icon: Users,
      trend: totalUsers > 0 ? "Active" : undefined,
      trendType: "positive",
    },
    {
      title: "New Visitors",
      value: isLoading ? "--" : newUsers.toLocaleString(),
      subtitle: totalUsers > 0 ? `${newUsersPct}% first-time discovery` : "First-time sessions",
      icon: UserPlus,
      trend: newUsers > 0 ? "Acquired" : undefined,
      trendType: "positive",
    },
    {
      title: "Avg Session Duration",
      value: isLoading ? "--:--" : totalUsers > 0 ? avgDurationLabel : "--:--",
      subtitle: totalUsers > 0 ? "Engagement time per visit" : "Awaiting sessions",
      icon: Clock,
    },
    {
      title: "Bounce Rate",
      value: isLoading ? "--" : totalUsers > 0 ? bounceRateLabel : "--",
      subtitle: totalUsers > 0 ? "Single-page sessions" : "Awaiting sessions",
      icon: Activity,
    },
  ];

  return (
    <AdminLayout>
      <div className="w-full max-w-full min-w-0 space-y-3.5 sm:space-y-5">
        {/* Error Banner */}
        {isError && (
          <div className="p-3 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{overviewError?.message || "Failed to load visitor statistics."}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                refetchOverview();
                refetchVisitors();
                refetchDevices();
              }}
              className="font-bold underline hover:no-underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Telemetry Metrics: Mobile List & Desktop Grid */}
        <div>
          <MobileMetricsList items={visitorMetrics} />

          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
            {visitorMetrics.map((m, idx) => (
              <StatCard
                key={idx}
                title={m.title}
                value={m.value}
                subtitle={m.subtitle}
                icon={m.icon}
                trend={m.trend}
                trendType={m.trendType}
              />
            ))}
          </div>
        </div>

        {totalUsers > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-5">
              {/* Panel 1: Audience Composition */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4.5 shadow-xs space-y-2.5 sm:space-y-3.5">
                <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Audience Composition
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      First-time discovery versus returning customer ratio.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                    <Users className="w-3 h-3 text-slate-500" />
                    <span>30-Day Split</span>
                  </span>
                </div>

                {/* Proportion Progress Bar */}
                <div className="space-y-1 sm:space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-700" />
                      <span>New Visitors ({newUsersPct}%)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      <span>Returning ({returningUsersPct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-teal-700 transition-all duration-300"
                      style={{ width: `${newUsersPct}%` }}
                      title={`New: ${newUsersPct}%`}
                    />
                    <div
                      className="h-full bg-slate-400 transition-all duration-300"
                      style={{ width: `${returningUsersPct}%` }}
                      title={`Returning: ${returningUsersPct}%`}
                    />
                  </div>
                </div>

                {/* Breakdown Summary Cards */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-0.5">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shrink-0">
                        <UserPlus className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">
                          New Visitors
                        </span>
                        <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums block">
                          {newUsers.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-500">
                      <span>Share</span>
                      <span className="font-semibold text-teal-800">{newUsersPct}%</span>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">
                          Returning
                        </span>
                        <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums block">
                          {returningUsers.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-500">
                      <span>Share</span>
                      <span className="font-semibold text-slate-700">{returningUsersPct}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel 2: Device & Technology Breakdown */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4.5 shadow-xs space-y-2.5 sm:space-y-3.5">
                <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Device & Platform Share
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Comparison between mobile and desktop/tablet browser sessions.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                    <Smartphone className="w-3 h-3 text-slate-500" />
                    <span>Devices</span>
                  </span>
                </div>

                {/* Proportion Progress Bar */}
                <div className="space-y-1 sm:space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-700" />
                      <span>Mobile ({mobilePct}%)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-500" />
                      <span>Desktop ({desktopPct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-teal-700 transition-all duration-300"
                      style={{ width: `${mobilePct}%` }}
                      title={`Mobile: ${mobilePct}%`}
                    />
                    <div
                      className="h-full bg-slate-500 transition-all duration-300"
                      style={{ width: `${desktopPct}%` }}
                      title={`Desktop: ${desktopPct}%`}
                    />
                  </div>
                </div>

                {/* Device Comparison Cards */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-0.5">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shrink-0">
                        <Smartphone className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">
                          Mobile Devices
                        </span>
                        <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums block">
                          {mobilePct}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-500">
                      <span>Form factor</span>
                      <span className="text-slate-700 font-medium truncate">Handheld</span>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                        <Laptop className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">
                          Desktop / Laptop
                        </span>
                        <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums block">
                          {desktopPct}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-500">
                      <span>Form factor</span>
                      <span className="text-slate-700 font-medium truncate">Workstation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 3: Session Depth & Engagement Summary */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4.5 shadow-xs space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Session Depth & Telemetry Summary
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Aggregate browse volume and engagement density over 30 days.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  <Layers className="w-3 h-3 text-teal-700" />
                  <span>GA4 Validated</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs">
                <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 block">Total Pageviews</span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums mt-0.5 block">
                    {totalPageviews.toLocaleString()}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 block">Recorded screens</span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 block">Pages Per Visitor</span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums mt-0.5 block">
                    {pagesPerUser}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 block">Views / audience</span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 block">Avg Duration</span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums mt-0.5 block">
                    {avgDurationLabel}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 block">Per session</span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 block">Bounce Rate</span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums mt-0.5 block">
                    {bounceRateLabel}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 block">Single visits</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* High-Density Clean Empty State Card */
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-8 sm:p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Awaiting 30-Day Audience Records
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                GA4 property has not logged audience sessions in this 30-day window yet. Acquisition ratios, device splits, and session duration metrics will appear once visitor traffic is processed.
              </p>
            </div>
            <div className="pt-1 flex items-center justify-center gap-2">
              <Link
                to="/admin/google/overview"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200 transition-colors"
              >
                <Activity className="w-3.5 h-3.5 text-teal-700" />
                <span>View Live Activity</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
