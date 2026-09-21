import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { empresa } from "@/config/empresa";
import { useCart } from "@/hooks/useCart";
import { CartDrawer } from "@/components/cart/CartDrawer";
import productsData from "@/data/products.json";
import type { Product } from "@/types";

const products = productsData as Product[];

function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function Header() {
  const { items } = useCart();
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const [cartOpen, setCartOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (search.trim().length < 2) return [];
    const q = normalize(search);
    return products
      .filter((p) => normalize(p.name).includes(q) || normalize(p.description).includes(q))
      .slice(0, 5);
  }, [search]);

  // Fecha sugestões ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSuggestionClick = useCallback(() => {
    setSearch("");
    setSearchFocused(false);
  }, []);

  const showSuggestions = searchFocused && suggestions.length > 0;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:px-4">
          {/* Logo */}
          <Link
            to="/"
            className="font-heading text-xl font-bold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 py-0.5 shrink-0 sm:text-2xl"
          >
            {empresa.nome}
          </Link>

          {/* Busca instantânea */}
          <div ref={wrapperRef} className="relative min-w-0 flex-1 max-w-none">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchRef}
                type="search"
                placeholder="O que você procura?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Buscar produtos"
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
              />
            </div>

            {/* Sugestões */}
            {showSuggestions && (
              <ul
                className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-50"
                role="listbox"
              >
                {suggestions.map((p) => (
                  <li key={p.id} role="option">
                    <Link
                      to={`/produto/${p.slug}`}
                      onClick={handleSuggestionClick}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:bg-accent"
                    >
                      <img
                        src={p.imageUrl}
                        alt=""
                        className="h-8 w-8 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{p.category}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav className="flex items-center gap-3 shrink-0">
            <Link
              to="/produtos"
              className="hidden md:block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-2 py-1"
            >
              Produtos
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4"
              aria-label={`Abrir carrinho com ${totalItems} ${totalItems === 1 ? "item" : "itens"}`}
            >
              <span className="hidden sm:inline">Meu pedido</span>
              <svg className="sm:hidden h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#3D1F2B] text-[10px] font-bold text-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <nav className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 py-2 sm:px-4" aria-label="Categorias do catálogo">
          <Link to="/produtos" className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Todos os produtos</Link>
          <Link to="/produtos/confeitaria" className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground">Confeitaria</Link>
          <Link to="/produtos/guloseimas" className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground">Guloseimas</Link>
          <Link to="/produtos/embalagens" className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground">Embalagens</Link>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
