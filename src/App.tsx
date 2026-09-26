import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { HomePage } from "@/pages/HomePage";
import { ProductsPage } from "@/pages/ProductsPage";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/produtos", element: <ProductsPage /> },
    ],
  },
]);

function App() {
  return (
    <div className="dark min-h-screen bg-background">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
