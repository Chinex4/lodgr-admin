import { createElement } from "react";
import { NavLink } from "react-router-dom";
import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CampaignIcon from "@mui/icons-material/Campaign";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SettingsIcon from "@mui/icons-material/Settings";

const links = [
  ["/", "Overview", DashboardIcon], ["/users", "Users", PeopleIcon], ["/properties", "Properties", HomeWorkIcon],
  ["/bookings", "Bookings", EventAvailableIcon], ["/home-sections", "Home Sections", ViewCarouselIcon],
  ["/payment-methods", "Payment Methods", PaymentsIcon],
  ["/payouts", "Payouts", AccountBalanceWalletIcon], ["/withdrawals", "Withdrawals", AccountBalanceWalletIcon],
  ["/newsletter", "Newsletter", CampaignIcon], ["/transactions", "Transactions", ReceiptLongIcon],
  ["/reviews", "Reviews", RateReviewIcon], ["/contact-messages", "Contact Messages", ContactMailIcon],
  ["/audit-logs", "Audit Log", ManageSearchIcon], ["/settings", "Settings", SettingsIcon],
];

function DrawerContent({ onClose }) {
  return <Box sx={{ height: "100%", bgcolor: "#0f2418", color: "white" }}>
    <Toolbar sx={{ px: 2 }}><Typography variant="h6">Bealodgr Admin</Typography></Toolbar>
    <Divider sx={{ borderColor: "rgba(255,255,255,.1)" }} />
    <List sx={{ px: 1.5, py: 2 }}>
      {links.map(([to, label, icon]) => <ListItemButton key={to} component={NavLink} to={to} end={to === "/"} onClick={onClose}
        sx={{ borderRadius: 1.5, mb: .5, color: "rgba(255,255,255,.72)", '&.active': { bgcolor: "primary.main", color: "white" }, '&:hover': { bgcolor: "rgba(255,255,255,.08)" } }}>
        <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{createElement(icon)}</ListItemIcon><ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }} />
      </ListItemButton>)}
    </List>
  </Box>;
}

export default function Sidebar({ drawerWidth, mobileOpen, onClose }) {
  return <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
    <Drawer variant="temporary" open={mobileOpen} onClose={onClose} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", md: "none" }, '& .MuiDrawer-paper': { width: drawerWidth } }}><DrawerContent onClose={onClose} /></Drawer>
    <Drawer variant="permanent" open sx={{ display: { xs: "none", md: "block" }, '& .MuiDrawer-paper': { width: drawerWidth, border: 0 } }}><DrawerContent /></Drawer>
  </Box>;
}
