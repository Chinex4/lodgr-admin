// src/components/contentManagement/modals/ModerationSuspendUserModal.jsx
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Flag } from "lucide-react";

const DURATIONS = [
  { id: "24h", label: "24 hrs" },
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "forever", label: "Indefinitely" },
];

const SUSPEND_REASONS = [
  "Select reason",
  "Severe harassment",
  "Repeated violations",
  "Hate speech",
  "Other",
];

function ModerationSuspendUserModal({ open, onClose, report }) {
  const [duration, setDuration] = useState("24h");
  const [reason, setReason] = useState("Select reason");
  const [notes, setNotes] = useState("");
  const [notify, setNotify] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Suspend user from report", {
      report,
      duration,
      reason,
      notes,
      notify,
    });
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
                        <Flag className="h-5 w-5 text-rose-400" />
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

                  <div className="px-6 pb-6 space-y-6">
                    <p className="text-sm text-neutral-600">
                      Suspending this user will prevent them from posting or
                      interacting for the chosen duration.
                    </p>

                    {/* duration pills */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-neutral-900">
                        Suspend for
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {DURATIONS.map((d) => (
                          <button
                            type="button"
                            key={d.id}
                            onClick={() => setDuration(d.id)}
                            className={`flex items-center justify-center rounded-2xl border px-3 py-2.5 text-sm font-medium ${
                              duration === d.id
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* reason + notes */}
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
                          {SUSPEND_REASONS.map((r) => (
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
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                      />
                    </div>

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={notify}
                          onChange={(e) => setNotify(e.target.checked)}
                          sx={{
                            color: "#8f07e7",
                            "&.Mui-checked": { color: "#8f07e7" },
                          }}
                        />
                      }
                      label={
                        <span className="text-sm text-neutral-700">
                          Notify the user with suspension details.
                        </span>
                      }
                    />

                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-full px-8 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md"
                      >
                        Suspend user
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

export default ModerationSuspendUserModal;
