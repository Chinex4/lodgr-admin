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

const STATUS_OPTIONS = ["mismatch", "matched", "resolved", ""];

function statusColor(status) {
  if (status === "matched" || status === "resolved") return "success";
  if (status === "mismatch") return "error";
  return "default";
}

function cleanParams(filters) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ""));
}

function formatMismatch(mismatches = []) {
  if (!Array.isArray(mismatches) || mismatches.length === 0) return "-";
  return mismatches.map((item) => item.field || item).join(", ");
}

export default function PaymentReconciliations() {
  const [filters, setFilters] = useState({ q: "", status: "mismatch", limit: 250 });
  const [selected, setSelected] = useState(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const params = useMemo(() => cleanParams(filters), [filters]);
  const { rows, loading, error, reload } = useApiList("/admin/payment-reconciliations", params);

  const updateFilter = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));

  const resolve = async () => {
    await mutate(
      api.patch(`/admin/payment-reconciliations/${selected.id}/resolve`, { resolution_note: resolutionNote }),
      "Reconciliation marked resolved",
      reload,
    );
    setSelected(null);
    setResolutionNote("");
  };

  return (
    <Page title="Payment Reconciliation" subtitle="Review Paystack verification/webhook mismatches before support or finance closes them." action={<Button variant="outlined" onClick={reload}>Refresh</Button>}>
      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
          <TextField size="small" label="Search reference" value={filters.q} onChange={updateFilter("q")} sx={{ minWidth: { md: 260 } }} />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={filters.status} onChange={updateFilter("status")}>
              {STATUS_OPTIONS.map((value) => <MenuItem key={value} value={value}>{value || "All statuses"}</MenuItem>)}
            </Select>
          </FormControl>
          <Button onClick={() => setFilters({ q: "", status: "", limit: 250 })}>Clear</Button>
        </Stack>
      </Paper>

      <DataTable
        rows={rows}
        loading={loading}
        error={error}
        empty="No payment reconciliation records match your filters."
        columns={[
          { key: "status", label: "Status", render: (row) => <Chip size="small" color={statusColor(row.status)} label={row.status} /> },
          { key: "reference", label: "Reference", render: (row) => <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.reference}</Typography> },
          { key: "source", label: "Source" },
          { key: "expected.amount", label: "Expected", render: (row) => money(Number(row.expected?.amount || 0) / 100, row.expected?.currency || "NGN") },
          { key: "actual.amount", label: "Actual", render: (row) => money(Number(row.actual?.amount || 0) / 100, row.actual?.currency || "NGN") },
          { key: "mismatches", label: "Mismatch", render: (row) => formatMismatch(row.mismatches) },
          { key: "created_at", label: "Created", render: (row) => date(row.created_at) },
        ]}
        actions={(row) => [<Button key="review" size="small" onClick={() => { setSelected(row); setResolutionNote(row.resolution_note || ""); }}>Review</Button>]}
      />

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>Resolve payment mismatch</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip color={statusColor(selected?.status)} label={selected?.status || "status"} />
              <Chip label={selected?.source || "source"} />
              <Chip label={selected?.reference || "reference"} />
            </Stack>
            <Typography variant="body2">Mismatches: {formatMismatch(selected?.mismatches)}</Typography>
            <Typography variant="caption" color="text.secondary">Expected: {JSON.stringify(selected?.expected || {})}</Typography>
            <Typography variant="caption" color="text.secondary">Actual: {JSON.stringify(selected?.actual || {})}</Typography>
            <TextField label="Resolution note" value={resolutionNote} onChange={(event) => setResolutionNote(event.target.value)} multiline minRows={3} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
          <Button variant="contained" onClick={resolve} disabled={!resolutionNote.trim()}>Mark resolved</Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
