import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import { useApiList } from "../../hooks/useApiList";
import { date } from "../../utils/formatters";

const ACTION_OPTIONS = [
  ["", "All actions"],
  ["user.status_updated", "User status"],
  ["property.approved", "Property approval"],
  ["property.visibility_updated", "Visibility"],
  ["payout.verified", "Payout verified"],
  ["payout.deleted", "Payout deleted"],
  ["withdrawal.status_updated", "Withdrawal status"],
  ["refund.created", "Refund created"],
  ["booking.approved", "Booking approved"],
  ["booking.cancelled", "Booking cancelled"],
  ["booking.completed", "Booking completed"],
];

const TARGET_OPTIONS = [
  ["", "All targets"],
  ["user", "Users"],
  ["property", "Properties"],
  ["payout", "Payouts"],
  ["withdrawal", "Withdrawals"],
  ["refund", "Refunds"],
  ["booking", "Bookings"],
];

function compactValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function diffSummary(metadata) {
  const previous = metadata?.previous;
  const current = metadata?.current;

  if (!previous && !current) return "-";

  const keys = Array.from(new Set([
    ...Object.keys(previous || {}),
    ...Object.keys(current || {}),
  ])).slice(0, 4);

  return (
    <Stack spacing={0.5}>
      {keys.map((key) => (
        <Typography key={key} variant="caption" color="text.secondary">
          <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>{key}</Box>
          {": "}
          {compactValue(previous?.[key])}
          {" -> "}
          {compactValue(current?.[key])}
        </Typography>
      ))}
    </Stack>
  );
}

function metadataRows(metadata) {
  const previous = metadata?.previous || {};
  const current = metadata?.current || {};
  const keys = Array.from(new Set([
    ...Object.keys(previous),
    ...Object.keys(current),
  ]));

  return keys.map((key) => ({
    key,
    previous: previous[key],
    current: current[key],
  }));
}

function actionColor(action) {
  if (action?.includes("deleted") || action?.includes("cancelled")) return "error";
  if (action?.includes("approved") || action?.includes("verified") || action?.includes("completed")) return "success";
  if (action?.includes("refund") || action?.includes("visibility") || action?.includes("status")) return "warning";
  return "default";
}

export default function AuditLogs() {
  const [filters, setFilters] = useState({
    q: "",
    action: "",
    target_type: "",
    ip_address: "",
    from: "",
    to: "",
    limit: 250,
  });
  const [selectedLog, setSelectedLog] = useState(null);

  const params = useMemo(
    () => Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== "" && value !== null),
    ),
    [filters],
  );
  const { rows, loading, error, reload } = useApiList("/admin/audit-logs", params);

  const updateFilter = (key) => (event) => {
    setFilters((current) => ({ ...current, [key]: event.target.value }));
  };

  const clearFilters = () => {
    setFilters({
      q: "",
      action: "",
      target_type: "",
      ip_address: "",
      from: "",
      to: "",
      limit: 250,
    });
  };

  const rowsForDiff = metadataRows(selectedLog?.metadata);

  return (
    <Page
      title="Audit Log"
      subtitle="Search admin actions, affected records, request origin, and before/after values."
      action={<Button variant="outlined" onClick={reload}>Refresh</Button>}
    >
      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={2} alignItems={{ lg: "center" }}>
          <TextField
            size="small"
            label="Search"
            value={filters.q}
            onChange={updateFilter("q")}
            sx={{ minWidth: { lg: 260 } }}
          />
          <FormControl size="small" sx={{ minWidth: 190 }}>
            <InputLabel>Action</InputLabel>
            <Select label="Action" value={filters.action} onChange={updateFilter("action")}>
              {ACTION_OPTIONS.map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Target</InputLabel>
            <Select label="Target" value={filters.target_type} onChange={updateFilter("target_type")}>
              {TARGET_OPTIONS.map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField size="small" label="IP address" value={filters.ip_address} onChange={updateFilter("ip_address")} />
          <TextField size="small" label="From" type="date" value={filters.from} onChange={updateFilter("from")} InputLabelProps={{ shrink: true }} />
          <TextField size="small" label="To" type="date" value={filters.to} onChange={updateFilter("to")} InputLabelProps={{ shrink: true }} />
          <Button onClick={clearFilters}>Clear</Button>
        </Stack>
      </Paper>

      <DataTable
        rows={rows}
        loading={loading}
        error={error}
        empty="No audit events match your filters."
        columns={[
          {
            key: "action",
            label: "Action",
            render: (row) => <Chip size="small" color={actionColor(row.action)} label={row.action_label || row.action} />,
          },
          {
            key: "admin.email",
            label: "Admin",
            render: (row) => (
              <Stack spacing={0.25}>
                <Typography variant="body2">{row.admin?.email || "System"}</Typography>
                {row.admin?.full_name && <Typography variant="caption" color="text.secondary">{row.admin.full_name}</Typography>}
              </Stack>
            ),
          },
          {
            key: "target",
            label: "Target",
            render: (row) => (
              <Stack spacing={0.25}>
                <Typography variant="body2">{row.target?.label || row.auditable_type || "-"}</Typography>
                <Typography variant="caption" color="text.secondary">{row.target?.type || "Unknown"} {row.target?.id ? `#${row.target.id}` : ""}</Typography>
              </Stack>
            ),
          },
          { key: "ip_address", label: "IP" },
          { key: "metadata", label: "Before / after", render: (row) => diffSummary(row.metadata) },
          { key: "created_at", label: "When", render: (row) => date(row.created_at) },
        ]}
        actions={(row) => [
          <Button key="details" size="small" onClick={() => setSelectedLog(row)}>Details</Button>,
        ]}
      />

      <Dialog open={Boolean(selectedLog)} onClose={() => setSelectedLog(null)} fullWidth maxWidth="md">
        <DialogTitle>{selectedLog?.action_label || selectedLog?.action || "Audit event"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} flexWrap="wrap">
              <Chip label={`Admin: ${selectedLog?.admin?.email || "System"}`} />
              <Chip label={`Target: ${selectedLog?.target?.type || "Unknown"}`} />
              <Chip label={`IP: ${selectedLog?.ip_address || "-"}`} />
              <Chip label={`When: ${date(selectedLog?.created_at)}`} />
            </Stack>

            {rowsForDiff.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Changed values</Typography>
                <Paper variant="outlined" sx={{ overflow: "hidden" }}>
                  {rowsForDiff.map((row) => (
                    <Box
                      key={row.key}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "180px 1fr 1fr" },
                        gap: 1,
                        p: 1.5,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="body2" fontWeight={700}>{row.key}</Typography>
                      <Typography variant="body2" color="text.secondary">{compactValue(row.previous)}</Typography>
                      <Typography variant="body2">{compactValue(row.current)}</Typography>
                    </Box>
                  ))}
                </Paper>
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Request context</Typography>
              <Typography variant="body2" color="text.secondary">User agent</Typography>
              <Typography variant="body2" sx={{ wordBreak: "break-word" }}>{selectedLog?.user_agent || "-"}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Metadata</Typography>
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 2,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  overflow: "auto",
                  fontSize: 12,
                }}
              >
                {JSON.stringify(selectedLog?.metadata || {}, null, 2)}
              </Box>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
