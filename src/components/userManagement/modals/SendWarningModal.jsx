import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { TextField } from "@mui/material";
import { Flag } from "lucide-react";

function SendWarningModal({ open, onClose, user }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Send warning", { id: user.id, title, content });
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
              <Dialog.Panel className="w-full max-w-xl rounded-3xl bg-white shadow-xl border border-neutral-100">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                        <Flag className="h-5 w-5 text-amber-500" />
                      </div>
                      <Dialog.Title className="text-xl font-semibold text-neutral-900">
                        Send Warning
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
                    <p className="text-sm text-neutral-600">
                      Send warning message to user{" "}
                      <span className="font-medium text-neutral-900">
                        {user.email}
                      </span>
                      .
                    </p>

                    <TextField
                      label="Warning Title"
                      placeholder="e.g. Policy Violation"
                      size="small"
                      fullWidth
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextField
                      label="Warning content"
                      placeholder="Type in warning details..."
                      multiline
                      minRows={4}
                      fullWidth
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />

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
                        className="rounded-full px-8 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 shadow-md"
                      >
                        Send Warning
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

export default SendWarningModal;
