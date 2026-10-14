import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  Upload,
  X,
  AlertCircle,
  Building,
  RotateCw,
} from "lucide-react";
import { useBusinessProfile } from "../../../../hooks/useBusinessProfile";
import { useBusinessDirectory } from "../../../../hooks/useBusinessDirectory";
import { useCategories } from "../../../../hooks/useCategories";

export default function AdminCreateStorefrontForm({ onSuccess, onCancel }) {
  const navigate = useNavigate();
  const { createBusiness, isCreating } = useBusinessProfile();
  const { businesses, refetch } = useBusinessDirectory();
  const { categories } = useCategories();

  const businessCount = businesses?.length || 0;
  const quotaLimit = 5;
  const isAtQuota = businessCount >= quotaLimit;

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
      if (refetch) refetch();
      if (onSuccess) {
        onSuccess(result.data);
      } else {
        navigate(`/admin/my-store/${result.data.slug}`, { replace: true });
      }
    } else {
      setServerError(
        result.message || "Failed to register storefront. Please try again."
      );
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/admin/my-store");
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

  // Quota Reached View
  if (isAtQuota) {
    return (
      <div
        role="alert"
        className="bg-white rounded-xl border border-amber-200 p-5 sm:p-6 shadow-xs text-center space-y-3"
      >
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
          <AlertCircle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Account Quota Limit Reached
          </h2>
          <p className="mt-1 text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            You have already registered the maximum limit of {quotaLimit} active storefronts on your account. Manage your existing storefronts or contact support for a quota upgrade.
          </p>
        </div>
        <div className="pt-1">
          <Link
            to="/admin/my-store"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors min-h-[40px] shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            Return to My Storefront
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      {/* Server Error Alert */}
      {serverError && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-2.5 shadow-xs"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">Error:</span> {serverError}
          </div>
        </div>
      )}

      {/* Single Consolidated Registration Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Card Header: Compact title & Quota Badge */}
        <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">
              Register New Storefront
            </h1>
            <p className="text-[11px] text-slate-500">
              Create a public profile to start collecting verified customer feedback.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-full shadow-2xs shrink-0">
            Slot {businessCount + 1} of {quotaLimit}
          </span>
        </div>

        {/* Form Body: Compact grid layout */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Row 1: Name and Category in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Storefront Name */}
            <div>
              <label
                htmlFor="admin-biz-name"
                className="block text-xs font-semibold text-slate-800 mb-1"
              >
                Storefront Name <span className="text-red-500">*</span>
              </label>
              <input
                id="admin-biz-name"
                name="name"
                type="text"
                required
                disabled={isCreating}
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Kape Balangay Roastery"
                aria-invalid={!!formErrors.name}
                aria-describedby={formErrors.name ? "admin-name-error" : undefined}
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[40px] ${
                  formErrors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-300 focus:border-teal-600"
                } disabled:bg-slate-50 disabled:text-slate-400`}
              />
              {formErrors.name ? (
                <p id="admin-name-error" className="mt-1 text-xs text-red-600">
                  {formErrors.name}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-500 flex items-center gap-1 truncate">
                  <span>Slug:</span>
                  <span className="font-mono text-slate-700 font-medium">
                    /business/{slugPreview}
                  </span>
                </p>
              )}
            </div>

            {/* Industry Category */}
            <div>
              <label
                htmlFor="admin-biz-category"
                className="block text-xs font-semibold text-slate-800 mb-1"
              >
                Industry Category <span className="text-red-500">*</span>
              </label>
              <select
                id="admin-biz-category"
                name="category"
                required
                disabled={isCreating}
                value={formData.category}
                onChange={handleInputChange}
                aria-invalid={!!formErrors.category}
                aria-describedby={formErrors.category ? "admin-category-error" : undefined}
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-lg border bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[40px] ${
                  formErrors.category
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-300 focus:border-teal-600"
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
                <p id="admin-category-error" className="mt-1 text-xs text-red-600">
                  {formErrors.category}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="admin-biz-description"
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
                    : "text-slate-400"
                }`}
              >
                {descriptionLength} / 300
              </span>
            </div>
            <textarea
              id="admin-biz-description"
              name="description"
              rows={2}
              required
              disabled={isCreating}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your products, services, and specialties in 1 to 2 clear sentences."
              aria-invalid={!!formErrors.description || isOverCharLimit}
              aria-describedby={formErrors.description ? "admin-desc-error" : undefined}
              className={`w-full px-3 py-2 text-xs sm:text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                formErrors.description || isOverCharLimit
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 focus:border-teal-600"
              } disabled:bg-slate-50 disabled:text-slate-400`}
            />
            {formErrors.description && (
              <p id="admin-desc-error" className="mt-1 text-xs text-red-600">
                {formErrors.description}
              </p>
            )}
          </div>

          {/* Row 3: Logo Upload & Contact in a compact 2-column grid */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Column 1: Logo or Storefront Photo */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Storefront Logo or Photo <span className="text-xs font-normal text-slate-400">(Optional)</span>
              </label>

              {imagePreview ? (
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <img
                    src={imagePreview}
                    alt="Logo preview"
                    className="w-11 h-11 object-cover rounded-lg border border-slate-200 shrink-0"
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
                    className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-3 border border-dashed border-slate-300 hover:border-slate-400 rounded-lg p-2.5 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors min-h-[44px]">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                    <Upload className="w-4 h-4 text-slate-600" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-teal-700 hover:underline block truncate">
                      Choose logo image
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      PNG, JPG, WebP up to 5MB
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    disabled={isCreating}
                    className="sr-only"
                  />
                </label>
              )}
              {formErrors.image && (
                <p className="mt-1 text-xs text-red-600">{formErrors.image}</p>
              )}
            </div>

            {/* Column 2: Phone & Website stacked neatly */}
            <div className="space-y-2.5">
              <div>
                <label
                  htmlFor="admin-biz-phone"
                  className="block text-xs font-semibold text-slate-800 mb-1"
                >
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="admin-biz-phone"
                  name="phone"
                  type="tel"
                  required
                  disabled={isCreating}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+63 917 123 4567"
                  aria-invalid={!!formErrors.phone}
                  aria-describedby={formErrors.phone ? "admin-phone-error" : undefined}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[40px] ${
                    formErrors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-300 focus:border-teal-600"
                  } disabled:bg-slate-50 disabled:text-slate-400`}
                />
                {formErrors.phone && (
                  <p id="admin-phone-error" className="mt-1 text-xs text-red-600">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="admin-biz-website"
                  className="block text-xs font-semibold text-slate-800 mb-1"
                >
                  Website URL <span className="text-xs font-normal text-slate-400">(Optional)</span>
                </label>
                <input
                  id="admin-biz-website"
                  name="website"
                  type="url"
                  disabled={isCreating}
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[40px] disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Physical Address (full width) */}
          <div className="pt-3 border-t border-slate-100">
            <label
              htmlFor="admin-biz-address"
              className="block text-xs font-semibold text-slate-800 mb-1"
            >
              Physical Address <span className="text-xs font-normal text-slate-400">(Optional)</span>
            </label>
            <input
              id="admin-biz-address"
              name="address"
              type="text"
              disabled={isCreating}
              value={formData.address}
              onChange={handleInputChange}
              placeholder="e.g., 123 Rizal St., Poblacion, Makati City"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[40px] disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
        </div>

        {/* Card Footer: Compact actions */}
        <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Published immediately upon registration.
          </p>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleCancelClick}
              disabled={isCreating}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors min-h-[40px] shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreating || isOverCharLimit}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors min-h-[40px] shadow-xs disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <Building className="w-3.5 h-3.5" aria-hidden="true" />
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
