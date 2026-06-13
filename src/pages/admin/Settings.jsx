import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import FormDialog from "../../components/common/FormDialog";
import RowButton from "../../components/common/RowButton";
import { useApiList } from "../../hooks/useApiList";
import { api } from "../../lib/api";
import { mutate } from "../../utils/mutate";

export default function Settings() {
  const { rows, loading, error, reload } = useApiList("/admin/settings");
  const [search, setSearch] = useState("");
  const [row, setRow] = useState(null);
  const [values, setValues] = useState({});
  return <Page title="Settings" subtitle="Site-wide support and fee configuration."><DataTable search={search} onSearch={setSearch} rows={rows} loading={loading} error={error} columns={[{ key: "key", label: "Key" }, { key: "value", label: "Value" }, { key: "type", label: "Type" }, { key: "description", label: "Description" }]} actions={(item) => [<RowButton key="edit" title="Edit" icon={<EditIcon />} onClick={() => { setRow(item); setValues({ value: item.value || "", type: item.type || "string", description: item.description || "" }); }} />]} /><FormDialog open={Boolean(row)} title={`Edit ${row?.key || "setting"}`} values={values} setValues={setValues} onClose={() => setRow(null)} onSubmit={async () => { await mutate(api.patch(`/admin/settings/${row.id}`, values), "Setting updated", reload); setRow(null); }} fields={[{ name: "value", label: "Value" }, { name: "type", label: "Type", type: "select", options: ["string", "integer", "decimal", "boolean", "json"] }, { name: "description", label: "Description", multiline: true }]} /></Page>;
}
