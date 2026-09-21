import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { empresa } from "@/config/empresa";
import { CATEGORY_LABELS } from "@/types";
import type { Category } from "@/types";
import productsData from "@/data/products.json";
import type { Product } from "@/types";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";

const products = productsData as Product[];
const featured = products.filter((p) => p.featured);

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

const businessSegments = [
  "Confeitarias",
  "Lanchonetes",
  "Restaurantes",
  "Pizzarias",
  "Açaiterias",
  "Deliverys",
];

const categoryCards: { category: Category; description: string }[] = [
  { category: "confeitaria", description: "Bolos, brigadeiros, tortas e muito mais" },
  { category: "guloseimas", description: "Chocolates, balas, suspiros e kits" },
  { category: "embalagens", description: "Caixas, forminhas, copos e sacolas" },
];

const steps = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Escolha seus produtos",
    description: "Navegue pelo catálogo e encontre o que precisa para o seu negócio.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Monte seu pedido",
    description: "Adicione ao carrinho, ajuste quantidades e adicione observações.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    title: "Envie pelo WhatsApp",
    description: "Um clique e seu pedido chega direto para nós, pronto para produção.",
  },
];

function FeaturedProductCard({ product }: { product: Product }) {
  const { addItem, isInCart, getQuantity, updateQuantity } = useCart();
  const unavailable = product.disponivel === false;
  const inCart = isInCart(product.id);
  const qty = getQuantity(product.id);

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md ${unavailable ? "opacity-70" : ""}`}
    >
      <Link
        to={`/produto/${product.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-2xl"
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
      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          <Link
            to={`/produto/${product.slug}`}
            className="font-heading text-sm font-semibold text-card-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 py-0.5 -mx-1 -my-0.5 line-clamp-2"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">por {product.unit}</p>
          {product.minQuantity && product.minQuantity > 1 && (
            <p className="mt-0.5 text-xs text-amber-600">Mín. {product.minQuantity} unidades</p>
          )}
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-primary">{formatPrice(product.price)}</span>
            {!unavailable && (
              inCart ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (qty > 1) updateQuantity(product.id, qty - 1);
                      else updateQuantity(product.id, 0);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Diminuir quantidade"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-sm font-medium">{qty}</span>
                  <button
                    onClick={() => updateQuantity(product.id, qty + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    addItem(product, product.minQuantity || 1);
                    toast.success(`${product.name} adicionado`);
                  }}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Adicionar
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${empresa.nome} — ${empresa.tagline}` },
      { name: "description", content: empresa.descricao },
      { property: "og:title", content: `${empresa.nome} — ${empresa.tagline}` },
      { property: "og:description", content: empresa.descricao },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  const instagramLink = `https://instagram.com/${empresa.instagram.replace("@", "")}`;
  const whatsappLink = `https://wa.me/55${empresa.whatsapp}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-rosa-doce/30 to-background px-4 pt-10 pb-14 text-center">
          <div className="mx-auto max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              Atacado para negócios
            </span>
            <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Seu atacado de confeitaria, doces e embalagens
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
              Produtos para quem produz, vende e transforma todos os dias. Encontre o que precisa, monte seu pedido e envie pelo WhatsApp.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/produtos"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Ver catálogo completo
              </Link>
              <a
                href={`https://wa.me/55${empresa.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-card-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Falar com a Sumel
              </a>
            </div>
          </div>
        </section>

        {/* Categorias */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Compre por categoria
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Encontre rapidamente o que seu negócio precisa</p>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
              {categoryCards.map(({ category, description }) => (
                <Link
                  key={category}
                  to={`/produtos/${category}`}
                  className="group flex min-w-[190px] flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 text-center transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-0"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {category === "confeitaria" && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.545c0-1-.806-2.545-2.545-2.545S15.91 14.545 15.91 15.545V17H8.09v-1.455c0-.999-.806-2.545-2.545-2.545S2.91 15.545 2.91 16.545V17H2v-2h20v-1.455zM2.91 8.545C2.91 7.545 3.716 6 5.545 6s2.636 1.545 2.636 2.545V11H2.91V8.545zM21 11h-7.091V8.545C13.909 7.545 13.103 6 11.273 6S8.637 7.545 8.637 8.545V11H1.636L1 21h22l-.636-10H21V11z" />
                      )}
                      {category === "guloseimas" && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm9-4v2.17c0 .47-.1.92-.27 1.33L21 12l-.27-1.5A5.985 5.985 0 0021 8V6h-2v2zm-9 0v2.17c0 .47-.1.92-.27 1.33L12 12l-.27-1.5A5.985 5.985 0 0012 6H10v2zm0 12v2.17c0 .47-.1.92-.27 1.33L12 22l-.27-1.5c-.17-.41-.27-.86-.27-1.33V18h2zm9 0v2.17c0 .47-.1.92-.27 1.33L21 22l-.27-1.5c-.17-.41-.27-.86-.27-1.33V18h2z" />
                      )}
                      {category === "embalagens" && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2h8z" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-card-foreground">
                      {CATEGORY_LABELS[category]}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Para o seu negócio */}
        <section className="bg-secondary/30 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Para o seu negócio
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Fornecemos para diferentes segmentos do mercado de alimentos
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {businessSegments.map((segment) => (
                <div
                  key={segment}
                  className="flex items-center justify-center rounded-xl border border-border bg-card px-4 py-3 text-center"
                >
                  <span className="text-xs font-medium text-card-foreground sm:text-sm">{segment}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Produtos em destaque */}
        {featured.length > 0 && (
          <section className="px-4 py-12">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                    Mais pedidos
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">Os favoritos dos nossos clientes</p>
                </div>
                <Link
                  to="/produtos"
                  className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-2 py-1"
                >
                  Ver todos →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {featured.map((product) => (
                  <FeaturedProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Como funciona */}
        <section className="bg-secondary/30 px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Como funciona
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Catálogo digital — sem pagamento online, tudo pelo WhatsApp
              </p>
            </div>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                    {step.icon}
                  </div>
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="px-4 py-16 text-center">
          <div className="mx-auto max-w-xl">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Pronto para montar seu pedido?
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground sm:text-base">
              Encontre os produtos que seu negócio precisa e envie seu pedido para a Sumel pelo WhatsApp.
            </p>
            <Link
              to="/produtos"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Montar meu pedido
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <span className="font-heading text-xl font-bold text-foreground">{empresa.nome}</span>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{empresa.descricao}</p>
            </div>
            <div>
              <h3 className="mb-3 font-heading text-base font-semibold text-foreground">Contato</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-green-600 transition-colors hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 py-0.5 -mx-1 -my-0.5"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </li>
                {empresa.lojas.map((loja) => (
                  <li key={loja.nome} className="flex items-start gap-1.5">
                    <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>
                      <span className="font-medium text-foreground">{loja.nome}</span>:{" "}
                      {loja.endereco}
                    </span>
                  </li>
                ))}
                <li className="flex items-start gap-1.5">
                  <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {empresa.horarios.diasUteis}{"\n"}
                    {empresa.horarios.sabado}{"\n"}
                    {empresa.horarios.domingo}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-heading text-base font-semibold text-foreground">Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/produtos" className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 py-0.5 -mx-1 -my-0.5">
                    Catálogo completo
                  </Link>
                </li>
                <li>
                  <Link to="/produtos/confeitaria" className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 py-0.5 -mx-1 -my-0.5">
                    Confeitaria
                  </Link>
                </li>
                <li>
                  <Link to="/produtos/guloseimas" className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 py-0.5 -mx-1 -my-0.5">
                    Guloseimas
                  </Link>
                </li>
                <li>
                  <Link to="/produtos/embalagens" className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 py-0.5 -mx-1 -my-0.5">
                    Embalagens
                  </Link>
                </li>
              </ul>
              <div className="mt-4 flex gap-3">
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded p-1"
                  aria-label="Instagram da Sumel"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href={empresa.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded p-1"
                  aria-label="Site da Sumel"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} {empresa.nome}. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
