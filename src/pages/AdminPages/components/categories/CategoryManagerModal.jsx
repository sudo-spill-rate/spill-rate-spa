import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, AlertCircle, RotateCw } from "lucide-react";
import { useCategories } from "../../../../hooks/useCategories";
import { useAdmin } from "../../../../hooks/useAdmin";
import { useBodyScrollLock } from "../../../../hooks/useBodyScrollLock";

export default function CategoryManagerModal({ isOpen, onClose }) {
  useBodyScrollLock(isOpen);
  const { categories, refetch } = useCategories();
  const { addCategory, deleteCategory, isAddingCategory, isDeletingCategory } = useAdmin();

  const [newCatName, setNewCatName] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setError("Category name is required.");
      return;
    }
    setError(null);
    try {
      await addCategory({
        name: newCatName.trim(),
      });
      setNewCatName("");
      setSuccessMsg("Category added successfully.");
      refetch();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err?.message || "Failed to add category.");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove the category "${name}"?`)) return;
    setError(null);
    try {
      await deleteCategory(id);
      setSuccessMsg(`Category "${name}" removed.`);
      refetch();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err?.message || "Failed to delete category.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-manager-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg p-5 sm:p-6 my-auto space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 id="category-manager-title" className="text-sm font-bold text-slate-900">
              Manage Business Categories
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Add or remove directory industry categories.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800">
            {successMsg}
          </div>
        )}

        {/* Add New Category Input */}
        <form onSubmit={handleAdd} className="space-y-1.5">
          <label htmlFor="new-category-input" className="block text-xs font-semibold text-slate-700">
            Add New Category
          </label>
          <div className="flex gap-2">
            <input
              id="new-category-input"
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Healthcare, Automotive, FinTech"
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 min-h-[38px] transition-colors"
            />
            <button
              type="submit"
              disabled={isAddingCategory}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50 min-h-[38px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 shrink-0"
            >
              {isAddingCategory ? (
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>Add</span>
            </button>
          </div>
        </form>

        {/* Existing Categories List */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-slate-600 mb-2">
            Registered Categories ({categories?.length || 0})
          </p>
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
            {(!categories || categories.length === 0) ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No categories available.
              </div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id || cat.slug || cat.name}
                  className="flex items-center justify-between p-3 text-xs hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-slate-900">{cat.name}</span>
                    <span className="text-slate-500 font-mono text-[11px] ml-2">
                      /{cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}
                    </span>
                  </div>
                  {cat.id && (
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id, cat.name)}
                      disabled={isDeletingCategory}
                      className="min-h-[36px] min-w-[36px] p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-red-500"
                      title={`Delete category ${cat.name}`}
                      aria-label={`Delete category ${cat.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer min-h-[38px] transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
