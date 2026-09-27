import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronDown, LayoutDashboard, LogOut, Menu, ShoppingCart, User, X, Zap } from "lucide-react"
import { navLinks } from "@/data/navigation"
import { categories } from "@/data/categories"
import { SearchBar } from "@/components/layout/SearchBar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { cn } from "@/lib/utils"

function isLinkActive(href: string, pathname: string, search: string) {
  const [path, query = ""] = href.split("?")
  if (pathname !== path) return false

  const expected = new URLSearchParams(query)
  const current = new URLSearchParams(search)

  if ([...expected.keys()].length === 0) {
    return current.get("ofertas") !== "1" && !current.get("categoria")
  }

  return [...expected.entries()].every(
    ([key, value]) => current.get(key) === value
  )
}

function NexoraLogo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="NEXORA — Página inicial"
    >
      <span className="flex size-8 items-center justify-center rounded-lg border border-nexora/30 bg-nexora/10 transition-colors group-hover:border-nexora/50 group-hover:bg-nexora/15">
        <Zap className="size-4 text-nexora" strokeWidth={2.5} />
      </span>
      <span className="text-lg font-bold tracking-[0.2em] text-foreground">
        NEXORA
      </span>
    </Link>
  )
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const { count: cartCount } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="section-container">
        {/* Top bar */}
        <div className="flex h-16 items-center gap-4 lg:h-[4.5rem]">
          <NexoraLogo className="shrink-0" />

          <div className="hidden flex-1 lg:block lg:max-w-xl xl:max-w-2xl">
            <SearchBar />
          </div>

          <nav
            className="hidden items-center gap-1 xl:flex"
            aria-label="Categorias principais"
          >
            {navLinks.map((link) => {
              const active = isLinkActive(
                link.href,
                location.pathname,
                location.search
              )

              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    link.highlight
                      ? "text-nexora hover:bg-nexora/10"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    active && !link.highlight && "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              to="/produtos"
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === "/produtos" && !location.search.includes("ofertas=1")
                  ? "text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              Produtos
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
              onFocus={() => setCategoriesOpen(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setCategoriesOpen(false)
                }
              }}
            >
              <button
                type="button"
                aria-expanded={categoriesOpen}
                aria-haspopup="true"
                onClick={() => setCategoriesOpen((open) => !open)}
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === "/produtos" && !location.search.includes("ofertas=1")
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  categoriesOpen && "bg-secondary text-foreground",
                )}
              >
                Categorias
                <ChevronDown className={cn("size-4 transition-transform", categoriesOpen && "rotate-180")} />
              </button>
              {categoriesOpen ? (
                <div className="absolute left-1/2 top-full z-50 w-[min(48rem,calc(100vw-2rem))] -translate-x-1/2 pt-3">
                  <div className="rounded-2xl border border-border/60 bg-background/95 p-5 shadow-2xl backdrop-blur-xl md:p-6">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {[
                        { title: "Hardware", ids: ["processadores", "placas-video", "placas-mae", "memoria-ram", "armazenamento", "gabinetes", "fontes", "coolers"] },
                        { title: "Periféricos e monitores", ids: ["perifericos", "monitores", "acessorios"] },
                        { title: "Computadores", ids: ["pc-gamer"] },
                      ].map((group) => (
                        <div key={group.title}>
                          <p className="mb-3 text-xs font-semibold tracking-wider text-nexora uppercase">{group.title}</p>
                          <div className="flex flex-col gap-1">
                            {categories
                              .filter((category) => group.ids.includes(category.id))
                              .map((category) => {
                                const Icon = category.icon
                                return (
                                  <Link
                                    key={category.id}
                                    to={category.href}
                                    onClick={() => setCategoriesOpen(false)}
                                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/70"
                                  >
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-nexora/20 bg-nexora/5 text-nexora transition-colors group-hover:bg-nexora/10">
                                      <Icon className="size-4" />
                                    </span>
                                    <span className="min-w-0">
                                      <span className="block text-sm font-medium text-foreground">{category.name}</span>
                                      <span className="block truncate text-xs text-muted-foreground">{category.description}</span>
                                    </span>
                                  </Link>
                                )
                              })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/produtos"
                      onClick={() => setCategoriesOpen(false)}
                      className="mt-5 flex items-center justify-between border-t border-border/50 pt-4 text-sm font-medium text-nexora transition-colors hover:text-foreground"
                    >
                      Ver todos os produtos <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {isAdmin ? (
              <Button
                render={<Link to="/admin" />}
                variant="ghost"
                size="icon"
                className="hidden text-muted-foreground hover:text-nexora sm:inline-flex"
                aria-label="Painel admin"
              >
                <LayoutDashboard className="size-5" />
              </Button>
            ) : null}

            <Button
              render={
                <Link to={isAuthenticated ? "/perfil" : "/login"} />
              }
              variant="ghost"
              size="icon"
              className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
                aria-label={isAuthenticated ? "Meu perfil" : "Entrar"}
            >
              <User className="size-5" />
            </Button>

            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="icon"
                className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
                aria-label="Sair"
                onClick={logout}
              >
                <LogOut className="size-5" />
              </Button>
            ) : null}

            <Button
              render={<Link to="/carrinho" />}
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
              aria-label={`Carrinho de compras${cartCount ? `, ${cartCount} itens` : ""}`}
            >
              <ShoppingCart className="size-5" />
              {cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex min-w-4 items-center justify-center rounded-full bg-nexora px-1 text-[10px] leading-4 font-semibold text-primary-foreground">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground lg:hidden"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="pb-3 lg:hidden">
          <SearchBar compact />
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border/40 transition-all duration-300 lg:hidden",
          mobileOpen ? "max-h-[70rem] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav
          className="section-container flex flex-col gap-1 py-4"
          aria-label="Menu mobile"
        >
          {navLinks.map((link) => {
            const active = isLinkActive(
              link.href,
              location.pathname,
              location.search
            )

            return (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  link.highlight
                    ? "bg-nexora/10 text-nexora"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  active && !link.highlight && "bg-secondary text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            to="/produtos"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              location.pathname === "/produtos" && !location.search.includes("ofertas=1")
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            Produtos
          </Link>
          <div>
            <button
              type="button"
              aria-expanded={mobileCategoriesOpen}
              onClick={() => setMobileCategoriesOpen((open) => !open)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Categorias
              <ChevronDown className={cn("size-4 transition-transform", mobileCategoriesOpen && "rotate-180")} />
            </button>
            {mobileCategoriesOpen ? (
              <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-border/60 pl-3">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Link
                      key={category.id}
                      to={category.href}
                      onClick={() => {
                        setMobileOpen(false)
                        setMobileCategoriesOpen(false)
                      }}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Icon className="size-4 text-nexora" />
                      {category.name}
                    </Link>
                  )
                })}
              </div>
            ) : null}
          </div>
          {isAdmin ? (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-nexora hover:bg-nexora/10"
            >
              <LayoutDashboard className="size-4" />
              Painel admin
            </Link>
          ) : null}
          <Link
            to={isAuthenticated ? "/perfil" : "/login"}
            onClick={() => setMobileOpen(false)}
            className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            {isAuthenticated ? (
              <User className="size-4" />
            ) : (
              <User className="size-4" />
            )}
            {isAuthenticated ? "Meu perfil" : "Entrar"}
          </Link>
          {!isAuthenticated ? (
            <Link
              to="/registro"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              Criar conta
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                logout()
                setMobileOpen(false)
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
