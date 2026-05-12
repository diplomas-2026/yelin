import { Chip } from '@mui/material';

const colors = {
  Новый: 'default',
  'В работе': 'warning',
  'На проверке': 'info',
  'На доработке': 'error',
  Завершен: 'success',
};

export default function StatusChip({ status }) {
  return <Chip size="small" label={status} color={colors[status] || 'default'} variant={status === 'Новый' ? 'outlined' : 'filled'} />;
}
