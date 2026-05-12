import { Chip } from '@mui/material';

const colors = {
  Новый: { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
  'В работе': { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
  'На проверке': { bg: '#e0f2fe', color: '#075985', border: '#7dd3fc' },
  'На доработке': { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
  Завершен: { bg: '#dcfce7', color: '#166534', border: '#86efac' },
};

export default function StatusChip({ status }) {
  const tone = colors[status] || colors.Новый;
  return (
    <Chip
      size="small"
      label={status}
      sx={{
        bgcolor: tone.bg,
        color: tone.color,
        border: `1px solid ${tone.border}`,
        fontWeight: 800,
      }}
    />
  );
}
