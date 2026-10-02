import React from "react";
import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import CreateBusinessForm from "../components/create/CreateBusinessForm";

export default function CreateBusinessPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Back Link */}
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-1 min-h-[44px]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Page Heading */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Register Business
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Set up your public business profile to begin collecting authentic customer feedback.
          </p>
        </div>

        {/* Form Component */}
        <CreateBusinessForm />
      </div>
    </DashboardLayout>
  );
}