import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import { get, idOf } from "../../utils/formatters";

export default function DataTable({
  columns,
  rows,
  loading,
  error,
  search,
  onSearch,
  empty = "No records found",
  actions,
}) {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(q));
  }, [rows, search]);

  const slice = filtered.slice(page * perPage, page * perPage + perPage);

  return (
    <Paper>
      {onSearch && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", gap: 2 }}>
          <TextField
            size="small"
            label="Search"
            value={search || ""}
            onChange={(event) => onSearch(event.target.value)}
            sx={{ maxWidth: 360, width: "100%" }}
          />
        </Box>
      )}
      {error && <Alert severity="error" sx={{ mx: 2 }}>{error}</Alert>}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => <TableCell key={column.key}>{column.label}</TableCell>)}
              {actions && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((column) => <TableCell key={column.key}><Skeleton /></TableCell>)}
                {actions && <TableCell><Skeleton /></TableCell>}
              </TableRow>
            )) : slice.length ? slice.map((row) => (
              <TableRow key={idOf(row)} hover>
                {columns.map((column) => (
                  <TableCell key={column.key}>{column.render ? column.render(row) : get(row, column.key)}</TableCell>
                ))}
                {actions && (
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">{actions(row)}</Stack>
                  </TableCell>
                )}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)}>
                  <Box sx={{ py: 5, textAlign: "center", color: "text.secondary" }}>{empty}</Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        rowsPerPage={perPage}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        rowsPerPageOptions={[10, 25, 50]}
        onRowsPerPageChange={(event) => {
          setPerPage(Number(event.target.value));
          setPage(0);
        }}
      />
    </Paper>
  );
}
