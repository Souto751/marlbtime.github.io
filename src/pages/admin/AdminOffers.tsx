import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useMemo, useState } from 'react';
import UnsavedChangesPrompt from '../../components/UnsavedChangesPrompt';
import { updateProductOverride } from '../../services/adminData';
import { getAllProducts, getDiscountPercent } from '../../services/mockData';
import type { Product } from '../../types';
import {
  AdminFieldRow,
  AdminMobileCard,
  AdminPageHeader,
  AdminScrollTable,
  adminResponsiveTable,
} from './adminUi';

interface OfferDraft {
  price?: number;
  originalPrice?: number | null;
  featured?: boolean;
}

export default function AdminOffers() {
  const [refresh, setRefresh] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, OfferDraft>>({});
  const [snackbar, setSnackbar] = useState(false);

  const products = useMemo(() => getAllProducts(), [refresh]);

  const updateDraft = (id: string, data: OfferDraft, product: Product) => {
    setDrafts((prev) => {
      const merged = { ...prev[id], ...data };
      const hasChange =
        (merged.price !== undefined && merged.price !== product.price) ||
        (merged.featured !== undefined && merged.featured !== product.featured) ||
        (merged.originalPrice !== undefined &&
          merged.originalPrice !== (product.originalPrice ?? null));

      if (!hasChange) {
        if (prev[id] === undefined) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      }

      return { ...prev, [id]: merged };
    });
  };

  const hasChanges = (id: string, product: Product) => {
    const draft = drafts[id];
    if (!draft) return false;

    if (draft.price !== undefined && draft.price !== product.price) return true;
    if (draft.featured !== undefined && draft.featured !== product.featured) return true;
    if (draft.originalPrice !== undefined) {
      const savedOriginal = product.originalPrice ?? null;
      return draft.originalPrice !== savedOriginal;
    }
    return false;
  };

  const hasUnsavedChanges = products.some((p) => hasChanges(p.id, p));

  const getRowValues = (id: string, product: Product) => {
    const draft = drafts[id];
    return {
      price: draft?.price ?? product.price,
      originalPrice:
        draft?.originalPrice !== undefined ? draft.originalPrice : product.originalPrice,
      featured: draft?.featured ?? product.featured,
    };
  };

  const handleSave = (id: string) => {
    const product = products.find((p) => p.id === id);
    const draft = drafts[id];
    if (!product || !draft || !hasChanges(id, product)) return;
    updateProductOverride(id, draft);
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setRefresh((r) => r + 1);
    setSnackbar(true);
  };

  const renderOfferFields = (product: Product) => {
    const values = getRowValues(product.id, product);
    const mockProduct: Product = { ...product, price: values.price, featured: values.featured };
    if (values.originalPrice != null) mockProduct.originalPrice = values.originalPrice;
    const hasOffer = values.originalPrice != null && values.originalPrice > values.price;
    const discount = hasOffer ? getDiscountPercent(mockProduct) : 0;

    return { values, hasOffer, discount };
  };

  return (
    <Box>
      <UnsavedChangesPrompt when={hasUnsavedChanges} />
      <AdminPageHeader
        title="Ofertas y precios"
        subtitle="Gestioná precios, precios tachados y productos destacados."
      />

      <Box sx={adminResponsiveTable.desktop}>
        <AdminScrollTable maxHeight={{ xs: 400, md: 600 }}>
          <Table size="small" stickyHeader sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell width={130}>Precio</TableCell>
                <TableCell width={130}>Precio original</TableCell>
                <TableCell width={90}>Descuento</TableCell>
                <TableCell width={100}>Destacado</TableCell>
                <TableCell width={80} align="center">
                  Guardar
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => {
                const { values, hasOffer, discount } = renderOfferFields(product);
                return (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {product.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={values.price}
                        onChange={(e) =>
                          updateDraft(product.id, { price: Math.max(0, Number(e.target.value)) }, product)
                        }
                        inputProps={{ min: 0 }}
                        sx={{ width: 110 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={values.originalPrice ?? ''}
                        placeholder="Sin oferta"
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft(
                            product.id,
                            {
                              originalPrice: val === '' ? null : Math.max(0, Number(val)),
                            },
                            product,
                          );
                        }}
                        inputProps={{ min: 0 }}
                        sx={{ width: 110 }}
                      />
                    </TableCell>
                    <TableCell>
                      {hasOffer ? (
                        <Chip label={`${discount}% OFF`} size="small" color="secondary" />
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        size="small"
                        checked={values.featured}
                        onChange={(e) => updateDraft(product.id, { featured: e.target.checked }, product)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleSave(product.id)}
                        disabled={!hasChanges(product.id, product)}
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </AdminScrollTable>
      </Box>

      <Box sx={adminResponsiveTable.mobile}>
        {products.map((product) => {
          const { values, hasOffer, discount } = renderOfferFields(product);
          return (
            <AdminMobileCard
              key={product.id}
              title={product.title}
              actions={
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => handleSave(product.id)}
                  disabled={!hasChanges(product.id, product)}
                  fullWidth
                >
                  Guardar cambios
                </Button>
              }
            >
              <AdminFieldRow
                label="Precio"
                value={
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={values.price}
                    onChange={(e) =>
                      updateDraft(product.id, { price: Math.max(0, Number(e.target.value)) }, product)
                    }
                  />
                }
              />
              <AdminFieldRow
                label="Precio original"
                value={
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={values.originalPrice ?? ''}
                    placeholder="Sin oferta"
                    onChange={(e) => {
                      const val = e.target.value;
                      updateDraft(
                        product.id,
                        {
                          originalPrice: val === '' ? null : Math.max(0, Number(val)),
                        },
                        product,
                      );
                    }}
                  />
                }
              />
              <AdminFieldRow
                label="Descuento"
                value={
                  hasOffer ? (
                    <Chip label={`${discount}% OFF`} size="small" color="secondary" />
                  ) : (
                    <Typography variant="body2">—</Typography>
                  )
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={values.featured}
                    onChange={(e) => updateDraft(product.id, { featured: e.target.checked }, product)}
                  />
                }
                label="Producto destacado"
              />
            </AdminMobileCard>
          );
        })}
      </Box>

      <Snackbar
        open={snackbar}
        autoHideDuration={2500}
        onClose={() => setSnackbar(false)}
        message="Oferta actualizada"
      />
    </Box>
  );
}
