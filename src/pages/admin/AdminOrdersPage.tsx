import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Eye,
  LoaderCircle,
  Package,
  Search,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { getAdminOrders, updateAdminOrderStatus } from "@/services/adminOrderService";
import type { Order, OrderStatus } from "@/types";

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Pendente" },
  { value: "PAID", label: "Pago" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELED", label: "Cancelado" },
];

const statusLabels = Object.fromEntries(
  statusOptions.map(({ value, label }) => [value, label]),
) as Record<OrderStatus, string>;

function formatDate(value?: string): string {
  if (!value) return "Data indisponível";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data indisponível";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date).replace(",", " às");
}

function getStatusVariant(status: OrderStatus): "nexora" | "secondary" | "outline" | "destructive" {
  if (status === "CANCELED") return "destructive";
  if (status === "PAID" || status === "DELIVERED") return "nexora";
  if (status === "SHIPPED") return "secondary";
  return "outline";
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "Não foi possível carregar os pedidos.";
}

export function AdminOrdersPage() {
  const { logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getAdminOrders();
      setOrders(
        [...data].sort(
          (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
        ),
      );
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        logout();
        return;
      }
      setLoadError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders, reloadKey]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      const matchesQuery = !query || [
        String(order.id),
        order.user?.name ?? "",
        order.user?.email ?? "",
      ].some((value) => value.toLocaleLowerCase("pt-BR").includes(query));
      return matchesStatus && matchesQuery;
    });
  }, [orders, search, statusFilter]);

  async function changeStatus(order: Order, nextStatus: OrderStatus) {
    if (order.status === nextStatus || updatingOrderId !== null) return;
    setUpdatingOrderId(order.id);
    setOperationError(null);
    setNotice(null);
    try {
      const updated = await updateAdminOrderStatus(order.id, nextStatus);
      setOrders((current) => current.map((item) =>
        item.id === order.id
          ? { ...item, status: updated.status, updatedAt: updated.updatedAt }
          : item,
      ));
      setSelectedOrder((current) => current?.id === order.id
        ? { ...current, status: updated.status, updatedAt: updated.updatedAt }
        : current,
      );
      setNotice(`Status do pedido #${order.id} atualizado para ${statusLabels[nextStatus]}.`);
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        logout();
      } else {
        setOperationError(error instanceof ApiError ? error.message : "Não foi possível atualizar o status.");
      }
    } finally {
      setUpdatingOrderId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gerenciar Pedidos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Consulte os pedidos da loja e atualize o andamento de cada compra.
        </p>
      </div>

      {notice ? (
        <div role="status" className="rounded-xl border border-nexora/30 bg-nexora/5 px-4 py-3 text-sm text-nexora">
          {notice}
        </div>
      ) : null}
      {operationError ? (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" /> {operationError}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por pedido ou cliente..."
            aria-label="Buscar pedidos"
            className="pl-9"
          />
        </div>
        <select
          aria-label="Filtrar por status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as OrderStatus | "ALL")}
          className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:w-52"
        >
          <option value="ALL">Todos os status</option>
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3" aria-label="Carregando pedidos">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-xl border border-border/50 bg-card/40" />
          ))}
        </div>
      ) : loadError ? (
        <Card className="border-destructive/30 bg-card/40">
          <CardContent className="flex flex-col items-start gap-3 p-6 sm:flex-row">
            <AlertCircle className="mt-0.5 size-5 text-destructive" />
            <div>
              <p className="font-medium">Não foi possível carregar os pedidos.</p>
              <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
              <Button variant="outline" className="mt-4" onClick={() => setReloadKey((key) => key + 1)}>
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <p className="rounded-xl border border-border/60 bg-card/40 px-5 py-12 text-center text-sm text-muted-foreground">
          Nenhum pedido encontrado.
        </p>
      ) : filteredOrders.length === 0 ? (
        <p className="rounded-xl border border-border/60 bg-card/40 px-5 py-12 text-center text-sm text-muted-foreground">
          Nenhum pedido corresponde aos filtros selecionados.
        </p>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-xl border border-border/60 md:block">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Pedido</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-border/50 bg-card/30">
                    <td className="px-4 py-4 font-semibold">#{order.id}</td>
                    <td className="max-w-56 px-4 py-4">
                      <p className="truncate font-medium">{order.user?.name ?? `Usuário #${order.userId}`}</p>
                      <p className="truncate text-xs text-muted-foreground">{order.user?.email ?? "E-mail indisponível"}</p>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-4">
                      <StatusControl order={order} updating={updatingOrderId === order.id} onChange={changeStatus} />
                    </td>
                    <td className="px-4 py-4 text-right font-semibold">{formatCurrency(Number(order.total))}</td>
                    <td className="px-4 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                        <Eye className="size-3.5" data-icon="inline-start" /> Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="border-border/60 bg-card/40">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold">Pedido #{order.id}</p>
                      <p className="truncate text-sm text-muted-foreground">{order.user?.name ?? `Usuário #${order.userId}`}</p>
                      <p className="truncate text-xs text-muted-foreground">{order.user?.email ?? "E-mail indisponível"}</p>
                    </div>
                    <p className="shrink-0 font-semibold">{formatCurrency(Number(order.total))}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                      <StatusControl order={order} updating={updatingOrderId === order.id} onChange={changeStatus} />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                      <Eye className="size-3.5" data-icon="inline-start" /> Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {selectedOrder ? (
        <OrderDetailsDialog
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          updating={updatingOrderId === selectedOrder.id}
          onStatusChange={changeStatus}
        />
      ) : null}
    </div>
  );
}

