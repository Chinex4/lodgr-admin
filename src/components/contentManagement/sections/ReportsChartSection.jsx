import React from "react";
import ReportTrendChartCard from "../reports/ReportTrendChardCard";
import ReportsByCategoryCard from "../reports/ReportsByCategoryCard";

function ReportsChartsSection() {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">
      <ReportTrendChartCard />
      <ReportsByCategoryCard />
    </section>
  );
}

export default ReportsChartsSection;
