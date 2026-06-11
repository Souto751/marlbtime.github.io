import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import ScrollRestoration from './components/ScrollRestoration';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminMessages from './pages/admin/AdminMessages';
import AdminOffers from './pages/admin/AdminOffers';
import AdminProductEdit from './pages/admin/AdminProductEdit';
import AdminProducts from './pages/admin/AdminProducts';
import AdminStock from './pages/admin/AdminStock';
import AdminSuppliers from './pages/admin/AdminSuppliers';
import AdminTransactions from './pages/admin/AdminTransactions';
import Cart from './pages/Cart';
import CategoryPage from './pages/CategoryPage';
import Home from './pages/Home';
import Login from './pages/Login';
import MyPublications from './pages/MyPublications';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import PublishProduct from './pages/PublishProduct';
import Register from './pages/Register';

function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
      {
        path: 'admin',
        element: (
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'productos', element: <AdminProducts /> },
          { path: 'productos/:id', element: <AdminProductEdit /> },
          { path: 'stock', element: <AdminStock /> },
          { path: 'ofertas', element: <AdminOffers /> },
          { path: 'mensajes', element: <AdminMessages /> },
          { path: 'transacciones', element: <AdminTransactions /> },
          { path: 'proveedores', element: <AdminSuppliers /> },
        ],
      },
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'productos', element: <Products /> },
          { path: 'categoria/:slug', element: <CategoryPage /> },
          { path: 'producto/:id', element: <ProductDetail /> },
          { path: 'carrito', element: <Cart /> },
          { path: 'login', element: <Login /> },
          { path: 'registro', element: <Register /> },
          {
            path: 'publicar',
            element: (
              <ProtectedRoute requireSeller>
                <PublishProduct />
              </ProtectedRoute>
            ),
          },
          {
            path: 'mis-publicaciones',
            element: (
              <ProtectedRoute requireSeller>
                <MyPublications />
              </ProtectedRoute>
            ),
          },
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
  ],
  { basename: basename || undefined },
);

export default function App() {
  return <RouterProvider router={router} />;
}
