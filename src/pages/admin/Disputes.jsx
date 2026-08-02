import { useMemo, useState } from "react";
import {
  Box,
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
import { date } from "../../utils/formatters";
import { mutate } from "../../utils/mutate";

const STATUSES = ["", "open", "in_review", "escalated", "resolved", "closed"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

function statusColor(value) {
  if (value === "resolved" || value === "closed") return "success";
  if (value === "escalated") return "error";
  if (value === "in_review") return "info";
  return "warning";
}

function priorityColor(value) {
  if (value === "urgent" || value === "high") return "error";
  if (value === "medium") return "warning";
  return "default";
}

function cleanParams(filters) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ""));
}

export default function Disputes() {
  const [filters, setFilters] = useState({ status: "", limit: 250 });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [values, setValues] = useState({ status: "in_review", priority: "medium", resolution: "" });
  const params = useMemo(() => cleanParams(filters), [filters]);
  const { rows, loading, error, reload } = useApiList("/admin/disputes", params);

  const openDetails = (row) => {
    setSelected(row);
    setValues({ status: row.status || "in_review", priority: row.priority || "medium", resolution: row.resolution || "" });
  };

  const save = async () => {
    await mutate(api.patch(`/admin/disputes/${selected.id}`, values), "Dispute updated", reload);
    setSelected(null);
  };

  return (
    <Page title="Disputes" subtitle="Track booking incidents, evidence, conversation trails, assignments, and resolutions." action={<Button variant="outlined" onClick={reload}>Refresh</Button>}>
      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              {STATUSES.map((value) => <MenuItem key={value} value={value}>{value || "All statuses"}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <DataTable
        search={search}
        onSearch={setSearch}
        rows={rows}
        loading={loading}
        error={error}
        empty="No disputes match your filters."
        columns={[
          { key: "subject", label: "Subject", render: (row) => <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.subject}</Typography> },
          { key: "booking.property.title", label: "Property", render: (row) => row.booking?.property?.title || "-" },
          { key: "opened_by_user.email", label: "Opened by", render: (row) => row.opened_by_user?.email || "-" },
          { key: "priority", label: "Priority", render: (row) => <Chip size="small" color={priorityColor(row.priority)} label={row.priority} /> },
          { key: "status", label: "Status", render: (row) => <Chip size="small" color={statusColor(row.status)} label={row.status} /> },
          { key: "messages", label: "Messages", render: (row) => row.messages?.length ?? 0 },
          { key: "evidence", label: "Evidence", render: (row) => row.evidence?.length ?? 0 },
          { key: "created_at", label: "Opened", render: (row) => date(row.created_at) },
        ]}
        actions={(row) => [<Button key="details" size="small" onClick={() => openDetails(row)}>Details</Button>]}
      />

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="md">
        <DialogTitle>{selected?.subject || "Dispute"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={selected?.category || "category"} />
              <Chip color={priorityColor(selected?.priority)} label={selected?.priority || "priority"} />
              <Chip color={statusColor(selected?.status)} label={selected?.status || "status"} />
            </Stack>
            <Typography variant="body2">{selected?.description}</Typography>
            <Typography variant="caption" color="text.secondary">Booking: {selected?.booking?.id || "-"} · {selected?.booking?.property?.title || "-"}</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={values.status} onChange={(event) => setValues((current) => ({ ...current, status: event.target.value }))}>
                  {STATUSES.filter(Boolean).map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select label="Priority" value={values.priority} onChange={(event) => setValues((current) => ({ ...current, priority: event.target.value }))}>
                  {PRIORITIES.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
                </Select>
              </FormControl>
            </Stack>
            <TextField label="Resolution" value={values.resolution} onChange={(event) => setValues((current) => ({ ...current, resolution: event.target.value }))} multiline minRows={3} fullWidth />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Conversation</Typography>
              <Stack spacing={1}>
                {(selected?.messages || []).map((message) => (
                  <Paper key={message.id} variant="outlined" sx={{ p: 1.5 }}>
                    <Typography variant="body2">{message.message}</Typography>
                    <Typography variant="caption" color="text.secondary">{message.user?.email || "Unknown"} · {date(message.created_at)}</Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Evidence</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {(selected?.evidence || []).map((item) => (
                  <Button key={item.id} size="small" variant="outlined" href={item.file_url} target="_blank" rel="noreferrer">
                    {item.original_name || "Evidence"}
                  </Button>
                ))}
                {!selected?.evidence?.length && <Typography variant="body2" color="text.secondary">No evidence uploaded.</Typography>}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
