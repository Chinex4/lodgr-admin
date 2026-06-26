import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import { api, errorMessage, unwrap } from "../../lib/api";
import { date, money } from "../../utils/formatters";

const initials = (user) => (user?.full_name || user?.email || "U").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

function InfoItem({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={700}>{value || "-"}</Typography>
    </Box>
  );
}

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = unwrap(await api.get(`/admin/users/${userId}`));
        if (active) setPayload(data);
      } catch (requestError) {
        if (active) setError(errorMessage(requestError));
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <Stack sx={{ py: 8 }} alignItems="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return (
      <Page title="User" subtitle="Unable to load user details.">
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/users")}>Back to users</Button>
      </Page>
    );
  }

  const user = payload?.profile || {};
  const summary = payload?.summary || {};
  const bookings = payload?.bookings || [];
  const hostBookings = payload?.host_bookings || [];
  const properties = payload?.properties || [];
  const reviews = payload?.reviews || [];

  return (
    <Page
      title={user.full_name || user.email || "User"}
      subtitle="Profile, activity, earnings, bookings, properties, and reviews."
      action={<Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/users")}>Back</Button>}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Stack spacing={2} alignItems="flex-start">
              <Avatar src={user.avatar_url || ""} sx={{ width: 72, height: 72, fontSize: 26 }}>{initials(user)}</Avatar>
              <Box>
                <Typography variant="h6">{user.full_name || "Unnamed user"}</Typography>
                <Typography color="text.secondary">{user.email}</Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={user.role || user.user_roles?.[0]?.role || "guest"} />
                <Chip label={user.status || "active"} color={user.status === "active" ? "success" : "default"} />
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={6}><InfoItem label="Phone" value={user.phone} /></Grid>
                <Grid item xs={6}><InfoItem label="Joined" value={date(user.created_at)} /></Grid>
                <Grid item xs={12}><InfoItem label="User ID" value={user.id} /></Grid>
              </Grid>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {[
              ["Guest bookings", summary.guest_bookings],
              ["Host bookings", summary.host_bookings],
              ["Properties", summary.properties],
              ["Earnings", money(summary.earnings)],
              ["Points", summary.points_balance],
              ["Reviews", reviews.length],
            ].map(([label, value]) => (
              <Grid item xs={12} sm={6} md={4} key={label}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary">{label}</Typography>
                  <Typography variant="h6">{value ?? 0}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 1 }}>Guest bookings</Typography>
          <DataTable rows={bookings} columns={[
            { key: "properties.title", label: "Property" },
            { key: "check_in", label: "Check-in" },
            { key: "check_out", label: "Check-out" },
            { key: "total_price", label: "Total", render: (row) => money(row.total_price) },
            { key: "status", label: "Status", render: (row) => <Chip size="small" label={row.status} /> },
          ]} />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 1 }}>Host bookings</Typography>
          <DataTable rows={hostBookings} columns={[
            { key: "properties.title", label: "Property" },
            { key: "profiles.email", label: "Guest" },
            { key: "check_in", label: "Check-in" },
            { key: "total_price", label: "Total", render: (row) => money(row.total_price) },
            { key: "status", label: "Status", render: (row) => <Chip size="small" label={row.status} /> },
          ]} />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 1 }}>Properties</Typography>
          <DataTable rows={properties} columns={[
            { key: "title", label: "Title" },
            { key: "city", label: "City" },
            { key: "price_per_night", label: "Nightly", render: (row) => money(row.price_per_night) },
            { key: "status", label: "Status", render: (row) => <Chip size="small" label={row.status} /> },
          ]} />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 1 }}>Reviews</Typography>
          <DataTable rows={reviews} columns={[
            { key: "property.title", label: "Property" },
            { key: "rating", label: "Rating" },
            { key: "comment", label: "Comment" },
            { key: "status", label: "Status", render: (row) => <Chip size="small" label={row.status || (row.is_hidden ? "hidden" : "visible")} /> },
            { key: "created_at", label: "Created", render: (row) => date(row.created_at) },
          ]} />
        </Grid>
      </Grid>
    </Page>
  );
}
