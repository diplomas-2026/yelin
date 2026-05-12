import { useMemo, useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';

export default function DataTable({ title, rows, columns, filterField, filterLabel, getRowId, onRowClick }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Все');
  const [orderBy, setOrderBy] = useState(columns[0]?.field);
  const [order, setOrder] = useState('asc');

  const filterValues = useMemo(() => {
    if (!filterField) return [];
    return ['Все', ...Array.from(new Set(rows.map((row) => row[filterField]).filter(Boolean)))];
  }, [rows, filterField]);

  const visibleRows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return rows
      .filter((row) => {
        const matchesSearch = !normalizedSearch || Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(normalizedSearch));
        const matchesFilter = filter === 'Все' || row[filterField] === filter;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const left = String(a[orderBy] ?? '');
        const right = String(b[orderBy] ?? '');
        return order === 'asc' ? left.localeCompare(right, 'ru') : right.localeCompare(left, 'ru');
      });
  }, [rows, search, filter, filterField, orderBy, order]);

  function sortBy(field) {
    if (orderBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      setOrder('asc');
    }
  }

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Toolbar sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap', py: 1.5, bgcolor: 'rgba(248,250,252,0.72)' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>{title}</Typography>
        <TextField size="small" label="Поиск" value={search} onChange={(event) => setSearch(event.target.value)} sx={{ minWidth: 260 }} />
        {filterField && (
          <FormControl size="small" sx={{ minWidth: 190 }}>
            <InputLabel>{filterLabel || 'Фильтр'}</InputLabel>
            <Select label={filterLabel || 'Фильтр'} value={filter} onChange={(event) => setFilter(event.target.value)}>
              {filterValues.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
            </Select>
          </FormControl>
        )}
      </Toolbar>
      <TableContainer>
        <Table sx={{ minWidth: 760 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>
                  <TableSortLabel active={orderBy === column.field} direction={orderBy === column.field ? order : 'asc'} onClick={() => sortBy(column.field)}>
                    {column.headerName}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow
                key={getRowId ? getRowId(row) : row.id}
                hover
                onClick={() => onRowClick?.(row)}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:last-child td': { borderBottom: 0 },
                  '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.04)' },
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.field}>{column.render ? column.render(row) : row[column.field]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!visibleRows.length && <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>Нет данных</Box>}
    </Paper>
  );
}
