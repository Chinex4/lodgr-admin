import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

export default function FormDialog({ open, title, fields, values, setValues, onClose, onSubmit, submitLabel = "Save" }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {fields.map((field) => {
            if (field.type === "select") {
              return (
                <FormControl key={field.name} fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    label={field.label}
                    value={values[field.name] ?? ""}
                    onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.value ?? option} value={option.value ?? option}>{option.label ?? option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            }

            if (field.type === "checkbox") {
              return (
                <FormControlLabel
                  key={field.name}
                  control={<Checkbox checked={Boolean(values[field.name])} onChange={(event) => setValues({ ...values, [field.name]: event.target.checked })} />}
                  label={field.label}
                />
              );
            }

            return (
              <TextField
                key={field.name}
                label={field.label}
                type={field.type || "text"}
                multiline={field.multiline}
                minRows={field.multiline ? 4 : undefined}
                value={values[field.name] ?? ""}
                onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
                fullWidth
              />
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>{submitLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
