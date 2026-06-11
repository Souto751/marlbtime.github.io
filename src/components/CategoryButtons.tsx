import { Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { categories } from '../services/mockData';

export default function CategoryButtons() {
  return (
    <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 5 }}>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant="contained"
          component={Link}
          to={`/categoria/${cat.slug}`}
          sx={{
            flex: {
              xs: '1 1 calc(50% - 6px)',
              sm: '1 1 calc(33.333% - 8px)',
              md: '0 1 auto',
            },
            minWidth: { md: 170 },
            py: 1.25,
          }}
        >
          {cat.name}
        </Button>
      ))}
    </Stack>
  );
}
