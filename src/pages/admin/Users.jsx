import { useState } from "react";
import { Avatar, Button, Chip, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import FormDialog from "../../components/common/FormDialog";
import RowButton from "../../components/common/RowButton";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useApiList } from "../../hooks/useApiList";
import { api } from "../../lib/api";
import { mutate } from "../../utils/mutate";

const initials = (row) => (row.full_name || row.email || "U").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

function UserAvatar({ row }) {
  return <Avatar src={row.avatar_url || ""} sx={{ width: 38, height: 38 }}>{initials(row)}</Avatar>;
}

export default function Users() {
  const navigate = useNavigate();
  const { rows, loading, error, reload } = useApiList("/admin/users");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [values, setValues] = useState({});

  const open = (type, row = {}) => {
    setDialog({ type, row });
    setValues(type === "notify"
      ? { title: "", message: "" }
      : type === "create"
        ? { full_name: "", email: "", phone: "", role: "guest", status: "active", password: "", password_confirmation: "" }
        : { full_name: row.full_name, phone: row.phone || "", role: row.role || row.user_roles?.[0]?.role || "guest", status: row.status || "active" });
  };

  const submit = async () => {
    const id = dialog.row?.id;
    if (dialog.type === "create") await mutate(api.post("/admin/users", values), "User created", reload);
    if (dialog.type === "edit") await mutate(api.patch(`/admin/users/${id}`, { full_name: values.full_name, phone: values.phone }), "User updated", reload);
    if (dialog.type === "role") await mutate(api.patch(`/admin/users/${id}/role`, { role: values.role }), "Role updated", reload);
    if (dialog.type === "notify") await mutate(api.post(`/admin/users/${id}/notifications`, { title: values.title, message: values.message, channels: ["email", "in_app"] }), "Notification sent", reload);
    setDialog(null);
  };

  const confirmStatus = async () => {
    await mutate(api.patch(`/admin/users/${confirm.row.id}/status`, { status: confirm.status }), `User ${confirm.status}`, reload);
    setConfirm(null);
  };

  const confirmDelete = async () => {
    await mutate(api.delete(`/admin/users/${confirm.row.id}`), "User deleted", reload);
    setConfirm(null);
  };

  const fields = dialog?.type === "notify"
    ? [{ name: "title", label: "Title" }, { name: "message", label: "Message", multiline: true }]
    : dialog?.type === "role"
      ? [{ name: "role", label: "Role", type: "select", options: ["guest", "user", "host", "admin"] }]
      : dialog?.type === "create"
        ? [
            { name: "full_name", label: "Full name" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Phone" },
            { name: "role", label: "Role", type: "select", options: ["guest", "user", "host", "admin"] },
            { name: "status", label: "Status", type: "select", options: ["active", "suspended", "banned"] },
            { name: "password", label: "Password", type: "password" },
            { name: "password_confirmation", label: "Confirm password", type: "password" },
          ]
        : [{ name: "full_name", label: "Full name" }, { name: "phone", label: "Phone" }];

  return (
    <Page
      title="Users"
      subtitle="Manage profiles, roles, account status, and direct notifications."
      action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => open("create")}>Create user</Button>}
    >
      <DataTable search={search} onSearch={setSearch} rows={rows} loading={loading} error={error} columns={[
        { key: "avatar", label: "", render: (row) => <UserAvatar row={row} /> },
        { key: "full_name", label: "Name" }, { key: "email", label: "Email" }, { key: "phone", label: "Phone" },
        { key: "role", label: "Role", render: (row) => row.role || row.user_roles?.[0]?.role || "guest" },
        { key: "status", label: "Status", render: (row) => <Chip size="small" label={row.status || "active"} /> },
      ]} actions={(row) => [
        <RowButton key="view" title="View" icon={<VisibilityIcon />} onClick={() => navigate(`/users/${row.id}`)} />,
        <RowButton key="edit" title="Edit" icon={<EditIcon />} onClick={() => open("edit", row)} />,
        <Button key="role" size="small" onClick={() => open("role", row)}>Role</Button>,
        <Stack key="status" direction="row" spacing={0.5}>
          <Button size="small" color="warning" onClick={() => setConfirm({ type: "status", status: "suspended", row })}>Suspend</Button>
          <Button size="small" color="error" onClick={() => setConfirm({ type: "status", status: "banned", row })}>Ban</Button>
        </Stack>,
        <RowButton key="notify" title="Notify" color="primary" icon={<SendIcon />} onClick={() => open("notify", row)} />,
        <RowButton key="delete" title="Delete" color="error" icon={<DeleteIcon />} onClick={() => setConfirm({ type: "delete", row })} />,
      ]} />
      <FormDialog open={Boolean(dialog)} title={dialog?.type === "notify" ? "Send notification" : dialog?.type === "role" ? "Change role" : dialog?.type === "create" ? "Create user" : "Edit user"} values={values} setValues={setValues} onClose={() => setDialog(null)} onSubmit={submit} fields={fields} />
      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.type === "delete" ? "Delete user?" : `${confirm?.status === "banned" ? "Ban" : "Suspend"} user?`}
        message={confirm?.type === "delete" ? "This permanently deletes the user and cannot be reversed." : "This changes the user's account access. Confirm before continuing."}
        confirmLabel={confirm?.type === "delete" ? "Delete user" : "Confirm"}
        onClose={() => setConfirm(null)}
        onConfirm={confirm?.type === "delete" ? confirmDelete : confirmStatus}
      />
    </Page>
  );
}
