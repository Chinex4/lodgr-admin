import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BadgeCheck, MapPin, Phone, Calendar, Users } from "lucide-react";

function ViewUserDetailsModal({ open, onClose, user }) {
  if (!user) return null;

  const isVerified = user.status === "Verified";

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start md:items-center justify-center p-4 md:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl rounded-3xl bg-white shadow-xl border border-neutral-100">
                <div className="flex items-center justify-between px-6 pt-4 pb-2">
                  <Dialog.Title className="text-lg font-semibold text-neutral-900">
                    User Details
                  </Dialog.Title>
                  <button
                    className="text-neutral-400 hover:text-neutral-600 text-xl leading-none"
                    onClick={onClose}
                  >
                    ×
                  </button>
                </div>

                <div className="px-6 pb-6 pt-2 space-y-6">
                  {/* Header info */}
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-neutral-200 shrink-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-neutral-900">
                          {user.name}
                        </p>
                        <span className="text-sm text-neutral-500">
                          {user.email}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500">
                        @{user.username || "username"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800">
                          {user.role || "User"}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                          Active
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                            isVerified
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          <BadgeCheck className="h-3.5 w-3.5" />
                          {isVerified ? "Verified" : "Unverified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Account info */}
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-semibold text-neutral-900 mb-2">
                        Account Info
                      </p>
                      <div className="space-y-1.5 text-neutral-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>Joined {user.dateJoined}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <span>{user.phone || "+234 (00) 0000 0000"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{user.location || "Lagos, Nigeria"}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900 mb-2">
                        Activity
                      </p>
                      <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-neutral-600">
                            Followers{" "}
                            <span className="text-primary font-semibold">
                              {user.followers || 130}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl leading-none">🔥</span>
                          <span className="text-neutral-600">
                            Post Created{" "}
                            <span className="text-primary font-semibold">
                              {user.posts || 250}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl leading-none">🚩</span>
                          <span className="text-neutral-600">
                            Reports Received{" "}
                            <span className="text-neutral-400">---</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={onClose}
                      className="rounded-full border border-neutral-200 px-6 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ViewUserDetailsModal;
