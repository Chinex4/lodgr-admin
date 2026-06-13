import { useState } from "react";
import { Button, Chip } from "@mui/material";
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

export default function Bookings() {
  const { rows, loading, error, reload } = useApiList("/admin/bookings");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);
  const [refund, setRefund] = useState(null);
  const [values, setValues] = useState({ amount: "", reason: "" });

  return (
    <Page title="Bookings" subtitle="Review, approve, cancel, complete, and refund bookings.">
      <DataTable search={search} onSearch={setSearch} rows={rows} loading={loading} error={error} columns={[
        { key: "properties.title", label: "Property" }, { key: "profiles.email", label: "Guest" }, { key: "check_in", label: "Check-in" },
        { key: "total_price", label: "Total", render: (row) => money(row.total_price) }, { key: "status", label: "Status", render: (row) => <Chip size="small" label={row.status} /> },
      ]} actions={(row) => [
        <RowButton key="view" title="View" icon={<VisibilityIcon />} onClick={() => setDetail(row)} />,
        <Button key="approve" size="small" onClick={() => mutate(api.post(`/bookings/${row.id}/approve`), "Booking approved", reload)}>Approve</Button>,
        <Button key="cancel" size="small" color="warning" onClick={() => mutate(api.post(`/bookings/${row.id}/cancel`), "Booking cancelled", reload)}>Cancel</Button>,
        <Button key="checkout" size="small" onClick={() => mutate(api.post(`/host/bookings/${row.id}/checkout`), "Booking completed", reload)}>Complete</Button>,
        <Button key="refund" size="small" color="secondary" onClick={() => { setRefund(row); setValues({ amount: row.total_price || "", reason: "" }); }}>Refund</Button>,
      ]} />
      <DetailDialog title="Booking details" row={detail} onClose={() => setDetail(null)} />
      <FormDialog open={Boolean(refund)} title="Create manual refund" values={values} setValues={setValues} onClose={() => setRefund(null)} onSubmit={async () => { await mutate(api.post(`/admin/bookings/${refund.id}/refunds`, values), "Refund created", reload); setRefund(null); }} fields={[{ name: "amount", label: "Amount", type: "number" }, { name: "reason", label: "Reason", multiline: true }]} />
    </Page>
  );
}
