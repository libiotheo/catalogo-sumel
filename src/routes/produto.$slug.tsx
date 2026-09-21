import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { empresa } from "@/config/empresa";
import { CATEGORY_LABELS } from "@/types";
import productsData from "@/data/products.json";
import type { Product } from "@/types";
import { Header } from "@/components/layout/Header";
import { useCart } from "@/hooks/useCart";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const products = productsData as Product[];

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw new Error("Produto não encontrado");
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.product.name} — ${empresa.nome}` : empresa.nome },
      { name: "description", content: loaderData?.product.description ?? "" },
    ],
  }),
  notFoundComponent: () => <NotFound />,
  component: ProductPage,
});

function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <svg className="mb-4 h-16 w-16 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="font-heading text-2xl font-bold text-foreground">Produto não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">Este produto pode ter sido removido ou o link está incorreto.</p>
        <Button asChild className="mt-6">
          <Link to="/produtos">Ver catálogo</Link>
        </Button>
      </main>
    </div>
  );
}

function ProductPage() {
  const data = Route.useLoaderData();
  const [cartOpen, setCartOpen] = useState(false);
  const { addItem, isInCart, getQuantity, updateQuantity } = useCart();

  const product = data.product;
  const unavailable = product.disponivel === false;
  const minQty = product.minQuantity ?? 1;
  const inCart = isInCart(product.id);
  const currentQty = inCart ? getQuantity(product.id) : minQty;

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  function handleAdd() {
    addItem(product, minQty);
    toast.success(`${product.name} adicionado ao carrinho!`);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Voltar */}
        <Link
          to="/produtos"
          search={{ categoria: "todos", subcategoria: "todos", ordenacao: "relevancia", busca: "" }}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Voltar ao catálogo
        </Link>

        {/* Layout: imagem + info */}
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          {/* Imagem */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <img
                src={product.imageUrl}
                alt={`Foto de ${product.name}`}
                className="aspect-square w-full object-cover"
              />
              {unavailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="rounded-full bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground">
                    Indisponível
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <span className="mb-2 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {CATEGORY_LABELS[product.category]}
            </span>
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Vendido por {product.unit}</p>

            <p className="mt-4 text-3xl font-bold text-primary sm:text-4xl">
              {formatPrice(product.price)}
            </p>

            {product.minQuantity && product.minQuantity > 1 && (
              <p className="mt-1 text-sm text-amber-600">
                Quantidade mínima: {product.minQuantity} {product.unit}
              </p>
            )}

            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Quantidade + Add */}
            <div className="mt-6 space-y-3">
              {!unavailable && (
                inCart ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-1">
                      <button
                        onClick={() => {
                          const q = getQuantity(product.id);
                          if (q > minQty) updateQuantity(product.id, q - 1);
                          else updateQuantity(product.id, 0);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label="Diminuir quantidade"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-base font-medium">
                        {getQuantity(product.id)}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, getQuantity(product.id) + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label="Aumentar quantidade"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => setCartOpen(true)}
                      className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Ver carrinho ✓
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAdd}
                    className="w-full rounded-xl bg-primary px-6 py-4 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Adicionar ao pedido
                  </button>
                )
              )}
              {unavailable && (
                <p className="text-center text-sm text-muted-foreground">
                  Este produto está indisponível no momento.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Produtos relacionados */}
        {related.length > 0 && (
          <section className="mt-12" aria-labelledby="related-heading">
            <h2 id="related-heading" className="mb-4 font-heading text-xl font-bold text-foreground">
              Mais em {CATEGORY_LABELS[product.category]}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => {
                const relUnavailable = p.disponivel === false;
                return (
                  <article key={p.id} className={`overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${relUnavailable ? "opacity-70" : ""}`}>
                    <Link
                      to="/produto/$slug"
                      params={{ slug: p.slug }}
                      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={p.imageUrl}
                          alt={`Foto de ${p.name}`}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                        {relUnavailable && (
                          <span className="absolute top-2 left-2 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">
                            Indisponível
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="p-3">
                      <Link
                        to="/produto/$slug"
                        params={{ slug: p.slug }}
                        className="block font-heading text-sm font-semibold text-card-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-0.5 py-0.5 -mx-0.5 -my-0.5"
                      >
                        {p.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">por {p.unit}</p>
                      <p className="mt-1 text-base font-bold text-primary">{formatPrice(p.price)}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border bg-card py-6 mt-12">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {empresa.nome}. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
