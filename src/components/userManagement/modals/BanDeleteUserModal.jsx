import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Trash2 } from "lucide-react";

function BanDeleteUserModal({ open, onClose, user }) {
  const [confirm, setConfirm] = useState(false);

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirm) return;
    console.log("Ban/Delete user", { id: user.id });
    onClose && onClose();
  };

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
              <Dialog.Panel className="w-full max-w-lg rounded-3xl bg-white shadow-xl border border-neutral-100">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center">
                        <Trash2 className="h-5 w-5 text-rose-500" />
                      </div>
                      <Dialog.Title className="text-xl font-semibold text-neutral-900">
                        Ban/Delete User
                      </Dialog.Title>
                    </div>
                    <button
                      type="button"
                      className="text-neutral-400 hover:text-neutral-600 text-xl leading-none"
                      onClick={onClose}
                    >
                      ×
                    </button>
                  </div>

                  <div className="px-6 pb-6 space-y-5">
                    <div className="rounded-xl bg-amber-50 text-amber-800 text-sm px-4 py-2.5 flex items-center gap-2">
                      <span className="text-lg leading-none">⚠️</span>
                      <span>
                        This action is permanent and cannot be undone.
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between rounded-xl bg-neutral-50 px-4 py-2.5">
                        <span className="text-neutral-500">
                          User’s full name
                        </span>
                        <span className="font-medium text-neutral-900">
                          {user.name}
                        </span>
                      </div>
                      <div className="flex justify-between rounded-xl bg-neutral-50 px-4 py-2.5">
                        <span className="text-neutral-500">User email</span>
                        <span className="font-medium text-neutral-900">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-neutral-800">
                      <input
                        type="checkbox"
                        checked={confirm}
                        onChange={(e) => setConfirm(e.target.checked)}
                        className="h-4 w-4 rounded border-neutral-300"
                      />
                      <span>Yes, I understand the consequences</span>
                    </label>

                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        disabled={!confirm}
                        className={`rounded-full px-8 py-2.5 text-sm font-semibold text-white shadow-md ${
                          confirm
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-red-300 cursor-not-allowed"
                        }`}
                      >
                        Delete Permanently
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default BanDeleteUserModal;
