import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/services/cartService";
import type { CartItem, Product } from "@/types";

interface CartContextValue {
  items: CartItem[];
  count: number;
  lastAdded: Product | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
  clearLastAdded: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isReady, logout } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAdded, setLastAdded] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isReady || !isAuthenticated) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const cart = await getCart();
      setItems(Array.isArray(cart.cartItem) ? cart.cartItem : []);
    } catch (requestError) {
      if (
        requestError instanceof ApiError &&
        (requestError.status === 401 || requestError.status === 403)
      ) {
        logout();
      }
      setError(getErrorMessage(requestError, "Não foi possível carregar o carrinho."));
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isReady, logout]);

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      setItems([]);
      setError(null);
      setIsLoading(false);
      return;
    }
    void refresh().catch(() => undefined);
  }, [isAuthenticated, isReady, refresh]);

  const runMutation = useCallback(
    async (operation: () => Promise<unknown>, fallback: string) => {
      if (isMutating) return;
      setIsMutating(true);
      setError(null);
      try {
        await operation();
        await refresh();
      } catch (requestError) {
        const message = getErrorMessage(requestError, fallback);
        setError(message);
        throw new Error(message);
      } finally {
        setIsMutating(false);
      }
    },
    [isMutating, refresh],
  );

  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      await runMutation(
        () => addCartItem(Number(product.id), quantity),
        "Não foi possível adicionar o produto ao carrinho.",
      );
      setLastAdded(product);
    },
    [runMutation],
  );

  const updateQuantity = useCallback(
    (itemId: number, quantity: number) => {
      if (!Number.isInteger(quantity) || quantity < 1) {
        return Promise.reject(new Error("A quantidade deve ser pelo menos 1."));
      }
      return runMutation(
        () => updateCartItem(itemId, quantity),
        "Não foi possível atualizar a quantidade.",
      );
    },
    [runMutation],
  );

  const removeItem = useCallback(
    (itemId: number) =>
      runMutation(
        () => removeCartItem(itemId),
        "Não foi possível remover o produto.",
      ),
    [runMutation],
  );

  const clearCart = useCallback(async () => {
    if (isMutating) return;
    setIsMutating(true);
    setError(null);
    let removalError: unknown = null;
    try {
      for (const item of items) {
        try {
          await removeCartItem(item.id);
        } catch (error) {
          removalError ??= error;
        }
      }
      await refresh();
      if (removalError) {
        throw new Error(getErrorMessage(removalError, "Não foi possível limpar o carrinho."));
      }
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Não foi possível limpar o carrinho.");
      setError(message);
      throw new Error(message);
    } finally {
      setIsMutating(false);
    }
  }, [isMutating, items, refresh]);

  const clearError = useCallback(() => setError(null), []);
  const clearLastAdded = useCallback(() => setLastAdded(null), []);
  const count = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      count,
      lastAdded,
      isLoading,
      isMutating,
      error,
      refresh,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      clearError,
      clearLastAdded,
    }),
    [
      items,
      count,
      lastAdded,
      isLoading,
      isMutating,
      error,
      refresh,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      clearError,
      clearLastAdded,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
