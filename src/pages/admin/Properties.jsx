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
import FormDialog from "../../components/common/FormDialog";
import RowButton from "../../components/common/RowButton";
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
  const [dialog, setDialog] = useState(null);
  const [values, setValues] = useState({});
  const [selectedDate, setSelectedDate] = useState("");

  const submit = async () => {
    const id = propertyId(dialog.row);
    if (!id) {
      toast.error("This property is missing an ID. Refresh after the backend migration runs.");
      return;
    }
    if (dialog.type === "edit") await mutate(api.patch(`/properties/${id}`, values), "Property updated", reload);
    if (dialog.type === "dates") {
      await mutate(api.post(`/properties/${id}/occupied-dates`, { dates: values.dates || [] }), "Occupied dates saved", reload);
    }
    setDialog(null);
  };

  const addSelectedDate = () => {
    if (!selectedDate) return;
    const dates = Array.from(new Set([...(values.dates || []), selectedDate])).sort();
    setValues({ ...values, dates });
    setSelectedDate("");
  };

  const removeDate = (date) => {
    setValues({ ...values, dates: (values.dates || []).filter((item) => item !== date) });
  };

  return (
    <Page title="Properties" subtitle="Approve listings, edit listing data, and manage availability." action={
      <FormControl size="small" sx={{ minWidth: 180 }}><InputLabel>Status</InputLabel><Select label="Status" value={status} onChange={(event) => setStatus(event.target.value)}><MenuItem value="">All</MenuItem><MenuItem value="pending">Pending</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select></FormControl>
    }>
      <DataTable search={search} onSearch={setSearch} rows={rows} loading={loading} error={error} columns={[
        { key: "image", label: "Image", render: (row) => <PropertyThumb row={row} /> },
        { key: "title", label: "Title" }, { key: "city", label: "City" }, { key: "price_per_night", label: "Nightly", render: (row) => money(row.price_per_night) },
        { key: "status", label: "Status", render: (row) => <Chip size="small" label={row.status} /> }, { key: "is_available", label: "Available", render: (row) => row.is_available ? "Yes" : "No" },
      ]} actions={(row) => {
        const id = propertyId(row);

        return [
        <RowButton key="view" title="View" icon={<VisibilityIcon />} onClick={() => id ? navigate(`/properties/${id}`) : toast.error("This property is missing an ID. Refresh after the backend migration runs.")} />,
        <RowButton key="approve" title="Approve" color="primary" icon={<CheckCircleIcon />} onClick={() => id ? mutate(api.post(`/admin/properties/${id}/approve`), "Property approved", reload) : toast.error("This property is missing an ID. Refresh after the backend migration runs.")} />,
        <RowButton key="edit" title="Edit" icon={<EditIcon />} onClick={() => { setDialog({ type: "edit", row }); setValues({ title: row.title, description: row.description, price_per_night: row.price_per_night, status: row.status, is_available: row.is_available }); }} />,
        <Button key="toggle" size="small" onClick={() => id ? mutate(api.post(`/admin/properties/${id}/availability/admin`, { is_available: !row.is_available }), "Availability updated", reload) : toast.error("This property is missing an ID. Refresh after the backend migration runs.")}>{row.is_available ? "Disable" : "Enable"}</Button>,
        <Button key="dates" size="small" onClick={() => { setDialog({ type: "dates", row }); setValues({ dates: [] }); setSelectedDate(""); }}>Dates</Button>,
        <RowButton key="delete" title="Delete" color="error" icon={<DeleteIcon />} onClick={() => id ? mutate(api.delete(`/admin/properties/${id}`), "Property deleted", reload) : toast.error("This property is missing an ID. Refresh after the backend migration runs.")} />,
      ];
      }} />
      <FormDialog open={Boolean(dialog && dialog.type === "edit")} title="Edit property" values={values} setValues={setValues} onClose={() => setDialog(null)} onSubmit={submit} fields={[{ name: "title", label: "Title" }, { name: "description", label: "Description", multiline: true }, { name: "price_per_night", label: "Price per night", type: "number" }, { name: "status", label: "Status", type: "select", options: ["pending", "active", "inactive"] }, { name: "is_available", label: "Available", type: "checkbox" }]} />
      <Dialog open={Boolean(dialog && dialog.type === "dates")} onClose={() => setDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Add occupied dates</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography color="text.secondary">
              Pick each unavailable date from the calendar and add it to this property.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                label="Occupied date"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <Button variant="contained" onClick={addSelectedDate}>Add</Button>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {(values.dates || []).length ? values.dates.map((date) => (
                <Chip key={date} label={date} onDelete={() => removeDate(date)} />
              )) : (
                <Typography color="text.secondary">No dates selected.</Typography>
              )}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)}>Cancel</Button>
          <Button variant="contained" disabled={!values.dates?.length} onClick={submit}>Save dates</Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
