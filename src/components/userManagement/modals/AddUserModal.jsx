import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Avatar,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { UserPlus } from "lucide-react";

function AddUserModal({ open, onClose }) {
  const [role, setRole] = useState("User");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [permissions, setPermissions] = useState({
    manageUsers: true,
    manageContents: false,
    manageReports: false,
    manageSettings: true,
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePermissionChange = (field) => (e) => {
    setPermissions((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Add user submit", { ...form, role, permissions });
    onClose && onClose();
  };

  const showPermissions = role === "Admin";

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
              <Dialog.Panel className="w-full max-w-4xl rounded-3xl bg-white shadow-xl border border-neutral-100">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserPlus className="h-5 w-5 text-primary" />
                      </div>
                      <Dialog.Title className="text-xl font-semibold text-neutral-900">
                        Add User
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
                      <TextField
                        label="Password"
                        placeholder="Password"
                        type="password"
                        size="small"
                        fullWidth
                        value={form.password}
                        onChange={handleChange("password")}
                      />

                      <FormControl fullWidth size="small">
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                          labelId="role-label"
                          label="Role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <MenuItem value="User">User</MenuItem>
                          <MenuItem value="Admin">Admin</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    {showPermissions && (
                      <div className="rounded-2xl bg-neutral-50 border border-neutral-100 p-4 md:p-5">
                        <p className="text-sm font-semibold text-neutral-900 mb-3">
                          Permissions
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={permissions.manageUsers}
                                onChange={handlePermissionChange("manageUsers")}
                                color="primary"
                              />
                            }
                            label="Manage Users"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={permissions.manageContents}
                                onChange={handlePermissionChange(
                                  "manageContents"
                                )}
                                color="primary"
                              />
                            }
                            label="Manage Contents"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={permissions.manageReports}
                                onChange={handlePermissionChange(
                                  "manageReports"
                                )}
                                color="primary"
                              />
                            }
                            label="Manage Reports"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={permissions.manageSettings}
                                onChange={handlePermissionChange(
                                  "manageSettings"
                                )}
                                color="primary"
                              />
                            }
                            label="Manage Settings"
                          />
                        </div>
                      </div>
                    )}

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
                        Add User
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

export default AddUserModal;
