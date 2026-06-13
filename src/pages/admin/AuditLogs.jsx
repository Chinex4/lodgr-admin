import { useState } from "react";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import { useApiList } from "../../hooks/useApiList";
import { date } from "../../utils/formatters";

export default function AuditLogs() {
  const { rows, loading, error } = useApiList("/admin/audit-logs", { limit: 500 });
  const [search, setSearch] = useState("");
  return <Page title="Audit Log" subtitle="Admin actions recorded by the backend."><DataTable search={search} onSearch={setSearch} rows={rows} loading={loading} error={error} columns={[{ key: "action", label: "Action" }, { key: "admin.email", label: "Admin" }, { key: "ip_address", label: "IP" }, { key: "created_at", label: "When", render: (row) => date(row.created_at) }]} /></Page>;
}
