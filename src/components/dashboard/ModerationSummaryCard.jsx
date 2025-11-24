import React from "react";
import { CalendarDays } from "lucide-react";

const moderationRows = [
  { label: "Spam", count: 240 },
  { label: "Harrassment", count: 240 },
  { label: "Offensive", count: 240 },
  { label: "Others", count: 240 },
];

function ModerationSummaryCard() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 gap-3">
        <h3 className="text-sm font-semibold text-neutral-900">
          Moderation Summary
        </h3>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50">
            <CalendarDays className="h-4 w-4" />
          </button>
          <button className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-neutral-900 text-white px-3 py-1.5 text-xs hover:bg-neutral-800">
            24hrs
            <span className="ml-1 text-[10px]">▾</span>
          </button>
        </div>
      </div>

      {/* Rows */}
      <div className="px-5 pb-4 flex-1 flex flex-col justify-between">
        {moderationRows.map((row, index) => (
          <div key={row.label}>
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-neutral-800">{row.label}</span>
              <span className="font-semibold text-neutral-900">
                {row.count}
              </span>
            </div>
            {index !== moderationRows.length - 1 && (
              <div className="h-px bg-neutral-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModerationSummaryCard;
