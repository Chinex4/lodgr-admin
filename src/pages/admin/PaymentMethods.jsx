import { useState } from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Page from "../../components/common/Page";
import DataTable from "../../components/common/DataTable";
import FormDialog from "../../components/common/FormDialog";
import RowButton from "../../components/common/RowButton";
import { useApiList } from "../../hooks/useApiList";
import { api } from "../../lib/api";
import { mutate } from "../../utils/mutate";

const fields = [
  { name: "method_type", label: "Type", type: "select", options: [{ value: "bank_transfer", label: "Bank" }, { value: "cryptocurrency", label: "Crypto" }] },
  { name: "bank_name", label: "Bank name" }, { name: "account_name", label: "Account name" }, { name: "account_number", label: "Account number" },
  { name: "crypto_type", label: "Crypto type" }, { name: "crypto_address", label: "Crypto address" }, { name: "is_active", label: "Active", type: "checkbox" },
];

export default function PaymentMethods() {
  const { rows, loading, error, reload } = useApiList("/admin/payment-methods", { include_inactive: 1 });
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(null);
  const [values, setValues] = useState({});

  const submit = async () => {
    const request = dialog?.row ? api.patch(`/admin/payment-methods/${dialog.row.id}`, values) : api.post("/admin/payment-methods", values);
    await mutate(request, dialog?.row ? "Payment method updated" : "Payment method created", reload);
    setDialog(null);
  };

  return (
    <Page title="Payment Methods" subtitle="Manage active bank and crypto payment instructions." action={<Button variant="contained" onClick={() => { setDialog({}); setValues({ method_type: "bank_transfer", is_active: true }); }}>New method</Button>}>
      <DataTable search={search} onSearch={setSearch} rows={rows} loading={loading} error={error} columns={[
        { key: "method_type", label: "Type" }, { key: "bank_name", label: "Bank" }, { key: "account_name", label: "Account" },
        { key: "crypto_type", label: "Crypto" }, { key: "is_active", label: "Active", render: (row) => row.is_active ? "Yes" : "No" },
      ]} actions={(row) => [
        <RowButton key="edit" title="Edit" icon={<EditIcon />} onClick={() => { setDialog({ row }); setValues(row); }} />,
        <RowButton key="delete" title="Delete" color="error" icon={<DeleteIcon />} onClick={() => mutate(api.delete(`/admin/payment-methods/${row.id}`), "Payment method deleted", reload)} />,
      ]} />
      <FormDialog open={Boolean(dialog)} title={dialog?.row ? "Edit payment method" : "Create payment method"} fields={fields} values={values} setValues={setValues} onClose={() => setDialog(null)} onSubmit={submit} />
    </Page>
  );
}
