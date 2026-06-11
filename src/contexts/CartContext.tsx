import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getProductById } from '../services/mockData';
import type { CartItem, Product } from '../types';

const CART_KEY = 'marlbtime_cart';

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return [];
    const parsed: { productId: string; quantity: number }[] = JSON.parse(stored);
    return parsed
      .map(({ productId, quantity }) => {
        const product = getProductById(productId);
        return product ? { product, quantity } : null;
      })
      .filter((item): item is CartItem => item !== null);
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  const toStore = items.map(({ product, quantity }) => ({
    productId: product.id,
    quantity,
  }));
  localStorage.setItem(CART_KEY, JSON.stringify(toStore));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  const persist = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    saveCart(newItems);
  }, []);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        let next: CartItem[];
        if (existing) {
          next = prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
              : i,
          );
        } else {
          next = [...prev, { product, quantity: Math.min(quantity, product.stock) }];
        }
        saveCart(next);
        return next;
      });
    },
    [],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.product.id !== productId);
        saveCart(next);
        return next;
      });
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setItems((prev) => {
        const next = prev
          .map((i) => {
            if (i.product.id !== productId) return i;
            if (quantity <= 0) return null;
            return { ...i, quantity: Math.min(quantity, i.product.stock) };
          })
          .filter((i): i is CartItem => i !== null);
        saveCart(next);
        return next;
      });
    },
    [],
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
}
