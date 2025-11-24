import React from "react";
import CCMOverviewCardsSection from "../../components/CCM/sections/CCMOverviewCardsSection";
import MemeUploadsOverTimeCard from "../../components/CCM/sections/MemeUploadsOvertime";
import ContentLibrarySection from "../../components/CCM/sections/ContentLibrarySection";

function ContentCategoryManagement() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900">Content And Category Management</h2>
      <CCMOverviewCardsSection />
      <MemeUploadsOverTimeCard />
      <ContentLibrarySection />
    </div>
  );
}

export default ContentCategoryManagement;
