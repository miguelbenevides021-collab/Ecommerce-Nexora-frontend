import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { AlertCircle, Check, LoaderCircle, Plus, Search, Tags, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { createAdminCategory, deleteAdminCategory } from "@/services/adminCategoryService";
import { getCategories } from "@/services/productService";
import type { ApiCategory } from "@/types";

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.status === 400) return "Preencha o nome e o slug da categoria.";
    if (error.status === 409) return "Categoria já existente. Confira o nome e o slug.";
    if (error.status >= 500) return "Erro ao criar categoria. Tente novamente em instantes.";
    return error.message;
  }
  return error instanceof Error ? error.message : fallback;
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiCategory | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setCategories(await getCategories());
    } catch (error) {
      setLoadError(errorMessage(error, "Não foi possível carregar as categorias."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    if (!query) return categories;
    return categories.filter((category) =>
      [String(category.id), category.name, category.slug]
        .some((value) => value.toLocaleLowerCase("pt-BR").includes(query)),
    );
  }, [categories, search]);

  function updateName(value: string) {
    setName(value);
    if (!slugEdited) setSlug(toSlug(value));
  }

  function openForm() {
    setName("");
    setSlug("");
    setSlugEdited(false);
    setFormError(null);
    setNotice(null);
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;
    setFormOpen(false);
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanSlug = slug.trim();
    if (!cleanName || !cleanSlug) {
      setFormError("Informe o nome e o slug da categoria.");
      return;
    }
    setSaving(true);
    setFormError(null);
    setNotice(null);
    try {
      const created = await createAdminCategory({ name: cleanName, slug: cleanSlug });
      setCategories((current) => [...current, created].sort((a, b) => a.id - b.id));
      setFormOpen(false);
      setName("");
      setSlug("");
      setSlugEdited(false);
      setNotice("Categoria criada com sucesso!");
    } catch (error) {
      setFormError(errorMessage(error, "Não foi possível criar a categoria."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    setNotice(null);
    try {
      await deleteAdminCategory(deleteTarget.id);
      setCategories((current) => current.filter((category) => category.id !== deleteTarget.id));
      setNotice(`Categoria “${deleteTarget.name}” excluída com sucesso.`);
      setDeleteTarget(null);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400) setDeleteError(error.message || "O ID da categoria é inválido.");
        else if (error.status === 404) setDeleteError(error.message || "Categoria não encontrada.");
        else if (error.status === 409) setDeleteError(error.message || "Não é possível remover uma categoria que possui produtos associados.");
        else if (error.status >= 500) setDeleteError(error.message || "Erro interno ao excluir a categoria.");
        else setDeleteError(error.message);
      } else {
        setDeleteError(error instanceof Error ? error.message : "Não foi possível excluir a categoria.");
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Categorias</h2>
          <p className="mt-1 text-sm text-muted-foreground">Organize as categorias usadas no catálogo de produtos.</p>
        </div>
        <Button onClick={openForm} className="bg-nexora text-primary-foreground hover:bg-nexora/90">
          <Plus className="size-4" data-icon="inline-start" /> Nova categoria
        </Button>
      </div>

      {notice ? <div role="status" className="flex items-center gap-2 rounded-xl border border-nexora/30 bg-nexora/5 px-4 py-3 text-sm"><Check className="size-4 text-nexora" />{notice}</div> : null}

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar categoria..." aria-label="Buscar categorias" className="pl-9" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card/40 py-16 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" />Carregando categorias...</div>
      ) : loadError ? (
        <Card className="border-destructive/30 bg-card/40"><CardContent className="flex flex-col items-start gap-3 p-6 sm:flex-row"><AlertCircle className="mt-0.5 size-5 text-destructive" /><div><p className="font-medium">Não foi possível carregar as categorias.</p><p className="mt-1 text-sm text-muted-foreground">{loadError}</p><Button variant="outline" className="mt-4" onClick={() => void loadCategories()}>Tentar novamente</Button></div></CardContent></Card>
      ) : categories.length === 0 ? (
        <Card className="border-border/60 bg-card/40"><CardContent className="flex flex-col items-center px-6 py-14 text-center"><span className="mb-4 flex size-12 items-center justify-center rounded-xl border border-nexora/30 bg-nexora/10"><Tags className="size-5 text-nexora" /></span><h3 className="font-semibold">Nenhuma categoria cadastrada.</h3><p className="mt-2 text-sm text-muted-foreground">Crie a primeira categoria para usar no catálogo.</p><Button onClick={openForm} className="mt-5 bg-nexora text-primary-foreground hover:bg-nexora/90"><Plus className="size-4" data-icon="inline-start" />Nova categoria</Button></CardContent></Card>
      ) : filteredCategories.length === 0 ? (
        <p className="rounded-xl border border-border/60 bg-card/40 px-5 py-10 text-center text-sm text-muted-foreground">Nenhuma categoria corresponde à busca.</p>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-border/60 bg-card/40 sm:block">
            <table className="w-full text-left text-sm"><thead className="border-b border-border/60 bg-secondary/30 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-5 py-3 font-medium">ID</th><th className="px-5 py-3 font-medium">Nome</th><th className="px-5 py-3 font-medium">Slug</th><th className="px-5 py-3 text-right font-medium">Ações</th></tr></thead><tbody className="divide-y divide-border/50">{filteredCategories.map((category) => <tr key={category.id} className="hover:bg-secondary/20"><td className="px-5 py-4 text-muted-foreground">{category.id}</td><td className="px-5 py-4 font-medium">{category.name}</td><td className="px-5 py-4 font-mono text-xs text-muted-foreground">{category.slug}</td><td className="px-5 py-3 text-right"><Button variant="ghost" size="icon" aria-label={`Excluir categoria ${category.name}`} onClick={() => { setDeleteError(null); setNotice(null); setDeleteTarget(category); }} className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="size-4" /></Button></td></tr>)}</tbody></table>
          </div>
          <div className="grid gap-3 sm:hidden">{filteredCategories.map((category) => <Card key={category.id} className="border-border/60 bg-card/40"><CardContent className="space-y-2 p-4"><div className="flex items-center justify-between gap-3"><span className="font-medium">{category.name}</span><span className="text-xs text-muted-foreground">ID {category.id}</span></div><div className="flex items-center justify-between gap-3"><p className="font-mono text-xs text-muted-foreground">{category.slug}</p><Button variant="ghost" size="icon" aria-label={`Excluir categoria ${category.name}`} onClick={() => { setDeleteError(null); setNotice(null); setDeleteTarget(category); }} className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="size-4" /></Button></div></CardContent></Card>)}</div>
        </>
      )}

      {formOpen ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="category-form-title" className="w-full max-w-lg rounded-t-2xl border border-border/60 bg-background p-5 shadow-2xl sm:rounded-2xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3"><div><h3 id="category-form-title" className="text-xl font-semibold">Nova categoria</h3><p className="mt-1 text-sm text-muted-foreground">Informe o nome e o identificador para a URL.</p></div><Button variant="ghost" size="icon" aria-label="Fechar formulário" onClick={closeForm} disabled={saving}><X className="size-4" /></Button></div>
            <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
              <label className="block space-y-2 text-sm font-medium" htmlFor="category-name">Nome<Input id="category-name" required maxLength={50} value={name} onChange={(event) => updateName(event.target.value)} placeholder="Placas de Vídeo" /></label>
              <label className="block space-y-2 text-sm font-medium" htmlFor="category-slug">Slug<Input id="category-slug" required maxLength={50} value={slug} onChange={(event) => { setSlugEdited(true); setSlug(toSlug(event.target.value)); }} placeholder="placas-de-video" /><span className="block text-xs font-normal text-muted-foreground">O slug é normalizado automaticamente e pode ser ajustado.</span></label>
              {formError ? <p role="alert" className="flex items-start gap-2 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" />{formError}</p> : null}
              <div className="flex flex-col-reverse gap-2 border-t border-border/50 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={closeForm} disabled={saving}>Cancelar</Button><Button type="submit" disabled={saving} className="bg-nexora text-primary-foreground hover:bg-nexora/90">{saving ? <LoaderCircle className="size-4 animate-spin" data-icon="inline-start" /> : <Check className="size-4" data-icon="inline-start" />}{saving ? "Criando..." : "Criar categoria"}</Button></div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div role="alertdialog" aria-modal="true" aria-labelledby="delete-category-title" className="w-full max-w-md rounded-2xl border border-border/60 bg-background p-6 shadow-2xl">
            <h3 id="delete-category-title" className="text-lg font-semibold">Excluir categoria</h3>
            <p className="mt-3 text-sm text-muted-foreground">Deseja excluir a categoria <span className="font-medium text-foreground">{deleteTarget.name}</span>? Essa ação não poderá ser desfeita.</p>
            {deleteError ? <p role="alert" className="mt-4 flex items-start gap-2 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" />{deleteError}</p> : null}
            <div className="mt-6 flex justify-end gap-2"><Button variant="outline" onClick={() => { if (!deleting) { setDeleteTarget(null); setDeleteError(null); } }} disabled={deleting}>Cancelar</Button><Button variant="destructive" onClick={() => void handleDelete()} disabled={deleting}>{deleting ? <LoaderCircle className="size-4 animate-spin" data-icon="inline-start" /> : <Trash2 className="size-4" data-icon="inline-start" />}{deleting ? "Excluindo..." : "Excluir categoria"}</Button></div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function toSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
