import React, { useState } from "react";
import { Trash2, RotateCw } from "lucide-react";
import { toast } from "react-toastify";
import { useUserAuth } from "../../../../hooks/useUserAuth";
import { useNavigate } from "react-router";
import BaseModal from "../../../../components/common/BaseModal";

export default function AccountSettingsModal({ isOpen, onClose }) {
  const { user, updateProfile, deleteAccount } = useUserAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [nameError, setNameError] = useState(null);

  // Danger zone confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");

  if (!isOpen || !user) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setNameError(null);

    if (!name.trim()) {
      const msg = "Name cannot be empty.";
      setNameError(msg);
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      setIsUpdating(true);
      const res = await updateProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
      });

      if (res.success) {
        toast.success("Profile updated successfully.");
        setMessage("Profile updated successfully.");
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errMsg = res.message || "Failed to update profile.";
        setError(errMsg);
        toast.error(errMsg);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()) {
      setError("Email address does not match.");
      toast.error("Email address does not match.");
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      const res = await deleteAccount();
      if (res.success) {
        toast.success("Account permanently deleted.");
        onClose();
        navigate("/", { replace: true });
      } else {
        const errMsg = res.message || "Failed to delete account.";
        setError(errMsg);
        toast.error(errMsg);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Account Settings"
      description="Manage your personal credentials and contact info."
      titleId="account-settings-title"
      maxWidth="max-w-md"
      isProcessing={isUpdating || isDeleting}
    >
        {/* Status Alerts */}
        {message && (
          <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs">
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs">
            <span>{error}</span>
          </div>
        )}

        {/* User Role Badge */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-600 font-medium">Access Level:</span>
          <span
            className={`font-semibold px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider ${
              user.role === "founder"
                ? "bg-teal-50 border border-teal-300 text-teal-800"
                : user.role === "admin" || user.is_admin
                ? "bg-slate-100 border border-slate-300 text-slate-800"
                : "bg-white border border-slate-200 text-slate-800"
            }`}
          >
            {user.role || (user.is_admin ? "admin" : "user")}
          </span>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleUpdate} className="space-y-3 text-xs">
          <div>
            <label htmlFor="settings-email" className="block font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              id="settings-email"
              name="email"
              type="email"
              autoComplete="email"
              disabled
              value={user.email}
              aria-describedby="settings-email-desc"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed min-h-[44px] sm:min-h-[38px] text-base sm:text-xs"
            />
            <p id="settings-email-desc" className="mt-1 text-[11px] text-slate-400">
              Linked to your Google OAuth sign-in.
            </p>
          </div>

          <div>
            <label htmlFor="settings-name" className="block font-semibold text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="settings-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
                if (error) setError(null);
              }}
              disabled={isUpdating}
              placeholder="Your full name"
              aria-required="true"
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? "settings-name-error" : undefined}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 min-h-[44px] sm:min-h-[38px] text-base sm:text-xs text-slate-900 ${
                nameError
                  ? "border-red-400 focus:ring-red-600 bg-red-50/20"
                  : "border-slate-300 focus:ring-teal-600"
              }`}
            />
            {nameError && (
              <p id="settings-name-error" role="alert" className="mt-1 text-[11px] text-red-600 font-medium">
                {nameError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="settings-phone" className="block font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              id="settings-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isUpdating}
              placeholder="+63 9..."
              aria-describedby="settings-phone-desc"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] sm:min-h-[38px] text-base sm:text-xs text-slate-900"
            />
            <p id="settings-phone-desc" className="mt-1 text-[11px] text-slate-400">
              Optional contact number for business inquiries.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold cursor-pointer disabled:opacity-50 min-h-[44px] sm:min-h-[38px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 w-full sm:w-auto"
            >
              <span>{isUpdating ? "Saving..." : "Save Profile"}</span>
            </button>
          </div>
        </form>

        {/* Danger Zone: Delete Account */}
        <div className="pt-3 border-t border-slate-200">
          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-800">Delete Account</p>
                <p className="text-[11px] text-slate-500">
                  Permanently remove account and all storefronts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer min-h-[44px] sm:min-h-[36px] flex items-center"
              >
                Delete Account
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <Trash2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-red-800 font-medium leading-relaxed">
                  Deleting your account will cascade delete all your registered businesses, reviews, and uploaded photos. This action cannot be undone.
                </p>
              </div>

              <div>
                <label htmlFor="settings-delete-confirm" className="block text-slate-700 font-medium mb-1">
                  Type <strong className="font-mono text-slate-900">{user.email}</strong> to confirm:
                </label>
                <input
                  id="settings-delete-confirm"
                  name="confirmEmail"
                  type="text"
                  autoComplete="off"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder={user.email}
                  disabled={isDeleting}
                  aria-invalid={Boolean(confirmEmail && confirmEmail.trim().toLowerCase() !== user.email.toLowerCase())}
                  aria-describedby="settings-delete-desc"
                  className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 min-h-[44px] sm:min-h-[38px] text-base sm:text-xs text-slate-900 ${
                    confirmEmail && confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()
                      ? "border-red-400 focus:ring-red-600 bg-red-50/20"
                      : "border-slate-300 focus:ring-red-600"
                  }`}
                />
                <p id="settings-delete-desc" className="mt-1 text-[11px] text-slate-500">
                  Case-insensitive. Must match your account email exactly to confirm.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer min-h-[44px] sm:min-h-[38px]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={confirmEmail.trim().toLowerCase() !== user.email.toLowerCase() || isDeleting}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer disabled:opacity-40 min-h-[44px] sm:min-h-[38px]"
                >
                  {isDeleting ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Permanently Delete</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
    </BaseModal>
  );
}
