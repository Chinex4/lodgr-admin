import React, { useState } from "react";
import { CalendarDays } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { userActivityBreakdown } from "../../data/userManagementData";

const ranges = ["Week", "Month", "Year"];
const COLORS = ["#8f07e7", "#09c6ff"];

function UserActivityCard() {
  const [activeRange, setActiveRange] = useState("Week");

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-neutral-900">
              User Activity
            </h3>
            <div className="mt-2 flex items-center">
              <div className="h-[3px] w-20 rounded-full bg-[#09c6ff]" />
              <div className="h-px flex-1 bg-neutral-200 ml-4 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <button className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50">
          <CalendarDays className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1 bg-neutral-50 rounded-xl p-1">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                activeRange === range
                  ? "bg-primary text-white"
                  : "text-neutral-700 hover:bg-white"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Inner box with pie */}
      <div className="px-5 pb-5 flex-1">
        <div className="w-full h-full rounded-2xl border border-neutral-100 bg-white px-4 py-4 flex flex-col items-center justify-center gap-6">
          <div className="w-full h-48 md:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userActivityBreakdown}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {userActivityBreakdown.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="text-neutral-700">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#09c6ff]" />
              <span className="text-neutral-700">Inactive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserActivityCard;
