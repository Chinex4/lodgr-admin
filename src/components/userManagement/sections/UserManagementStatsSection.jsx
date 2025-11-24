// src/components/userManagement/UserManagementStatsSection.jsx
import React from "react";
import UserGrowthSummaryCard from "../UserGrowthSummaryCard";
import UserActivityCard from "../UserActivityCard";

function UserManagementStatsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <UserGrowthSummaryCard />
      <div className="xl:col-span-2">
        <UserActivityCard />
      </div>
    </section>
  );
}

export default UserManagementStatsSection;
