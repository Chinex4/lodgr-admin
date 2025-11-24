import React from "react";
import OverviewCardsSection from "../../components/dashboard/sections/OverviewCards";
import ChartsSection from "../../components/dashboard/sections/ChartsSection";

function DashboardPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900">Dashboard</h2>
      <OverviewCardsSection />
      <ChartsSection />
    </div>
  );
}

export default DashboardPage;
