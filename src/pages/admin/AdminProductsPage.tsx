import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  AlertCircle,
  Check,
  Image as ImageIcon,
  LoaderCircle,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import { ApiError } from "@/lib/api";
import { getCategories, getProducts } from "@/services/productService";
import {
  createAdminProduct,
  deleteAdminProduct,
  updateAdminProduct,
  type CreateProductPayload,
  type UpdateProductPayload,
} from "@/services/adminProductService";
import type { ApiCategory, ApiProduct } from "@/types";

interface ProductFormValues {
  categoriaId: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  brand: string;
  imageUrl: string;
}

const emptyForm: ProductFormValues = {
  categoriaId: "",
  name: "",
  description: "",
  price: "",
  stock: "",
  brand: "",
  imageUrl: "",
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  return error instanceof Error ? error.message : fallback;
}

function validImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ApiProduct | null>(null);
  const [form, setForm] = useState<ProductFormValues>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [productData, categoryData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productData);
      setCategories(categoryData);
    } catch (error) {
      setLoadError(getErrorMessage(error, "Não foi possível carregar os produtos."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    if (!query) return products;
    return products.filter((product) => {
      const category = categoryNames.get(product.categoriaId) ?? "";
      return [product.name, product.brand, category]
        .some((value) => value.toLocaleLowerCase("pt-BR").includes(query));
    });
  }, [categoryNames, products, search]);

  function openCreateForm() {
    setEditing(null);
    setForm({ ...emptyForm, categoriaId: categories[0] ? String(categories[0].id) : "" });
    setFormError(null);
    setOperationError(null);
    setNotice(null);
    setFormOpen(true);
  }

  function openEditForm(product: ApiProduct) {
    setEditing(product);
    setForm({
      categoriaId: String(product.categoriaId),
      name: product.name,
      description: product.description,
      price: String(Number(product.price)),
      stock: String(product.stock),
      brand: product.brand,
      imageUrl: product.imageUrl ?? "",
    });
    setFormError(null);
    setOperationError(null);
    setNotice(null);
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;
    setFormOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const price = Number(form.price);
    const stock = Number(form.stock);
    const categoriaId = Number(form.categoriaId);
    if (!Number.isFinite(price) || price < 0) {
      setFormError("Informe um preço válido, igual ou maior que zero.");
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setFormError("Informe um estoque válido, igual ou maior que zero.");
      return;
    }
    if (!editing && !Number.isInteger(categoriaId)) {
      setFormError("Selecione uma categoria.");
      return;
    }

    const commonPayload: UpdateProductPayload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      stock,
      brand: form.brand.trim(),
      imageUrl: form.imageUrl.trim(),
    };
    setSaving(true);
    setOperationError(null);
    setNotice(null);
    try {
      if (editing) {
        await updateAdminProduct(editing.id, commonPayload);
      } else {
        const payload: CreateProductPayload = {
          ...commonPayload,
          categoriaId,
        };
        await createAdminProduct(payload);
      }

      const successMessage = editing
        ? "Produto atualizado com sucesso."
        : "Produto criado com sucesso.";
      setFormOpen(false);
      setEditing(null);
      setForm(emptyForm);
      setNotice(successMessage);
      await loadData();
    } catch (error) {
      setFormError(
        getErrorMessage(error, editing
          ? "Não foi possível atualizar o produto."
          : "Não foi possível criar o produto."),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setOperationError(null);
    setNotice(null);
    try {
      await deleteAdminProduct(deleteTarget.id);
      setProducts((current) => current.filter((product) => product.id !== deleteTarget.id));
      setNotice(`Produto “${deleteTarget.name}” excluído com sucesso.`);
      setDeleteTarget(null);
      void loadData().catch(() => undefined);
    } catch (error) {
      setOperationError(getErrorMessage(error, "Não foi possível excluir o produto."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Produtos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Consulte e mantenha o catálogo da loja atualizado.
          </p>
        </div>
        <Button
          onClick={openCreateForm}
          disabled={loading || categories.length === 0}
          className="bg-nexora text-primary-foreground hover:bg-nexora/90"
        >
          <Plus className="size-4" data-icon="inline-start" /> Adicionar produto
        </Button>
      </div>

      {notice ? (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-nexora/30 bg-nexora/5 px-4 py-3 text-sm">
          <Check className="size-4 shrink-0 text-nexora" /> {notice}
        </div>
      ) : null}
      {operationError ? (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" /> {operationError}
        </div>
      ) : null}

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por produto, marca ou categoria..."
          aria-label="Buscar produtos"
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card/40 py-16 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" /> Carregando produtos...
        </div>
      ) : loadError ? (
        <Card className="border-destructive/30 bg-card/40">
          <CardContent className="flex flex-col items-start gap-3 p-6 sm:flex-row">
            <AlertCircle className="mt-0.5 size-5 text-destructive" />
            <div>
              <p className="font-medium">Não foi possível carregar os produtos.</p>
              <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
              <Button variant="outline" className="mt-4" onClick={() => void loadData()}>
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : products.length === 0 ? (
        <Card className="border-border/60 bg-card/40">
          <CardContent className="flex flex-col items-center px-6 py-14 text-center">
            <span className="mb-4 flex size-12 items-center justify-center rounded-xl border border-nexora/30 bg-nexora/10">
              <PackagePlus className="size-5 text-nexora" />
            </span>
            <h3 className="font-semibold">Nenhum produto cadastrado.</h3>
            <p className="mt-2 text-sm text-muted-foreground">Adicione o primeiro produto ao catálogo.</p>
            <Button onClick={openCreateForm} disabled={categories.length === 0} className="mt-5 bg-nexora text-primary-foreground hover:bg-nexora/90">
              Adicionar produto
            </Button>
          </CardContent>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <p className="rounded-xl border border-border/60 bg-card/40 px-5 py-10 text-center text-sm text-muted-foreground">
          Nenhum produto corresponde à busca.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductAdminCard
              key={product.id}
              product={product}
              category={categoryNames.get(product.categoriaId) ?? "Categoria indisponível"}
              onEdit={() => openEditForm(product)}
              onDelete={() => {
                setOperationError(null);
                setNotice(null);
                setDeleteTarget(product);
              }}
            />
          ))}
        </div>
      )}

      {formOpen ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="product-form-title" className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border/60 bg-background p-5 shadow-2xl sm:rounded-2xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 id="product-form-title" className="text-xl font-semibold">
                  {editing ? "Editar produto" : "Adicionar produto"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Preencha as informações do catálogo.
                </p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Fechar formulário" onClick={closeForm} disabled={saving}>
                <X className="size-4" />
              </Button>
            </div>

            <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Nome" htmlFor="product-name">
                  <Input id="product-name" required maxLength={60} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                </FormField>
                <FormField label="Marca" htmlFor="product-brand">
                  <Input id="product-brand" required maxLength={60} value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} />
                </FormField>
              </div>
              {!editing ? (
                <FormField label="Categoria" htmlFor="product-category">
                  <select
                    id="product-category"
                    required
                    value={form.categoriaId}
                    onChange={(event) => setForm({ ...form, categoriaId: event.target.value })}
                    className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="" disabled>Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </FormField>
              ) : null}
              <FormField label="Descrição" htmlFor="product-description">
                <textarea
                  id="product-description"
                  required
                  maxLength={500}
                  rows={4}
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  className="w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                />
              </FormField>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Preço (R$)" htmlFor="product-price">
                  <Input id="product-price" type="number" required min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
                </FormField>
                <FormField label="Estoque" htmlFor="product-stock">
                  <Input id="product-stock" type="number" required min="0" step="1" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
                </FormField>
              </div>
              <FormField label="URL da imagem" htmlFor="product-image">
                <Input id="product-image" type="url" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} placeholder="https://..." />
              </FormField>
              {form.imageUrl && validImageUrl(form.imageUrl) ? (
                <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/20 p-3">
                  <img src={form.imageUrl} alt="Prévia do produto" className="size-16 rounded-lg object-cover" />
                  <span className="text-xs text-muted-foreground">Prévia da imagem</span>
                </div>
              ) : null}
              {formError ? <p role="alert" className="text-sm text-destructive">{formError}</p> : null}
              <div className="flex flex-col-reverse gap-2 border-t border-border/50 pt-4 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={closeForm} disabled={saving}>Cancelar</Button>
                <Button type="submit" disabled={saving} className="bg-nexora text-primary-foreground hover:bg-nexora/90">
                  {saving ? <LoaderCircle className="size-4 animate-spin" data-icon="inline-start" /> : <Check className="size-4" data-icon="inline-start" />}
                  {saving ? "Salvando..." : editing ? "Salvar alterações" : "Criar produto"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div role="alertdialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-md rounded-2xl border border-border/60 bg-background p-6 shadow-2xl">
            <h3 id="delete-title" className="text-lg font-semibold">Excluir produto</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Tem certeza que deseja excluir <span className="font-medium text-foreground">{deleteTarget.name}</span>? Essa ação não poderá ser desfeita.
            </p>
            {operationError ? <p role="alert" className="mt-3 text-sm text-destructive">{operationError}</p> : null}
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancelar</Button>
              <Button variant="destructive" onClick={() => void handleDelete()} disabled={deleting}>
                {deleting ? <LoaderCircle className="size-4 animate-spin" data-icon="inline-start" /> : <Trash2 className="size-4" data-icon="inline-start" />}
                {deleting ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProductAdminCard({
  product,
  category,
  onEdit,
  onDelete,
}: {
  product: ApiProduct;
  category: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="min-w-0 border-border/60 bg-card/50">
      <CardContent className="flex h-full flex-col gap-4 p-4">
        <div className="flex min-w-0 gap-4">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-secondary/30 sm:size-24">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="size-full object-cover" />
            ) : (
              <ImageIcon className="size-6 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-nexora">{category}</p>
            <h3 className="mt-1 break-words font-semibold">{product.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{product.brand}</p>
          </div>
        </div>
        <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">{product.description}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
          <div>
            <p className="font-semibold">{formatCurrency(Number(product.price))}</p>
            <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="mt-1">
              Estoque: {product.stock}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit} aria-label={`Editar ${product.name}`}>
              <Pencil className="size-3.5" data-icon="inline-start" /> Editar
            </Button>
            <Button variant="destructive" size="icon" onClick={onDelete} aria-label={`Excluir ${product.name}`}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
