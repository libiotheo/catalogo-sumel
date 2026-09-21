import { createFileRoute, Link, useSearchFilters } from "@tanstack/react-router";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { empresa } from "@/config/empresa";
import { CATEGORY_LABELS } from "@/types";
import type { Category } from "@/types";
import productsData from "@/data/products.json";
import type { Product } from "@/types";
import { Header } from "@/components/layout/Header";
import { useCart } from "@/hooks/useCart";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { toast } from "sonner";

const products = productsData as Product[];

type SortOption = "relevancia" | "menor-preco" | "maior-preco" | "nome";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevancia", label: "Relevância" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "nome", label: "Nome A–Z" },
];

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

// Sem subcategorias no dataset atual — filtro desativado
function getSubcategories(_cat: Category) {
  return [];
}

function allSubcategories(cat: Category) {
  return [{ slug: "todos", label: "Todas" }, ...getSubcategories(cat)];
}

function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const Route = createFileRoute("/produtos")({
  validateSearch: (search: Record<string, unknown>) => ({
    categoria: (search.categoria as Category | "todos") ?? "todos",
    subcategoria: (search.subcategoria as string) ?? "todos",
    precoMin: search.precoMin ? Number(search.precoMin) : undefined,
    precoMax: search.precoMax ? Number(search.precoMax) : undefined,
    disponivel: search.disponivel === "true",
    ordenacao: (search.ordenacao as SortOption) ?? "relevancia",
    busca: (search.busca as string) ?? "",
  }),
  head: () => ({
    meta: [
      { title: `Produtos — ${empresa.nome}` },
      { name: "description", content: "Catálogo completo de produtos da Sumel." },
    ],
  }),
  component: ProdutosPage,
});

function ProdutosPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [localBusca, setLocalBusca] = useState(search.busca);
  const { addItem, isInCart, getQuantity, updateQuantity, totalItems } = useCart();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local busca with URL param
  useEffect(() => {
    setLocalBusca(search.busca);
  }, [search.busca]);

  // Sync URL params (from header search redirect)
  const updateFilter = useCallback(
    (patch: Partial<typeof search>) => {
      navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });
    },
    [navigate]
  );

  // Debounce URL sync for local busca
  const handleBuscaChange = useCallback(
    (value: string) => {
      setLocalBusca(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateFilter({ busca: value });
      }, 300);
    },
    [updateFilter]
  );

  // Max price in data
  const maxPriceInData = useMemo(
    () => Math.ceil(Math.max(...products.map((p) => p.price)) / 100) * 100,
    []
  );

  // Filtered + sorted products
  const filtered = useMemo(() => {
    let list = [...products];

    // Categoria
    if (search.categoria !== "todos") {
      list = list.filter((p) => p.category === search.categoria);
    }

    // Busca
    if (search.busca.trim()) {
      const q = normalize(search.busca);
      list = list.filter(
        (p) =>
          normalize(p.name).includes(q) ||
          normalize(p.description).includes(q) ||
          normalize(p.unit).includes(q)
      );
    }

    // Preço
    if (search.precoMin != null) {
      list = list.filter((p) => p.price >= search.precoMin! * 100);
    }
    if (search.precoMax != null) {
      list = list.filter((p) => p.price <= search.precoMax! * 100);
    }

    // Disponibilidade
    if (search.disponivel) {
      list = list.filter((p) => p.disponivel !== false);
    }

    // Ordenação
    switch (search.ordenacao) {
      case "menor-preco":
        list.sort((a, b) => a.price - b.price);
        break;
      case "maior-preco":
        list.sort((a, b) => b.price - a.price);
        break;
      case "nome":
        list.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
        break;
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return list;
  }, [search]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search.categoria !== "todos") count++;
    if (search.subcategoria !== "todos") count++;
    if (search.precoMin != null) count++;
    if (search.precoMax != null) count++;
    if (search.disponivel) count++;
    if (search.ordenacao !== "relevancia") count++;
    return count;
  }, [search]);

  const currentSubcategories = search.categoria !== "todos"
    ? allSubcategories(search.categoria as Category)
    : [];

  // ── Filters sidebar (desktop) ──────────────────────────────────
  function FilterSidebar() {
    return (
      <aside className="w-52 shrink-0 space-y-6">
        {/* Categoria */}
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoria</legend>
          <div className="space-y-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="categoria"
                checked={search.categoria === "todos"}
                onChange={() => updateFilter({ categoria: "todos", subcategoria: "todos" })}
                className="accent-primary"
              />
              <span className="text-sm">Todas</span>
            </label>
            {(["confeitaria", "guloseimas", "embalagens"] as Category[]).map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="categoria"
                  checked={search.categoria === cat}
                  onChange={() => updateFilter({ categoria: cat, subcategoria: "todos" })}
                  className="accent-primary"
                />
                <span className="text-sm">{CATEGORY_LABELS[cat]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Subcategoria (só se categoria selecionada) */}
        {currentSubcategories.length > 0 && (
          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subcategoria</legend>
            <div className="space-y-1">
              {currentSubcategories.map((sub) => (
                <label key={sub.slug} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="subcategoria"
                    checked={search.subcategoria === sub.slug}
                    onChange={() => updateFilter({ subcategoria: sub.slug })}
                    className="accent-primary"
                  />
                  <span className="text-sm">{sub.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {/* Faixa de preço */}
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Faixa de Preço</legend>
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="sr-only" htmlFor="preco-min">Preço mínimo</label>
                <input
                  id="preco-min"
                  type="number"
                  min={0}
                  placeholder="Mín"
                  value={search.precoMin ?? ""}
                  onChange={(e) =>
                    updateFilter({ precoMin: e.target.value ? Number(e.target.value) : undefined })
                  }
                  className="w-full rounded-lg border border-input bg-card px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <span className="self-center text-muted-foreground">—</span>
              <div className="flex-1">
                <label className="sr-only" htmlFor="preco-max">Preço máximo</label>
                <input
                  id="preco-max"
                  type="number"
                  min={0}
                  placeholder="Máx"
                  value={search.precoMax ?? ""}
                  onChange={(e) =>
                    updateFilter({ precoMax: e.target.value ? Number(e.target.value) : undefined })
                  }
                  className="w-full rounded-lg border border-input bg-card px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={maxPriceInData}
              step={100}
              value={search.precoMax ?? maxPriceInData}
              onChange={(e) => updateFilter({ precoMax: Number(e.target.value) })}
              className="w-full accent-primary"
              aria-label="Preço máximo"
            />
          </div>
        </fieldset>

        {/* Disponível */}
        <fieldset>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={search.disponivel}
              onChange={(e) => updateFilter({ disponivel: e.target.checked })}
              className="accent-primary"
            />
            <span className="text-sm font-medium">Somente disponíveis</span>
          </label>
        </fieldset>

        {/* Ordenação */}
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ordenar por</legend>
          <select
            value={search.ordenacao}
            onChange={(e) => updateFilter({ ordenacao: e.target.value as SortOption })}
            className="w-full rounded-lg border border-input bg-card px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </fieldset>

        {activeFilterCount > 0 && (
          <button
            onClick={() =>
              updateFilter({
                categoria: "todos",
                subcategoria: "todos",
                precoMin: undefined,
                precoMax: undefined,
                disponivel: false,
                ordenacao: "relevancia",
              })
            }
            className="w-full rounded-lg border border-destructive/40 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Limpar filtros
          </button>
        )}
      </aside>
    );
  }

  // ── Mobile filter button ───────────────────────────────────────
  function FilterToggleBtn() {
    return (
      <button
        onClick={() => setFiltersOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtros
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {activeFilterCount}
          </span>
        )}
      </button>
    );
  }

  // ── Product card ───────────────────────────────────────────────
  function ProductCard({ product }: { product: Product }) {
    const unavailable = product.disponivel === false;
    return (
      <article className={`overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${unavailable ? "opacity-70" : ""}`}>
        <Link
          to={`/produto/${product.slug}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={product.imageUrl}
              alt={`Foto de ${product.name}`}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
            {unavailable && (
              <span className="absolute top-2 left-2 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">
                Indisponível
              </span>
            )}
          </div>
        </Link>
        <div className="p-3">
          <Link
            to={`/produto/${product.slug}`}
            className="block font-heading text-sm font-semibold text-card-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 py-0.5 -mx-1 -my-0.5"
          >
            {product.name}
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">por {product.unit}</p>
          <p className="mt-1 text-base font-bold text-primary">{formatPrice(product.price)}</p>
          {product.minQuantity && product.minQuantity > 1 && (
            <p className="mt-0.5 text-xs text-amber-600">Mín. {product.minQuantity}</p>
          )}

          {!unavailable && (
            isInCart(product.id) ? (
              <div className="mt-2 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const current = getQuantity(product.id);
                    if (current > 1) updateQuantity(product.id, current - 1);
                    else updateQuantity(product.id, 0);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Diminuir quantidade"
                >
                  −
                </button>
                <span className="text-sm font-medium">{getQuantity(product.id)}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    updateQuantity(product.id, getQuantity(product.id) + 1);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addItem(product, product.minQuantity || 1);
                  toast.success(`${product.name} adicionado ao carrinho`);
                }}
                className="mt-2 w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Adicionar
              </button>
            )
          )}
        </div>
      </article>
    );
  }



  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-4">
        {/* Título */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Catálogo de atacado</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} de {products.length} produtos
            </p>
          </div>
          <FilterToggleBtn />
        </div>

        {/* Layout: sidebar + grid */}
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          {/* Grid */}
          <div className="flex-1">
            {/* Busca local + ordenação */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  placeholder="Buscar produto, marca ou categoria..."
                  value={localBusca}
                  onChange={(e) => handleBuscaChange(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card py-3 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Buscar produtos neste filtro"
                />
              </div>
              <select
                value={search.ordenacao}
                onChange={(e) => updateFilter({ ordenacao: e.target.value as SortOption })}
                className="rounded-xl border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Ordenar produtos"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Chips de filtros ativos */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {search.categoria !== "todos" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {CATEGORY_LABELS[search.categoria as Category]}
                    <button onClick={() => updateFilter({ categoria: "todos", subcategoria: "todos" })} className="ml-1 hover:text-primary/70" aria-label="Remover filtro de categoria">×</button>
                  </span>
                )}
                {search.disponivel && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Disponíveis
                    <button onClick={() => updateFilter({ disponivel: false })} className="ml-1 hover:text-primary/70" aria-label="Remover filtro de disponibilidade">×</button>
                  </span>
                )}
                {search.precoMin != null && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    R$ {search.precoMin}+
                    <button onClick={() => updateFilter({ precoMin: undefined })} className="ml-1 hover:text-primary/70" aria-label="Remover filtro de preço mínimo">×</button>
                  </span>
                )}
                {search.precoMax != null && search.precoMax < maxPriceInData && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    até R$ {search.precoMax}
                    <button onClick={() => updateFilter({ precoMax: undefined })} className="ml-1 hover:text-primary/70" aria-label="Remover filtro de preço máximo">×</button>
                  </span>
                )}
              </div>
            )}

            {/* Grid de produtos */}
            {filtered.length === 0 ? (
              <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
                <svg className="mb-4 h-12 w-12 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="font-heading text-lg font-semibold text-foreground">Nenhum produto encontrado</h2>
                <p className="mt-1 text-sm text-muted-foreground">Tente outra busca ou veja todas as categorias.</p>
                <button
                  onClick={() =>
                    updateFilter({
                      categoria: "todos",
                      subcategoria: "todos",
                      precoMin: undefined,
                      precoMax: undefined,
                      disponivel: false,
                      ordenacao: "relevancia",
                      busca: "",
                    })
                  }
                  className="mt-4 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Botão flutuante do carrinho no mobile */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        aria-label="Abrir carrinho"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Carrinho
        {totalItems > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3D1F2B] text-[10px] font-bold text-white">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </button>

      {/* Gaveta de filtros no mobile */}
      <Drawer open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DrawerContent>
          <DrawerHeader className="px-4 pb-2">
            <div className="flex items-center justify-between">
              <DrawerTitle className="font-heading text-xl">Filtros</DrawerTitle>
              <DrawerClose className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Fechar filtros">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="max-h-[70vh] overflow-y-auto px-4 pb-8 space-y-6">
            <FilterSidebar />
          </div>
        </DrawerContent>
      </Drawer>

      <footer className="border-t border-border bg-card py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {empresa.nome}. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
