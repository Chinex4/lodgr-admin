import { useMemo, useState } from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
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
import { api } from "../../lib/api";
import { date, money } from "../../utils/formatters";
import { mutate } from "../../utils/mutate";

const STATUS_OPTIONS = ["", "pending_review", "escalated", "approved", "dismissed"];
const SEVERITY_OPTIONS = ["", "low", "medium", "high", "critical"];

function severityColor(value) {
  if (value === "critical" || value === "high") return "error";
  if (value === "medium") return "warning";
  if (value === "low") return "info";
  return "default";
}

function statusColor(value) {
  if (value === "approved") return "success";
  if (value === "dismissed") return "default";
  if (value === "escalated") return "error";
  return "warning";
}

function cleanParams(filters) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ""));
}

export default function RiskFlags() {
  const [filters, setFilters] = useState({ q: "", status: "pending_review", severity: "", risk_type: "", limit: 250 });
  const [selected, setSelected] = useState(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const params = useMemo(() => cleanParams(filters), [filters]);
  const { rows, loading, error, reload } = useApiList("/admin/risk-flags", params);

  const updateFilter = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));
  const review = async (status) => {
    await mutate(api.patch(`/admin/risk-flags/${selected.id}`, { status, resolution_note: resolutionNote }), "Risk flag updated", reload);
    setSelected(null);
    setResolutionNote("");
  };

  return (
    <Page title="Risk Review" subtitle="Review duplicate bookings, unusual payment attempts, rapid cancellations, and high-risk accounts." action={<Button variant="outlined" onClick={reload}>Refresh</Button>}>
      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={2} alignItems={{ lg: "center" }}>
          <TextField size="small" label="Search" value={filters.q} onChange={updateFilter("q")} sx={{ minWidth: { lg: 260 } }} />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={filters.status} onChange={updateFilter("status")}>
              {STATUS_OPTIONS.map((value) => <MenuItem key={value} value={value}>{value || "All statuses"}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Severity</InputLabel>
            <Select label="Severity" value={filters.severity} onChange={updateFilter("severity")}>
              {SEVERITY_OPTIONS.map((value) => <MenuItem key={value} value={value}>{value || "All severity"}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField size="small" label="Type" value={filters.risk_type} onChange={updateFilter("risk_type")} />
          <Button onClick={() => setFilters({ q: "", status: "", severity: "", risk_type: "", limit: 250 })}>Clear</Button>
        </Stack>
      </Paper>

      <DataTable
        rows={rows}
        loading={loading}
        error={error}
        empty="No risk flags match your filters."
        columns={[
          { key: "severity", label: "Severity", render: (row) => <Chip size="small" color={severityColor(row.severity)} label={row.severity} /> },
          { key: "risk_type", label: "Type", render: (row) => <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.risk_type}</Typography> },
          { key: "user.email", label: "User", render: (row) => row.user?.email || "-" },
          { key: "target", label: "Target", render: (row) => row.booking?.property?.title || row.payment?.reference || "-" },
          { key: "status", label: "Status", render: (row) => <Chip size="small" color={statusColor(row.status)} label={row.status} /> },
          { key: "reason", label: "Reason" },
          { key: "amount", label: "Amount", render: (row) => row.payment ? money(row.payment.amount, row.payment.currency) : "-" },
          { key: "created_at", label: "Created", render: (row) => date(row.created_at) },
        ]}
        actions={(row) => [<Button key="review" size="small" onClick={() => { setSelected(row); setResolutionNote(row.resolution_note || ""); }}>Review</Button>]}
      />

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>Review risk flag</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip color={severityColor(selected?.severity)} label={selected?.severity || "severity"} />
              <Chip color={statusColor(selected?.status)} label={selected?.status || "status"} />
              <Chip label={selected?.risk_type || "type"} />
            </Stack>
            <Typography variant="body2">{selected?.reason}</Typography>
            <Typography variant="caption" color="text.secondary">User: {selected?.user?.email || "-"}</Typography>
            <Typography variant="caption" color="text.secondary">Booking: {selected?.booking?.id || "-"}</Typography>
            <TextField label="Resolution note" value={resolutionNote} onChange={(event) => setResolutionNote(event.target.value)} multiline minRows={3} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
          <Button color="error" onClick={() => review("escalated")}>Escalate</Button>
          <Button onClick={() => review("dismissed")}>Dismiss</Button>
          <Button variant="contained" onClick={() => review("approved")}>Approve</Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
