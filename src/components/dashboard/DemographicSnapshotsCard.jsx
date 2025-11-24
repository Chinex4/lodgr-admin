// src/components/dashboard/DemographicSnapshotsCard.jsx
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#8f07e7", "#08d2ff"];

const demoData = [
  { name: "Male", value: 225250, percent: 58.33 },
  { name: "Female", value: 99750, percent: 41.67 },
];

function DemographicSnapshotsCard() {
  const male = demoData[0];
  const female = demoData[1];

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <h3 className="text-sm font-semibold text-neutral-900">
          Demographic Snapshots
        </h3>
        {/* little cyan underline + grey line like in design */}
        <div className="mt-2 flex items-center">
          <div className="h-[3px] w-20 rounded-full bg-[#09c6ff]" />
          <div className="h-px flex-1 bg-neutral-200 ml-4 rounded-full" />
        </div>
      </div>

      {/* Inner content box */}
      <div className="px-5 pb-5 flex-1">
        <div className="w-full h-full rounded-2xl border border-neutral-100 bg-white px-4 py-4 flex flex-col md:flex-row items-center gap-6">
          {/* Left labels */}
          <div className="md:w-1/3 flex flex-col items-start gap-6 text-sm">
            <div className="space-y-1">
              <p className="text-neutral-600">Male</p>
              <div className="w-full h-0.5 bg-primary rounded-full" />
              <p className="text-xs">
                <span className="text-primary font-semibold">
                  {male.value.toLocaleString()}
                </span>
                <span className="ml-2 text-neutral-500">
                  {male.percent.toFixed(2)}%
                </span>
              </p>
            </div>

            <div className="space-y-1 md:hidden">
              <p className="text-neutral-600">Female</p>
              <div className="w-full h-0.5 bg-[#09c6ff] rounded-full" />
              <p className="text-xs">
                <span className="text-[#09c6ff] font-semibold">
                  {female.value.toLocaleString()}
                </span>
                <span className="ml-2 text-neutral-500">
                  {female.percent.toFixed(2)}%
                </span>
              </p>
            </div>
          </div>

          {/* Middle: pie */}
          <div className="md:w-1/3 w-full h-44 md:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demoData}
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {demoData.map((entry, index) => (
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

          {/* Right labels */}
          <div className="hidden md:flex md:w-1/3 flex-col items-end gap-6 text-sm">
            <div className="space-y-1 text-right">
              <p className="text-neutral-600">Female</p>
              <div className="w-full h-0.5 bg-[#09c6ff] rounded-full" />
              <p className="text-xs">
                <span className="text-[#09c6ff] font-semibold">
                  {female.value.toLocaleString()}
                </span>
                <span className="ml-2 text-neutral-500">
                  {female.percent.toFixed(2)}%
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className=" relative -top-10 mt-4 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-neutral-700">Male</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#09c6ff]" />
            <span className="text-neutral-700">Female</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DemographicSnapshotsCard;
