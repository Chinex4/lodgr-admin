import { useState } from "react";
import { Button, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import DetailDialog from "../../components/common/DetailDialog";
import FormDialog from "../../components/common/FormDialog";
import RowButton from "../../components/common/RowButton";
import { useApiList } from "../../hooks/useApiList";
import { api } from "../../lib/api";
import { mutate } from "../../utils/mutate";

export default function Users() {
  const { rows, loading, error, reload } = useApiList("/admin/users");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [values, setValues] = useState({});

  const open = (type, row) => {
    setDialog({ type, row });
    setValues(type === "notify"
      ? { title: "", message: "" }
      : { full_name: row.full_name, phone: row.phone || "", role: row.role || row.user_roles?.[0]?.role || "guest", status: row.status || "active" });
  };

  const submit = async () => {
    const id = dialog.row.id;
    if (dialog.type === "edit") await mutate(api.patch(`/admin/users/${id}`, { full_name: values.full_name, phone: values.phone }), "User updated", reload);
    if (dialog.type === "role") await mutate(api.patch(`/admin/users/${id}/role`, { role: values.role }), "Role updated", reload);
    if (dialog.type === "status") await mutate(api.patch(`/admin/users/${id}/status`, { status: values.status }), "Status updated", reload);
    if (dialog.type === "notify") await mutate(api.post(`/admin/users/${id}/notifications`, { title: values.title, message: values.message, channels: ["email", "in_app"] }), "Notification sent", reload);
    setDialog(null);
  };

  const fields = dialog?.type === "notify"
    ? [{ name: "title", label: "Title" }, { name: "message", label: "Message", multiline: true }]
    : dialog?.type === "role"
      ? [{ name: "role", label: "Role", type: "select", options: ["guest", "host", "admin"] }]
      : dialog?.type === "status"
        ? [{ name: "status", label: "Status", type: "select", options: ["active", "suspended", "banned"] }]
        : [{ name: "full_name", label: "Full name" }, { name: "phone", label: "Phone" }];

  return (
    <Page title="Users" subtitle="Manage profiles, roles, account status, and direct notifications.">
      <DataTable search={search} onSearch={setSearch} rows={rows} loading={loading} error={error} columns={[
        { key: "full_name", label: "Name" }, { key: "email", label: "Email" }, { key: "phone", label: "Phone" },
        { key: "role", label: "Role", render: (row) => row.role || row.user_roles?.[0]?.role || "guest" },
        { key: "status", label: "Status", render: (row) => <Chip size="small" label={row.status || "active"} /> },
      ]} actions={(row) => [
        <RowButton key="view" title="View" icon={<VisibilityIcon />} onClick={() => setDetail(row)} />,
        <RowButton key="edit" title="Edit" icon={<EditIcon />} onClick={() => open("edit", row)} />,
        <Button key="role" size="small" onClick={() => open("role", row)}>Role</Button>,
        <Button key="status" size="small" color="warning" onClick={() => open("status", row)}>Status</Button>,
        <RowButton key="notify" title="Notify" color="primary" icon={<SendIcon />} onClick={() => open("notify", row)} />,
        <RowButton key="delete" title="Delete" color="error" icon={<DeleteIcon />} onClick={() => mutate(api.delete(`/admin/users/${row.id}`), "User deleted", reload)} />,
      ]} />
      <DetailDialog title="User details" row={detail} onClose={() => setDetail(null)} />
      <FormDialog open={Boolean(dialog)} title={dialog?.type === "notify" ? "Send notification" : dialog?.type === "role" ? "Change role" : dialog?.type === "status" ? "Change status" : "Edit user"} values={values} setValues={setValues} onClose={() => setDialog(null)} onSubmit={submit} fields={fields} />
    </Page>
  );
}
