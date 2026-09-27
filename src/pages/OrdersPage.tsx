import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CircleAlert, Package, PackageCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { getOrders } from "@/services/orderService";
import type { Order, OrderStatus } from "@/types";

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

function formatDate(value?: string): string {
  if (!value) return "Data indisponível";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data indisponível";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "Não foi possível carregar seus pedidos.";
}

export function OrdersPage() {
  const { logout } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const navigationState = location.state as {
    orderCreated?: boolean;
    cartCleared?: boolean;
  } | null;
  const orderCreated = navigationState?.orderCreated;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    void getOrders()
      .then((data) => {
        if (!active) return;
        setOrders(
          [...data].sort(
            (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
          ),
        );
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        if (
          requestError instanceof ApiError &&
          (requestError.status === 401 || requestError.status === 403)
        ) {
          logout();
          return;
        }
        setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [logout, reloadKey]);

  return (
    <section className="section-container py-12 md:py-16">
      <p className="text-sm font-medium tracking-wider text-nexora uppercase">
        Minha conta
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Meus pedidos</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Acompanhe os pedidos realizados na sua conta.
      </p>

      {orderCreated ? (
        <div role="status" className="mt-6 flex items-center gap-3 rounded-xl border border-nexora/30 bg-nexora/5 px-4 py-3 text-sm">
          <PackageCheck className="size-5 shrink-0 text-nexora" />
          <span>
            Pedido realizado com sucesso.
            {navigationState?.cartCleared === false
              ? " O carrinho não pôde ser limpo; confira os itens antes de finalizar outra compra."
              : ""}
          </span>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8 space-y-4" aria-label="Carregando pedidos">
          {[1, 2].map((item) => (
            <div key={item} className="h-44 animate-pulse rounded-xl border border-border/50 bg-card/50" />
          ))}
        </div>
      ) : error ? (
        <Card className="mt-8 max-w-2xl border-destructive/30 bg-card/60">
          <CardContent className="flex flex-col items-start gap-3 p-6 sm:flex-row">
            <CircleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
            <div>
              <p className="font-medium">Não foi possível carregar seus pedidos.</p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              <Button className="mt-4" variant="outline" onClick={() => setReloadKey((key) => key + 1)}>
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card className="mt-8 max-w-xl border-border/60 bg-card/40">
          <CardContent className="flex flex-col items-center px-6 py-14 text-center">
            <span className="mb-4 flex size-12 items-center justify-center rounded-xl border border-nexora/30 bg-nexora/10">
              <Package className="size-5 text-nexora" />
            </span>
            <h2 className="text-lg font-semibold">Você ainda não possui pedidos.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Quando fizer uma compra, os detalhes aparecerão aqui.
            </p>
            <Button
              render={<Link to="/produtos" />}
              className="mt-6 bg-nexora text-primary-foreground hover:bg-nexora/90"
            >
              Continuar comprando
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </section>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Card className="min-w-0 border-border/60 bg-card/50">
      <CardHeader className="flex flex-col gap-3 border-b border-border/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <CardTitle className="text-base">Pedido #{order.id}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Realizado em {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge variant={order.status === "CANCELED" ? "outline" : "nexora"} className="w-fit">
          {statusLabels[order.status] ?? order.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        {order.orderItem.map((item) => (
          <div key={item.id} className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-secondary/40 sm:size-20">
              {item.product.imageUrl ? (
                <img src={item.product.imageUrl} alt={item.product.name} className="size-full object-cover" />
              ) : (
                <Package className="size-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="break-words text-sm font-medium">{item.product.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Quantidade: {item.quantity} · {formatCurrency(Number(item.price))} cada
              </p>
            </div>
            <p className="shrink-0 text-right text-sm font-semibold">
              {formatCurrency(Number(item.price) * item.quantity)}
            </p>
          </div>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-4">
          <span className="text-sm text-muted-foreground">Total do pedido</span>
          <span className="text-lg font-bold">{formatCurrency(Number(order.total))}</span>
        </div>
      </CardContent>
    </Card>
  );
}
