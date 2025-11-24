import React from "react";
import ReportTrendLargeCard from "../reports/ReportTrendLargeCard";
import RecentPostsTableCard from "./RecentPostsTableCard";

function ReportsTrendAndRecentPostsSection() {
  return (
    <section className="space-y-6 mt-6">
      <ReportTrendLargeCard />
      <RecentPostsTableCard />
    </section>
  );
}

export default ReportsTrendAndRecentPostsSection;
