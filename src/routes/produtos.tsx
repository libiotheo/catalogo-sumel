import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { empresa } from "@/config/empresa";
import { CATEGORY_LABELS } from "@/types";
import type { Category } from "@/types";
import productsData from "@/data/products.json";
import type { Product } from "@/types";
import { Header } from "@/components/layout/Header";
import { useCart } from "@/hooks/useCart";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { toast } from "sonner";

const products = productsData as Product[];

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

const ALL_CATEGORIES: Category[] = ["confeitaria", "guloseimas", "embalagens"];

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: `Produtos — ${empresa.nome}` },
      { name: "description", content: "Catálogo completo de produtos da Sumel." },
    ],
  }),
  component: ProdutosPage,
});

function ProdutosPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "todos">("todos");
  const [cartOpen, setCartOpen] = useState(false);
  const { addItem, isInCart, getQuantity, updateQuantity } = useCart();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "todos" || p.category === selectedCategory;
      const matchesSearch =
        search.trim() === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Catálogo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} produtos disponíveis
          </p>
        </div>

        {/* Busca */}
        <div className="mb-4">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              placeholder="Buscar produto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Buscar produtos"
            />
          </div>
        </div>

        {/* Filtros de categoria */}
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
          <button
            onClick={() => setSelectedCategory("todos")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              selectedCategory === "todos"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            Todos
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Estado vazio */}
        {filtered.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <svg
              className="mb-4 h-12 w-12 text-muted-foreground/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Nenhum produto encontrado
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tente outra busca ou veja todas as categorias.
            </p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory("todos"); }}
              className="mt-4 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <Link
                  to={`/produto/${product.slug}`}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={`Foto de ${product.name}`}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
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
                  
                  {/* Botão adicionar ao carrinho */}
                  {isInCart(product.id) ? (
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const current = getQuantity(product.id);
                          if (current > 1) {
                            updateQuantity(product.id, current - 1);
                          } else {
                            updateQuantity(product.id, 0);
                          }
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
                      className="mt-2 w-full rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Adicionar
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
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

      <footer className="border-t border-border bg-card py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {empresa.nome}. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
