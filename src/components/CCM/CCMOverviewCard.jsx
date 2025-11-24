import React from "react";

function CCMOverviewCard({
  title,
  value,
  Icon,
  badgeBgClass,
  titleColorClass,
  todayText,
  todayColorClass,
  weekText,
  weekColorClass,
}) {
  const showFooter = todayText || weekText;

  return (
    <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm px-5 py-4 flex flex-col justify-between gap-3">
      {/* top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className={`text-sm font-semibold ${titleColorClass}`}>
            {title}
          </p>
          <p className="text-3xl font-semibold text-neutral-900 mt-1">
            {value}
          </p>
        </div>

        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center ${badgeBgClass}`}
        >
          <Icon className="h-5 w-5 text-neutral-700" />
        </div>
      </div>

      {/* bottom row (today / week) */}
      {showFooter && (
        <div className="flex items-center gap-6 text-xs md:text-sm mt-1">
          {todayText && (
            <p className={todayColorClass || "text-neutral-600"}>
              {todayText}
            </p>
          )}
          {weekText && (
            <p className={weekColorClass || "text-neutral-600"}>
              {weekText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default CCMOverviewCard;
