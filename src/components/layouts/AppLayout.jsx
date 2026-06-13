import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const drawerWidth = 280;

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Topbar drawerWidth={drawerWidth} onMenuClick={() => setMobileOpen(true)} />
      <Sidebar drawerWidth={drawerWidth} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth}px)` }, px: { xs: 2, md: 3 }, py: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
