// src/components/userManagement/UsersTableSection.jsx
import React, { useMemo, useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal,
  BadgeCheck,
  XCircle,
} from "lucide-react";
import { usersData } from "../../../data/usersData";
import UserActionsMenu from "../UserActionsMenu";

import ViewUserDetailsModal from "../modals/ViewUserDetailsModal";
import AddUserModal from "../modals/AddUserModal";
import EditUserModal from "../modals/EditUserModal";
import SuspendUserModal from "../modals/SuspendUserModal";
import SendWarningModal from "../modals/SendWarningModal";
import BanDeleteUserModal from "../modals/BanDeleteUserModal";
import ResetPasswordModal from "../modals/ResetPasswordModal";

function StatusBadge({ status }) {
  const isVerified = status === "Verified";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
        isVerified
          ? "bg-emerald-50 text-emerald-700"
          : "bg-rose-50 text-rose-600"
      }`}
    >
      {isVerified ? (
        <BadgeCheck className="h-3.5 w-3.5" />
      ) : (
        <XCircle className="h-3.5 w-3.5" />
      )}
      {status}
    </span>
  );
}

function UsersTableSection() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [openMenuId, setOpenMenuId] = useState(null);

  const [openModal, setOpenModal] = useState(null); // 'view' | 'add' | 'edit' | 'suspend' | 'warning' | 'ban' | 'reset'
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = useMemo(() => {
    return usersData
      .filter((u) =>
        `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
      )
      .filter((u) => (roleFilter === "All" ? true : u.role === roleFilter))
      .filter((u) =>
        statusFilter === "All" ? true : u.status === statusFilter
      )
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "dateJoined")
          return a.dateJoined.localeCompare(b.dateJoined);
        return 0;
      });
  }, [search, roleFilter, statusFilter, sortBy]);

  const closeAllModals = () => {
    setOpenModal(null);
    setSelectedUser(null);
  };

  return (
    <>
      <section className="space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900">
              All Users
            </h2>
            <p className="text-sm text-neutral-500">
              Track and manage all existing users.
            </p>
          </div>

          <button
            onClick={() => setOpenModal("add")}
            className="inline-flex items-center justify-center rounded-full bg-primary text-white px-5 py-2.5 text-sm font-semibold shadow-md hover:bg-primarySecond transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>

        {/* Card with search + table */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm">
          {/* Search + filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 md:px-6 pt-4 pb-3">
            {/* Search */}
            <div className="w-full md:max-w-md">
              <div className="flex items-center gap-2 bg-[#f3f4f8] rounded-full px-3 py-2">
                <Search className="h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by username or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() =>
                    setSortBy((prev) =>
                      prev === "name" ? "dateJoined" : "name"
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 text-purple-700 px-3 py-2 text-xs md:text-sm font-medium hover:bg-purple-100"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Sort by
                </button>
              </div>

              {/* Role filter (dummy for now) */}
              <div className="relative">
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-2 text-xs md:text-sm text-neutral-700 hover:bg-neutral-50">
                  Role
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Status filter (dummy for now) */}
              <div className="relative">
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-2 text-xs md:text-sm text-neutral-700 hover:bg-neutral-50">
                  Status
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-y border-neutral-100 text-xs text-neutral-500">
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-neutral-300"
                    />
                  </th>
                  <th className="px-2 py-3 whitespace-nowrap">FULL NAME</th>
                  <th className="px-2 py-3 whitespace-nowrap">EMAIL ADDRESS</th>
                  <th className="px-2 py-3 whitespace-nowrap">ROLE</th>
                  <th className="px-2 py-3 whitespace-nowrap">DATE JOINED</th>
                  <th className="px-2 py-3 whitespace-nowrap">LAST ACTIVE</th>
                  <th className="px-2 py-3 whitespace-nowrap">STATUS</th>
                  <th className="px-2 py-3 whitespace-nowrap text-right" />
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/60 transition-colors relative"
                  >
                    <td className="px-6 py-3 align-middle">
                      <input
                        type="checkbox"
                        className="rounded border-neutral-300"
                      />
                    </td>
                    <td className="px-2 py-3 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-neutral-200 overflow-hidden">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <span className="text-sm font-medium text-neutral-900">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 align-middle text-neutral-600">
                      {user.email}
                    </td>
                    <td className="px-2 py-3 align-middle text-neutral-600">
                      {user.role}
                    </td>
                    <td className="px-2 py-3 align-middle text-neutral-600">
                      {user.dateJoined}
                    </td>
                    <td className="px-2 py-3 align-middle text-neutral-600">
                      {user.lastActive}
                    </td>
                    <td className="px-2 py-3 align-middle">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-3 align-middle text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          className="text-xs font-medium text-primary hover:underline"
                          onClick={() => {
                            setSelectedUser(user);
                            setOpenModal("view");
                          }}
                        >
                          View details
                        </button>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuId((prev) =>
                                prev === user.id ? null : user.id
                              )
                            }
                            className="inline-flex items-center justify-center rounded-full p-1.5 hover:bg-neutral-100"
                          >
                            <MoreHorizontal className="h-4 w-4 text-neutral-600" />
                          </button>

                          {openMenuId === user.id && (
                            <div className="absolute right-0 top-7 z-20">
                              <UserActionsMenu
                                onClose={() => setOpenMenuId(null)}
                                onEdit={() => {
                                  setSelectedUser(user);
                                  setOpenModal("edit");
                                  setOpenMenuId(null);
                                }}
                                onResetPassword={() => {
                                  setSelectedUser(user);
                                  setOpenModal("reset");
                                  setOpenMenuId(null);
                                }}
                                onSendWarning={() => {
                                  setSelectedUser(user);
                                  setOpenModal("warning");
                                  setOpenMenuId(null);
                                }}
                                onSuspend={() => {
                                  setSelectedUser(user);
                                  setOpenModal("suspend");
                                  setOpenMenuId(null);
                                }}
                                onBanDelete={() => {
                                  setSelectedUser(user);
                                  setOpenModal("ban");
                                  setOpenMenuId(null);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-10 text-center text-sm text-neutral-500"
                    >
                      No users found with the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t border-neutral-100 text-sm">
            <button className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1.5 text-neutral-700 hover:bg-neutral-50">
              ← Previous
            </button>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 8, 9, 10].map((n, idx) => (
                <button
                  key={`${n}-${idx}`}
                  className={`h-8 w-8 rounded-full text-xs font-medium ${
                    n === 1
                      ? "bg-primary text-white"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1.5 text-neutral-700 hover:bg-neutral-50">
              Next →
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}

      <AddUserModal open={openModal === "add"} onClose={closeAllModals} />

      <ViewUserDetailsModal
        open={openModal === "view"}
        onClose={closeAllModals}
        user={selectedUser}
      />

      <EditUserModal
        open={openModal === "edit"}
        onClose={closeAllModals}
        user={selectedUser}
      />

      <SuspendUserModal
        open={openModal === "suspend"}
        onClose={closeAllModals}
        user={selectedUser}
      />

      <SendWarningModal
        open={openModal === "warning"}
        onClose={closeAllModals}
        user={selectedUser}
      />

      <BanDeleteUserModal
        open={openModal === "ban"}
        onClose={closeAllModals}
        user={selectedUser}
      />

      <ResetPasswordModal
        open={openModal === "reset"}
        onClose={closeAllModals}
        user={selectedUser}
      />
    </>
  );
}

export default UsersTableSection;
