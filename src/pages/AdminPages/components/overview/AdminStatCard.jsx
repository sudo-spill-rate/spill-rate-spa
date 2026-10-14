import React from "react";

export default function AdminStatCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
      <div className="text-xs font-medium text-slate-500 mb-1">
        {title}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        {value}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

