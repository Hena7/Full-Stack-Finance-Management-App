"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminApiService, UserSummary } from "@/lib/services/adminService";
import { Card } from "@/components/ui/card";
import {
  Shield,
  Users,
  Trash2,
  RefreshCw,
  UserCheck,
  UserX,
  AlertCircle,
} from "lucide-react";

export default function AdminPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Guard: redirect non-admins
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (isAuthenticated && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isAdmin, router]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AdminApiService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to load users. Make sure you are logged in as an admin.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const handleDelete = async (id: number) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setActionLoadingId(id);
    try {
      await AdminApiService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete user.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRoleToggle = async (user: UserSummary) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    setActionLoadingId(user.id);
    try {
      const updated = await AdminApiService.changeUserRole(user.id, newRole);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    } catch (err) {
      console.error(err);
      setError("Failed to change user role.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const userCount = users.filter((u) => u.role === "USER").length;

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-500" />
            Admin Panel
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage all registered users and their roles
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Users
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {users.length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Admins
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {adminCount}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Regular Users
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {userCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-500"
          >
            ✕
          </button>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          All Users
        </h2>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Loading user database…
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
            <Users className="w-12 h-12 opacity-30" />
            <p>No users registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 pr-4 font-semibold text-slate-500 dark:text-slate-400">
                    User
                  </th>
                  <th className="pb-3 pr-4 font-semibold text-slate-500 dark:text-slate-400">
                    Email
                  </th>
                  <th className="pb-3 pr-4 font-semibold text-slate-500 dark:text-slate-400">
                    Role
                  </th>
                  <th className="pb-3 pr-4 font-semibold text-slate-500 dark:text-slate-400">
                    Joined
                  </th>
                  <th className="pb-3 font-semibold text-slate-500 dark:text-slate-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                          {user.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2) || "U"}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {user.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-slate-500 dark:text-slate-400">
                      {user.email}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                        }`}
                      >
                        {user.role === "ADMIN" ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <UserCheck className="w-3 h-3" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-500 dark:text-slate-400">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Role Button */}
                        <button
                          onClick={() => handleRoleToggle(user)}
                          disabled={actionLoadingId === user.id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
                            user.role === "ADMIN"
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30"
                              : "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:hover:bg-purple-500/30"
                          }`}
                        >
                          {actionLoadingId === user.id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : user.role === "ADMIN" ? (
                            <UserX className="w-3 h-3" />
                          ) : (
                            <Shield className="w-3 h-3" />
                          )}
                          {user.role === "ADMIN" ? "Demote" : "Promote"}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={actionLoadingId === user.id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
                            confirmDeleteId === user.id
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30"
                          }`}
                        >
                          <Trash2 className="w-3 h-3" />
                          {confirmDeleteId === user.id ? "Confirm?" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
