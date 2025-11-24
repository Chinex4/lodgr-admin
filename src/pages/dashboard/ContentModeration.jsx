import React from "react";
import ContentOverviewCardsSection from "../../components/contentManagement/sections/ContentOverviewCardsSection";
import ReportsChartsSection from "../../components/contentManagement/sections/ReportsChartSection";
import ModerationQueueSection from "../../components/contentManagement/sections/ModerationQueueSection";
import ReportsTrendAndRecentPostsSection from "../../components/contentManagement/reports/ReportsTrendAndRecentPostsSection";

function ContentModeration() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900">Content Moderation</h2>
      <ContentOverviewCardsSection />
      <ReportsChartsSection />
      <ModerationQueueSection />
      <ReportsTrendAndRecentPostsSection />
    </div>
  );
}

export default ContentModeration;
