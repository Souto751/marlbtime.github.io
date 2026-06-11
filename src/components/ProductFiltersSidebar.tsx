import CheckIcon from '@mui/icons-material/Check';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Drawer,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import {
  formatPrice,
  hasActiveFilters,
  type FilterOptions,
  type ProductFilterState,
} from '../services/productFilters';

interface FilterCheckboxProps {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}

function FilterCheckbox({ label, count, checked, onChange }: FilterCheckboxProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.25}
      onClick={onChange}
      sx={{
        py: 0.6,
        cursor: 'pointer',
        borderRadius: 1,
        px: 0.5,
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: '2px solid',
          borderColor: 'primary.main',
          bgcolor: checked ? 'primary.main' : 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background-color 0.2s',
        }}
      >
        {checked && <CheckIcon sx={{ fontSize: 14, color: 'primary.contrastText' }} />}
      </Box>
      <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.3 }}>
        {label}
        {count !== undefined && (
          <Typography component="span" variant="body2" color="text.secondary">
            {` (${count})`}
          </Typography>
        )}
      </Typography>
    </Stack>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="subtitle2"
        fontWeight={700}
        sx={{ mb: 1, color: 'text.primary', letterSpacing: 0.2 }}
      >
        {title}
      </Typography>
      <Stack spacing={0.25}>{children}</Stack>
    </Box>
  );
}

interface ProductFiltersSidebarProps {
  filters: ProductFilterState;
  options: FilterOptions;
  initialFilters?: Partial<ProductFilterState>;
  onToggle: <K extends keyof ProductFilterState>(
    key: K,
    value: ProductFilterState[K] extends Array<infer U> ? U : never,
  ) => void;
  onToggleBoolean: (key: 'inStock' | 'onOffer' | 'featured') => void;
  onPriceChange: (field: 'minPrice' | 'maxPrice', value: number | null) => void;
  onClear: () => void;
}

function FiltersContent({
  filters,
  options,
  initialFilters = {},
  onToggle,
  onToggleBoolean,
  onPriceChange,
  onClear,
}: ProductFiltersSidebarProps) {
  const showClear = hasActiveFilters(filters, initialFilters);

  const handlePriceInput = (field: 'minPrice' | 'maxPrice', raw: string) => {
    const digits = raw.replace(/\D/g, '');
    onPriceChange(field, digits ? Number(digits) : null);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Filtros
        </Typography>
        {showClear && (
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer', fontWeight: 600 }}
            onClick={onClear}
          >
            Limpiar
          </Typography>
        )}
      </Stack>

      <FilterSection title="Disponibilidad">
        <FilterCheckbox
          label="Con stock en el local"
          count={options.inStockCount}
          checked={filters.inStock}
          onChange={() => onToggleBoolean('inStock')}
        />
      </FilterSection>

      <FilterSection title="Precio">
        {options.priceRanges.map((range) => (
          <FilterCheckbox
            key={range.id}
            label={range.label}
            count={range.count}
            checked={filters.priceRanges.includes(range.id)}
            onChange={() => onToggle('priceRanges', range.id)}
          />
        ))}
        <Stack spacing={1.5} sx={{ mt: 1.5 }}>
          <TextField
            label="Precio mínimo"
            size="small"
            fullWidth
            placeholder={formatPrice(options.minAvailablePrice)}
            value={filters.minPrice ?? ''}
            onChange={(e) => handlePriceInput('minPrice', e.target.value)}
            slotProps={{ htmlInput: { inputMode: 'numeric' } }}
          />
          <TextField
            label="Precio máximo"
            size="small"
            fullWidth
            placeholder={formatPrice(options.maxAvailablePrice)}
            value={filters.maxPrice ?? ''}
            onChange={(e) => handlePriceInput('maxPrice', e.target.value)}
            slotProps={{ htmlInput: { inputMode: 'numeric' } }}
          />
        </Stack>
      </FilterSection>

      {options.categories.length > 0 && (
        <FilterSection title="Categoría">
          {options.categories.map((category) => (
            <FilterCheckbox
              key={category.id}
              label={category.name}
              count={category.count}
              checked={filters.categoryIds.includes(category.id)}
              onChange={() => onToggle('categoryIds', category.id)}
            />
          ))}
        </FilterSection>
      )}

      {options.subcategories.length > 0 && (
        <FilterSection title="Subcategoría">
          {options.subcategories.map((item) => (
            <FilterCheckbox
              key={item.value}
              label={item.value}
              count={item.count}
              checked={filters.subcategories.includes(item.value)}
              onChange={() => onToggle('subcategories', item.value)}
            />
          ))}
        </FilterSection>
      )}

      {options.brands.length > 0 && (
        <FilterSection title="Marca">
          {options.brands.map((item) => (
            <FilterCheckbox
              key={item.value}
              label={item.value}
              count={item.count}
              checked={filters.brands.includes(item.value)}
              onChange={() => onToggle('brands', item.value)}
            />
          ))}
        </FilterSection>
      )}

      {options.conditions.length > 0 && (
        <FilterSection title="Condición">
          {options.conditions.map((item) => (
            <FilterCheckbox
              key={item.value}
              label={item.value === 'nuevo' ? 'Nuevo' : 'Usado'}
              count={item.count}
              checked={filters.conditions.includes(item.value)}
              onChange={() => onToggle('conditions', item.value)}
            />
          ))}
        </FilterSection>
      )}

      <FilterSection title="Promociones">
        <FilterCheckbox
          label="En oferta"
          count={options.onOfferCount}
          checked={filters.onOffer}
          onChange={() => onToggleBoolean('onOffer')}
        />
        <FilterCheckbox
          label="Destacados"
          count={options.featuredCount}
          checked={filters.featured}
          onChange={() => onToggleBoolean('featured')}
        />
      </FilterSection>
    </Box>
  );
}

export default function ProductFiltersSidebar(props: ProductFiltersSidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            mb: 2,
          }}
          aria-label="Abrir filtros"
        >
          <FilterListIcon />
        </IconButton>
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{ sx: { width: 300, p: 2 } }}
        >
          <FiltersContent {...props} />
        </Drawer>
      </>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        position: 'sticky',
        top: 120,
        maxHeight: 'calc(100vh - 140px)',
        overflowY: 'auto',
      }}
    >
      <FiltersContent {...props} />
    </Paper>
  );
}
