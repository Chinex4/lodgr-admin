import { useState } from "react";
import { Button, Checkbox, FormControlLabel, Grid, Paper, Stack, TextField } from "@mui/material";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import { useApiList } from "../../hooks/useApiList";
import { api } from "../../lib/api";
import { date } from "../../utils/formatters";
import { mutate } from "../../utils/mutate";

export default function Newsletter() {
  const { rows, loading, error, reload } = useApiList("/admin/newsletter/logs");
  const [values, setValues] = useState({ subject: "", body: "", include_users: true, include_hosts: false, include_admins: false, email: true, in_app: true });
  const send = async () => {
    await mutate(api.post("/admin/newsletter/send", { subject: values.subject, body: values.body, include_users: values.include_users, include_hosts: values.include_hosts, include_admins: values.include_admins, channels: [values.email && "email", values.in_app && "in_app"].filter(Boolean) }), "Broadcast sent", reload);
  };
  return <Page title="Newsletter / Broadcast" subtitle="Send email and in-app broadcasts to users, hosts, or admins."><Grid container spacing={2}><Grid item xs={12} md={5}><Paper sx={{ p: 2 }}><Stack spacing={2}><TextField label="Subject" value={values.subject} onChange={(event) => setValues({ ...values, subject: event.target.value })} /><TextField label="Body" multiline minRows={6} value={values.body} onChange={(event) => setValues({ ...values, body: event.target.value })} /><FormControlLabel control={<Checkbox checked={values.include_users} onChange={(event) => setValues({ ...values, include_users: event.target.checked })} />} label="Users" /><FormControlLabel control={<Checkbox checked={values.include_hosts} onChange={(event) => setValues({ ...values, include_hosts: event.target.checked })} />} label="Hosts" /><FormControlLabel control={<Checkbox checked={values.include_admins} onChange={(event) => setValues({ ...values, include_admins: event.target.checked })} />} label="Admins" /><FormControlLabel control={<Checkbox checked={values.email} onChange={(event) => setValues({ ...values, email: event.target.checked })} />} label="Email" /><FormControlLabel control={<Checkbox checked={values.in_app} onChange={(event) => setValues({ ...values, in_app: event.target.checked })} />} label="In-app" /><Button variant="contained" onClick={send}>Send broadcast</Button></Stack></Paper></Grid><Grid item xs={12} md={7}><DataTable rows={rows} loading={loading} error={error} columns={[{ key: "subject", label: "Subject" }, { key: "audience", label: "Audience" }, { key: "recipients_count", label: "Recipients" }, { key: "created_at", label: "Sent", render: (row) => date(row.created_at) }]} /></Grid></Grid></Page>;
}
