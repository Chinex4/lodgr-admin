// src/components/dashboard/OverviewCardsSection.jsx
import React from "react";
import { Users, LineChart, FileStack, Radar } from "lucide-react";
import OverviewCard from "../OverviewCard";

const overviewCards = [
  {
    id: "totalUsers",
    title: "Total Users",
    value: "325,000",
    helper: "5% this week",
    trendDirection: "up",
    Icon: Users,
    badgeBgClass: "bg-[#f4e6fd]",
    titleColorClass: "text-primary",
    accentColor: "#8f07e7",
  },
  {
    id: "activeUsers",
    title: "Active Users",
    value: "25,000",
    helper: "+324 Today • +1009 This week",
    trendDirection: "up",
    Icon: LineChart,
    badgeBgClass: "bg-[#e6f9ed]",
    titleColorClass: "text-emerald-600",
    accentColor: "#16a34a",
  },
  {
    id: "postsCreated",
    title: "Posts Created",
    value: "4,040",
    helper: "12.7% this week",
    trendDirection: "down",
    Icon: FileStack,
    badgeBgClass: "bg-[#fff3df]",
    titleColorClass: "text-orange-500",
    accentColor: "#f97316",
  },
  {
    id: "engagementTrends",
    title: "Engagement Trends",
    value: "32%",
    helper: "35% this week",
    trendDirection: "up",
    Icon: Radar,
    badgeBgClass: "bg-[#e3ecff]",
    titleColorClass: "text-blue-600",
    accentColor: "#2563eb",
  },
];

function OverviewCardsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {overviewCards.map((card) => (
        <OverviewCard key={card.id} {...card} />
      ))}
    </section>
  );
}

export default OverviewCardsSection;
