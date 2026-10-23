import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Users,
  Search,
  ShieldAlert,
  RotateCw,
  Ban,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import { useAdmin, useAdminUsers } from "../../../../hooks/useAdmin";
import { useUserAuth } from "../../../../hooks/useUserAuth";
import BaseModal from "../../../../components/common/BaseModal";

export default function AdminUsersSection() {
  const { user: currentUser } = useUserAuth();
  const { banUser, isBanningUser } = useAdmin();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [userToToggleBan, setUserToToggleBan] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminUsers({
    search: search.trim() || undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
    limit: 50,
  });

  const users = usersData?.users || [];

  const handleConfirmBanToggle = async () => {
    if (!userToToggleBan) return;

    const isBanning = userToToggleBan.role !== "banned";
    setProcessingId(userToToggleBan.id);

    try {
      await banUser({
        userId: userToToggleBan.id,
        isBanned: isBanning,
      });

      toast.success(
        isBanning
          ? `User ${userToToggleBan.email} has been suspended.`
          : `User ${userToToggleBan.email} has been reinstated.`
      );
      refetch();
      setUserToToggleBan(null);
    } catch (err) {
      toast.error(err?.message || "Failed to update user status.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-700" />
            <span>Platform User Directory ({users.length})</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Audit registered accounts, privilege roles, and manage access suspensions.
          </p>
        </div>

        {/* Search & Role Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <label htmlFor="admin-user-search" className="sr-only">
              Search users
            </label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="admin-user-search"
              name="userSearch"
              type="search"
              autoComplete="off"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email or name..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 min-h-[38px] transition-colors"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 min-h-[38px] cursor-pointer"
            aria-label="Filter by role"
          >
            <option value="all">All Roles</option>
            <option value="user">Regular Users</option>
            <option value="admin">Administrators</option>
            <option value="founder">Founders</option>
            <option value="banned">Suspended / Banned</option>
          </select>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 sm:p-12 text-center text-xs text-slate-500">
            <RotateCw className="w-6 h-6 animate-spin text-teal-700 mx-auto mb-2" />
            <span>Loading user directory...</span>
          </div>
        ) : isError ? (
          <div className="p-8 sm:p-12 text-center">
            <ShieldAlert className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-900">Failed to load users</h3>
            <p className="text-xs text-slate-500 mt-1">{error?.message || "An unexpected error occurred."}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-900">No users found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {search.trim() ? "Try clearing or broadening your search criteria." : "No registered accounts found."}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {users.map((u) => {
                const isCurrent = u.email?.toLowerCase() === currentUser?.email?.toLowerCase();
                const isBanned = u.role === "banned";

                return (
                  <div key={u.id} className="p-3.5 space-y-2.5 bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-xs text-slate-900 break-words">
                            {u.full_name || u.email}
                          </span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                              You
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[11px] text-slate-500 mt-0.5 truncate">{u.email}</p>
                      </div>

                      <span
                        className={`shrink-0 inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          isBanned
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : u.role === "founder"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : u.role === "admin"
                            ? "bg-teal-50 text-teal-800 border border-teal-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span>Joined {new Date(u.created_at).toLocaleDateString()}</span>

                      {!isCurrent && u.role !== "founder" && (
                        <button
                          type="button"
                          onClick={() => setUserToToggleBan(u)}
                          disabled={isBanningUser && processingId === u.id}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors min-h-[36px] ${
                            isBanned
                              ? "bg-teal-50 text-teal-800 border-teal-300 hover:bg-teal-100"
                              : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          }`}
                        >
                          {isBanningUser && processingId === u.id ? (
                            <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          ) : isBanned ? (
                            <CheckCircle className="w-3.5 h-3.5" />
                          ) : (
                            <Ban className="w-3.5 h-3.5" />
                          )}
                          <span>{isBanned ? "Reinstate" : "Ban User"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" aria-label="Platform users table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <th scope="col" className="px-4 py-3">User</th>
                    <th scope="col" className="px-4 py-3">Role</th>
                    <th scope="col" className="px-4 py-3">Registered</th>
                    <th scope="col" className="px-4 py-3 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const isCurrent = u.email?.toLowerCase() === currentUser?.email?.toLowerCase();
                    const isBanned = u.role === "banned";

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            {u.avatar_url ? (
                              <img
                                src={u.avatar_url}
                                alt={u.full_name || u.email}
                                className="w-7 h-7 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {(u.full_name || u.email)[0].toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-900 truncate">
                                  {u.full_name || "Anonymous User"}
                                </span>
                                {isCurrent && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="font-mono text-[11px] text-slate-500 truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              isBanned
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : u.role === "founder"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : u.role === "admin"
                                ? "bg-teal-50 text-teal-800 border border-teal-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px]">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          {!isCurrent && u.role !== "founder" ? (
                            <button
                              type="button"
                              onClick={() => setUserToToggleBan(u)}
                              disabled={isBanningUser && processingId === u.id}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors min-h-[34px] ${
                                isBanned
                                  ? "bg-teal-50 text-teal-800 border-teal-300 hover:bg-teal-100"
                                  : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                              }`}
                            >
                              {isBanningUser && processingId === u.id ? (
                                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                              ) : isBanned ? (
                                <CheckCircle className="w-3.5 h-3.5" />
                              ) : (
                                <Ban className="w-3.5 h-3.5" />
                              )}
                              <span>{isBanned ? "Reinstate User" : "Suspend Access"}</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Protected</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {userToToggleBan && (
        <BaseModal
          isOpen={Boolean(userToToggleBan)}
          onClose={() => setUserToToggleBan(null)}
          title={userToToggleBan.role === "banned" ? "Reinstate User Account?" : "Suspend User Access?"}
          titleId="ban-toggle-modal-title"
          maxWidth="max-w-md"
          isProcessing={isBanningUser}
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-600 leading-relaxed">
              {userToToggleBan.role === "banned" ? (
                <>
                  Are you sure you want to reinstate access for <strong className="text-slate-900">{userToToggleBan.email}</strong>? The user will immediately be able to sign in and interact with the platform.
                </>
              ) : (
                <>
                  Are you sure you want to suspend access for <strong className="text-slate-900">{userToToggleBan.email}</strong>? Any future API requests will immediately be blocked with HTTP 403 Forbidden.
                </>
              )}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 font-semibold">
              <button
                type="button"
                onClick={() => setUserToToggleBan(null)}
                disabled={isBanningUser}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 min-h-[44px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBanToggle}
                disabled={isBanningUser}
                className={`w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg text-white min-h-[44px] cursor-pointer disabled:opacity-50 ${
                  userToToggleBan.role === "banned"
                    ? "bg-teal-700 hover:bg-teal-800"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isBanningUser ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : userToToggleBan.role === "banned" ? (
                  <span>Reinstate Account</span>
                ) : (
                  <span>Suspend Account</span>
                )}
              </button>
            </div>
          </div>
        </BaseModal>
      )}
    </div>
  );
}
