import { IconButton, Tooltip } from "@mui/material";

export default function RowButton({ title, icon, onClick, color = "default" }) {
  return (
    <Tooltip title={title}>
      <IconButton size="small" color={color} onClick={onClick}>{icon}</IconButton>
    </Tooltip>
  );
}
