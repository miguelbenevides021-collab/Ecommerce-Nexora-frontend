import { Link } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CheckoutPage() {
  return (
    <section className="section-container py-16 md:py-20">
      <p className="text-sm font-medium tracking-wider text-nexora uppercase">
        Checkout
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Finalizar compra</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        O pedido será criado com POST /orders a partir do carrinho autenticado.
      </p>
      <div className="mt-8 flex max-w-md flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/40 px-6 py-16 text-center">
        <span className="mb-4 flex size-12 items-center justify-center rounded-xl border border-nexora/30 bg-nexora/10">
          <CreditCard className="size-5 text-nexora" />
        </span>
        <p className="text-sm text-muted-foreground">
          Adicione itens ao carrinho para concluir o pedido.
        </p>
        <Button
          render={<Link to="/carrinho" />}
          className="mt-6 bg-nexora text-primary-foreground hover:bg-nexora/90"
        >
          Voltar ao carrinho
        </Button>
      </div>
    </section>
  );
}
