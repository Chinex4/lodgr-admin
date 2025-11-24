// src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Layers3,
  BadgePercent,
  Mail,
  Settings,
  ChevronDown,
} from "lucide-react";

const mainLinks = [
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
    to: "/communication-notification",
    label: "Communication & Notification",
    icon: Mail,
  },
];

const settingsSubLinks = [
  {
    to: "/settings/general",
    label: "General Settings",
  },
  {
    to: "/settings/security-access",
    label: "Security & Access",
  },
  {
    to: "/settings/audit-logs",
    label: "Audit Logs",
  },
];

function Sidebar({ isMobileOpen, onMobileClose }) {
  const location = useLocation();
  const isSettingsActive = location.pathname.startsWith("/settings");
  const [settingsOpen, setSettingsOpen] = useState(isSettingsActive);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-neutral-200",
          "transform transition-transform duration-200 ease-in-out",
          "flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:static md:translate-x-0 md:flex",
        ].join(" ")}
      >
        <div className="h-16 flex items-center px-4 border-b border-neutral-100 mt-2">
          <img className="size-10" src="/images/logo.png" alt="Zagasm Admin" />
          <span className="ml-2 text-xl font-bold">Zagasm Admin</span>
        </div>

        <nav className="flex-1 px-3 py-8 space-y-4 mt-3 overflow-y-auto">
          {mainLinks.map(({ to, label, icon: Icon }) => (
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
              // close drawer when clicking link on mobile
              onClick={onMobileClose}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Settings & Security dropdown */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setSettingsOpen((prev) => !prev)}
              className={[
                "w-full flex items-center justify-between rounded-2xl px-4 py-2.5 font-medium",
                "text-neutral-500 hover:bg-primary/5 transition-all duration-200 hover:text-primary",
                isSettingsActive
                  ? "bg-primary text-white shadow-[0_8px_16px_rgba(143,7,231,0.25)]"
                  : "",
              ].join(" ")}
            >
              <span className="flex items-center gap-3">
                <Settings size={20} />
                <span>Settings &amp; Security</span>
              </span>
              <ChevronDown
                size={18}
                className={`transition-transform ${
                  settingsOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {settingsOpen && (
              <div className="mt-1 space-y-1 pl-4">
                {settingsSubLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      [
                        "flex items-center rounded-xl px-4 py-2 text-sm",
                        "text-neutral-500 hover:bg-primary/5 hover:text-primary transition-all duration-200",
                        isActive
                          ? "text-primary font-semibold bg-primary/5"
                          : "",
                      ].join(" ")
                    }
                    onClick={onMobileClose}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 mr-2" />
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
