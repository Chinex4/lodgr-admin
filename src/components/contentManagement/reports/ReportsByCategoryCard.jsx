import React, { useState, useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CalendarDays } from "lucide-react";

const COLORS = {
  spam: "#fbbf24", // yellow / orange
  hate: "#06b6d4", // cyan
  nudity: "#8b5cf6", // purple
  others: "#93c5fd", // light blue
};

const baseCategoryData = [
  { name: "Spam", key: "spam", value: 35 },
  { name: "Hate speech", key: "hate", value: 25 },
  { name: "Nudity", key: "nudity", value: 20 },
  { name: "Others", key: "others", value: 20 },
];

function ReportsByCategoryCard() {
  const [range, setRange] = useState("24h"); // 24h | 7d | 30d | 1y

  const chartData = useMemo(() => {
    if (range === "24h") return baseCategoryData;
    if (range === "7d")
      return baseCategoryData.map((d) => ({
        ...d,
        value: d.value + (d.key === "spam" ? 5 : 0),
      }));
    if (range === "30d")
      return baseCategoryData.map((d) => ({
        ...d,
        value: d.value + (d.key === "hate" ? 10 : 0),
      }));
    return baseCategoryData.map((d) => ({
      ...d,
      value: d.value + (d.key === "others" ? 8 : 0),
    }));
  }, [range]);

  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm px-4 md:px-6 pt-4 pb-5 flex flex-col gap-4">
      {/* header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
          <div className="relative inline-flex">
            <p className="text-sm md:text-base font-semibold text-neutral-900">
              Reports by Category
            </p>
            <span className="absolute -bottom-1 left-0 h-1 w-14 rounded-full bg-sky-400" />
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
              { id: "90d", label: "90 days" },
              { id: "1y", label: "1 year" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setRange(opt.id === "90d" ? "30d" : opt.id)}
                className={`px-3 md:px-3.5 py-1.5 text-xs md:text-sm rounded-lg font-medium transition ${
                  range === opt.id || (range === "30d" && opt.id === "90d")
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

      {/* chart + legend */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mt-2">
        <div className="w-full md:w-1/2 h-52 md:h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="60%"
                outerRadius="90%"
                paddingAngle={3}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.key}
                    fill={COLORS[entry.key]}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 flex flex-col gap-2 text-sm">
          {chartData.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[item.key] }}
                />
                <span className="text-neutral-700">{item.name}</span>
              </div>
              <span className="text-neutral-900 font-medium">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReportsByCategoryCard;
