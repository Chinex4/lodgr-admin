import React, { useState } from "react";
import { CalendarDays } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { userGrowthTimeline } from "../../data/userManagementData";

const ranges = ["Week", "Month", "Year"];

function UserGrowthSummaryCard() {
  const [activeRange, setActiveRange] = useState("Week");

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 gap-3">
        <div className="flex-1">
          <h3 className="text-xs font-semibold text-neutral-900">
            User Growth
          </h3>
          <div className="mt-2 flex items-center">
            <div className="h-[3px] w-20 rounded-full bg-blue-500" />
            <div className="h-px flex-1 bg-neutral-200 ml-4 rounded-full" />
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
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-700 hover:bg-white"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-3 pb-5 pt-1 flex-1">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowthTimeline}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={true}
                horizontal={true}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8f07e7"
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 0, fill: "#8f07e7" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default UserGrowthSummaryCard;
