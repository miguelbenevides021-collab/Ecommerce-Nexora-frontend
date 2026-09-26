export function AdminProductsPage() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
      <h2 className="text-lg font-semibold">Gerenciar produtos</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        POST, PUT e DELETE em /admin/products. Disponível apenas para usuários
        com role ADMIN.
      </p>
    </div>
  );
}

export function AdminCategoriesPage() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
      <h2 className="text-lg font-semibold">Gerenciar categorias</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        POST /admin/categories para criar novas categorias.
      </p>
    </div>
  );
}

export function AdminOrdersPage() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
      <h2 className="text-lg font-semibold">Pedidos da loja</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        GET /admin/orders e PATCH /admin/orders/:id para atualizar status.
      </p>
    </div>
  );
}
