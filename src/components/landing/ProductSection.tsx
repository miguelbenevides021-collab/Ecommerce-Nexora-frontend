import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/landing/ProductCard";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/services/productService";
import { adaptProduct } from "@/lib/adaptProduct";
import type { Product } from "@/types";
import { Reveal } from "@/components/motion/Reveal";

export function ProductSection() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getProducts()
      .then((products) => {
        if (active) setFeaturedProducts(products.slice(0, 4).map(adaptProduct));
      })
      .catch(() => {
        if (active) setFeaturedProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="ofertas"
      className="border-y border-border/40 bg-secondary/20 py-16 md:py-20"
    >
      <div className="section-container">
        <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-12">
          <div className="space-y-3">
            <p className="text-sm font-medium tracking-wider text-nexora uppercase">
              Seleção especial
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Produtos em destaque
            </h2>
            <p className="max-w-lg text-muted-foreground">
              Os componentes mais procurados com condições exclusivas e entrega
              acelerada.
            </p>
          </div>
          <Button
            render={<Link to="/produtos" />}
            variant="outline"
            className="w-fit shrink-0 border-border/60 hover:border-nexora/40 hover:bg-nexora/5"
          >
            Ver todos
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? <p className="text-sm text-muted-foreground">Carregando produtos...</p> : null}
          {featuredProducts.map((product, index) => (
            <Reveal key={product.id} delay={(index % 4) * 70} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
          {!loading && featuredProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Não foi possível carregar os produtos agora.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
