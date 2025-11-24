import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Layers3,
  BadgePercent,
  Mail,
  Settings,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/user-management", label: "User Management", icon: Users },
  {
    to: "/content-moderation",
    label: "Content Moderation",
    icon: ShieldCheck,
  },
  {
    to: "/content-category",
    label: "Content & Category Management",
    icon: Layers3,
  },
  {
    to: "/monetization",
    label: "Monetization & Revenue",
    icon: BadgePercent,
  },
  {
    to: "/communication",
    label: "Communication & Notification",
    icon: Mail,
  },
  {
    to: "/settings",
    label: "Settings & Security",
    icon: Settings,
  },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-4 border-b border-neutral-100 mt-2">
        <img className="size-10" src="/images/logo.png" alt="Zagasm Admin" />
        <span className="ml-2 text-xl font-bold">Zagasm Admin</span>
      </div>

      <nav className="flex-1 px-3 py-8 space-y-4 mt-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-2xl px-4 py-2.5 font-medium",
                "text-neutral-500 hover:bg-primary/5 transition-all duration-200 hover:text-primary",
                isActive
                  ? "bg-primary text-white shadow-[0_8px_16px_rgba(143,7,231,0.25)]"
                  : "",
              ].join(" ")
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
