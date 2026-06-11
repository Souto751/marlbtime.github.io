import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NavigationDrawerProvider } from './contexts/NavigationDrawerContext';
import { ThemeModeProvider } from './contexts/ThemeModeContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeModeProvider>
      <NavigationDrawerProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </NavigationDrawerProvider>
    </ThemeModeProvider>
  </StrictMode>,
);
