// src/components/dashboard/UserGrowthCard.jsx
import React from "react";
import { CalendarDays } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const userGrowthData = [
  { day: "Mon", posts: 60 },
  { day: "Tue", posts: 120 },
  { day: "Wed", posts: 200 },
  { day: "Thu", posts: 290 },
  { day: "Fri", posts: 360 },
  { day: "Sat", posts: 410 },
  { day: "Sun", posts: 430 },
];

function UserGrowthCard() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900">
              User Growth
            </span>
          </div>
          {/* little blue underline like tab */}
          <div className="h-0.5 w-16 bg-blue-500 rounded-full" />
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50">
            <CalendarDays className="h-4 w-4" />
          </button>
          <button className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50">
            Week
            <span className="ml-1 text-xs">▾</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 pb-4 pt-1 flex-1">
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userGrowthData} margin={{ left: 0, right: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="day"
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
              <Area
                type="monotone"
                dataKey="posts"
                stroke="#8f07e7"
                fill="#f4e6fd"
                fillOpacity={0.9}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-center text-xs text-neutral-500">● Posts</p>
      </div>
    </div>
  );
}

export default UserGrowthCard;
