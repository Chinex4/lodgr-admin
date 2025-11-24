import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppLayout() {
  return (
    // Full viewport height, no body scroll
    <div className="h-screen overflow-hidden bg-[#f5f5f7] text-neutral-900 flex">
      {/* LEFT: Sidebar (fixed in place because only main scrolls) */}
      <Sidebar />

      {/* RIGHT: Topbar + main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar is non-scrolling header */}
        <Topbar />

        {/* Only this area scrolls */}
        <main className="flex-1 overflow-y-auto px-2 md:px-6 lg:px-8 pb-8 pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
