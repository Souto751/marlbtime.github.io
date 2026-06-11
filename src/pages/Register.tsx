import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'buyer' as 'buyer' | 'seller',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Error al registrarse');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box textAlign="center">
            <PersonAddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" gutterBottom>
              Crear cuenta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Registrate como comprador o vendedor
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Nombre completo"
                fullWidth
                required
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              <TextField
                label="Teléfono / WhatsApp"
                fullWidth
                required
                placeholder="54911..."
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                required
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />

              <FormControl>
                <FormLabel>Tipo de cuenta</FormLabel>
                <RadioGroup
                  row
                  value={form.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                >
                  <FormControlLabel value="buyer" control={<Radio />} label="Comprador" />
                  <FormControlLabel value="seller" control={<Radio />} label="Vendedor" />
                </RadioGroup>
              </FormControl>

              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
              </Button>
            </Stack>
          </Box>

          <Typography textAlign="center" variant="body2">
            ¿Ya tenés cuenta?{' '}
            <Typography component={Link} to="/login" color="primary" variant="body2">
              Iniciá sesión
            </Typography>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
