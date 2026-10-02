import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Upload,
  X,
  AlertCircle,
  Building,
  RotateCw,
} from "lucide-react";
import { useBusinessProfile } from "../../../../hooks/useBusinessProfile";
import { useBusinessDirectory } from "../../../../hooks/useBusinessDirectory";

const CATEGORIES = [
  "Food & Beverage",
  "Retail & Shopping",
  "Health & Wellness",
  "Technology & IT",
  "Professional Services",
  "Automotive",
  "Hospitality & Tourism",
  "Education",
  "Beauty & Personal Care",
  "Other",
];

export default function CreateBusinessForm() {
  const navigate = useNavigate();
  const { createBusiness, isCreating } = useBusinessProfile();
  const { businesses } = useBusinessDirectory();

  const businessCount = businesses?.length || 0;
  const isAtQuota = businessCount >= 5;

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
        image: "Please upload a valid image file (PNG, JPG, WebP).",
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
      errors.name = "Business name is required.";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Business name must be at least 2 characters.";
    }

    if (!formData.description.trim()) {
      errors.description = "A short business description is required.";
    } else if (formData.description.trim().length > 300) {
      errors.description = `Description exceeds 300 characters (${formData.description.trim().length}/300).`;
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
      navigate(`/dashboard/business/${result.data.slug}`, { replace: true });
    } else {
      setServerError(
        result.message || "Failed to create business profile. Please try again."
      );
    }
  };

  const descriptionLength = formData.description.length;
  const isOverCharLimit = descriptionLength > 300;

  if (isAtQuota) {
    return (
      <div
        role="alert"
        className="bg-white rounded-xl border border-amber-200 p-6 sm:p-8 shadow-xs text-center space-y-4"
      >
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Account Quota Reached
          </h2>
          <p className="mt-1 text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            You have already registered 5 businesses under your free plan. To add more profiles, you may contact support for a quota upgrade or manage your existing businesses.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors min-h-[44px]"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Server Error Alert */}
      {serverError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3 shadow-xs"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">Error:</span> {serverError}
          </div>
        </div>
      )}

      {/* Card 1: Core Profile Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">General Information</h2>
          <p className="text-xs text-slate-500 mt-0.5">Primary information displayed on your public page.</p>
        </div>

        {/* Business Name */}
        <div>
          <label
            htmlFor="biz-name"
            className="block text-xs font-semibold text-slate-800 mb-1.5"
          >
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            id="biz-name"
            name="name"
            type="text"
            required
            disabled={isCreating}
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Kape Balangay Roastery"
            aria-invalid={!!formErrors.name}
            aria-describedby={formErrors.name ? "name-error" : undefined}
            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] ${
              formErrors.name
                ? "border-red-500 focus:border-red-500"
                : "border-slate-300 focus:border-teal-600"
            } disabled:bg-slate-50 disabled:text-slate-400`}
          />
          {formErrors.name && (
            <p id="name-error" className="mt-1 text-xs text-red-600">
              {formErrors.name}
            </p>
          )}
        </div>

        {/* Primary Category */}
        <div>
          <label
            htmlFor="biz-category"
            className="block text-xs font-semibold text-slate-800 mb-1.5"
          >
            Category <span className="text-xs font-normal text-slate-400">(Optional)</span>
          </label>
          <select
            id="biz-category"
            name="category"
            disabled={isCreating}
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 min-h-[44px] disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">Select industry category...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="biz-description"
              className="block text-xs font-semibold text-slate-800"
            >
              Short Description <span className="text-red-500">*</span>
            </label>
            <span
              className={`text-xs font-mono font-medium ${
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
            id="biz-description"
            name="description"
            rows={3}
            required
            disabled={isCreating}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Tell customers what your business offers and what sets you apart (up to 300 characters)."
            aria-invalid={!!formErrors.description || isOverCharLimit}
            aria-describedby={formErrors.description ? "desc-error" : undefined}
            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
              formErrors.description || isOverCharLimit
                ? "border-red-500 focus:border-red-500"
                : "border-slate-300 focus:border-teal-600"
            } disabled:bg-slate-50 disabled:text-slate-400`}
          />
          {formErrors.description && (
            <p id="desc-error" className="mt-1 text-xs text-red-600">
              {formErrors.description}
            </p>
          )}
        </div>
      </div>

      {/* Card 2: Storefront & Contact Details (Optional) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Storefront & Contact Details</h2>
          <p className="text-xs text-slate-500 mt-0.5">Help customers locate, recognize, and connect with your store.</p>
        </div>

        {/* Logo / Photo Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Storefront Logo or Photo <span className="text-xs font-normal text-slate-400">(Optional)</span>
          </label>

          {imagePreview ? (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <img
                src={imagePreview}
                alt="Logo preview"
                className="w-14 h-14 object-cover rounded-md border border-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
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
                className="p-2 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-600"
                aria-label="Remove uploaded image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-3 border border-dashed border-slate-300 hover:border-slate-400 rounded-lg p-3.5 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors min-h-[44px]">
              <div className="w-9 h-9 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-teal-700 hover:underline block truncate">
                  Choose logo image
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  PNG, JPG, or WebP up to 5MB
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

        {/* Contact Phone & Website */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label
              htmlFor="biz-phone"
              className="block text-xs font-semibold text-slate-800 mb-1.5"
            >
              Contact Phone <span className="text-xs font-normal text-slate-400">(Optional)</span>
            </label>
            <input
              id="biz-phone"
              name="phone"
              type="tel"
              disabled={isCreating}
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+63 917 123 4567"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 min-h-[44px] disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="biz-website"
              className="block text-xs font-semibold text-slate-800 mb-1.5"
            >
              Website <span className="text-xs font-normal text-slate-400">(Optional)</span>
            </label>
            <input
              id="biz-website"
              name="website"
              type="url"
              disabled={isCreating}
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 min-h-[44px] disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
        </div>

        {/* Physical Address */}
        <div>
          <label
            htmlFor="biz-address"
            className="block text-xs font-semibold text-slate-800 mb-1.5"
          >
            Physical Address <span className="text-xs font-normal text-slate-400">(Optional)</span>
          </label>
          <input
            id="biz-address"
            name="address"
            type="text"
            disabled={isCreating}
            value={formData.address}
            onChange={handleInputChange}
            placeholder="e.g., 123 Rizal St., Poblacion, Makati City"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 min-h-[44px] disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          disabled={isCreating}
          className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] text-center"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isCreating || isOverCharLimit}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors min-h-[44px] shadow-xs disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
        >
          {isCreating ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Registering Profile...</span>
            </>
          ) : (
            <>
              <Building className="w-4 h-4" />
              <span>Register Business</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}