import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  CircleAlert,
  Hash,
  LoaderCircle,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { PageSpinner } from "@/components/layout/PageSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { getProfile } from "@/services/authService";
import { getOrders } from "@/services/orderService";
import type { Address, Order, User } from "@/types";

function formatCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date).replace(",", " às");
}

function getProfileError(error: unknown): string {
  if (error instanceof ApiError && error.status === 404) {
    return "Não encontramos os dados do seu perfil.";
  }
  if (error instanceof ApiError) return error.message;
  return "Não foi possível carregar seu perfil. Tente novamente em instantes.";
}

function getRoleLabel(role: User["role"]): string {
  return role === "ADMIN" ? "Administrador" : "Cliente";
}

function getOrderStatusLabel(status: Order["status"]): string {
  const labels: Record<Order["status"], string> = {
    PENDING: "Pendente",
    PAID: "Pago",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELED: "Cancelado",
  };
  return labels[status] ?? status;
}

export function ProfilePage() {
  const { logout } = useAuth();
  const {
    items: cartItems,
    isLoading: cartLoading,
    error: cartError,
    refresh: refreshCart,
  } = useCart();
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [ordersReloadKey, setOrdersReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    void getProfile()
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch((requestError: unknown) => {
        if (
          requestError instanceof ApiError &&
          (requestError.status === 401 || requestError.status === 403)
        ) {
          logout();
          return;
        }
        if (active) setError(getProfileError(requestError));
      });
    return () => {
      active = false;
    };
  }, [logout]);

  useEffect(() => {
    let active = true;
    setOrdersLoading(true);
    setOrdersError(null);
    void getOrders()
      .then((data) => {
        if (active) {
          setOrders(
            [...data].sort(
              (a, b) =>
                new Date(b.createdAt ?? 0).getTime() -
                new Date(a.createdAt ?? 0).getTime(),
            ),
          );
        }
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
        setOrdersError(
          requestError instanceof ApiError
            ? requestError.message
            : "Não foi possível carregar seus pedidos.",
        );
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });
    return () => {
      active = false;
    };
  }, [logout, ordersReloadKey]);

  if (!profile && !error) return <PageSpinner label="Carregando seu perfil..." />;

  return (
    <section className="section-container py-12 md:py-16">
      <p className="text-sm font-medium tracking-wider text-nexora uppercase">
        Minha conta
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Meu perfil</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Consulte as informações cadastradas na sua conta.
      </p>

      {error ? (
        <Card className="mt-8 max-w-2xl border-destructive/30 bg-card/60">
          <CardContent className="flex items-start gap-3 p-6">
            <CircleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
            <div>
              <p className="font-medium">Não foi possível carregar o perfil</p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              <Button render={<Link to="/" />} variant="outline" className="mt-4">
                Voltar para a loja
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : profile ? (
        <div className="mt-8 grid min-w-0 gap-5 lg:grid-cols-2">
          <Card className="min-w-0 border-border/60 bg-card/60">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-lg">Informações pessoais</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
              <ProfileField icon={UserRound} label="Nome" value={profile.name} />
              <ProfileField icon={Mail} label="E-mail" value={profile.email} />
              <ProfileField icon={Hash} label="CPF" value={formatCpf(profile.cpf)} />
              <ProfileField icon={ShieldCheck} label="Tipo de conta" value={getRoleLabel(profile.role)} />
            </CardContent>
          </Card>

          <Card className="min-w-0 border-border/60 bg-card/60">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="size-4 text-nexora" /> Endereços
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {profile.address?.length ? profile.address.map((address) => (
                <AddressCard key={address.id ?? `${address.rua}-${address.numero}`} address={address} />
              )) : (
                <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado.</p>
              )}
            </CardContent>
          </Card>

          <Card className="min-w-0 border-border/60 bg-card/60">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="size-4 text-nexora" /> Carrinho
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {cartLoading ? (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LoaderCircle className="size-4 animate-spin" /> Carregando carrinho...
                </p>
              ) : cartError ? (
                <div>
                  <p className="text-sm text-destructive">Não foi possível carregar o carrinho.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => void refreshCart().catch(() => undefined)}
                  >
                    Tentar novamente
                  </Button>
                </div>
              ) : cartItems.length ? (
                <>
                  <ul className="space-y-3">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex min-w-0 justify-between gap-3 text-sm">
                        <span className="min-w-0 break-words text-muted-foreground">
                          {item.product.name} <span className="whitespace-nowrap">× {item.quantity}</span>
                        </span>
                        <span className="shrink-0">
                          {formatCurrency(Number(item.product.price) * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="border-t border-border/50 pt-3 text-right text-sm font-semibold">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)} itens · {formatCurrency(
                      cartItems.reduce(
                        (sum, item) => sum + Number(item.product.price) * item.quantity,
                        0,
                      ),
                    )}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
              )}
            </CardContent>
          </Card>

          <Card className="min-w-0 border-border/60 bg-card/60">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="size-4 text-nexora" /> Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {ordersLoading ? (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LoaderCircle className="size-4 animate-spin" /> Carregando pedidos...
                </p>
              ) : ordersError ? (
                <div>
                  <p className="text-sm text-destructive">Não foi possível carregar os pedidos.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setOrdersReloadKey((key) => key + 1)}
                  >
                    Tentar novamente
                  </Button>
                </div>
              ) : orders.length ? orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              )) : (
                <p className="text-sm text-muted-foreground">Você ainda não possui pedidos.</p>
              )}
            </CardContent>
          </Card>

          <Card className="min-w-0 border-border/60 bg-card/60 lg:col-span-2">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarClock className="size-4 text-nexora" /> Informações da conta
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
              <ProfileField icon={Hash} label="ID do usuário" value={`#${profile.id}`} />
              <ProfileField icon={CalendarClock} label="Conta criada em" value={formatDate(profile.createdAt)} />
              <ProfileField icon={CalendarClock} label="Última atualização" value={formatDate(profile.updatedAt)} />
            </CardContent>
          </Card>
        </div>
      ) : null}
    </section>
  );
}

function AddressCard({ address }: { address: Address }) {
  const locality = [address.cidade, address.estado].filter(Boolean).join(" / ");
  return (
    <div className="rounded-xl border border-border/50 bg-secondary/20 p-4 text-sm">
      <p className="font-medium">{address.rua}, {address.numero}</p>
      <p className="mt-1 text-muted-foreground">
        {address.bairro}{locality ? ` · ${locality}` : ""}
      </p>
      <p className="mt-1 text-muted-foreground">CEP: {address.cep}</p>
      {address.complemento ? (
        <p className="mt-1 text-muted-foreground">Complemento: {address.complemento}</p>
      ) : null}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <div className="rounded-xl border border-border/50 bg-secondary/20 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium">Pedido #{order.id}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {getOrderStatusLabel(order.status)} · {formatDate(order.createdAt)}
          </p>
        </div>
        <p className="font-semibold">{formatCurrency(Number(order.total))}</p>
      </div>
      {order.orderItem?.length ? (
        <ul className="mt-3 space-y-2 border-t border-border/50 pt-3">
          {order.orderItem.map((item) => (
            <li key={item.id} className="flex min-w-0 justify-between gap-3 text-sm">
              <span className="min-w-0 break-words text-muted-foreground">
                {item.product.name} <span className="whitespace-nowrap">× {item.quantity}</span>
              </span>
              <span className="shrink-0">{formatCurrency(Number(item.price) * item.quantity)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-nexora/25 bg-nexora/10">
        <Icon className="size-4 text-nexora" />
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 break-words font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}
