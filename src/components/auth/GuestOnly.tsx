import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageSpinner } from "@/components/layout/PageSpinner";
import type { ReactNode } from "react";

export function GuestOnly({ children }: { children: ReactNode }) {
  const { isReady, isAuthenticated } = useAuth();

  if (!isReady) {
    return <PageSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
