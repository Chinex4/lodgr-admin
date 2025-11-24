import React from "react";
import UserGrowthCard from "../UserGrowthCard";
import EngagementTrendsCard from "../EngagementTrendsCard";
import TopPerformingContentCard from "../TopPerformingContentCard";
import ModerationSummaryCard from "../ModerationSummaryCard";
import DemographicSnapshotsCard from "../DemographicSnapshotsCard";

function ChartsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <UserGrowthCard />
      <EngagementTrendsCard />
      <TopPerformingContentCard />

      <ModerationSummaryCard />

      <div className="lg:col-span-2">
        <DemographicSnapshotsCard />
      </div>
    </section>
  );
}

export default ChartsSection;
