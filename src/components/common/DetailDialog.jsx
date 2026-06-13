import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export default function DetailDialog({ title, row, onClose }) {
  return (
    <Dialog open={Boolean(row)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component="pre" sx={{ whiteSpace: "pre-wrap", bgcolor: "#f8fafc", p: 2, borderRadius: 1, fontSize: 12 }}>
          {JSON.stringify(row, null, 2)}
        </Box>
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
    </Dialog>
  );
}
