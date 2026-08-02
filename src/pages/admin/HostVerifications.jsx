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
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import { useApiList } from "../../hooks/useApiList";
import { api } from "../../lib/api";
import { date } from "../../utils/formatters";
import { mutate } from "../../utils/mutate";

const STATUSES = ["", "not_started", "pending_review", "approved", "rejected", "re_requested"];

function statusColor(status) {
  if (status === "approved") return "success";
  if (status === "rejected") return "error";
  if (status === "re_requested") return "warning";
  return "default";
}

function cleanParams(filters) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ""));
}

export default function HostVerifications() {
  const [filters, setFilters] = useState({ q: "", status: "pending_review", limit: 250 });
  const [selected, setSelected] = useState(null);
  const [values, setValues] = useState({ status: "approved", verification_note: "" });
  const params = useMemo(() => cleanParams(filters), [filters]);
  const { rows, loading, error, reload } = useApiList("/admin/host-verifications", params);

  const open = (row) => {
    setSelected(row);
    setValues({ status: row.verification_status || "pending_review", verification_note: row.verification_note || "" });
  };

  const save = async (status = values.status) => {
    await mutate(api.patch(`/admin/host-verifications/${selected.id}`, { ...values, status }), "Host verification updated", reload);
    setSelected(null);
  };

  return (
    <Page title="Host Verification" subtitle="Review host identity and business documents before listings and withdrawals are unlocked." action={<Button variant="outlined" onClick={reload}>Refresh</Button>}>
      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
          <TextField size="small" label="Search" value={filters.q} onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))} sx={{ minWidth: 260 }} />
          <FormControl size="small" sx={{ minWidth: 190 }}>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              {STATUSES.map((status) => <MenuItem key={status} value={status}>{status || "All statuses"}</MenuItem>)}
            </Select>
          </FormControl>
          <Button onClick={() => setFilters({ q: "", status: "", limit: 250 })}>Clear</Button>
        </Stack>
      </Paper>

      <DataTable
        rows={rows}
        loading={loading}
        error={error}
        empty="No host verifications match your filters."
        columns={[
          { key: "listing.name", label: "Listing", render: (row) => row.listing?.name || "-" },
          { key: "user.email", label: "Host", render: (row) => row.user?.email || "-" },
          { key: "listing.type", label: "Type", render: (row) => row.listing?.type || "-" },
          { key: "verification_status", label: "Status", render: (row) => <Chip size="small" color={statusColor(row.verification_status)} label={row.verification_status || "not_started"} /> },
          { key: "documents", label: "Documents", render: (row) => row.documents?.length ?? 0 },
          { key: "verification_submitted_at", label: "Submitted", render: (row) => date(row.verification_submitted_at || row.updated_at) },
        ]}
        actions={(row) => [<Button key="review" size="small" startIcon={<VerifiedUserIcon />} onClick={() => open(row)}>Review</Button>]}
      />

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="md">
        <DialogTitle>Review host verification</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={selected?.user?.email || "Host"} />
              <Chip color={statusColor(selected?.verification_status)} label={selected?.verification_status || "not_started"} />
              <Chip label={selected?.listing?.name || "Listing"} />
            </Stack>
            <FormControl size="small" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={values.status} onChange={(event) => setValues((current) => ({ ...current, status: event.target.value }))}>
                {STATUSES.filter(Boolean).map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Review note" value={values.verification_note} onChange={(event) => setValues((current) => ({ ...current, verification_note: event.target.value }))} multiline minRows={3} fullWidth />
            <Typography variant="subtitle2">Documents</Typography>
            <Stack spacing={1}>
              {(selected?.documents || []).map((document) => (
                <Paper key={document.id} variant="outlined" sx={{ p: 1.5, display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
                  <Stack>
                    <Typography variant="body2" fontWeight={700}>{document.document_type}</Typography>
                    <Typography variant="caption" color="text.secondary">{document.original_name || "Document"} · {document.status}</Typography>
                  </Stack>
                  <Button size="small" href={document.file_url} target="_blank" rel="noreferrer">Open</Button>
                </Paper>
              ))}
              {!selected?.documents?.length && <Typography variant="body2" color="text.secondary">No documents submitted.</Typography>}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
          <Button color="warning" onClick={() => save("re_requested")}>Re-request</Button>
          <Button color="error" onClick={() => save("rejected")}>Reject</Button>
          <Button variant="contained" onClick={() => save("approved")}>Approve</Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
