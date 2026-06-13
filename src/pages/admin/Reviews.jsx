import { useState } from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import RowButton from "../../components/common/RowButton";
import { useApiList } from "../../hooks/useApiList";
import { api } from "../../lib/api";
import { mutate } from "../../utils/mutate";

export default function Reviews() {
  const { rows, loading, error, reload } = useApiList("/admin/reviews");
  const [search, setSearch] = useState("");
  return <Page title="Reviews" subtitle="Moderate guest reviews and hide inappropriate content."><DataTable search={search} onSearch={setSearch} rows={rows} loading={loading} error={error} columns={[{ key: "property.title", label: "Property" }, { key: "profiles.full_name", label: "Guest" }, { key: "rating", label: "Rating" }, { key: "comment", label: "Comment" }, { key: "is_hidden", label: "Hidden", render: (row) => row.is_hidden ? "Yes" : "No" }]} actions={(row) => [<Button key="hide" size="small" onClick={() => mutate(api.patch(`/admin/reviews/${row.id}`, { is_hidden: !row.is_hidden, status: !row.is_hidden ? "hidden" : "published" }), "Review updated", reload)}>{row.is_hidden ? "Unhide" : "Hide"}</Button>, <RowButton key="delete" title="Delete" color="error" icon={<DeleteIcon />} onClick={() => mutate(api.delete(`/admin/reviews/${row.id}`), "Review deleted", reload)} />]} /></Page>;
}
