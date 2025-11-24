import React, { useMemo, useState } from "react";
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Search, MoreHorizontal } from "lucide-react";

import ModerationActionMenu from "../shared/ModerationActionMenu";
import RemovePostModal from "../modals/RemovePostModal";
import ModerationSendWarningModal from "../modals/ModerationSendWarningModal";
import ModerationSuspendUserModal from "../modals/ModerationSuspendUserModal";
import DismissReportModal from "../modals/DismissReportModal";

const moderationQueueData = [
  {
    id: "1",
    postId: "#12345",
    reason: "Harassment",
    reports: 5,
    dateApproved: "25 Aug, 2025",
    status: "Pending",
  },
  {
    id: "2",
    postId: "#12346",
    reason: "Nudity",
    reports: 5,
    dateApproved: "25 Aug, 2025",
    status: "Actioned",
  },
  {
    id: "3",
    postId: "#12347",
    reason: "Harassment",
    reports: 5,
    dateApproved: "25 Aug, 2025",
    status: "Pending",
  },
  {
    id: "4",
    postId: "#12348",
    reason: "Spam",
    reports: 5,
    dateApproved: "25 Aug, 2025",
    status: "Reviewed",
  },
  {
    id: "5",
    postId: "#12349",
    reason: "Harassment",
    reports: 5,
    dateApproved: "25 Aug, 2025",
    status: "Pending",
  },
];

const REASONS = ["All reasons", "Harassment", "Nudity", "Spam"];
const STATUSES = ["All status", "Pending", "Actioned", "Reviewed"];

function ModerationQueueSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reasonFilter, setReasonFilter] = useState("All reasons");
  const [statusFilter, setStatusFilter] = useState("All status");

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openModal, setOpenModal] = useState(null); // 'remove' | 'warning' | 'suspend' | 'dismiss'

  const filteredReports = useMemo(() => {
    return moderationQueueData
      .filter((item) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
          item.postId.toLowerCase().includes(q) ||
          item.reason.toLowerCase().includes(q)
        );
      })
      .filter((item) =>
        reasonFilter === "All reasons" ? true : item.reason === reasonFilter
      )
      .filter((item) =>
        statusFilter === "All status" ? true : item.status === statusFilter
      );
  }, [searchTerm, reasonFilter, statusFilter]);

  const handleOpenMenu = (event, report) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleOpenModal = (type) => {
    setOpenModal(type);
    handleCloseMenu();
  };

  const handleCloseModal = () => {
    setOpenModal(null);
    setSelectedReport(null);
  };

  return (
    <>
      <section className="mt-6 bg-white rounded-3xl border border-neutral-100 shadow-sm px-4 md:px-6 pt-5 pb-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base md:text-lg font-semibold text-neutral-900">
            Moderation Queue
          </h3>
        </div>

        {/* search + filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search by post ID or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="h-5 w-5 text-neutral-400" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "999px",
                  backgroundColor: "#f9fafb",
                },
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "#e5e7eb" },
                "&.Mui-focused fieldset": { borderColor: "#d4d4d8" },
              }}
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <FormControl
              size="small"
              fullWidth
              sx={{
                minWidth: 120,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "#f9fafb",
                },
                "& fieldset": { borderColor: "transparent" },
              }}
            >
              <InputLabel>Reason</InputLabel>
              <Select
                label="Reason"
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
              >
                {REASONS.map((reason) => (
                  <MenuItem key={reason} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              fullWidth
              sx={{
                minWidth: 120,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "#f9fafb",
                },
                "& fieldset": { borderColor: "transparent" },
              }}
            >
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-xs text-neutral-500 border-b border-neutral-100">
                <th className="px-4 md:px-2 lg:px-4 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-300"
                  />
                </th>
                <th className="px-2 lg:px-4 py-3 whitespace-nowrap">POST ID</th>
                <th className="px-2 lg:px-4 py-3 whitespace-nowrap">
                  REPORT REASON
                </th>
                <th className="px-2 lg:px-4 py-3 whitespace-nowrap">REPORTS</th>
                <th className="px-2 lg:px-4 py-3 whitespace-nowrap">
                  DATE APPROVED
                </th>
                <th className="px-2 lg:px-4 py-3 whitespace-nowrap">STATUS</th>
                <th className="px-2 lg:px-4 py-3 whitespace-nowrap text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/60 transition-colors"
                >
                  <td className="px-4 md:px-2 lg:px-4 py-3 align-middle">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-300"
                    />
                  </td>
                  <td className="px-2 lg:px-4 py-3 align-middle text-neutral-800">
                    {report.postId}
                  </td>
                  <td className="px-2 lg:px-4 py-3 align-middle text-neutral-700">
                    {report.reason}
                  </td>
                  <td className="px-2 lg:px-4 py-3 align-middle text-neutral-700">
                    {report.reports}
                  </td>
                  <td className="px-2 lg:px-4 py-3 align-middle text-neutral-700">
                    {report.dateApproved}
                  </td>
                  <td className="px-2 lg:px-4 py-3 align-middle text-neutral-700">
                    {report.status}
                  </td>
                  <td className="px-2 lg:px-4 py-3 align-middle">
                    <div className="flex items-center justify-end gap-3">
                      <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 hover:bg-neutral-200">
                        View
                      </button>

                      <button
                        onClick={(e) => handleOpenMenu(e, report)}
                        className="inline-flex items-center justify-center rounded-full p-1.5 hover:bg-neutral-100"
                      >
                        <MoreHorizontal className="h-4 w-4 text-neutral-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReports.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-neutral-500"
                  >
                    No reports match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-4 border-t border-neutral-100 text-sm">
          <button className="inline-flex items-center justify-center gap-1 rounded-full border border-neutral-200 px-4 py-2 text-neutral-800 hover:bg-neutral-50 w-full md:w-auto">
            ← Previous
          </button>

          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, "…", 8, 9, 10].map((item, idx) =>
              item === "…" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-neutral-400 text-sm"
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  className={`h-9 w-9 rounded-full text-xs font-medium ${
                    item === 1
                      ? "bg-primary/10 text-primary"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <button className="inline-flex items-center justify-center gap-1 rounded-full border border-neutral-200 px-4 py-2 text-neutral-800 hover:bg-neutral-50 w-full md:w-auto">
            Next →
          </button>
        </div>
      </section>

      {/* action popover */}
      <ModerationActionMenu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        onRemovePost={() => handleOpenModal("remove")}
        onSendWarning={() => handleOpenModal("warning")}
        onSuspendUser={() => handleOpenModal("suspend")}
        onDismissReport={() => handleOpenModal("dismiss")}
      />

      {/* modals */}
      <RemovePostModal
        open={openModal === "remove"}
        onClose={handleCloseModal}
        report={selectedReport}
      />
      <ModerationSendWarningModal
        open={openModal === "warning"}
        onClose={handleCloseModal}
        report={selectedReport}
      />
      <ModerationSuspendUserModal
        open={openModal === "suspend"}
        onClose={handleCloseModal}
        report={selectedReport}
      />
      <DismissReportModal
        open={openModal === "dismiss"}
        onClose={handleCloseModal}
        report={selectedReport}
      />
    </>
  );
}

export default ModerationQueueSection;
