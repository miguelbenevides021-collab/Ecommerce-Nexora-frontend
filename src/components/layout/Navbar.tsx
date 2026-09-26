import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, ShoppingCart, User, X, Zap } from "lucide-react"
import { navLinks } from "@/data/navigation"
import { SearchBar } from "@/components/layout/SearchBar"
import { Button } from "@/components/ui/button"
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
  const location = useLocation()

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
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
              aria-label="Minha conta"
            >
              <User className="size-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
              aria-label="Carrinho de compras"
            >
              <ShoppingCart className="size-5" />
              <span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-nexora text-[10px] font-bold text-primary-foreground">
                2
              </span>
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
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
          <a
            href="#"
            onClick={() => setMobileOpen(false)}
            className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <User className="size-4" />
            Minha conta
          </a>
        </nav>
      </div>
    </header>
  )
}
