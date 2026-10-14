import React from "react";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import AdminCreateStorefrontForm from "../components/createStorefront/AdminCreateStorefrontForm";

export default function AdminCreateStorefrontPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/admin/my-store");
  };

  return (
    <AdminLayout>
      <div className="space-y-3">
        {/* Compact Back Link */}
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded p-1 min-h-[36px] cursor-pointer"
            aria-label="Back to storefronts"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Form Component */}
        <AdminCreateStorefrontForm />
      </div>
    </AdminLayout>
  );
}

