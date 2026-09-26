import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Tags } from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { to: "/admin/produtos", label: "Produtos", icon: Package },
  { to: "/admin/categorias", label: "Categorias", icon: Tags },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
];

export function AdminLayout() {
  return (
    <section className="section-container py-12 md:py-16">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl border border-nexora/30 bg-nexora/10">
          <LayoutDashboard className="size-5 text-nexora" />
        </span>
        <div>
          <p className="text-xs font-medium tracking-wider text-nexora uppercase">
            Área restrita
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Painel admin</h1>
        </div>
      </div>

      <nav className="mb-8 flex flex-wrap gap-2" aria-label="Admin">
        {adminLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-nexora/40 bg-nexora/10 text-nexora"
                  : "border-border/60 text-muted-foreground hover:border-nexora/30 hover:bg-nexora/5 hover:text-foreground",
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <Outlet />

      <p className="mt-10 text-xs text-muted-foreground">
        Ações de criação, edição e status serão conectadas às rotas{" "}
        <code className="text-nexora">/admin/*</code>.{" "}
        <Link to="/" className="underline hover:text-foreground">
          Voltar à loja
        </Link>
      </p>
    </section>
  );
}
