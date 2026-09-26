import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { featuredProducts } from "../../data/products";
import { ProductCard } from "@/components/landing/ProductCard";
import { Button } from "@/components/ui/button";

export function ProductSection() {
  return (
    <section
      id="ofertas"
      className="border-y border-border/40 bg-secondary/20 py-16 md:py-20"
    >
      <div className="section-container">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-12">
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
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
