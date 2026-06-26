import { useState } from "react";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import RowButton from "../../components/common/RowButton";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useApiList } from "../../hooks/useApiList";
import { api } from "../../lib/api";
import { money } from "../../utils/formatters";
import { mutate } from "../../utils/mutate";

const propertyId = (row) => row?.id || row?.public_id;
const propertyImage = (row) => {
  const images = row?.images || row?.property_images || [];
  return row?.cover_image?.image_url || images.find((image) => image.is_primary || image.is_cover)?.image_url || images[0]?.image_url || "";
};

function PropertyThumb({ row }) {
  const image = propertyImage(row);

  return image ? (
    <Box component="img" src={image} alt={row.title || "Property"} sx={{ width: 64, height: 48, objectFit: "cover", borderRadius: 1 }} />
  ) : (
    <Box sx={{ width: 64, height: 48, borderRadius: 1, bgcolor: "grey.100", color: "text.secondary", display: "grid", placeItems: "center", fontSize: 11 }}>
      No image
    </Box>
  );
}

export default function Properties() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const { rows, loading, error, reload } = useApiList("/admin/properties", status ? { status } : {});
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [dateDialog, setDateDialog] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [dates, setDates] = useState([]);
  const [confirm, setConfirm] = useState(null);

  const runBulk = async (action) => {
    const ids = selectedIds.slice();
    if (!ids.length) return;

    await toast.promise(Promise.all(ids.map((id) => {
      if (action === "approve") return api.post(`/admin/properties/${id}/approve`);
      if (action === "disable") return api.post(`/admin/properties/${id}/availability/admin`, { is_available: false });
      return api.post(`/admin/properties/${id}/availability/admin`, { is_available: true });
    })), {
      loading: "Updating properties...",
      success: "Properties updated",
      error: "Some properties could not be updated",
    });
    setSelectedIds([]);
    await reload();
  };

  const addSelectedDate = () => {
    if (!selectedDate) return;
    setDates(Array.from(new Set([...dates, selectedDate])).sort());
    setSelectedDate("");
  };

  const saveDates = async () => {
    const id = propertyId(dateDialog);
    if (!id || dates.length === 0) return;
    await mutate(api.post(`/properties/${id}/occupied-dates`, { dates }), "Occupied dates saved", reload);
    setDateDialog(null);
    setDates([]);
  };

  const deleteProperty = async () => {
    if (!confirm?.row) return;
    await mutate(api.delete(`/admin/properties/${propertyId(confirm.row)}`), "Property deleted", reload);
    setConfirm(null);
  };

  return (
    <Page title="Properties" subtitle="Approve listings, edit listing data, and manage availability." action={
      <FormControl size="small" sx={{ minWidth: 180 }}><InputLabel>Status</InputLabel><Select label="Status" value={status} onChange={(event) => setStatus(event.target.value)}><MenuItem value="">All</MenuItem><MenuItem value="pending">Pending</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select></FormControl>
    }>
      <DataTable
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        getRowId={propertyId}
        bulkActions={() => [
          <Button key="approve" size="small" variant="contained" onClick={() => runBulk("approve")}>Approve</Button>,
          <Button key="disable" size="small" color="warning" onClick={() => runBulk("disable")}>Disable</Button>,
          <Button key="enable" size="small" onClick={() => runBulk("enable")}>Enable</Button>,
        ]}
        search={search}
        onSearch={setSearch}
        rows={rows}
        loading={loading}
        error={error}
        columns={[
          { key: "image", label: "Image", render: (row) => <PropertyThumb row={row} /> },
          { key: "title", label: "Title" },
          { key: "city", label: "City" },
          { key: "price_per_night", label: "Nightly", render: (row) => money(row.price_per_night) },
          { key: "status", label: "Status", render: (row) => <Chip size="small" label={row.status} /> },
          { key: "is_available", label: "Available", render: (row) => row.is_available ? "Yes" : "No" },
        ]}
        actions={(row) => {
          const id = propertyId(row);

          return [
            <RowButton key="view" title="View" icon={<VisibilityIcon />} onClick={() => id ? navigate(`/properties/${id}`) : toast.error("This property is missing an ID.")} />,
            <RowButton key="approve" title="Approve" color="primary" icon={<CheckCircleIcon />} onClick={() => id && mutate(api.post(`/admin/properties/${id}/approve`), "Property approved", reload)} />,
            <RowButton key="edit" title="Edit" icon={<EditIcon />} onClick={() => id && navigate(`/properties/${id}/edit`)} />,
            <Button key="toggle" size="small" onClick={() => id && mutate(api.post(`/admin/properties/${id}/availability/admin`, { is_available: !row.is_available }), "Availability updated", reload)}>{row.is_available ? "Disable" : "Enable"}</Button>,
            <Button key="dates" size="small" onClick={() => { setDateDialog(row); setDates([]); setSelectedDate(""); }}>Dates</Button>,
            <RowButton key="delete" title="Delete" color="error" icon={<DeleteIcon />} onClick={() => setConfirm({ row })} />,
          ];
        }}
      />

      <Dialog open={Boolean(dateDialog)} onClose={() => setDateDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Add occupied dates</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography color="text.secondary">Pick unavailable dates and save them to this property.</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField label="Occupied date" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
              <Button variant="contained" onClick={addSelectedDate}>Add</Button>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {dates.length ? dates.map((date) => <Chip key={date} label={date} onDelete={() => setDates(dates.filter((item) => item !== date))} />) : <Typography color="text.secondary">No dates selected.</Typography>}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDateDialog(null)}>Cancel</Button>
          <Button variant="contained" disabled={!dates.length} onClick={saveDates}>Save dates</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Delete property?"
        message="This action is permanent and cannot be reversed. Only delete a property when you are sure it should be removed."
        confirmLabel="Delete property"
        onClose={() => setConfirm(null)}
        onConfirm={deleteProperty}
      />
    </Page>
  );
}
