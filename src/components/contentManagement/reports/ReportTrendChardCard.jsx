import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { CalendarDays } from "lucide-react";

const baseData = [
  { label: "Apr 1", value: 400 },
  { label: "Apr 4", value: 190 },
  { label: "Apr 8", value: 240 },
  { label: "Apr 12", value: 200 },
  { label: "Apr 16", value: 280 },
  { label: "Apr 20", value: 160 },
  { label: "Apr 24", value: 340 },
  { label: "Apr 28", value: 500 },
  { label: "May 1", value: 290 },
];

function ReportTrendChartCard() {
  const [range, setRange] = useState("week"); // week | month | year

  const data = useMemo(() => {
    if (range === "week") return baseData.slice(-4);
    if (range === "month") return baseData;
    return [
      ...baseData,
      { label: "May 5", value: 260 },
      { label: "May 9", value: 320 },
      { label: "May 13", value: 280 },
    ];
  }, [range]);

  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm px-4 md:px-6 pt-4 pb-5 flex flex-col gap-4">
      {/* header with tab-like underline */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
          <div className="relative inline-flex">
            <p className="text-sm md:text-base font-semibold text-neutral-900">
              Reports Trend Over Time
            </p>
            <span className="absolute -bottom-1 left-0 h-1 w-14 rounded-full bg-blue-500" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* calendar button (placeholder for real date picker) */}
          <button className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 px-3 py-1.5 text-xs md:text-sm text-neutral-700 bg-white hover:bg-neutral-50">
            <CalendarDays className="h-4 w-4 text-neutral-500" />
          </button>

          {/* range tabs */}
          <div className="inline-flex rounded-xl bg-neutral-50 border border-neutral-100 p-1">
            {[
              { id: "week", label: "Week" },
              { id: "month", label: "Month" },
              { id: "year", label: "Year" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setRange(opt.id)}
                className={`px-3 md:px-4 py-1.5 text-xs md:text-sm rounded-lg font-medium transition ${
                  range === opt.id
                    ? "bg-white shadow-sm text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* chart */}
      <div className="h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="reportsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8f07e7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8f07e7" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickCount={6}
            />
            <Tooltip
              cursor={{ stroke: "#c4b5fd", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8f07e7"
              strokeWidth={3}
              fill="url(#reportsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* legend row under chart */}
      <div className="flex items-center justify-center gap-6 text-xs md:text-sm text-neutral-600">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span>Like</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-primarySecond" />
          <span>Comment</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-lightPurple" />
          <span>Share</span>
        </div>
      </div>
    </div>
  );
}

export default ReportTrendChartCard;
