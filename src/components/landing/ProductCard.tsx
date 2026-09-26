import { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card/50 transition-all duration-300",
        "hover:border-nexora/30 hover:bg-card hover:shadow-[0_8px_30px_oklch(0_0_0/20%)]",
      )}
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-secondary/60" />
        )}

        {product.badge && (
          <Badge
            variant={product.badge === "Oferta" ? "discount" : "nexora"}
            className="absolute top-3 left-3 z-10"
          >
            {product.badge}
          </Badge>
        )}

        <Badge variant="discount" className="absolute top-3 right-3 z-10">
          -{product.discount}%
        </Badge>

        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(
            "absolute right-3 bottom-3 z-10 bg-background/80 backdrop-blur-sm transition-all",
            "opacity-0 group-hover:opacity-100",
            isFavorite && "opacity-100 text-red-400",
          )}
          aria-label={
            isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          onClick={() => setIsFavorite((prev) => !prev)}
        >
          <Heart className={cn("size-4", isFavorite && "fill-current")} />
        </Button>

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-nexora-muted uppercase">
            {product.category}
          </p>
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3",
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30",
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        <div className="mt-auto space-y-1">
          <p className="text-xs text-muted-foreground line-through">
            {formatCurrency(product.oldPrice)}
          </p>
          <p className="text-xl font-bold text-foreground">
            {formatCurrency(product.currentPrice)}
          </p>
          <p className="text-xs text-muted-foreground">{product.installment}</p>
        </div>

        <Button
          className="mt-1 w-full bg-nexora/90 text-primary-foreground hover:bg-nexora"
          size="sm"
        >
          <ShoppingCart className="size-4" data-icon="inline-start" />
          Adicionar ao carrinho
        </Button>
      </div>
    </article>
  );
}
