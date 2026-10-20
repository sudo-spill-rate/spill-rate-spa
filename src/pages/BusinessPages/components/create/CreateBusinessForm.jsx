import React from "react";
import StorefrontWizardForm from "../../../../components/common/StorefrontWizardForm";

/**
 * CreateBusinessForm (Merchant View)
 * Clean wrapper around shared StorefrontWizardForm.
 */
export default function CreateBusinessForm() {
  return (
    <StorefrontWizardForm
      onSuccessRedirect={(slug) => `/dashboard/business/${slug}`}
      onCancelRedirect="/dashboard"
      quotaDashboardPath="/dashboard"
    />
  );
}
