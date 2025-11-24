import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Pencil } from "lucide-react";

function EditUserModal({ open, onClose, user }) {
  const [role, setRole] = useState("User");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      const [firstName, ...rest] = user.name?.split(" ") || [];
      setForm({
        firstName: firstName || "",
        lastName: rest.join(" "),
        email: user.email || "",
        phone: user.phone || "",
      });
      setRole(user.role || "User");
    }
  }, [user, open]);

  if (!user) return null;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Edit user submit", { id: user.id, ...form, role });
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
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Pencil className="h-5 w-5 text-primary" />
                      </div>
                      <Dialog.Title className="text-xl font-semibold text-neutral-900">
                        Edit User
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextField
                        label="First Name"
                        placeholder="First name"
                        size="small"
                        fullWidth
                        value={form.firstName}
                        onChange={handleChange("firstName")}
                      />
                      <TextField
                        label="Last Name"
                        placeholder="Last name"
                        size="small"
                        fullWidth
                        value={form.lastName}
                        onChange={handleChange("lastName")}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextField
                        label="Email Address"
                        placeholder="Email address"
                        size="small"
                        fullWidth
                        value={form.email}
                        onChange={handleChange("email")}
                      />
                      <TextField
                        label="Phone Number"
                        placeholder="Mobile number"
                        size="small"
                        fullWidth
                        value={form.phone}
                        onChange={handleChange("phone")}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormControl fullWidth size="small">
                        <InputLabel id="edit-role-label">Role</InputLabel>
                        <Select
                          labelId="edit-role-label"
                          label="Role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <MenuItem value="User">User</MenuItem>
                          <MenuItem value="Admin">Admin</MenuItem>
                        </Select>
                      </FormControl>
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
                        className="rounded-full px-8 py-2.5 text-sm font-semibold text-white bg-linear-to-br from-primary to-primarySecond shadow-md hover:opacity-95"
                      >
                        Save Information
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

export default EditUserModal;
