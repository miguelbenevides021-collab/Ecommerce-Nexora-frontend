import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface FavoritesContextValue {
  favoriteIds: Set<string>;
  isFavorite: (productId: string | number) => boolean;
  toggleFavorite: (productId: string | number) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("nexora:favorites");
      const ids: unknown = saved ? JSON.parse(saved) : [];
      return new Set(Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("nexora:favorites", JSON.stringify([...favoriteIds]));
    } catch {
      // Favorites remain available for the current session when storage is unavailable.
    }
  }, [favoriteIds]);

  const isFavorite = useCallback(
    (productId: string | number) => favoriteIds.has(String(productId)),
    [favoriteIds],
  );
  const toggleFavorite = useCallback((productId: string | number) => {
    const id = String(productId);
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ favoriteIds, isFavorite, toggleFavorite }),
    [favoriteIds, isFavorite, toggleFavorite],
  );
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
}
