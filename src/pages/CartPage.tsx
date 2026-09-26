import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartPage() {
  return (
    <section className="section-container py-16 md:py-20">
      <p className="text-sm font-medium tracking-wider text-nexora uppercase">
        Carrinho
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Seu carrinho</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Os itens do carrinho serão carregados da API autenticada. Esta tela já
        exige login.
      </p>
      <div className="mt-8 flex max-w-md flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/40 px-6 py-16 text-center">
        <span className="mb-4 flex size-12 items-center justify-center rounded-xl border border-nexora/30 bg-nexora/10">
          <ShoppingCart className="size-5 text-nexora" />
        </span>
        <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
        <Button
          render={<Link to="/produtos" />}
          className="mt-6 bg-nexora text-primary-foreground hover:bg-nexora/90"
        >
          Ver produtos
        </Button>
      </div>
    </section>
  );
}
