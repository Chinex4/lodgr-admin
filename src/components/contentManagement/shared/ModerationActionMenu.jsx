import React from "react";
import { Popover } from "@mui/material";
import { Trash2, Info, Clock, FileMinus2 } from "lucide-react";

function ModerationActionMenu({
  anchorEl,
  open,
  onClose,
  onRemovePost,
  onSendWarning,
  onSuspendUser,
  onDismissReport,
}) {
  const itemBase =
    "w-full flex items-center gap-2.5 text-sm text-neutral-800 hover:bg-neutral-100 rounded-lg px-4 py-2 cursor-pointer";

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        className: "mt-1 rounded-2xl shadow-xl border border-neutral-100 w-52",
        sx: { overflow: "hidden" },
      }}
    >
      <div className="py-2 bg-white">
        <button
          className={itemBase}
          onClick={() => {
            onRemovePost && onRemovePost();
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span>Remove Post</span>
        </button>
        <button
          className={itemBase}
          onClick={() => {
            onSendWarning && onSendWarning();
          }}
        >
          <Info className="h-4 w-4" />
          <span>Send Warning</span>
        </button>
        <button
          className={itemBase}
          onClick={() => {
            onSuspendUser && onSuspendUser();
          }}
        >
          <Clock className="h-4 w-4" />
          <span>Suspend User</span>
        </button>
        <button
          className={itemBase}
          onClick={() => {
            onDismissReport && onDismissReport();
          }}
        >
          <FileMinus2 className="h-4 w-4" />
          <span>Dismiss Report</span>
        </button>
      </div>
    </Popover>
  );
}

export default ModerationActionMenu;
