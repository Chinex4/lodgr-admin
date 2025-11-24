import React from "react";
import { Pencil, Lock, Info, Clock, Trash2 } from "lucide-react";

function UserActionsMenu({
  onClose,
  onEdit,
  onResetPassword,
  onSendWarning,
  onSuspend,
  onBanDelete,
}) {
  const itemBase =
    "w-full flex items-center gap-2.5 text-sm text-neutral-800 hover:bg-neutral-100 rounded-lg px-3 py-2 cursor-pointer";

  return (
    <div className="mt-2 w-48 rounded-2xl bg-white shadow-xl border border-neutral-100 py-2 text-sm">
      <button
        className={itemBase}
        onClick={() => {
          onEdit && onEdit();
          onClose && onClose();
        }}
      >
        <Pencil className="h-4 w-4" />
        <span>Edit User</span>
      </button>

      <button
        className={itemBase}
        onClick={() => {
          onResetPassword && onResetPassword();
          onClose && onClose();
        }}
      >
        <Lock className="h-4 w-4" />
        <span>Reset Password</span>
      </button>

      <button
        className={itemBase}
        onClick={() => {
          onSendWarning && onSendWarning();
          onClose && onClose();
        }}
      >
        <Info className="h-4 w-4" />
        <span>Send Warning</span>
      </button>

      <button
        className={itemBase}
        onClick={() => {
          onSuspend && onSuspend();
          onClose && onClose();
        }}
      >
        <Clock className="h-4 w-4" />
        <span>Suspend</span>
      </button>

      <button
        className={`${itemBase} text-red-600`}
        onClick={() => {
          onBanDelete && onBanDelete();
          onClose && onClose();
        }}
      >
        <Trash2 className="h-4 w-4" />
        <span>Ban/Delete User</span>
      </button>
    </div>
  );
}

export default UserActionsMenu;
