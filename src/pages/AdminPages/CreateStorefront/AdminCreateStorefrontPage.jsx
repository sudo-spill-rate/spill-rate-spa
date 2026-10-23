import React from "react";
import AdminLayout from "../components/layout/AdminLayout";
import StorefrontWizardForm from "../../../components/common/StorefrontWizardForm";

export default function AdminCreateStorefrontPage() {
  return (
    <AdminLayout>
      <div className="w-full">
        <StorefrontWizardForm
          onSuccessRedirect={(slug) => `/admin/my-store/${slug}`}
          onCancelRedirect="/admin/my-store"
          quotaDashboardPath="/admin/my-store"
        />
      </div>
    </AdminLayout>
  );
}
