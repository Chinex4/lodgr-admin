// src/components/layout/Topbar.jsx
import React, { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Popover } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Topbar({ onMenuClick }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // plug your logout logic here
    console.log("Logging out…");
    logout();
    navigate("/login");
    handleClosePopover();
  };

  return (
    <header className="shrink-0 h-20 bg-white border-b border-neutral-200 flex items-center justify-between px-4 md:px-6 lg:px-8">
      {/* Left: menu button (mobile) + search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex items-center justify-center rounded-full p-2 hover:bg-neutral-100 md:hidden"
        >
          <Menu className="h-5 w-5 text-neutral-800" />
        </button>
        <img className="md:hidden" src="/images/logo.png" alt="" />

        <div className="flex-1 hidden md:block">
          <div className="flex items-center gap-2 bg-[#f3f4f8] rounded-full px-3 py-1.5">
            <Search className="h-4 w-4 text-neutral-400" />
            <input
              className="w-full bg-transparent text-xs py-3 md:text-sm outline-none"
              placeholder="Search for something..."
            />
          </div>
        </div>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-4">
        <button className="inline-flex relative items-center justify-center rounded-full p-2 hover:bg-neutral-100">
          <div className="absolute -top-1 right-0 bg-primary size-5 rounded-full text-white grid place-items-center">
            <span className="text-xs">6</span>
          </div>
          <Bell className="size-6 text-neutral-700" />
        </button>

        <button
          type="button"
          onClick={handleProfileClick}
          className="px-3 py-2 shadow-md rounded-xl flex items-center gap-2 hover:bg-neutral-50"
        >
          <img
            src="/images/dummy-user.png"
            alt="Admin avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-neutral-900">Admin</span>
            <span className="text-[11px] text-neutral-500 hidden sm:inline">
              admin@zagasm.com
            </span>
          </div>
        </button>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              borderRadius: 3,
              px: 2,
              py: 1.5,
              boxShadow: "0 12px 40px rgba(15,23,42,0.18)",
            },
          }}
        >
          <div className="flex items-center gap-3 px-1 py-1.5">
            <img
              src="/images/dummy-user.png"
              alt="Admin avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-neutral-900">Admin</p>
              <p className="text-xs text-neutral-500">admin@zagasm.com</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 w-full rounded-xl bg-neutral-100 hover:bg-neutral-200 text-sm font-medium text-neutral-800 px-3 py-1.5 text-left"
          >
            Logout
          </button>
        </Popover>
      </div>
    </header>
  );
}

export default Topbar;