function StatusControl({
  order,
  updating,
  onChange,
}: {
  order: Order;
  updating: boolean;
  onChange: (order: Order, status: OrderStatus) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusVariant(order.status)}>{statusLabels[order.status]}</Badge>
      <select
        aria-label={`Alterar status do pedido ${order.id}`}
        value={order.status}
        disabled={updating}
        onChange={(event) => onChange(order, event.target.value as OrderStatus)}
        className="h-8 max-w-36 rounded-md border border-input bg-background px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-60"
      >
        {statusOptions.map((status) => (
          <option key={status.value} value={status.value}>{status.label}</option>
        ))}
      </select>
      {updating ? <LoaderCircle className="size-4 animate-spin text-nexora" /> : null}
    </div>
  );
}

function OrderDetailsDialog({
  order,
  onClose,
  updating,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  updating: boolean;
  onStatusChange: (order: Order, status: OrderStatus) => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="order-details-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border/60 bg-background p-5 shadow-2xl sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-nexora">Detalhes do pedido</p>
            <h3 id="order-details-title" className="mt-1 text-xl font-semibold">Pedido #{order.id}</h3>
          </div>
          <Button variant="ghost" size="icon" aria-label="Fechar detalhes" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-5 grid gap-4 rounded-xl border border-border/50 bg-secondary/20 p-4 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Cliente</p>
            <p className="mt-1 break-words font-medium">{order.user?.name ?? `Usuário #${order.userId}`}</p>
            <p className="break-words text-sm text-muted-foreground">{order.user?.email ?? "E-mail indisponível"}</p>
            <p className="mt-1 text-xs text-muted-foreground">ID do usuário: #{order.user?.id ?? order.userId}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pedido</p>
            <p className="mt-1 text-sm">Criado em {formatDate(order.createdAt)}</p>
            <p className="mt-1 text-sm">Status: {statusLabels[order.status]}</p>
            <p className="mt-1 text-sm font-semibold">Total: {formatCurrency(Number(order.total))}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="font-semibold">Produtos</h4>
            <StatusControl order={order} updating={updating} onChange={onStatusChange} />
          </div>
          <div className="space-y-3">
            {order.orderItem.map((item) => (
              <div key={item.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-border/50 bg-card/40 p-3 sm:gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-secondary/40 sm:size-16">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="size-full object-cover" />
                  ) : (
                    <Package className="size-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-medium">{item.product.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Quantidade: {item.quantity} · {formatCurrency(Number(item.price))} cada
                  </p>
                </div>
                <p className="shrink-0 text-right text-sm font-semibold">
                  {formatCurrency(Number(item.price) * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
