import React, { useState } from "react";
import { UserCheck, AlertCircle, RotateCw, Shield, Trash2, Users } from "lucide-react";
import { useAdmin } from "../../../../hooks/useAdmin";
import { useUserAuth } from "../../../../hooks/useUserAuth";
import BaseModal from "../../../../components/common/BaseModal";

export default function PromoteAdminModal({ isOpen, onClose }) {
  const { user } = useUserAuth();
  const {
    promoteAdmin,
    isPromoting,
    admins,
    isLoadingAdmins,
    refetchAdmins,
    revokeAdmin,
    isRevoking,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState("promote"); // 'promote' | 'list'
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [revokingEmail, setRevokingEmail] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError("Email address is required.");
      return;
    }

    try {
      const res = await promoteAdmin({
        email: trimmed,
        role: role,
      });
      setSuccessMsg(`Account '${res.email}' granted '${res.role}' privileges successfully.`);
      setEmail("");
      refetchAdmins();
      setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);
    } catch (err) {
      setError(err?.message || "Failed to promote user account.");
    }
  };

  const handleRevoke = async (adminEmail) => {
    if (adminEmail.toLowerCase() === user?.email?.toLowerCase()) {
      setError("You cannot revoke your own administrator access.");
      return;
    }

    setRevokingEmail(adminEmail);
    setError(null);
    setSuccessMsg(null);

    try {
      await revokeAdmin(adminEmail);
      setSuccessMsg(`Administrator access for '${adminEmail}' has been revoked.`);
      refetchAdmins();
    } catch (err) {
      setError(err?.message || "Failed to revoke admin privileges.");
    } finally {
      setRevokingEmail(null);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Platform Administrators"
      icon={<UserCheck className="w-4 h-4 text-teal-700" />}
      titleId="promote-admin-title"
      maxWidth="max-w-lg"
      isProcessing={isPromoting || isRevoking}
    >
      <div className="space-y-4">
        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("promote")}
            className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition-colors cursor-pointer min-h-[34px] flex items-center justify-center gap-1.5 ${
              activeTab === "promote"
                ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-700" />
            <span>Grant Privileges</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("list");
              refetchAdmins();
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition-colors cursor-pointer min-h-[34px] flex items-center justify-center gap-1.5 ${
              activeTab === "list"
                ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Active Admins ({admins?.length || 0})</span>
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800 flex items-center gap-2">
            <Shield className="w-4 h-4 shrink-0 text-teal-700" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Grant Privileges */}
        {activeTab === "promote" && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <p className="text-xs text-slate-600 leading-relaxed">
              Grant platform governance access to a registered user. Changes take effect on their next authentication session.
            </p>

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
                disabled={isPromoting || !email.trim()}
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
        )}

        {/* Tab 2: Active Administrators List */}
        {activeTab === "list" && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Active accounts holding governance or moderation privileges.
            </p>

            {isLoadingAdmins ? (
              <div className="p-8 text-center text-slate-500">
                <RotateCw className="w-5 h-5 animate-spin text-teal-700 mx-auto mb-2" />
                <span>Loading platform administrators...</span>
              </div>
            ) : (!admins || admins.length === 0) ? (
              <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                No administrators found.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-[320px] overflow-y-auto">
                {admins.map((adm) => {
                  const isCurrentAccount = adm.email.toLowerCase() === user?.email?.toLowerCase();
                  const isBusyRevoking = revokingEmail === adm.email;

                  return (
                    <div
                      key={adm.email}
                      className="p-3 bg-white hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900 truncate">
                            {adm.email}
                          </span>
                          {isCurrentAccount && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                          <span className="capitalize">{adm.role}</span>
                          {adm.created_at && (
                            <span>• Joined {new Date(adm.created_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>

                      {!isCurrentAccount && (
                        <button
                          type="button"
                          onClick={() => handleRevoke(adm.email)}
                          disabled={isRevoking}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 min-h-[34px] transition-colors"
                          title={`Revoke admin privileges for ${adm.email}`}
                        >
                          {isBusyRevoking ? (
                            <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          <span>Revoke</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer min-h-[38px] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
