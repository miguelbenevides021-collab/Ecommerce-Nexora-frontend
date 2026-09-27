import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleAlert, CreditCard, LoaderCircle, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { PageSpinner } from "@/components/layout/PageSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { createOrder } from "@/services/orderService";

export function CheckoutPage() {
  const { items, isLoading, refresh, clearCart } = useCart();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  async function handleCreateOrder() {
    setSubmitting(true);
    setError(null);
    try {
      const order = await createOrder();
      let cartCleared = true;
      try {
        await clearCart();
      } catch {
        cartCleared = false;
      }
      navigate("/pedidos", {
        replace: true,
        state: { orderCreated: true, orderId: order.id, cartCleared },
      });
    } catch (requestError) {
      if (
        requestError instanceof ApiError &&
        (requestError.status === 401 || requestError.status === 403)
      ) {
        logout();
        return;
      }
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Não foi possível finalizar o pedido. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading && items.length === 0) {
    return <PageSpinner label="Preparando a finalização..." />;
  }

  return (
    <section className="section-container py-12 md:py-16">
      <p className="text-sm font-medium tracking-wider text-nexora uppercase">
        Checkout
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Finalizar compra</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Confira os itens e confirme seu pedido.
      </p>

      {error ? (
        <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
          <span className="text-destructive">{error}</span>
        </div>
      ) : null}

      {items.length === 0 ? (
        <Card className="mt-8 max-w-xl border-border/60 bg-card/40">
          <CardContent className="flex flex-col items-center px-6 py-14 text-center">
            <span className="mb-4 flex size-12 items-center justify-center rounded-xl border border-nexora/30 bg-nexora/10">
              <CreditCard className="size-5 text-nexora" />
            </span>
            <h2 className="text-lg font-semibold">Seu carrinho está vazio.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Adicione produtos antes de finalizar seu pedido.
            </p>
            <Button render={<Link to="/produtos" />} className="mt-6 bg-nexora text-primary-foreground hover:bg-nexora/90">
              Ver produtos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Card className="min-w-0 border-border/60 bg-card/50">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-lg">Itens do pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              {items.map((item) => (
                <div key={item.id} className="flex min-w-0 items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Package className="size-4 shrink-0 text-nexora" />
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {formatCurrency(Number(item.product.price))}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-semibold">
                    {formatCurrency(Number(item.product.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/50 lg:sticky lg:top-28">
            <CardContent className="space-y-4 p-5">
              <h2 className="text-lg font-semibold">Resumo</h2>
              <div className="flex justify-between border-t border-border/50 pt-4 font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                O backend confirmará o valor e criará o pedido a partir do seu carrinho autenticado.
              </p>
              <Button
                className="w-full bg-nexora text-primary-foreground hover:bg-nexora/90"
                disabled={submitting || isLoading}
                onClick={() => void handleCreateOrder()}
              >
                {submitting ? (
                  <LoaderCircle className="size-4 animate-spin" data-icon="inline-start" />
                ) : (
                  <CreditCard className="size-4" data-icon="inline-start" />
                )}
                {submitting ? "Finalizando..." : "Confirmar pedido"}
              </Button>
              <Button render={<Link to="/carrinho" />} variant="outline" className="w-full">
                Voltar ao carrinho
              </Button>
              {error ? (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setError(null);
                    void refresh().catch(() => undefined);
                  }}
                >
                  Atualizar carrinho
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
