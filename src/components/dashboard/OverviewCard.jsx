import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

function OverviewCard({
  title,
  value,
  helper,
  Icon,
  badgeBgClass,
  titleColorClass,
  accentColor,
  trendDirection = "up",
}) {
  const isDown = trendDirection === "down";

  return (
    <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm px-5 py-4 flex flex-col gap-3">
      {/* top row: icon + title + value */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className={`text-sm font-semibold ${titleColorClass}`}>
            {title}
          </span>
          <span className="text-3xl font-semibold text-neutral-900">
            {value}
          </span>
        </div>

        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center ${badgeBgClass}`}
        >
          <Icon className="h-5 w-5" style={{ color: accentColor }} />
        </div>
      </div>

      {/* bottom: trend / helper */}
      <div className="flex items-center gap-2 text-sm">
        <span
          className={`inline-flex items-center gap-1 font-medium ${
            isDown ? "text-red-500" : "text-emerald-500"
          }`}
        >
          {isDown ? (
            <ArrowDownRight className="h-4 w-4" />
          ) : (
            <ArrowUpRight className="h-4 w-4" />
          )}
        </span>
        <span className="text-neutral-600">{helper}</span>
      </div>
    </div>
  );
}

export default OverviewCard;
