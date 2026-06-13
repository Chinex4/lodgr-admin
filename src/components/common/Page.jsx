import { Box, Stack, Typography } from "@mui/material";

export default function Page({ title, subtitle, children, action }) {
  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h4">{title}</Typography>
          <Typography color="text.secondary">{subtitle}</Typography>
        </Box>
        {action}
      </Box>
      {children}
    </Stack>
  );
}
