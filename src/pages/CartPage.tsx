import { Link } from "react-router-dom";
import { LoaderCircle, Minus, PackageSearch, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { adaptProduct } from "@/lib/adaptProduct";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageSpinner } from "@/components/layout/PageSpinner";

export function CartPage() {
  const {
    items,
    isLoading,
    isMutating,
    error,
    refresh,
    updateQuantity,
    removeItem,
    clearError,
  } = useCart();

  const subtotal = items.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0,
  );

  if (isLoading && items.length === 0) {
    return <PageSpinner label="Carregando seu carrinho..." />;
  }

  return (
    <section className="section-container py-12 md:py-16">
      <p className="text-sm font-medium tracking-wider text-nexora uppercase">
        Minha conta
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Meu carrinho</h1>
      <p className="mt-3 text-muted-foreground">
        {items.reduce((total, item) => total + item.quantity, 0)} itens no carrinho
      </p>

      {error ? (
        <div role="alert" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
          <span className="text-destructive">{error}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading || isMutating}
            onClick={() => {
              clearError();
              void refresh().catch(() => undefined);
            }}
          >
            Tentar novamente
          </Button>
        </div>
      ) : null}

      {items.length === 0 && !error ? (
        <Card className="mt-8 max-w-xl border-border/60 bg-card/40">
          <CardContent className="flex flex-col items-center px-6 py-14 text-center">
            <span className="mb-4 flex size-12 items-center justify-center rounded-xl border border-nexora/30 bg-nexora/10">
              <ShoppingCart className="size-5 text-nexora" />
            </span>
            <h2 className="text-lg font-semibold">Seu carrinho está vazio.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore os produtos e adicione seus favoritos ao carrinho.
            </p>
            <Button
              render={<Link to="/produtos" />}
              className="mt-6 bg-nexora text-primary-foreground hover:bg-nexora/90"
            >
              Continuar comprando
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {items.length > 0 ? (
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-3">
            {items.map((item) => {
              const product = adaptProduct(item.product);
              const lineTotal = Number(item.product.price) * item.quantity;
              return (
                <Card key={item.id} className="border-border/60 bg-card/50">
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-secondary/40 sm:size-24">
                        {item.product.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} className="size-full object-cover" />
                        ) : (
                          <PackageSearch className="size-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-nexora">{product.category}</p>
                        <h2 className="mt-1 line-clamp-2 font-semibold">{item.product.name}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(Number(item.product.price))} cada</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                      <div className="flex items-center rounded-lg border border-border/60 bg-secondary/30">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Diminuir quantidade de ${item.product.name}`}
                          disabled={isMutating || item.quantity <= 1}
                          onClick={() => void updateQuantity(item.id, item.quantity - 1).catch(() => undefined)}
                        >
                          <Minus className="size-4" />
                        </Button>
                        <span className="min-w-9 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Aumentar quantidade de ${item.product.name}`}
                          disabled={isMutating}
                          onClick={() => void updateQuantity(item.id, item.quantity + 1).catch(() => undefined)}
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                      <p className="w-28 text-right font-semibold">{formatCurrency(lineTotal)}</p>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remover ${item.product.name} do carrinho`}
                        disabled={isMutating}
                        onClick={() => void removeItem(item.id).catch(() => undefined)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        {isMutating ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            <Button render={<Link to="/produtos" />} variant="outline" className="mt-2 border-border/60">
              Continuar comprando
            </Button>
          </div>

          <Card className="border-border/60 bg-card/50 lg:sticky lg:top-28">
            <CardContent className="space-y-4 p-5">
              <h2 className="text-lg font-semibold">Resumo do pedido</h2>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between border-t border-border/50 pt-4 font-semibold">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Frete e condições finais serão calculados na finalização do pedido.
              </p>
              <Button
                render={<Link to="/checkout" />}
                disabled={isMutating || isLoading}
                className="w-full bg-nexora text-primary-foreground hover:bg-nexora/90"
              >
                Finalizar pedido
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {isMutating ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground" role="status">
          <LoaderCircle className="size-4 animate-spin" /> Atualizando carrinho...
        </p>
      ) : null}
    </section>
  );
}
