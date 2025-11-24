// src/components/contentManagement/modals/RemovePostModal.jsx
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Trash2 } from "lucide-react";

const REASONS = [
  "Select reason",
  "Hate speech",
  "Nudity",
  "Harassment",
  "Spam",
  "Other",
];

function RemovePostModal({ open, onClose, report }) {
  const [reason, setReason] = useState("Select reason");
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Remove post", { report, reason, note });
    onClose && onClose();
  };

  if (!open) return null;

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
          <div className="flex min-h-full items-start md:items-center justify-center p-4 md:p-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl rounded-3xl bg-white shadow-xl border border-neutral-100">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center">
                        <Trash2 className="h-5 w-5 text-rose-500" />
                      </div>
                      <Dialog.Title className="text-xl font-semibold text-neutral-900">
                        Remove Post
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

                  <div className="px-6 pb-6 space-y-6">
                    <p className="text-sm text-neutral-600">
                      This action will permanently remove the post from Zagasm.
                      You can include a reason for the user&apos;s reference.
                    </p>

                    <div className="space-y-4">
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                      >
                        <InputLabel>Reason</InputLabel>
                        <Select
                          label="Reason"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        >
                          {REASONS.map((r) => (
                            <MenuItem key={r} value={r}>
                              {r}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        label="Additional notes"
                        placeholder="Write any additional note..."
                        multiline
                        minRows={4}
                        fullWidth
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                      />
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
                        Remove Post
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

export default RemovePostModal;
