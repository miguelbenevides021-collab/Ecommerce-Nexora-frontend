import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { GuestOnly } from "@/components/auth/GuestOnly";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { MainLayout } from "@/components/layout/MainLayout";
import { HomePage } from "@/pages/HomePage";
import { ProductsPage } from "@/pages/ProductsPage";
import { ProductDetailsPage } from "@/pages/ProductDetailsPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminCategoriesPage } from "@/pages/admin/AdminPages";
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";
import { AdminOrdersPage } from "@/pages/admin/AdminOrdersPage";
import { InstitutionalPage } from "@/pages/InstitutionalPage";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/produtos", element: <ProductsPage /> },
      { path: "/produtos/:categorySlug", element: <ProductsPage /> },
      { path: "/products/:productId", element: <ProductDetailsPage /> },
      { path: "/sobre", element: <InstitutionalPage page="sobre" /> },
      { path: "/trabalhe-conosco", element: <InstitutionalPage page="trabalhe-conosco" /> },
      { path: "/blog", element: <InstitutionalPage page="blog" /> },
      { path: "/sustentabilidade", element: <InstitutionalPage page="sustentabilidade" /> },
      { path: "/ajuda", element: <InstitutionalPage page="ajuda" /> },
      { path: "/rastrear-pedido", element: <InstitutionalPage page="rastrear-pedido" /> },
      { path: "/trocas-e-devolucoes", element: <InstitutionalPage page="trocas-e-devolucoes" /> },
      { path: "/contato", element: <InstitutionalPage page="contato" /> },
      { path: "/privacidade", element: <InstitutionalPage page="privacidade" /> },
      { path: "/termos", element: <InstitutionalPage page="termos" /> },
      { path: "/cookies", element: <InstitutionalPage page="cookies" /> },
      { path: "/garantia", element: <InstitutionalPage page="garantia" /> },
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
        path: "/perfil",
        element: (
          <RequireAuth>
            <ProfilePage />
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
          { path: "products", element: <AdminProductsPage /> },
          { path: "categorias", element: <AdminCategoriesPage /> },
          { path: "pedidos", element: <AdminOrdersPage /> },
          { path: "orders", element: <AdminOrdersPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <div className="dark min-h-screen bg-background">
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <RouterProvider router={router} />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
