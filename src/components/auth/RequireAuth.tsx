import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageSpinner } from "@/components/layout/PageSpinner";
import type { ReactNode } from "react";

interface RequireAuthProps {
  children: ReactNode;
  role?: "ADMIN";
}

export function RequireAuth({ children, role }: RequireAuthProps) {
  const { isReady, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return <PageSpinner label="Validando sessão..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role === "ADMIN" && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
