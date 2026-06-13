import { useState } from "react";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import { useApiList } from "../../hooks/useApiList";
import { date, money } from "../../utils/formatters";

export default function Transactions() {
  const { rows, loading, error } = useApiList("/admin/transactions");
  const [search, setSearch] = useState("");
  return <Page title="Transactions" subtitle="Platform-wide payment transaction ledger."><DataTable search={search} onSearch={setSearch} rows={rows} loading={loading} error={error} columns={[{ key: "reference", label: "Reference" }, { key: "customer_email", label: "Customer" }, { key: "booking.property.title", label: "Property" }, { key: "amount", label: "Amount", render: (row) => money(Number(row.amount || 0) / 100, row.currency) }, { key: "status", label: "Status" }, { key: "created_at", label: "Date", render: (row) => date(row.created_at) }]} /></Page>;
}
