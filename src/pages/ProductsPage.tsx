import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PackageSearch, SlidersHorizontal, Zap } from "lucide-react";
import { getProducts } from "@/services/productService";
import { adaptProduct } from "@/lib/adaptProduct";
import type { Product } from "@/types";
import { ProductCard } from "@/components/landing/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "destaque", label: "Em destaque" },
  { value: "preco-asc", label: "Menor preço" },
  { value: "preco-desc", label: "Maior preço" },
  { value: "desconto", label: "Maior desconto" },
  { value: "avaliacao", label: "Melhor avaliação" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

export function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setAllProducts(data.map(adaptProduct));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const query = searchParams.get("q")?.trim() ?? "";
  const categoria = searchParams.get("categoria") ?? "Todos";
  const sort = (searchParams.get("ordem") as SortValue) || "destaque";
  const onlyOffers = searchParams.get("ofertas") === "1";

  const allCategories = useMemo(
    () => ["Todos", ...Array.from(new Set(allProducts.map((p) => p.category)))],
    [allProducts],
  );

  const products = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      const matchesCategory =
        categoria === "Todos" || product.category === categoria;
      const matchesQuery =
        query.length === 0 ||
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase());
      const matchesOffers =
        !onlyOffers || Boolean(product.badge) || product.discount >= 25;
      return matchesCategory && matchesQuery && matchesOffers;
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "preco-asc":
          return a.currentPrice - b.currentPrice;
        case "preco-desc":
          return b.currentPrice - a.currentPrice;
        case "desconto":
          return b.discount - a.discount;
        case "avaliacao":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [allProducts, categoria, onlyOffers, query, sort]);

  function updateParams(updates: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "Todos") next.delete(key);
      else next.set(key, value);
    }
    setSearchParams(next);
  }

  if (loading) {
    return (
      <p className="section-container py-20 text-center">
        Carregando produtos...
      </p>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="pointer-events-none absolute inset-0 grid-pattern" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-nexora/8 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-56 w-56 rounded-full bg-nexora/5 blur-3xl" />

        <div className="section-container relative py-12 md:py-16">
          <div className="flex max-w-2xl flex-col gap-4">
            <Badge variant="nexora" className="w-fit gap-1.5 px-3 py-1">
              <Zap className="size-3" />
              Catálogo Nexora
            </Badge>
            <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl">
              Produtos para{" "}
              <span className="text-nexora nexora-text-glow">ir além.</span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Hardware premium, periféricos e componentes selecionados com o
              mesmo padrão da loja: entrega rápida e condições exclusivas.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border/40 bg-secondary/20 py-16 md:py-20">
        <div className="section-container">
          <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium tracking-wider text-nexora uppercase">
                Catálogo
              </p>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {onlyOffers ? "Ofertas da semana" : "Todos os produtos"}
              </h2>
              <p className="text-muted-foreground">
                {products.length}{" "}
                {products.length === 1
                  ? "item encontrado"
                  : "itens encontrados"}
                {query ? ` para "${query}"` : ""}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant={onlyOffers ? "default" : "outline"}
                className={cn(
                  "w-fit shrink-0",
                  onlyOffers
                    ? "bg-nexora text-primary-foreground hover:bg-nexora/90"
                    : "border-border/60 hover:border-nexora/40 hover:bg-nexora/5",
                )}
                onClick={() =>
                  updateParams({ ofertas: onlyOffers ? null : "1" })
                }
              >
                <SlidersHorizontal
                  className="size-4"
                  data-icon="inline-start"
                />
                Só ofertas
              </Button>

              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                Ordenar
                <select
                  value={sort}
                  onChange={(event) =>
                    updateParams({
                      ordem:
                        event.target.value === "destaque"
                          ? null
                          : event.target.value,
                    })
                  }
                  className="h-9 rounded-lg border border-border/60 bg-secondary/50 px-3 text-sm text-foreground outline-none transition-colors hover:border-nexora/30 focus-visible:border-nexora/50 focus-visible:ring-3 focus-visible:ring-nexora/20"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {allCategories.map((category) => {
              const isActive = categoria === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => updateParams({ categoria: category })}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "border-nexora/40 bg-nexora/10 text-nexora"
                      : "border-border/60 bg-card/50 text-muted-foreground hover:border-nexora/30 hover:bg-nexora/5 hover:text-foreground",
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/40 px-6 py-16 text-center">
              <span className="mb-4 flex size-12 items-center justify-center rounded-xl border border-nexora/30 bg-nexora/10">
                <PackageSearch className="size-5 text-nexora" />
              </span>
              <h3 className="text-lg font-semibold">
                Nenhum produto encontrado
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Ajuste os filtros ou limpe a busca para ver o catálogo completo.
              </p>
              <Button
                render={<Link to="/produtos" />}
                className="mt-6 bg-nexora text-primary-foreground hover:bg-nexora/90"
              >
                Ver todos os produtos
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
