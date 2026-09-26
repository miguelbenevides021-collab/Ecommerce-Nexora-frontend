import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { GuestOnly } from "@/components/auth/GuestOnly";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { MainLayout } from "@/components/layout/MainLayout";
import { HomePage } from "@/pages/HomePage";
import { ProductsPage } from "@/pages/ProductsPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import {
  AdminCategoriesPage,
  AdminOrdersPage,
  AdminProductsPage,
} from "@/pages/admin/AdminPages";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/produtos", element: <ProductsPage /> },
      {
        path: "/login",
        element: (
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        ),
      },
      {
        path: "/registro",
        element: (
          <GuestOnly>
            <RegisterPage />
          </GuestOnly>
        ),
      },
      {
        path: "/carrinho",
        element: (
          <RequireAuth>
            <CartPage />
          </RequireAuth>
        ),
      },
      {
        path: "/checkout",
        element: (
          <RequireAuth>
            <CheckoutPage />
          </RequireAuth>
        ),
      },
      {
        path: "/pedidos",
        element: (
          <RequireAuth>
            <OrdersPage />
          </RequireAuth>
        ),
      },
      {
        path: "/admin",
        element: (
          <RequireAuth role="ADMIN">
            <AdminLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Navigate to="produtos" replace /> },
          { path: "produtos", element: <AdminProductsPage /> },
          { path: "categorias", element: <AdminCategoriesPage /> },
          { path: "pedidos", element: <AdminOrdersPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <div className="dark min-h-screen bg-background">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}

export default App;
