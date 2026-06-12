import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useThemeMode } from '../../contexts/ThemeModeContext';
import { createEmptyCustomPalette, expandPaletteColors } from '../../theme/palettes';
import type { ThemePaletteColors, ThemePaletteDefinition } from '../../types';
import { AdminPageHeader } from './adminUi';

const ASPECT_LABELS: Record<string, string> = {
  tecnologico: 'Tecnológico',
  profesional: 'Profesional',
  hacker: 'Hacker',
  custom: 'Personalizado',
};

function PaletteStrip({ colors, label }: { colors: ThemePaletteColors; label: string }) {
  const c = expandPaletteColors(colors);
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        {label}
      </Typography>
      <Stack direction="row" sx={{ height: 36, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ flex: 1.2, bgcolor: c.primaryMain }} title="Primario" />
        <Box sx={{ flex: 1, bgcolor: c.secondaryMain }} title="Secundario" />
        <Box sx={{ flex: 1, bgcolor: c.backgroundDefault }} title="Fondo" />
        <Box sx={{ flex: 1, bgcolor: c.backgroundPaper }} title="Superficie" />
      </Stack>
    </Box>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box
        component="input"
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          width: 40,
          height: 40,
          p: 0,
          border: 'none',
          borderRadius: 1,
          cursor: 'pointer',
          bgcolor: 'transparent',
          flexShrink: 0,
        }}
      />
      <TextField
        label={label}
        size="small"
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputProps={{ maxLength: 7 }}
      />
    </Stack>
  );
}

function ModeColorFields({
  colors,
  onChange,
}: {
  colors: ThemePaletteColors;
  onChange: (colors: ThemePaletteColors) => void;
}) {
  const update = (key: keyof ThemePaletteColors, value: string) => {
    onChange({ ...colors, [key]: value });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ColorInput label="Primario" value={colors.primaryMain} onChange={(v) => update('primaryMain', v)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ColorInput label="Secundario" value={colors.secondaryMain} onChange={(v) => update('secondaryMain', v)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ColorInput
          label="Fondo"
          value={colors.backgroundDefault}
          onChange={(v) => update('backgroundDefault', v)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ColorInput
          label="Superficie"
          value={colors.backgroundPaper}
          onChange={(v) => update('backgroundPaper', v)}
        />
      </Grid>
    </Grid>
  );
}

function PaletteCard({
  palette,
  active,
  onApply,
  onEdit,
  onDelete,
}: {
  palette: ThemePaletteDefinition;
  active: boolean;
  onApply: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: '100%',
        borderColor: active ? 'primary.main' : 'divider',
        borderWidth: active ? 2 : 1,
        position: 'relative',
      }}
    >
      {active && (
        <Chip
          icon={<CheckCircleIcon />}
          label="Activo"
          color="primary"
          size="small"
          sx={{ position: 'absolute', top: 12, right: 12 }}
        />
      )}
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {palette.name}
          </Typography>
          <Chip label={ASPECT_LABELS[palette.aspect]} size="small" sx={{ mt: 0.5 }} />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
          {palette.description}
        </Typography>
        <PaletteStrip colors={palette.light} label="Modo claro" />
        <PaletteStrip colors={palette.dark} label="Modo oscuro" />
        <Stack direction="row" spacing={1}>
          <Button variant={active ? 'outlined' : 'contained'} size="small" onClick={onApply} disabled={active}>
            {active ? 'En uso' : 'Aplicar'}
          </Button>
          {onEdit && (
            <IconButton size="small" onClick={onEdit} aria-label="Editar tema">
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton size="small" color="error" onClick={onDelete} aria-label="Eliminar tema">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function AdminThemes() {
  const {
    paletteId,
    palettes,
    customPalettes,
    setPalette,
    saveCustomPalette,
    removeCustomPalette,
  } = useThemeMode();

  const builtinPalettes = useMemo(() => palettes.filter((p) => p.builtin), [palettes]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ThemePaletteDefinition | null>(null);
  const [tab, setTab] = useState(0);
  const [saved, setSaved] = useState(false);

  const openCreate = () => {
    setEditing(createEmptyCustomPalette('Nuevo tema'));
    setTab(0);
    setDialogOpen(true);
  };

  const openEdit = (palette: ThemePaletteDefinition) => {
    setEditing({ ...palette, light: { ...palette.light }, dark: { ...palette.dark } });
    setTab(0);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!editing?.name.trim()) return;
    saveCustomPalette({
      ...editing,
      name: editing.name.trim(),
      light: expandPaletteColors(editing.light),
      dark: expandPaletteColors(editing.dark),
    });
    setPalette(editing.id);
    setDialogOpen(false);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <AdminPageHeader
        title="Paleta de colores"
        subtitle="Elegí un estilo para toda la tienda. Cada tema incluye versión clara y oscura."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Crear tema
          </Button>
        }
      />

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Tema guardado y aplicado correctamente.
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <PaletteOutlinedIcon color="primary" />
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            Tema activo: {palettes.find((p) => p.id === paletteId)?.name ?? 'Tecnológico'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Los cambios se aplican al instante en la tienda y el panel admin.
          </Typography>
        </Box>
      </Paper>

      <Typography variant="h6" fontWeight={600} gutterBottom>
        Temas predefinidos
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {builtinPalettes.map((palette) => (
          <Grid key={palette.id} size={{ xs: 12, md: 4 }}>
            <PaletteCard
              palette={palette}
              active={paletteId === palette.id}
              onApply={() => setPalette(palette.id)}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" fontWeight={600} gutterBottom>
        Temas personalizados
      </Typography>
      {customPalettes.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary" gutterBottom>
            Todavía no creaste temas propios.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={openCreate} sx={{ mt: 1 }}>
            Crear primer tema
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {customPalettes.map((palette) => (
            <Grid key={palette.id} size={{ xs: 12, md: 4 }}>
              <PaletteCard
                palette={palette}
                active={paletteId === palette.id}
                onApply={() => setPalette(palette.id)}
                onEdit={() => openEdit(palette)}
                onDelete={() => removeCustomPalette(palette.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editing && customPalettes.some((p) => p.id === editing.id)
            ? 'Editar tema personalizado'
            : 'Nuevo tema personalizado'}
        </DialogTitle>
        <DialogContent>
          {editing && (
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <TextField
                label="Nombre del tema"
                fullWidth
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
              <TextField
                label="Descripción"
                fullWidth
                multiline
                minRows={2}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
              <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
                <Tab label="Modo claro" />
                <Tab label="Modo oscuro" />
              </Tabs>
              {tab === 0 && (
                <ModeColorFields
                  colors={editing.light}
                  onChange={(light) => setEditing({ ...editing, light })}
                />
              )}
              {tab === 1 && (
                <ModeColorFields
                  colors={editing.dark}
                  onChange={(dark) => setEditing({ ...editing, dark })}
                />
              )}
              <PaletteStrip colors={editing.light} label="Vista previa claro" />
              <PaletteStrip colors={editing.dark} label="Vista previa oscuro" />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={!editing?.name.trim()}>
            Guardar y aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
