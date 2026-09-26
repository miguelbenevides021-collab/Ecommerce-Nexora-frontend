import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ApiError,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/lib/api";
import { decodeJwt, isJwtExpired } from "@/lib/jwt";
import { getProfile, loginRequest, registerRequest } from "@/services/authService";
import type { LoginPayload, RegisterPayload, User, UserRole } from "@/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isReady: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const hydrateFromToken = useCallback(
    async (nextToken: string) => {
      const payload = decodeJwt(nextToken);
      if (!payload || isJwtExpired(payload)) {
        logout();
        return;
      }

      setToken(nextToken);
      setStoredToken(nextToken);

      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (error) {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          logout();
          return;
        }
        setUser({
          id: payload.id,
          name: "",
          email: "",
          cpf: "",
          role: payload.role,
          createdAt: "",
          address: [],
        });
      }
    },
    [logout],
  );

  useEffect(() => {
    const stored = getStoredToken();
    if (!stored) {
      setIsReady(true);
      return;
    }

    void hydrateFromToken(stored).finally(() => setIsReady(true));
  }, [hydrateFromToken]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const { token: nextToken } = await loginRequest(payload);
      await hydrateFromToken(nextToken);
    },
    [hydrateFromToken],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await registerRequest(payload);
      await login({ email: payload.email, password: payload.password });
    },
    [login],
  );

  const role = user?.role ?? decodeJwt(token ?? "")?.role ?? null;

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      isReady,
      isAuthenticated: Boolean(token),
      isAdmin: role === "ADMIN",
      login,
      register,
      logout,
    }),
    [isReady, login, logout, register, role, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
