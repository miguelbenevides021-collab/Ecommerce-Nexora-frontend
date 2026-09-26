import { Package } from "lucide-react";

export function OrdersPage() {
  return (
    <section className="section-container py-16 md:py-20">
      <p className="text-sm font-medium tracking-wider text-nexora uppercase">
        Pedidos
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Meus pedidos</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        O histórico será listado com GET /orders. Esta rota já exige autenticação.
      </p>
      <div className="mt-8 flex max-w-md flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/40 px-6 py-16 text-center">
        <span className="mb-4 flex size-12 items-center justify-center rounded-xl border border-nexora/30 bg-nexora/10">
          <Package className="size-5 text-nexora" />
        </span>
        <p className="text-sm text-muted-foreground">Você ainda não fez pedidos.</p>
      </div>
    </section>
  );
}
