import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catálogo | Produtos Selecionados" },
      { name: "description", content: "Explore nosso catálogo de produtos selecionados com qualidade e design." },
      { property: "og:title", content: "Catálogo | Produtos Selecionados" },
      { property: "og:description", content: "Explore nosso catálogo de produtos selecionados com qualidade e design." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Category = "Todos" | "Casa" | "Tecnologia" | "Acessórios";

interface Product {
  id: string;
  name: string;
  category: Category;
  price: string;
  description: string;
  imageUrl: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Luminária de Mesa",
    category: "Casa",
    price: "R$ 289,00",
    description: "Design minimalista em metal com acabamento fosco.",
    imageUrl: "https://images.unsplash.com/photo-1507473888900-52e1adad5420?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    name: "Fone Sem Fio",
    category: "Tecnologia",
    price: "R$ 459,00",
    description: "Som de alta fidelidade com cancelamento ativo de ruído.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    name: "Relógio Clássico",
    category: "Acessórios",
    price: "R$ 329,00",
    description: "Pulseira de couro legítimo e mostrador discreto.",
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    name: "Cadeira de Escritório",
    category: "Casa",
    price: "R$ 899,00",
    description: "Ergonomia e conforto para longas horas de trabalho.",
    imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "5",
    name: "Câmera Vintage",
    category: "Tecnologia",
    price: "R$ 1.299,00",
    description: "Estilo retrô com tecnologia digital moderna.",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "6",
    name: "Mochila de Couro",
    category: "Acessórios",
    price: "R$ 569,00",
    description: "Compartimentos inteligentes e material durável.",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
  },
];

const categories: Category[] = ["Todos", "Casa", "Tecnologia", "Acessórios"];

function Index() {
  const [activeCategory, setActiveCategory] = useState<Category>("Todos");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "Todos") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight text-foreground">Catálogo</span>
          <nav className="hidden gap-6 text-sm font-medium text-muted-foreground sm:flex">
            <span className="cursor-pointer transition-colors hover:text-foreground">Início</span>
            <span className="cursor-pointer transition-colors hover:text-foreground">Produtos</span>
            <span className="cursor-pointer transition-colors hover:text-foreground">Sobre</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Produtos Selecionados
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Curadoria de itens com design atemporal e funcionalidade para o seu dia a dia.
          </p>
        </section>

        <section className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-card-foreground">{product.name}</h2>
                  <span className="whitespace-nowrap text-base font-semibold text-primary">
                    {product.price}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                <button className="mt-5 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Ver detalhes
                </button>
              </div>
            </article>
          ))}
        </section>

        {filteredProducts.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            Nenhum produto encontrado nesta categoria.
          </p>
        )}
      </main>

      <footer className="mt-16 border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Catálogo. Todos os direitos reservados.
      </footer>
    </div>
  );
}
