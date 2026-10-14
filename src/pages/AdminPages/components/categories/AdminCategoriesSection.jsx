import React, { useState } from "react";
import { Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { useCategories } from "../../../../hooks/useCategories";
import { useAdmin } from "../../../../hooks/useAdmin";

export default function AdminCategoriesSection({ onOpenAddModal }) {
  const { categories, refetch } = useCategories();
  const { deleteCategory, isDeletingCategory } = useAdmin();

  const [notification, setNotification] = useState(null);
  const [errorNotification, setErrorNotification] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently remove category "${name}"?`)) return;
    setDeletingId(id);
    setErrorNotification(null);
    try {
      await deleteCategory(id);
      setNotification(`Category "${name}" removed successfully.`);
      refetch();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setErrorNotification(err?.message || "Failed to delete category.");
      setTimeout(() => setErrorNotification(null), 4000);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Notifications */}
      {notification && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>{notification}</span>
        </div>
      )}
      {errorNotification && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorNotification}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Industry Categories ({categories?.length || 0})
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Standard business taxonomy applied across directories and ratings.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-lg text-xs font-semibold cursor-pointer min-h-[38px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {(!categories || categories.length === 0) ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
          No categories registered. Click &ldquo;Add Category&rdquo; to create the first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id || cat.slug || cat.name}
              className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs hover:border-slate-300 transition-colors flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="font-semibold text-xs text-slate-900 truncate">{cat.name}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  /{cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}
                </p>
              </div>
              {cat.id && (
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  disabled={isDeletingCategory && deletingId === cat.id}
                  className="min-h-[36px] min-w-[36px] p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-red-500"
                  title={`Delete category ${cat.name}`}
                  aria-label={`Delete category ${cat.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
