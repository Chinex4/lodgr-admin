import { useEffect, useState } from "react";
import { Alert, Button, Chip } from "@mui/material";
import BackupIcon from "@mui/icons-material/Backup";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import toast from "react-hot-toast";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import RowButton from "../../components/common/RowButton";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { api, errorMessage, unwrap } from "../../lib/api";
import { date } from "../../utils/formatters";
import { mutate } from "../../utils/mutate";

const fileSize = (bytes) => {
  const value = Number(bytes || 0);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
};

async function downloadBackup(name) {
  const toastId = toast.loading("Preparing download...");
  try {
    const res = await api.get(`/admin/backups/${encodeURIComponent(name)}/download`, { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Download started", { id: toastId });
  } catch (error) {
    let message = errorMessage(error);
    // Blob error bodies need decoding to surface the API message.
    if (error.response?.data instanceof Blob) {
      try { message = JSON.parse(await error.response.data.text()).message || message; } catch { /* keep default */ }
    }
    toast.error(message, { id: toastId });
  }
}

export default function Backups() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/backups");
      setRows((unwrap(res) || []).map((row) => ({ ...row, id: row.name })));
      setMeta(res.data?.meta || null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const createAndDownload = async () => {
    setCreating(true);
    const toastId = toast.loading("Creating database backup... this can take a minute.");
    try {
      const backup = unwrap(await api.post("/admin/backups", {}, { timeout: 15 * 60 * 1000 }));
      toast.success("Backup created", { id: toastId });
      await load();
      if (backup?.name) await downloadBackup(backup.name);
    } catch (requestError) {
      toast.error(errorMessage(requestError), { id: toastId });
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = async () => {
    await mutate(api.delete(`/admin/backups/${encodeURIComponent(toDelete.name)}`), "Backup deleted", load);
    setToDelete(null);
  };

  return (
    <Page
      title="Database Backups"
      subtitle="Full SQL dumps of the database, stored privately on the server."
      action={
        <Button variant="contained" startIcon={<BackupIcon />} onClick={createAndDownload} disabled={creating}>
          {creating ? "Backing up..." : "Back up & download now"}
        </Button>
      }
    >
      <Alert severity="info">
        {meta?.schedule || "Automatic backups run weekly"}. The latest {meta?.keep ?? 8} backups are kept; older ones are removed automatically.
        Files are gzipped SQL (<code>.sql.gz</code>) — restore with <code>gunzip &lt; file.sql.gz | mysql dbname</code> or import directly in phpMyAdmin.
      </Alert>
      <DataTable
        search={search}
        onSearch={setSearch}
        rows={rows}
        loading={loading}
        error={error}
        empty="No backups yet. Create one with the button above."
        columns={[
          { key: "name", label: "File" },
          { key: "created_at", label: "Created", render: (row) => date(row.created_at) },
          { key: "trigger", label: "Type", render: (row) => <Chip size="small" label={row.trigger === "scheduled" ? "Weekly" : "Manual"} color={row.trigger === "scheduled" ? "primary" : "default"} /> },
          { key: "size", label: "Size", render: (row) => fileSize(row.size) },
        ]}
        actions={(row) => [
          <RowButton key="download" title="Download" icon={<DownloadIcon />} onClick={() => downloadBackup(row.name)} />,
          <RowButton key="delete" title="Delete" color="error" icon={<DeleteIcon />} onClick={() => setToDelete(row)} />,
        ]}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete backup?"
        message={`${toDelete?.name || ""} will be permanently removed from the server.`}
        confirmLabel="Delete"
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </Page>
  );
}
