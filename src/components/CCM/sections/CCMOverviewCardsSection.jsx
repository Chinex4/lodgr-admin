import React from "react";
import { Users, Flag, Info } from "lucide-react";
import CCMOverviewCard from "../CCMOverviewCard";

const overviewCards = [
  {
    id: "totalMemes",
    title: "Total Memes",
    value: "1.2k",
    Icon: Users,
    badgeBgClass: "bg-[#E6FAFF]", // soft pink
    titleColorClass: "text-[#1E95B3]",
    todayText: null,
    todayColorClass: "text-[#1E95B3]",
    weekText: null,
    weekColorClass: null,
  },
  {
    id: "activeMemes",
    title: "Active Memes",
    value: "85%",
    Icon: Flag,
    badgeBgClass: "bg-[#e6f9ed]", // soft green
    titleColorClass: "text-emerald-600",
    todayText: null,
    todayColorClass: null,
    weekText: null,
    weekColorClass: null,
  },
  {
    id: "reportedMemes ",
    // keeping the typo from the design
    title: "Reported Memes",
    value: "15%",
    Icon: Flag,
    badgeBgClass: "bg-[#fff3df]", // soft orange
    titleColorClass: "text-orange-500",
    todayText: null,
    weekText: null,
  },
];

function CCMOverviewCardsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {overviewCards.map((card) => (
        <CCMOverviewCard key={card.id} {...card} />
      ))}
    </section>
  );
}

export default CCMOverviewCardsSection;
