import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { empresa } from "@/config/empresa";
import { CATEGORY_LABELS } from "@/types";
import type { Category } from "@/types";
import productsData from "@/data/products.json";
import type { Product } from "@/types";

const products = productsData as Product[];
const featured = products.filter((p) => p.featured);

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

const categoryCards: { category: Category; emoji: string; description: string }[] = [
  { category: "confeitaria", emoji: "🎂", description: "Bolos, brigadeiros, tortas e muito mais" },
  { category: "guloseimas", emoji: "🍬", description: "Chocolates, balas, suspiros e kits" },
  { category: "embalagens", emoji: "📦", description: "Caixas, forminhas, copos e sacolas" },
];

const steps = [
  {
    number: "1",
    title: "Escolha seus produtos",
    description: "Navegue pelo catálogo e adicione ao carrinho o que precisar.",
  },
  {
    number: "2",
    title: "Revise o pedido",
    description: "Ajuste quantidades e adicione uma observação, se necessário.",
  },
  {
    number: "3",
    title: "Envie pelo WhatsApp",
    description: "Um clique e seu pedido chega direto para nós, pronto para produção.",
  },
];

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
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            {empresa.nome}
          </span>
          <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <Link to="/produtos" className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-2 py-1">
              Produtos
            </Link>
            <Link
              to="/checkout"
              className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Carrinho
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-rosa-doce/40 to-background px-4 py-14 text-center">
          <div className="mx-auto max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-rosa-vibrante">
              Casa de Festas no Atacado
            </p>
            <h1 className="font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              {empresa.tagline}
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground">
              Fornecemos para lanchonetes, restaurantes, pizzarias, açaiterias e deliverys em todo o RS.
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
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Fale conosco
              </a>
            </div>
          </div>
        </section>

        {/* Categorias */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Nossos produtos
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Clique e veja tudo de cada categoria</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {categoryCards.map(({ category, emoji, description }) => (
                <Link
                  key={category}
                  to={`/produtos/${category}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="text-4xl" role="img" aria-hidden="true">
                    {emoji}
                  </span>
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

        {/* Produtos em destaque */}
        {featured.length > 0 && (
          <section className="bg-secondary/30 px-4 py-12">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                    Mais pedidos
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">Os favoritos dos nossos clientes</p>
                </div>
                <Link
                  to="/produtos"
                  className="text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-2 py-1"
                >
                  Ver todos →
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((product) => (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                  >
                    <Link to={`/produto/${product.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-2xl">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={`Foto de ${product.name}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/produto/${product.slug}`}
                          className="font-heading text-base font-semibold text-card-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 py-0.5 -mx-1 -my-0.5"
                        >
                          {product.name}
                        </Link>
                        <span className="whitespace-nowrap text-base font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">por {product.unit}</p>
                      {product.minQuantity && product.minQuantity > 1 && (
                        <p className="mt-1 text-xs text-amber-600">
                          Mín. {product.minQuantity} unidades
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Como fazer pedido */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Como fazer seu pedido
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Rápido e sem complicação — tudo pelo WhatsApp
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-sm">
                    {step.number}
                  </div>
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 inline-block rounded-full bg-secondary px-5 py-2 text-sm font-medium text-secondary-foreground">
              {empresa.pedidoMinimo}
            </p>
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
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href={`https://wa.me/55${empresa.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-green-600 transition-colors hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 py-0.5 -mx-1 -my-0.5"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                </li>
                <li className="flex items-start gap-1.5">
                  <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {empresa.endereco}
                </li>
                <li className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {empresa.horarios}
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
                  href={empresa.redes.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded p-1"
                  aria-label="Instagram da Sumel"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a
                  href={empresa.redes.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded p-1"
                  aria-label="Facebook da Sumel"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
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
