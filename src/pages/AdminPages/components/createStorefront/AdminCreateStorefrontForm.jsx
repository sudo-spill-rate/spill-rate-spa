import React from "react";
import StorefrontWizardForm from "../../../../components/common/StorefrontWizardForm";

/**
 * AdminCreateStorefrontForm (Admin / Founder View)
 * Clean wrapper around shared StorefrontWizardForm.
 */
export default function AdminCreateStorefrontForm({ onSuccess, onCancel }) {
  return (
    <StorefrontWizardForm
      onSuccess={onSuccess}
      onCancel={onCancel}
      onSuccessRedirect={(slug) => `/admin/my-store/${slug}`}
      onCancelRedirect="/admin/my-store"
      quotaDashboardPath="/admin/my-store"
    />
  );
}
