import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Avatar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Topbar({ drawerWidth, onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);
  const handleLogout = async () => {
    await toast.promise(logout(), { loading: "Signing out...", success: "Signed out", error: "Logout failed" });
    navigate("/login", { replace: true });
  };
  return <AppBar position="fixed" color="inherit" elevation={0} sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` }, borderBottom: "1px solid #e2e8f0" }}>
    <Toolbar>
      <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 1, display: { md: "none" } }}><MenuIcon /></IconButton>
      <Box sx={{ flexGrow: 1 }}><Typography variant="subtitle1" fontWeight={800}>Bealodgr Operations Console</Typography><Typography variant="caption" color="text.secondary">Asaba property operations and platform management</Typography></Box>
      <Button onClick={(e) => setAnchor(e.currentTarget)} startIcon={<Avatar sx={{ width: 28, height: 28, bgcolor: "primary.main" }}>{(user?.full_name || user?.email || "A").charAt(0)}</Avatar>} color="inherit">
        <Box sx={{ textAlign: "left", display: { xs: "none", sm: "block" } }}><Typography fontSize={13} fontWeight={800}>{user?.full_name || "Admin"}</Typography><Typography fontSize={11} color="text.secondary">{user?.email}</Typography></Box>
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}><MenuItem onClick={handleLogout}><LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout</MenuItem></Menu>
    </Toolbar>
  </AppBar>;
}
