import React from "react";
import { Search, Bell, Menu } from "lucide-react";

function Topbar() {
  return (
    <header className="shrink-0 h-20 bg-white border-b border-neutral-200 flex items-center justify-between px-4 md:px-6 lg:px-8">
      <div className="flex-1 mx-4 max-w-md">
        <div className="flex items-center gap-2 bg-[#f3f4f8] rounded-full px-3 py-1.5">
          <Search className="h-4 w-4 text-neutral-400" />
          <input
            className="w-full bg-transparent text-xs py-3 md:text-sm outline-none"
            placeholder="Search for something..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="inline-flex relative items-center justify-center rounded-full p-2 hover:bg-neutral-100">
          <div className="absolute -top-1 right-0 bg-primary size-5 rounded-full text-white grid place-items-center">
            <span className="text-xs">6</span>
          </div>
          <Bell className="size-6 text-neutral-700" />
        </button>
        <div className="px-3 py-2 shadow-md rounded-xl flex items-center gap-2">
          <img src="/images/dummy-user.png" alt="" />
          <h3>Admin</h3>
          <Menu />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
