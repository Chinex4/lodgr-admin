import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Flag } from "lucide-react";

const OPTIONS = [
  { value: "24h", label: "24 hrs" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "forever", label: "Indefinitely" },
];

function SuspendUserModal({ open, onClose, user }) {
  const [duration, setDuration] = useState("24h");

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Suspend user", { id: user.id, duration });
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
                        <Flag className="h-5 w-5 text-rose-500" />
                      </div>
                      <Dialog.Title className="text-xl font-semibold text-neutral-900">
                        Suspend User
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
                      <span>Are you sure you want to suspend this user?</span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-neutral-900 mb-2">
                        Suspend for
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setDuration(opt.value)}
                            className={`flex items-center justify-center rounded-2xl border px-3 py-2.5 text-sm font-medium ${
                              duration === opt.value
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

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
                        className="rounded-full px-8 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md"
                      >
                        Confirm
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

export default SuspendUserModal;
