import { useState } from "react";
import { Button, Chip } from "@mui/material";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import FormDialog from "../../components/common/FormDialog";
import { useApiList } from "../../hooks/useApiList";
import { api } from "../../lib/api";
import { date, money } from "../../utils/formatters";
import { mutate } from "../../utils/mutate";

export default function Withdrawals() {
  const { rows, loading, error, reload } = useApiList("/admin/withdrawals");
  const [search, setSearch] = useState("");
  const [row, setRow] = useState(null);
  const [values, setValues] = useState({ status: "processing", admin_note: "" });
  return <Page title="Withdrawals" subtitle="Process host withdrawal requests."><DataTable search={search} onSearch={setSearch} rows={rows} loading={loading} error={error} columns={[{ key: "host.email", label: "Host" }, { key: "amount", label: "Amount", render: (item) => money(item.amount, item.currency) }, { key: "status", label: "Status", render: (item) => <Chip size="small" label={item.status} /> }, { key: "created_at", label: "Requested", render: (item) => date(item.created_at) }]} actions={(item) => [<Button key="update" size="small" onClick={() => { setRow(item); setValues({ status: "processing", admin_note: item.admin_note || "" }); }}>Update</Button>]} /><FormDialog open={Boolean(row)} title="Update withdrawal" values={values} setValues={setValues} onClose={() => setRow(null)} onSubmit={async () => { await mutate(api.patch(`/admin/withdrawals/${row.id}`, values), "Withdrawal updated", reload); setRow(null); }} fields={[{ name: "status", label: "Status", type: "select", options: ["processing", "paid", "rejected"] }, { name: "admin_note", label: "Admin note", multiline: true }]} /></Page>;
}
