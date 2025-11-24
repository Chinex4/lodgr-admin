// src/components/contentManagement/reports/MemeUploadsOverTimeCard.jsx
import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { CalendarDays } from "lucide-react";

const baseData = [
  { label: "Apr 1", value: 330 },
  { label: "Apr 2", value: 355 },
  { label: "Apr 3", value: 405 },
  { label: "Apr 4", value: 402 },
  { label: "Apr 5", value: 405 },
  { label: "Apr 6", value: 403 },
  { label: "Apr 7", value: 404 },
  { label: "Apr 8", value: 410 },
  { label: "Apr 9", value: 412 },
  { label: "Apr 10", value: 370 },
  { label: "Apr 11", value: 280 },
];

function MemeUploadsOverTimeCard() {
  const [range, setRange] = useState("24h"); // 24h | 7d | 30d | 1y

  const data = useMemo(() => {
    if (range === "24h") return baseData.slice(-7);
    if (range === "7d") return baseData;
    if (range === "30d") {
      return [...baseData, { label: "Apr 12", value: 390 }];
    }
    // 1y mock
    return [
      ...baseData,
      { label: "Apr 12", value: 390 },
      { label: "Apr 13", value: 360 },
    ];
  }, [range]);

  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm px-4 md:px-6 pt-4 pb-5 flex flex-col gap-4">
      {/* header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="relative inline-flex">
            <p className="text-sm md:text-base font-semibold text-neutral-900">
              Meme uploads over time
            </p>
            <span className="absolute -bottom-1 left-0 h-1 w-20 rounded-full bg-blue-500" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 px-3 py-1.5 text-xs md:text-sm text-neutral-700 bg-white hover:bg-neutral-50">
            <CalendarDays className="h-4 w-4 text-neutral-500" />
          </button>

          <div className="inline-flex rounded-xl bg-neutral-50 border border-neutral-100 p-1">
            {[
              { id: "24h", label: "24hrs" },
              { id: "7d", label: "7 days" },
              { id: "30d", label: "30 days" },
              { id: "1y", label: "1 year" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRange(opt.id)}
                className={`px-3 md:px-4 py-1.5 text-xs md:text-sm rounded-lg font-medium transition ${
                  range === opt.id
                    ? "bg-primary/10 text-primary shadow-sm"
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
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#e5e7eb"
              strokeDasharray="3 3"
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
              cursor={{ fill: "rgba(129, 140, 248, 0.12)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="value"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MemeUploadsOverTimeCard;
