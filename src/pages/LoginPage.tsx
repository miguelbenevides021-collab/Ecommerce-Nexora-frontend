import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, LogIn } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string; search?: string } } | null)
      ?.from?.pathname ?? "/";
  const fromSearch =
    (location.state as { from?: { search?: string } } | null)?.from?.search ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email: email.trim(), password });
      navigate(`${from}${fromSearch}`, { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível entrar. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      badge="Área do cliente"
      title={
        <>
          Acesse sua <span className="text-nexora nexora-text-glow">conta.</span>
        </>
      }
      description="Entre para gerenciar pedidos, finalizar compras e acompanhar seu setup."
    >
      <Card className="border border-border/60 bg-card/70 ring-1 ring-nexora/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Entrar</CardTitle>
          <CardDescription>
            Use o e-mail e a senha cadastrados na Nexora.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            {error ? (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@email.com"
                className="h-11"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="h-11"
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4 border-t border-border/40 bg-transparent">
            <Button
              type="submit"
              disabled={loading}
              className="h-11 bg-nexora text-primary-foreground hover:bg-nexora/90"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
              ) : (
                <LogIn className="size-4" data-icon="inline-start" />
              )}
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Ainda não tem conta?{" "}
              <Link
                to="/registro"
                className="font-medium text-nexora hover:underline"
              >
                Criar conta
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  );
}
