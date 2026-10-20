import React, { useState } from "react";
import { UserCheck, AlertCircle, RotateCw } from "lucide-react";
import { useAdmin } from "../../../../hooks/useAdmin";
import BaseModal from "../../../../components/common/BaseModal";

export default function PromoteAdminModal({ isOpen, onClose }) {
  const { promoteAdmin, isPromoting } = useAdmin();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    try {
      const res = await promoteAdmin({
        email: email.trim().toLowerCase(),
        role: role,
      });
      setSuccessMsg(`Account '${res.email}' granted '${res.role}' privileges successfully.`);
      setEmail("");
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 2500);
    } catch (err) {
      setError(err?.message || "Failed to promote user account.");
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Promote User to Admin"
      icon={<UserCheck className="w-4 h-4 text-teal-700" />}
      titleId="promote-admin-title"
      maxWidth="max-w-md"
      isProcessing={isPromoting}
    >
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

        <p className="text-xs text-slate-600 leading-relaxed">
          Grant platform governance access to a registered user. Changes take effect on their next authentication session.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label htmlFor="promote-email-input" className="block font-semibold text-slate-700 mb-1">
              Account Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="promote-email-input"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. moderator@platform.com"
              disabled={isPromoting}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 min-h-[38px] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="promote-role-select" className="block font-semibold text-slate-700 mb-1">
              Privilege Level
            </label>
            <select
              id="promote-role-select"
              name="role"
              autoComplete="off"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isPromoting}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 min-h-[38px] transition-colors"
            >
              <option value="admin">Platform Admin (Moderation & Verification)</option>
              <option value="founder">Co-Founder (Platform Governance & Admin Management)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isPromoting}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer min-h-[38px] transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPromoting}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-semibold cursor-pointer disabled:opacity-50 min-h-[38px] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
            >
              {isPromoting ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Granting...</span>
                </>
              ) : (
                <span>Grant Privileges</span>
              )}
            </button>
          </div>
        </form>
    </BaseModal>
  );
}
