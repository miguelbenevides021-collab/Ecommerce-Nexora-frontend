import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Heart,
  LoaderCircle,
  Minus,
  PackageCheck,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { categories as localCategories } from "@/data/categories";
import { adaptProduct } from "@/lib/adaptProduct";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { getCategories, getProductById } from "@/services/productService";
import type { ApiCategory, ApiProduct } from "@/types";

export function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { addItem, isMutating } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const id = Number(productId);
    if (!Number.isInteger(id) || id < 1) {
      setLoadError("Produto não encontrado.");
      setLoading(false);
      return () => { active = false; };
    }

    setLoading(true);
    setLoadError(null);
    void Promise.all([getProductById(id), getCategories().catch(() => [] as ApiCategory[])])
      .then(([productData, categories]) => {
        if (!active) return;
        setProduct(productData);
        setCategoryName(
          categories.find((category) => category.id === productData.categoriaId)?.name ??
            localCategories.find((category) => category.categoryId === productData.categoriaId)?.name ??
            null,
        );
        setQuantity(1);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(
          error instanceof ApiError && error.status === 404
            ? "Este produto não foi encontrado ou não está mais disponível."
            : error instanceof Error
              ? error.message
              : "Não foi possível carregar este produto.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [productId]);

  async function handleAddToCart() {
    if (!product) return;
    setAddError(null);
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    setAdding(true);
    try {
      await addItem(adaptProduct(product), quantity);
    } catch (error) {
      setAddError(error instanceof Error ? error.message : "Não foi possível adicionar o produto ao carrinho.");
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return <div className="section-container flex min-h-[55vh] items-center justify-center gap-3 text-muted-foreground"><LoaderCircle className="size-5 animate-spin text-nexora" />Carregando produto...</div>;
  }

  if (loadError || !product) {
    return (
      <section className="section-container py-16 sm:py-24">
        <Card className="mx-auto max-w-xl border-border/60 bg-card/40"><CardContent className="flex flex-col items-center px-6 py-12 text-center">
          <span className="mb-4 flex size-12 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10"><AlertCircle className="size-5 text-destructive" /></span>
          <h1 className="text-2xl font-bold">Não foi possível encontrar o produto</h1>
          <p className="mt-2 text-sm text-muted-foreground">{loadError ?? "Este produto não está disponível."}</p>
          <Button render={<Link to="/produtos" />} className="mt-6 bg-nexora text-primary-foreground hover:bg-nexora/90"><ArrowLeft className="size-4" data-icon="inline-start" />Voltar para produtos</Button>
        </CardContent></Card>
      </section>
    );
  }

  const available = product.stock > 0;
  const favorite = isFavorite(product.id);
  const productPrice = Number(product.price);
  const oldPrice = product.oldPrice === undefined ? null : Number(product.oldPrice);
  const offer = oldPrice !== null && Number.isFinite(oldPrice) && oldPrice > productPrice;
  const discount = offer && oldPrice ? Math.round((1 - productPrice / oldPrice) * 100) : 0;

  return (
    <section className="section-container py-8 sm:py-12">
      <Button render={<Link to="/produtos" />} variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" data-icon="inline-start" />Voltar para produtos</Button>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative flex min-h-72 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-secondary/30 p-6 sm:min-h-[480px] sm:p-10">
          {discount > 0 ? <Badge variant="discount" className="absolute top-4 left-4 z-10">-{discount}%</Badge> : null}
          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="max-h-[440px] w-full object-contain" /> : <div className="flex flex-col items-center gap-3 text-muted-foreground"><PackageCheck className="size-12" /><span className="text-sm">Imagem indisponível</span></div>}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-3">
            {categoryName ? <Badge variant="nexora">{categoryName}</Badge> : <Badge variant="secondary">Categoria #{product.categoriaId}</Badge>}
            <Button variant="outline" size="icon" aria-pressed={favorite} aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"} onClick={() => toggleFavorite(product.id)} className={favorite ? "border-red-400/40 text-red-400 hover:text-red-300" : ""}><Heart className={favorite ? "size-4 fill-current" : "size-4"} /></Button>
          </div>

          <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-nexora uppercase">{product.brand}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Star className="size-4 text-amber-400" />{typeof product.rating === "number" ? <span>{product.rating.toFixed(1)}{typeof product.reviewCount === "number" ? ` (${product.reviewCount} avaliações)` : ""}</span> : <span>Avaliações não disponíveis</span>}</div>

          <div className="mt-7 rounded-xl border border-border/50 bg-card/40 p-5">
            {offer && oldPrice !== null ? <p className="text-sm text-muted-foreground line-through">{formatCurrency(oldPrice)}</p> : null}
            <p className="mt-1 text-3xl font-bold text-foreground">{formatCurrency(productPrice)}</p>
            {discount > 0 && oldPrice !== null ? <Badge variant="discount" className="mt-2">Economize {formatCurrency(oldPrice - productPrice)}</Badge> : null}
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm">
            <span className={`size-2 rounded-full ${available ? "bg-emerald-400" : "bg-destructive"}`} />
            {available ? `${product.stock} unidade${product.stock === 1 ? "" : "s"} disponível${product.stock === 1 ? "" : "is"}` : "Produto indisponível no momento"}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="flex h-11 w-fit items-center rounded-lg border border-border/60">
              <Button variant="ghost" size="icon" aria-label="Diminuir quantidade" onClick={() => setQuantity((current) => Math.max(1, current - 1))} disabled={quantity <= 1}><Minus className="size-4" /></Button>
              <span aria-live="polite" className="w-10 text-center text-sm font-medium">{quantity}</span>
              <Button variant="ghost" size="icon" aria-label="Aumentar quantidade" onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))} disabled={!available || quantity >= product.stock}><Plus className="size-4" /></Button>
            </div>
            <Button onClick={() => void handleAddToCart()} disabled={!available || adding || isMutating} className="h-11 flex-1 bg-nexora text-primary-foreground hover:bg-nexora/90">
              {adding || isMutating ? <LoaderCircle className="size-4 animate-spin" data-icon="inline-start" /> : <ShoppingCart className="size-4" data-icon="inline-start" />}
              {adding ? "Adicionando..." : "Adicionar ao carrinho"}
            </Button>
          </div>
          {addError ? <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" />{addError}</p> : null}

          <div className="mt-8 border-t border-border/50 pt-6">
            <h2 className="text-lg font-semibold">Descrição</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{product.description || "Este produto ainda não possui descrição."}</p>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-border/50 bg-card/30 p-3"><dt className="text-xs text-muted-foreground">Código do produto</dt><dd className="mt-1 font-medium">#{product.id}</dd></div>
            <div className="rounded-lg border border-border/50 bg-card/30 p-3"><dt className="text-xs text-muted-foreground">Marca</dt><dd className="mt-1 font-medium">{product.brand}</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
