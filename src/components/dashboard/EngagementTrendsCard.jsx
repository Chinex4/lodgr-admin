// src/components/dashboard/EngagementTrendsCard.jsx
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
  Legend,
} from "recharts";

const engagementData = [
  { day: "Mon", like: 340, comment: 275, share: 220 },
  { day: "Tue", like: 315, comment: 270, share: 225 },
  { day: "Wed", like: 335, comment: 290, share: 245 },
  { day: "Thu", like: 365, comment: 310, share: 275 },
  { day: "Fri", like: 390, comment: 335, share: 305 },
  { day: "Sat", like: 395, comment: 340, share: 295 },
  { day: "Sun", like: 370, comment: 320, share: 285 },
];

const ranges = ["Week", "Month", "Year"];

function EngagementTrendsCard() {
  const [activeRange, setActiveRange] = useState("Week");

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-900">
            Engagement Trends
          </span>
          <div className="h-0.5 w-20 bg-blue-500 rounded-full" />
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50">
            <CalendarDays className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1 bg-neutral-50 rounded-xl p-1">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRange(r)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  activeRange === r
                    ? "bg-primary text-white shadow-sm"
                    : "text-neutral-600 hover:bg-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 pb-4 pt-1 flex-1">
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementData}>
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
              <Legend
                verticalAlign="bottom"
                height={32}
                iconType="circle"
                wrapperStyle={{ fontSize: 11, paddingTop: 32 }}
              />
              <Line
                type="monotone"
                dataKey="like"
                name="Like"
                stroke="#8f07e7"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="comment"
                name="Comment"
                stroke="#c115b5"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="share"
                name="Share"
                stroke="#a855f7"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default EngagementTrendsCard;
