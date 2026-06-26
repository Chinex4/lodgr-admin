import { useState } from "react";
import { Box, Button, Chip } from "@mui/material";
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

function BookingPropertyThumb({ row }) {
  const image = row?.properties?.cover_image?.image_url;

  return image ? (
    <Box component="img" src={image} alt={row?.properties?.title || "Property"} sx={{ width: 64, height: 48, objectFit: "cover", borderRadius: 1 }} />
  ) : (
    <Box sx={{ width: 64, height: 48, borderRadius: 1, bgcolor: "grey.100", color: "text.secondary", display: "grid", placeItems: "center", fontSize: 11 }}>
      No image
    </Box>
  );
}

export default function Bookings() {
  const navigate = useNavigate();
  const { rows, loading, error, reload } = useApiList("/admin/bookings");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [refund, setRefund] = useState(null);
  const [values, setValues] = useState({ amount: "", reason: "" });

  const runBulk = async (action) => {
    const ids = selectedIds.slice();
    if (!ids.length) return;

    await toast.promise(Promise.all(ids.map((id) => {
      if (action === "approve") return api.post(`/bookings/${id}/approve`);
      if (action === "cancel") return api.post(`/bookings/${id}/cancel`);
      return api.post(`/host/bookings/${id}/checkout`);
    })), {
      loading: "Updating bookings...",
      success: "Bookings updated",
      error: "Some bookings could not be updated",
    });
    setSelectedIds([]);
    await reload();
  };

  return (
    <Page title="Bookings" subtitle="Review, approve, cancel, complete, and refund bookings.">
      <DataTable
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        bulkActions={() => [
          <Button key="approve" size="small" variant="contained" onClick={() => runBulk("approve")}>Approve</Button>,
          <Button key="cancel" size="small" color="warning" onClick={() => runBulk("cancel")}>Cancel</Button>,
          <Button key="complete" size="small" onClick={() => runBulk("complete")}>Complete</Button>,
        ]}
        search={search}
        onSearch={setSearch}
        rows={rows}
        loading={loading}
        error={error}
        columns={[
        { key: "property_image", label: "Image", render: (row) => <BookingPropertyThumb row={row} /> },
        { key: "properties.title", label: "Property" }, { key: "profiles.email", label: "Guest" }, { key: "check_in", label: "Check-in" },
        { key: "total_price", label: "Total", render: (row) => money(row.total_price) }, { key: "status", label: "Status", render: (row) => <Chip size="small" label={row.status} /> },
      ]} actions={(row) => [
        <RowButton key="view" title="View" icon={<VisibilityIcon />} onClick={() => navigate(`/bookings/${row.id}`)} />,
        <Button key="approve" size="small" onClick={() => mutate(api.post(`/bookings/${row.id}/approve`), "Booking approved", reload)}>Approve</Button>,
        <Button key="cancel" size="small" color="warning" onClick={() => mutate(api.post(`/bookings/${row.id}/cancel`), "Booking cancelled", reload)}>Cancel</Button>,
        <Button key="checkout" size="small" onClick={() => mutate(api.post(`/host/bookings/${row.id}/checkout`), "Booking completed", reload)}>Complete</Button>,
        <Button key="refund" size="small" color="secondary" onClick={() => { setRefund(row); setValues({ amount: row.total_price || "", reason: "" }); }}>Refund</Button>,
      ]} />
      <FormDialog open={Boolean(refund)} title="Create manual refund" values={values} setValues={setValues} onClose={() => setRefund(null)} onSubmit={async () => { await mutate(api.post(`/admin/bookings/${refund.id}/refunds`, values), "Refund created", reload); setRefund(null); }} fields={[{ name: "amount", label: "Amount", type: "number" }, { name: "reason", label: "Reason", multiline: true }]} />
    </Page>
  );
}
