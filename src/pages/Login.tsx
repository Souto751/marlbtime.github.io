import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Error al iniciar sesión');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box textAlign="center">
            <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" gutterBottom>
              Iniciar sesión
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accedé a tu cuenta para publicar y consultar productos
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <Alert severity="info" variant="outlined">
            Demo: <strong>demo@marlbtime.com</strong> / <strong>123456</strong> (comprador),{' '}
            <strong>vendedor@marlbtime.com</strong> / <strong>123456</strong> (vendedor) o{' '}
            <strong>admin@marlbtime.com</strong> / <strong>123456</strong> (administrador)
          </Alert>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </Stack>
          </Box>

          <Typography textAlign="center" variant="body2">
            ¿No tenés cuenta?{' '}
            <Typography component={Link} to="/registro" color="primary" variant="body2">
              Registrate acá
            </Typography>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
