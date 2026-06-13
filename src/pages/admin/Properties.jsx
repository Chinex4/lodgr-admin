import { useState } from "react";
import { Button, Chip, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import DetailDialog from "../../components/common/DetailDialog";
import FormDialog from "../../components/common/FormDialog";
import RowButton from "../../components/common/RowButton";
import { useApiList } from "../../hooks/useApiList";
import { api } from "../../lib/api";
import { money } from "../../utils/formatters";
import { mutate } from "../../utils/mutate";

export default function Properties() {
  const [status, setStatus] = useState("");
  const { rows, loading, error, reload } = useApiList("/admin/properties", status ? { status } : {});
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [values, setValues] = useState({});

  const submit = async () => {
    const id = dialog.row.id;
    if (dialog.type === "edit") await mutate(api.patch(`/properties/${id}`, values), "Property updated", reload);
    if (dialog.type === "dates") {
      await mutate(api.post(`/properties/${id}/occupied-dates`, { dates: String(values.dates || "").split(",").map((item) => item.trim()).filter(Boolean) }), "Occupied dates saved", reload);
    }
    setDialog(null);
  };

  return (
    <Page title="Properties" subtitle="Approve listings, edit listing data, and manage availability." action={
      <FormControl size="small" sx={{ minWidth: 180 }}><InputLabel>Status</InputLabel><Select label="Status" value={status} onChange={(event) => setStatus(event.target.value)}><MenuItem value="">All</MenuItem><MenuItem value="pending">Pending</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select></FormControl>
    }>
      <DataTable search={search} onSearch={setSearch} rows={rows} loading={loading} error={error} columns={[
        { key: "title", label: "Title" }, { key: "city", label: "City" }, { key: "price_per_night", label: "Nightly", render: (row) => money(row.price_per_night) },
        { key: "status", label: "Status", render: (row) => <Chip size="small" label={row.status} /> }, { key: "is_available", label: "Available", render: (row) => row.is_available ? "Yes" : "No" },
      ]} actions={(row) => [
        <RowButton key="view" title="View" icon={<VisibilityIcon />} onClick={() => setDetail(row)} />,
        <RowButton key="approve" title="Approve" color="primary" icon={<CheckCircleIcon />} onClick={() => mutate(api.post(`/admin/properties/${row.id}/approve`), "Property approved", reload)} />,
        <RowButton key="edit" title="Edit" icon={<EditIcon />} onClick={() => { setDialog({ type: "edit", row }); setValues({ title: row.title, description: row.description, price_per_night: row.price_per_night, status: row.status, is_available: row.is_available }); }} />,
        <Button key="toggle" size="small" onClick={() => mutate(api.post(`/admin/properties/${row.id}/availability/admin`, { is_available: !row.is_available }), "Availability updated", reload)}>{row.is_available ? "Disable" : "Enable"}</Button>,
        <Button key="dates" size="small" onClick={() => { setDialog({ type: "dates", row }); setValues({ dates: "" }); }}>Dates</Button>,
        <RowButton key="delete" title="Delete" color="error" icon={<DeleteIcon />} onClick={() => mutate(api.delete(`/admin/properties/${row.id}`), "Property deleted", reload)} />,
      ]} />
      <DetailDialog title="Property details" row={detail} onClose={() => setDetail(null)} />
      <FormDialog open={Boolean(dialog)} title={dialog?.type === "dates" ? "Add occupied dates" : "Edit property"} values={values} setValues={setValues} onClose={() => setDialog(null)} onSubmit={submit} fields={dialog?.type === "dates" ? [{ name: "dates", label: "Dates comma-separated YYYY-MM-DD" }] : [{ name: "title", label: "Title" }, { name: "description", label: "Description", multiline: true }, { name: "price_per_night", label: "Price per night", type: "number" }, { name: "status", label: "Status", type: "select", options: ["pending", "active", "inactive"] }, { name: "is_available", label: "Available", type: "checkbox" }]} />
    </Page>
  );
}
