import React, { useState, useEffect } from "react";
import { AlertCircle, RotateCw, Trash2, Edit3, Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import { useCategories } from "../../../../hooks/useCategories";
import BaseModal from "../../../../components/common/BaseModal";

export function EditBusinessModal({
  isOpen,
  onClose,
  business,
  onUpdate,
  isUpdating,
}) {
  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    name: business?.name || "",
    category: business?.category || "",
    description: business?.description || "",
    address: business?.address || "",
    phone: business?.phone || "",
    website: business?.website || "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  // Sync state when modal opens or business prop updates
  useEffect(() => {
    if (isOpen && business) {
      setFormData({
        name: business.name || "",
        category: business.category || "",
        description: business.description || "",
        address: business.address || "",
        phone: business.phone || "",
        website: business.website || "",
      });
      setSelectedImage(null);
      setImagePreview(null);
      setError(null);
    }
  }, [isOpen, business]);

  if (!isOpen || !business) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image file size must be 5MB or less.");
      return;
    }
    setError(null);
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Business name is required.");
      toast.error("Business name is required.");
      return;
    }

    const payload = {
      ...formData,
      ...(selectedImage ? { image: selectedImage } : {}),
    };

    const res = await onUpdate(business.id, payload);
    if (res.success) {
      toast.success("Business details updated successfully.");
      onClose();
    } else {
      const errMsg = res.message || "Failed to update business.";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Business Details"
      icon={<Edit3 className="w-4 h-4 text-teal-600" />}
      titleId="edit-business-title"
      maxWidth="max-w-lg"
      isProcessing={isUpdating}
      className="max-h-[90dvh] sm:max-h-[85vh] flex flex-col"
    >
      <div className="flex-1 min-h-0 flex flex-col">
        {error && (
          <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2 mb-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-3.5 sm:space-y-4 text-xs">
            {/* Logo Upload Section */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Business Logo / Image (Optional)
              </label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : business.image_url ? (
                    <img
                      src={business.image_url}
                      alt="Current Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <label
                      htmlFor="edit-biz-logo-input"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 font-medium text-slate-700 transition-colors focus-within:ring-2 focus-within:ring-teal-600 min-h-[44px] sm:min-h-[36px]"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>{selectedImage ? "Change Image" : "Replace Logo"}</span>
                      <input
                        id="edit-biz-logo-input"
                        name="logo"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                        style={{ display: "none" }}
                        disabled={isUpdating}
                        aria-label="Upload storefront logo"
                      />
                    </label>
                    {selectedImage && (
                      <button
                        type="button"
                        onClick={handleRemoveSelectedImage}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 px-2.5 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer min-h-[44px] sm:min-h-[36px]"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {selectedImage ? selectedImage.name : "JPEG, PNG, or WebP up to 5MB"}
                  </p>
                </div>
              </div>
            </div>

            {/* Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div>
                <label htmlFor="edit-biz-name" className="block font-semibold text-slate-700 mb-1">
                  Business Name *
                </label>
                <input
                  id="edit-biz-name"
                  type="text"
                  name="name"
                  autoComplete="organization"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isUpdating}
                  aria-required="true"
                  aria-invalid={Boolean(error && !formData.name.trim())}
                  aria-describedby={error && !formData.name.trim() ? "edit-biz-name-error" : undefined}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 min-h-[44px] sm:min-h-[38px] text-base sm:text-xs text-slate-900 ${
                    error && !formData.name.trim()
                      ? "border-red-400 focus:ring-red-600 bg-red-50/20"
                      : "border-slate-300 focus:ring-teal-600"
                  }`}
                />
                {error && !formData.name.trim() && (
                  <p id="edit-biz-name-error" role="alert" className="mt-1 text-[11px] text-red-600 font-medium">
                    Business name is required.
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="edit-biz-category" className="block font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  id="edit-biz-category"
                  name="category"
                  autoComplete="off"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] sm:min-h-[38px] bg-white text-base sm:text-xs text-slate-900"
                >
                  <option value="">Select category...</option>
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
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="edit-biz-description" className="block font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                id="edit-biz-description"
                name="description"
                autoComplete="off"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                disabled={isUpdating}
                placeholder="Tell customers about your products or services..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none text-base sm:text-xs text-slate-900 leading-relaxed"
              />
            </div>

            {/* Full-width Address */}
            <div>
              <label htmlFor="edit-biz-address" className="block font-semibold text-slate-700 mb-1">
                Address
              </label>
              <input
                id="edit-biz-address"
                type="text"
                name="address"
                autoComplete="street-address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isUpdating}
                placeholder="Street, Barangay, City, Province"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] sm:min-h-[38px] text-base sm:text-xs text-slate-900"
              />
            </div>

            {/* Phone & Website (2 Columns on tablet+, 1 column on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div>
                <label htmlFor="edit-biz-phone" className="block font-semibold text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  id="edit-biz-phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                  placeholder="+63 9..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] sm:min-h-[38px] text-base sm:text-xs text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="edit-biz-website" className="block font-semibold text-slate-700 mb-1">
                  Website
                </label>
                <input
                  id="edit-biz-website"
                  type="url"
                  name="website"
                  autoComplete="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] sm:min-h-[38px] text-base sm:text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Docked Action Footer: Grid on mobile, flex-end on desktop */}
          <div className="pt-3 mt-2 border-t border-slate-100 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end sm:gap-2.5 shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer min-h-[44px] sm:min-h-[38px] text-xs text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold cursor-pointer disabled:opacity-50 min-h-[44px] sm:min-h-[38px] text-xs"
            >
              {isUpdating ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
}

export function DeleteBusinessModal({
  isOpen,
  onClose,
  business,
  onDelete,
  isDeleting,
}) {
  const [confirmationInput, setConfirmationInput] = useState("");
  const [error, setError] = useState(null);

  if (!isOpen || !business) return null;

  const isConfirmed = confirmationInput.trim() === business.name.trim();

  const handleConfirmDelete = async () => {
    if (!isConfirmed) return;
    const res = await onDelete(business.id);
    if (res.success) {
      toast.success("Business storefront deleted successfully.");
      onClose();
    } else {
      const errMsg = res.message || "Failed to delete business.";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      titleId="delete-business-title"
      maxWidth="max-w-md"
      isProcessing={isDeleting}
      showCloseButton={false}
      className="border-red-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
          <Trash2 className="w-5 h-5" />
        </div>
        <div>
          <h2 id="delete-business-title" className="text-sm font-bold text-slate-900">
            Delete Business Storefront?
          </h2>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            This action <strong className="text-red-700">cannot be undone</strong>. Deleting{" "}
            <strong className="text-slate-900">{business.name}</strong> will permanently remove all associated customer reviews, ratings, and media assets.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-1.5 text-xs">
        <label htmlFor="delete-biz-confirm" className="block text-slate-700 font-medium">
          Please type <strong className="font-mono text-slate-900">{business.name}</strong> to confirm:
        </label>
        <input
          id="delete-biz-confirm"
          name="confirmDelete"
          type="text"
          autoComplete="off"
          value={confirmationInput}
          onChange={(e) => setConfirmationInput(e.target.value)}
          disabled={isDeleting}
          placeholder={business.name}
          aria-invalid={Boolean(confirmationInput && !isConfirmed)}
          aria-describedby="delete-biz-confirm-desc"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 min-h-[44px] sm:min-h-[38px] text-base sm:text-xs text-slate-900 ${
            confirmationInput && !isConfirmed
              ? "border-red-400 focus:ring-red-600 bg-red-50/20"
              : "border-slate-300 focus:ring-red-600"
          }`}
        />
        <p id="delete-biz-confirm-desc" className="text-[11px] text-slate-500">
          Case-sensitive. Must match &ldquo;{business.name}&rdquo; exactly to enable deletion.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end sm:gap-2 pt-3 border-t border-slate-100 text-xs font-semibold">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="w-full sm:w-auto px-3.5 py-2.5 sm:py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer min-h-[44px] sm:min-h-[38px] text-center"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirmDelete}
          disabled={!isConfirmed || isDeleting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer disabled:opacity-40 min-h-[44px] sm:min-h-[38px]"
        >
          {isDeleting ? (
            <>
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>Deleting...</span>
            </>
          ) : (
            <>
              <Trash2 className="w-3.5 h-3.5" />
              <span>Permanently Delete</span>
            </>
          )}
        </button>
      </div>
    </BaseModal>
  );
}
