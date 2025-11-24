// src/components/contentManagement/sections/ContentLibrarySection.jsx
import React, { useMemo, useState } from "react";
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Search } from "lucide-react";

const STATUS_OPTIONS = ["All", "Active", "Non-active"];

const contentLibraryData = [
  {
    id: "1",
    title: "Featured Content",
    creatorName: "Stanley Adams",
    creatorAvatar: "/images/avatars/stanley.png",
    status: "Active",
    dateApproved: "25 Aug, 2025",
  },
  {
    id: "2",
    title: "Featured Content",
    creatorName: "Stanley Adams",
    creatorAvatar: "/images/avatars/stanley.png",
    status: "Non-active",
    dateApproved: "25 Aug, 2025",
  },
  {
    id: "3",
    title: "Featured Content",
    creatorName: "Stanley Adams",
    creatorAvatar: "/images/avatars/stanley.png",
    status: "Active",
    dateApproved: "25 Aug, 2025",
  },
  {
    id: "4",
    title: "Featured Content",
    creatorName: "Stanley Adams",
    creatorAvatar: "/images/avatars/stanley.png",
    status: "Active",
    dateApproved: "25 Aug, 2025",
  },
  {
    id: "5",
    title: "Featured Content",
    creatorName: "Stanley Adams",
    creatorAvatar: "/images/avatars/stanley.png",
    status: "Active",
    dateApproved: "25 Aug, 2025",
  },
];

function ContentLibrarySection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredContent = useMemo(() => {
    return contentLibraryData
      .filter((item) =>
        searchTerm
          ? item.title.toLowerCase().includes(searchTerm.toLowerCase())
          : true
      )
      .filter((item) =>
        statusFilter === "All" ? true : item.status === statusFilter
      );
  }, [searchTerm, statusFilter]);

  return (
    <section className="mt-6 bg-white rounded-3xl border border-neutral-100 shadow-sm px-4 md:px-6 pt-5 pb-5 space-y-4">
      <h3 className="text-base md:text-lg font-semibold text-neutral-900">
        Content Library
      </h3>

      {/* search + filter row */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1">
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search by title..."
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

        <div className="w-full md:w-auto">
          <FormControl
            fullWidth
            size="small"
            sx={{
              minWidth: 140,
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
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status === "All" ? "All status" : status}
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
              <th className="px-2 lg:px-4 py-3 font-medium">TITLE</th>
              <th className="px-2 lg:px-4 py-3 font-medium">CREATOR</th>
              <th className="px-2 lg:px-4 py-3 font-medium">STATUS</th>
              <th className="px-2 lg:px-4 py-3 font-medium whitespace-nowrap">
                DATE APPROVED
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredContent.map((item) => (
              <tr
                key={item.id}
                className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/60 transition-colors"
              >
                <td className="px-4 md:px-2 lg:px-4 py-3 align-middle">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-300"
                  />
                </td>

                <td className="px-2 lg:px-4 py-3 align-middle text-neutral-800">
                  {item.title}
                </td>

                <td className="px-2 lg:px-4 py-3 align-middle">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-neutral-200 overflow-hidden">
                      <img
                        src={item.creatorAvatar}
                        alt={item.creatorName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-neutral-800">{item.creatorName}</span>
                  </div>
                </td>

                <td className="px-2 lg:px-4 py-3 align-middle text-neutral-800">
                  {item.status}
                </td>

                <td className="px-2 lg:px-4 py-3 align-middle text-neutral-700 whitespace-nowrap">
                  {item.dateApproved}
                </td>
              </tr>
            ))}

            {filteredContent.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-neutral-500"
                >
                  No content matches the current filters.
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
  );
}

export default ContentLibrarySection;
