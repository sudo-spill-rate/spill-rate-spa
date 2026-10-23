import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import {
  Upload,
  X,
  AlertCircle,
  Building,
  RotateCw,
} from "lucide-react";
import { useBusinessProfile } from "../../hooks/useBusinessProfile";
import { useBusinessDirectory } from "../../hooks/useBusinessDirectory";
import { useCategories } from "../../hooks/useCategories";

/**
 * Reusable 3-step unified Storefront Registration Form.
 * Adheres to WCAG AA, Anti-AI-Slop and responsive layout standards.
 *
 * @param {Object} props
 * @param {string|((slug: string) => string)} [props.onSuccessRedirect="/dashboard/business"] - Path to navigate on success
 * @param {string} [props.onCancelRedirect="/dashboard"] - Path to navigate on cancel
 * @param {string} [props.quotaDashboardPath="/dashboard"] - Destination link when account quota limit is reached
 * @param {function} [props.onSuccess] - Optional callback invoked with the created business record
 * @param {function} [props.onCancel] - Optional cancel callback override
 */
export default function StorefrontWizardForm({
  onSuccessRedirect,
  onCancelRedirect = "/dashboard",
  quotaDashboardPath = "/dashboard",
  onSuccess,
  onCancel,
}) {
  const navigate = useNavigate();
  const { createBusiness, isCreating } = useBusinessProfile();
  const { businesses, isLoading: isBusinessesLoading, refetch } = useBusinessDirectory();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const businessCount = businesses?.length || 0;
  const quotaLimit = 5;
  const isAtQuota = !isBusinessesLoading && businessCount >= quotaLimit;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    phone: "",
    website: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (serverError) setServerError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        image: "Image size must be 5MB or less.",
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFormErrors((prev) => ({
        ...prev,
        image: "Please upload a valid image file (PNG, JPG, or WebP).",
      }));
      return;
    }

    setFormErrors((prev) => ({ ...prev, image: null }));
    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormErrors((prev) => ({ ...prev, image: null }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Storefront name is required.";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Storefront name must be at least 2 characters.";
    }

    if (!formData.category.trim()) {
      errors.category = "Industry category is required.";
    }

    if (!formData.description.trim()) {
      errors.description = "A short storefront description is required.";
    } else if (formData.description.trim().length > 300) {
      errors.description = `Description exceeds 300 characters (${formData.description.trim().length}/300).`;
    }

    if (!formData.phone.trim()) {
      errors.phone = "Contact phone is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAtQuota || isCreating) return;
    if (!validate()) return;

    setServerError(null);

    const result = await createBusiness({
      name: formData.name.trim(),
      category: formData.category.trim() || undefined,
      description: formData.description.trim(),
      address: formData.address.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      website: formData.website.trim() || undefined,
      image: selectedImage || undefined,
    });

    if (result.success && result.data) {
      toast.success("Business storefront registered successfully!");
      if (refetch) refetch();

      if (onSuccess) {
        onSuccess(result.data);
      } else if (typeof onSuccessRedirect === "function") {
        navigate(onSuccessRedirect(result.data.slug), { replace: true });
      } else if (onSuccessRedirect) {
        navigate(onSuccessRedirect, { replace: true });
      } else {
        navigate(`/dashboard/business/${result.data.slug}`, { replace: true });
      }
    } else {
      const errMsg =
        result.message || "Failed to register storefront. Please try again.";
      setServerError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else if (onCancelRedirect) {
      navigate(onCancelRedirect);
    } else {
      navigate("/dashboard");
    }
  };

  const slugPreview = formData.name.trim()
    ? formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "your-storefront-slug";

  const descriptionLength = formData.description.length;
  const isOverCharLimit = descriptionLength > 300;

  // Loading Skeleton State while storefronts or profile quota resolves
  if (isBusinessesLoading) {
    return (
      <div
        className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-6 shadow-xs animate-pulse space-y-4"
        aria-busy="true"
        aria-label="Loading storefront registration form"
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="h-5 w-48 bg-slate-200 rounded" />
            <div className="h-3 w-64 bg-slate-100 rounded" />
          </div>
          <div className="h-6 w-20 bg-slate-100 rounded-full" />
        </div>
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="h-14 bg-slate-100 rounded-lg" />
            <div className="h-14 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-24 bg-slate-100 rounded-lg" />
          <div className="h-14 bg-slate-100 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="h-14 bg-slate-100 rounded-lg" />
            <div className="h-14 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Quota Reached View
  if (isAtQuota) {
    return (
      <div
        role="alert"
        className="bg-white rounded-xl border border-amber-200/90 p-6 sm:p-8 shadow-xs text-center space-y-3.5"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto shadow-2xs">
          <AlertCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900">
            Account Quota Limit Reached ({quotaLimit} of {quotaLimit})
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            You have already registered the maximum limit of {quotaLimit} active storefronts on this account. Manage existing storefronts or remove inactive profiles to register a new one.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to={quotaDashboardPath}
            className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors min-h-[44px] shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-700"
          >
            Return to Storefronts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      {/* Server Error Alert */}
      {serverError && (
        <div
          role="alert"
          className="mb-3.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-2.5 shadow-xs"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">Error:</span> {serverError}
          </div>
        </div>
      )}

      {/* Main Registration Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Card Header: Title & Quota Counter */}
        <div className="px-4 py-3.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Register New Storefront
            </h1>
            <p className="text-xs text-slate-600 truncate sm:whitespace-normal">
              Create a public storefront to collect verified customer ratings and feedback.
            </p>
          </div>
          <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full shadow-2xs shrink-0">
            Slot {businessCount + 1} of {quotaLimit}
          </span>
        </div>

        {/* Form Body: Grouped in Logical Sections */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Section 1: Storefront Profile */}
          <div className="space-y-3.5">
            <div className="border-b border-slate-100 pb-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Storefront Profile
              </h2>
            </div>

            {/* Row 1: Storefront Name & Industry Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Storefront Name */}
              <div>
                <label
                  htmlFor="biz-name"
                  className="block text-xs font-semibold text-slate-800 mb-1"
                >
                  Storefront Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="biz-name"
                  name="name"
                  type="text"
                  autoComplete="organization"
                  required
                  disabled={isCreating}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Kape Balangay Roastery"
                  aria-invalid={!!formErrors.name}
                  aria-describedby={formErrors.name ? "name-error" : undefined}
                  className={`w-full px-3 py-2 text-base sm:text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 min-h-[44px] transition-colors ${
                    formErrors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-300 focus:border-teal-700"
                  } disabled:bg-slate-50 disabled:text-slate-400`}
                />
                {formErrors.name ? (
                  <p id="name-error" className="mt-1 text-xs text-red-600 font-medium">
                    {formErrors.name}
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <span>Public URL:</span>
                    <span className="font-mono text-slate-700 font-medium truncate">
                      /business/{slugPreview}
                    </span>
                  </p>
                )}
              </div>

              {/* Industry Category */}
              <div>
                <label
                  htmlFor="biz-category"
                  className="block text-xs font-semibold text-slate-800 mb-1"
                >
                  Industry Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="biz-category"
                  name="category"
                  autoComplete="off"
                  required
                  disabled={isCreating}
                  value={formData.category}
                  onChange={handleInputChange}
                  aria-invalid={!!formErrors.category}
                  aria-describedby={formErrors.category ? "category-error" : undefined}
                  className={`w-full px-3 py-2 text-base sm:text-sm rounded-lg border bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700 min-h-[44px] transition-colors ${
                    formErrors.category
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-300 focus:border-teal-700"
                  } disabled:bg-slate-50 disabled:text-slate-400`}
                >
                  <option value="">Select industry category...</option>
                  {categories.map((cat) => {
                    const catName = typeof cat === "string" ? cat : cat.name;
                    const catKey = typeof cat === "string" ? cat : cat.id || cat.slug || cat.name;
                    return (
                      <option key={catKey} value={catName}>
                        {catName}
                      </option>
                    );
                  })}
                </select>
                {formErrors.category && (
                  <p id="category-error" className="mt-1 text-xs text-red-600 font-medium">
                    {formErrors.category}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Storefront Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="biz-description"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Storefront Description <span className="text-red-500">*</span>
                </label>
                <span
                  className={`text-[11px] font-mono font-medium ${
                    isOverCharLimit
                      ? "text-red-600 font-bold"
                      : descriptionLength > 270
                      ? "text-amber-600"
                      : "text-slate-500"
                  }`}
                >
                  {descriptionLength} / 300
                </span>
              </div>
              <textarea
                id="biz-description"
                name="description"
                autoComplete="off"
                rows={2}
                required
                disabled={isCreating}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your products, services, and specialties in 1 to 2 clear sentences."
                aria-invalid={!!formErrors.description || isOverCharLimit}
                aria-describedby={formErrors.description ? "desc-error" : undefined}
                className={`w-full px-3 py-2 text-base sm:text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 transition-colors ${
                  formErrors.description || isOverCharLimit
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-300 focus:border-teal-700"
                } disabled:bg-slate-50 disabled:text-slate-400`}
              />
              {formErrors.description && (
                <p id="desc-error" className="mt-1 text-xs text-red-600 font-medium">
                  {formErrors.description}
                </p>
              )}
            </div>

            {/* Row 3: Storefront Logo or Photo */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Storefront Logo or Photo <span className="text-xs font-normal text-slate-500">(Optional)</span>
              </label>

              {imagePreview ? (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <img
                    src={imagePreview}
                    alt="Logo preview"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0 bg-white shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {selectedImage?.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {selectedImage?.size
                        ? `${(selectedImage.size / (1024 * 1024)).toFixed(2)} MB`
                        : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isCreating}
                    className="p-2.5 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
                    aria-label="Remove storefront image"
                    title="Remove storefront image"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="biz-logo-upload"
                  className="flex items-center gap-3 border border-dashed border-slate-300 hover:border-teal-600 rounded-xl p-3 cursor-pointer bg-slate-50/60 hover:bg-slate-50 active:bg-slate-100 transition-colors min-h-[44px] focus-within:ring-2 focus-within:ring-teal-700 focus-within:ring-offset-2"
                >
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-2xs">
                    <Upload className="w-5 h-5 text-slate-600" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-teal-800 hover:underline block truncate">
                      Choose storefront logo or photo
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      PNG, JPG, or WebP up to 5MB
                    </span>
                  </div>
                  <input
                    id="biz-logo-upload"
                    name="logo"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    disabled={isCreating}
                    aria-label="Upload storefront logo image"
                    className="sr-only"
                  />
                </label>
              )}
              {formErrors.image && (
                <p className="mt-1 text-xs text-red-600 font-medium">{formErrors.image}</p>
              )}
            </div>
          </div>

          {/* Section 2: Contact & Location Details */}
          <div className="space-y-3.5 pt-2 border-t border-slate-100">
            <div className="border-b border-slate-100 pb-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Contact & Location
              </h2>
            </div>

            {/* Row 4: Phone and Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Contact Phone */}
              <div>
                <label
                  htmlFor="biz-phone"
                  className="block text-xs font-semibold text-slate-800 mb-1"
                >
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="biz-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  disabled={isCreating}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+63 917 123 4567"
                  aria-invalid={!!formErrors.phone}
                  aria-describedby={formErrors.phone ? "phone-error" : undefined}
                  className={`w-full px-3 py-2 text-base sm:text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 min-h-[44px] transition-colors ${
                    formErrors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-300 focus:border-teal-700"
                  } disabled:bg-slate-50 disabled:text-slate-400`}
                />
                {formErrors.phone && (
                  <p id="phone-error" className="mt-1 text-xs text-red-600 font-medium">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Website URL */}
              <div>
                <label
                  htmlFor="biz-website"
                  className="block text-xs font-semibold text-slate-800 mb-1"
                >
                  Website URL <span className="text-xs font-normal text-slate-500">(Optional)</span>
                </label>
                <input
                  id="biz-website"
                  name="website"
                  type="url"
                  autoComplete="url"
                  disabled={isCreating}
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 text-base sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 min-h-[44px] transition-colors disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
            </div>

            {/* Row 5: Physical Address */}
            <div>
              <label
                htmlFor="biz-address"
                className="block text-xs font-semibold text-slate-800 mb-1"
              >
                Physical Address <span className="text-xs font-normal text-slate-500">(Optional)</span>
              </label>
              <input
                id="biz-address"
                name="address"
                type="text"
                autoComplete="street-address"
                disabled={isCreating}
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g., 123 Rizal St., Poblacion, Makati City"
                className="w-full px-3 py-2 text-base sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 min-h-[44px] transition-colors disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Card Footer: Responsive actions */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <p className="text-xs text-slate-600 hidden sm:block">
            Storefront will be published immediately upon registration.
          </p>

          <div className="w-full sm:w-auto flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 sm:ml-auto">
            <button
              type="button"
              onClick={handleCancelClick}
              disabled={isCreating}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors min-h-[44px] shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-700 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreating || isOverCharLimit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900 rounded-xl transition-colors min-h-[44px] shadow-xs disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Registering storefront...</span>
                </>
              ) : (
                <>
                  <Building className="w-4 h-4" aria-hidden="true" />
                  <span>Register Storefront</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
