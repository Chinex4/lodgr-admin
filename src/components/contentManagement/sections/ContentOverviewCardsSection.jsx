// src/components/dashboard/sections/OverviewCards.jsx
import React from "react";
import { Users, Flag, Info } from "lucide-react";
import ContentOverviewCard from "../ContentOverviewCard";

const overviewCards = [
  {
    id: "reportedUsers",
    title: "Total Reported Users",
    value: "1.2k",
    Icon: Users,
    badgeBgClass: "bg-[#fbe5f0]", // soft pink
    titleColorClass: "text-rose-500",
    todayText: "32 Today",
    todayColorClass: "text-rose-500",
    weekText: "50 This week",
    weekColorClass: "text-red-500",
  },
  {
    id: "resolvedReports",
    title: "Resolved Reports",
    value: "85%",
    Icon: Flag,
    badgeBgClass: "bg-[#e6f9ed]", // soft green
    titleColorClass: "text-emerald-600",
    todayText: "324 Today",
    todayColorClass: "text-emerald-500",
    weekText: "1009 This week",
    weekColorClass: "text-emerald-500",
  },
  {
    id: "pendingReports",
    // keeping the typo from the design
    title: "Rending Reports",
    value: "15%",
    Icon: Flag,
    badgeBgClass: "bg-[#fff3df]", // soft orange
    titleColorClass: "text-orange-500",
    todayText: null,
    weekText: null,
  },
  {
    id: "topViolation",
    title: "Top Violation Type",
    value: "Hate Speech",
    Icon: Info,
    badgeBgClass: "bg-[#e3ecff]",
    titleColorClass: "text-blue-600",
    todayText: null,
    weekText: null,
  },
];

function ContentOverviewCardsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
      {overviewCards.map((card) => (
        <ContentOverviewCard key={card.id} {...card} />
      ))}
    </section>
  );
}

export default ContentOverviewCardsSection;
