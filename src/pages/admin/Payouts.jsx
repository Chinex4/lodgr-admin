import { useState } from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import RowButton from "../../components/common/RowButton";
import { useApiList } from "../../hooks/useApiList";
import { api } from "../../lib/api";
import { mutate } from "../../utils/mutate";

export default function Payouts() {
  const { rows, loading, error, reload } = useApiList("/admin/payouts");
  const [search, setSearch] = useState("");
  return <Page title="Payouts" subtitle="Verify and manage host payout details."><DataTable search={search} onSearch={setSearch} rows={rows} loading={loading} error={error} columns={[{ key: "host.email", label: "Host" }, { key: "payment_type", label: "Type" }, { key: "bank_name", label: "Bank" }, { key: "account_name", label: "Account" }, { key: "verified", label: "Verified", render: (row) => row.verified ? "Yes" : "No" }]} actions={(row) => [<Button key="verify" size="small" onClick={() => mutate(api.post(`/admin/payouts/${row.id}/verify`), "Payout verified", reload)}>Verify</Button>, <RowButton key="delete" title="Delete" color="error" icon={<DeleteIcon />} onClick={() => mutate(api.delete(`/admin/payouts/${row.id}`), "Payout deleted", reload)} />]} /></Page>;
}
