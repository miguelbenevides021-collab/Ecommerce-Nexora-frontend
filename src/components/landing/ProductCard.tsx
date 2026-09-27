import { useState } from "react";
import { Heart, LoaderCircle, ShoppingCart, Star } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { addItem, isMutating } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleAddToCart() {
    setAddError(null);
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setIsAdding(true);
    try {
      await addItem(product);
    } catch (error) {
      setAddError(
        error instanceof Error
          ? error.message
          : "Não foi possível adicionar o produto ao carrinho.",
      );
    } finally {
      setIsAdding(false);
    }
  }

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

        {product.discount > 0 ? (
          <Badge variant="discount" className="absolute top-3 right-3 z-10">
            -{product.discount}%
          </Badge>
        ) : null}

        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(
            "absolute right-3 bottom-3 z-10 bg-background/80 backdrop-blur-sm transition-all",
            "opacity-0 group-hover:opacity-100",
            favorite && "opacity-100 text-red-400",
          )}
          aria-label={
            favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          onClick={() => toggleFavorite(product.id)}
        >
          <Heart className={cn("size-4", favorite && "fill-current")} />
        </Button>

        <Link to={`/products/${product.id}`} aria-label={`Ver ${product.name}`} className="block h-full w-full">
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
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-nexora-muted uppercase">
            {product.category}
          </p>
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold hover:text-nexora">
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>
        </div>

        {product.reviewCount > 0 ? (
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
        ) : null}

        <div className="mt-auto space-y-1">
          {product.oldPrice > product.currentPrice ? (
            <p className="text-xs text-muted-foreground line-through">
              {formatCurrency(product.oldPrice)}
            </p>
          ) : null}
          <p className="text-xl font-bold text-foreground">
            {formatCurrency(product.currentPrice)}
          </p>
          <p className="text-xs text-muted-foreground">{product.installment}</p>
        </div>

        <Button
          className="mt-1 w-full bg-nexora/90 text-primary-foreground hover:bg-nexora"
          size="sm"
          disabled={isAdding || isMutating || !/^\d+$/.test(product.id)}
          onClick={handleAddToCart}
        >
          {isAdding ? (
            <LoaderCircle className="size-4 animate-spin" data-icon="inline-start" />
          ) : (
            <ShoppingCart className="size-4" data-icon="inline-start" />
          )}
          {/^\d+$/.test(product.id)
            ? isAdding
              ? "Adicionando..."
              : "Adicionar ao carrinho"
            : "Indisponível"}
        </Button>
        {addError ? (
          <p role="alert" className="text-xs text-destructive">
            {addError}
          </p>
        ) : null}
      </div>
    </article>
  );
}
