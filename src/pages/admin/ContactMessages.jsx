import { useState } from "react";
import { Button, Chip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import DetailDialog from "../../components/common/DetailDialog";
import RowButton from "../../components/common/RowButton";
import { useApiList } from "../../hooks/useApiList";
import { api } from "../../lib/api";
import { date } from "../../utils/formatters";
import { mutate } from "../../utils/mutate";

export default function ContactMessages() {
  const { rows, loading, error, reload } = useApiList("/admin/contact-messages");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);
  return <Page title="Contact Messages" subtitle="View contact form submissions and mark support cases resolved."><DataTable search={search} onSearch={setSearch} rows={rows} loading={loading} error={error} columns={[{ key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "subject", label: "Subject" }, { key: "status", label: "Status", render: (row) => <Chip size="small" label={row.status} /> }, { key: "created_at", label: "Received", render: (row) => date(row.created_at) }]} actions={(row) => [<RowButton key="view" title="View" icon={<VisibilityIcon />} onClick={() => setDetail(row)} />, <Button key="resolve" size="small" onClick={() => mutate(api.patch(`/admin/contact-messages/${row.id}`, { status: "resolved" }), "Message resolved", reload)}>Resolve</Button>]} /><DetailDialog title="Contact message" row={detail} onClose={() => setDetail(null)} /></Page>;
}
