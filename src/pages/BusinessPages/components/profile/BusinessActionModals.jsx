import React, { useState } from "react";
import { X, AlertCircle, RotateCw, Trash2, Edit3, Upload } from "lucide-react";
import { useCategories } from "../../../../hooks/useCategories";
import { useBodyScrollLock } from "../../../../hooks/useBodyScrollLock";

export function EditBusinessModal({
  isOpen,
  onClose,
  business,
  onUpdate,
  isUpdating,
}) {
  useBodyScrollLock(isOpen);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Business name is required.");
      return;
    }

    const payload = {
      ...formData,
      ...(selectedImage ? { image: selectedImage } : {}),
    };

    const res = await onUpdate(business.id, payload);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || "Failed to update business.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-business-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isUpdating) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg p-5 sm:p-6 my-auto space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-teal-600" />
            <h2 id="edit-business-title" className="text-sm font-bold text-slate-900">
              Edit Business Details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
            aria-label="Close edit modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Logo Upload preview */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Business Logo / Image (Optional)
            </label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
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
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 font-medium text-slate-700 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Replace Logo</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="sr-only"
                  disabled={isUpdating}
                />
              </label>
            </div>
          </div>

          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isUpdating}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[38px]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={isUpdating}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[38px] bg-white"
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
            <label className="block font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              disabled={isUpdating}
              placeholder="Tell customers about your products or services..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
            />
          </div>

          {/* Address, Phone, Website */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isUpdating}
                placeholder="City / Address"
                className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[38px]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isUpdating}
                placeholder="+63 9..."
                className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[38px]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                disabled={isUpdating}
                placeholder="https://..."
                className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[38px]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold cursor-pointer disabled:opacity-50"
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
    </div>
  );
}

export function DeleteBusinessModal({
  isOpen,
  onClose,
  business,
  onDelete,
  isDeleting,
}) {
  useBodyScrollLock(isOpen);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [error, setError] = useState(null);

  if (!isOpen || !business) return null;

  const isConfirmed = confirmationInput.trim() === business.name.trim();

  const handleConfirmDelete = async () => {
    if (!isConfirmed) return;
    const res = await onDelete(business.id);
    if (!res.success) {
      setError(res.message || "Failed to delete business.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-business-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl border border-red-200 shadow-xl w-full max-w-md p-5 sm:p-6 my-auto space-y-4"
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
          <label className="block text-slate-700 font-medium">
            Please type <strong className="font-mono text-slate-900">{business.name}</strong> to confirm:
          </label>
          <input
            type="text"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            disabled={isDeleting}
            placeholder={business.name}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 min-h-[38px]"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs font-semibold">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={!isConfirmed || isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer disabled:opacity-40"
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
      </div>
    </div>
  );
}
