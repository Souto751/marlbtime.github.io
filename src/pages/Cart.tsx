import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ProductImage from '../components/ProductImage';
import { buildWhatsAppLink, formatPrice, storeConfig } from '../services/mockData';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [notes, setNotes] = useState('');
  const [sent, setSent] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');

  const buildOrderMessage = () => {
    const lines = items.map(
      (i) => `- ${i.product.title} x${i.quantity} = ${formatPrice(i.product.price * i.quantity)}`,
    );
    return [
      `Hola! Quiero consultar/comprar los siguientes productos de ${storeConfig.storeName}:`,
      '',
      ...lines,
      '',
      `Total estimado: ${formatPrice(totalPrice)}`,
      user ? `Nombre: ${user.name}` : '',
      user ? `Email: ${user.email}` : '',
      user ? `Teléfono: ${user.phone}` : '',
      notes ? `Notas: ${notes}` : '',
      '',
      '¿Podemos coordinar pago y entrega?',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleSendRequest = () => {
    setOrderMessage(buildOrderMessage());
    setSent(true);
    clearCart();
  };

  if (items.length === 0 && !sent) {
    return (
      <Container maxWidth="md">
        <Box textAlign="center" py={8}>
          <Typography variant="h5" gutterBottom>
            Tu carrito está vacío
          </Typography>
          <Button component={Link} to="/productos" variant="contained" sx={{ mt: 2 }}>
            Ver productos
          </Button>
        </Box>
      </Container>
    );
  }

  if (sent) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom color="success.main">
            ¡Solicitud preparada!
          </Typography>
          <Typography variant="body1" mb={3}>
            Elegí cómo querés enviar tu consulta. Nos comunicaremos para confirmar pago y entrega.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="success"
              startIcon={<WhatsAppIcon />}
              href={buildWhatsAppLink(orderMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Enviar por WhatsApp
            </Button>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              href={`mailto:${storeConfig.email}?subject=${encodeURIComponent('Consulta de compra')}&body=${encodeURIComponent(orderMessage)}`}
            >
              Enviar por Email
            </Button>
          </Stack>
          <Button component={Link} to="/productos" sx={{ mt: 3 }}>
            Seguir comprando
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Carrito de compras
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        No hay pasarela de pagos. Al confirmar, te ayudamos a enviar tu pedido por WhatsApp o email.
      </Alert>

      <GridLayout items={items} removeFromCart={removeFromCart} updateQuantity={updateQuantity} totalPrice={totalPrice} notes={notes} setNotes={setNotes} handleSendRequest={handleSendRequest} user={user} />
    </Container>
  );
}

function GridLayout({
  items,
  removeFromCart,
  updateQuantity,
  totalPrice,
  notes,
  setNotes,
  handleSendRequest,
  user,
}: {
  items: ReturnType<typeof useCart>['items'];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  totalPrice: number;
  notes: string;
  setNotes: (v: string) => void;
  handleSendRequest: () => void;
  user: ReturnType<typeof useAuth>['user'];
}) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
      <Box flex={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell align="center">Cantidad</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(({ product, quantity }) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <ProductImage
                        src={product.image}
                        alt={product.title}
                        height={60}
                        sx={{ width: 60, borderRadius: 1, flexShrink: 0 }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        {product.title}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      value={quantity}
                      onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
                      slotProps={{ htmlInput: { min: 1, max: product.stock } }}
                      sx={{ width: 70 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {formatPrice(product.price * quantity)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => removeFromCart(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Paper sx={{ p: 3, width: { md: 360 }, height: 'fit-content' }}>
        <Typography variant="h6" gutterBottom>
          Resumen del pedido
        </Typography>
        {user && (
          <Typography variant="body2" color="text.secondary" mb={1}>
            {user.name} · {user.email}
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography>Total estimado</Typography>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            {formatPrice(totalPrice)}
          </Typography>
        </Stack>
        <TextField
          label="Notas adicionales (opcional)"
          multiline
          rows={3}
          fullWidth
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          fullWidth
          size="large"
          startIcon={<ShoppingCartCheckoutIcon />}
          onClick={handleSendRequest}
        >
          Solicitar por mensaje
        </Button>
        <Typography variant="caption" color="text.secondary" display="block" mt={1} textAlign="center">
          Sin pagos online · Coordinación manual
        </Typography>
      </Paper>
    </Stack>
  );
}
