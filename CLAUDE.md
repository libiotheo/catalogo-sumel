# Sumel — Catálogo Digital

## Projeto
Catálogo digital com carrinho para a **Sumel**, empresa atacadista de confeitaria, guloseimas e embalagens. Público-alvo: confeiteiras, donos de lanchonete, restaurantes e deliverys. O cliente monta o pedido pelo app e envia pronto via WhatsApp. Sem pagamento online nem login.

## Stack
- **Framework:** React + TypeScript + Vite
- **UI:** Tailwind CSS + shadcn/ui (Radix UI)
- **Roteamento:** TanStack Router
- **Estado do carrinho:** localStorage (via hook useCart)
- **Produtos:** arquivo JSON estático (`src/data/products.json`)
- **Deploy:** Lovable (sem backend próprio)

## Rotas
| Rota | Conteúdo |
|------|----------|
| `/` | Home: hero, atalhos por categoria, destaque, como fazer pedido, rodapé |
| `/produtos` | Catálogo com filtros de categoria + busca |
| `/produtos/:categoria` | Catálogo pré-filtrado |
| `/produto/:slug` | Detalhe de produto + relacionados |
| `/checkout` | Resumo do pedido + campos do cliente + botão WhatsApp |

## Paleta de cores
| Token | Hex | Uso |
|-------|-----|-----|
| `rosa-doce` | `#F9D4D8` | Backgrounds suaves |
| `rosa-vibrante` | `#E8406B` | CTAs, destaques, badge do carrinho |
| `creme` | `#FFF8F5` | Background principal |
| `chocolate` | `#3D1F2B` | Títulos, texto principal |
| `baunilha` | `#6B3E4D` | Texto secundário |
| `glase` | `#FFFFFF` | Cards, superfícies |

## Tipografia
- **Títulos (H1–H3):** Playfair Display, peso 600–700
- **Corpo / UI:** DM Sans, peso 400–500
- Ambas via Google Fonts

## Modelo de dados

```typescript
// src/types/index.ts
type Category = "confeitaria" | "guloseimas" | "embalagens";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;       // em centavos (ex: 1590 = R$ 15,90)
  description: string;
  imageUrl: string;
  unit: string;        // "kg", "pacote", "cento", "unidade"
  minQuantity?: number;
  featured?: boolean;
};

type CartItem = {
  product: Product;
  quantity: number;
};
```

## Convenções de código

### Preços
- Sempre armazenar em **centavos** (`number`).
- Formatar na tela com `formatPrice(cents)` → "R$ 15,90".

### Imagens
- Usar Unsplash com `?w=600&auto=format&fit=crop&q=80` como fallback.
- Sempre incluir `alt` descritivo.

### Carrinho (localStorage)
- Hook `useCart` em `src/hooks/useCart.ts`.
- Chave: `"sumel_cart"`.
- Métodos: `addItem(product, qty)`, `removeItem(id)`, `updateQuantity(id, qty)`, `clearCart()`, `cartItems[]`, `cartCount`, `cartTotal`.

### WhatsApp
- `src/lib/whatsapp.ts`: `buildWhatsAppUrl(waNumber, items, clientName, note)`.
- Retorna URL `https://wa.me/55{numero}?text={mensagem}`.

### Componentes
- `src/components/layout/Header.tsx` — topo fixo com logo, busca, carrinho
- `src/components/layout/Footer.tsx` — contato, endereço, horários
- `src/components/catalog/ProductCard.tsx` — card com imagem, nome, preço, seletor de qtd
- `src/components/catalog/ProductGrid.tsx` — grid responsivo (2/3/4 colunas)
- `src/components/catalog/CategoryFilter.tsx` — botões de filtro por categoria
- `src/components/catalog/ProductSearch.tsx` — campo de busca
- `src/components/cart/CartDrawer.tsx` — sheet lateral com resumo do carrinho
- `src/components/cart/CartItem.tsx` — item individual com +/-
- `src/components/cart/CartIcon.tsx` — ícone com badge de contagem

### Mobile-first breakpoints
| Dispositivo | Colunas do grid |
|---|---|
| < 640px | 2 |
| 640–1024px | 3 |
| > 1024px | 4 |

### Acessibilidade
- Todos os botões com `aria-label` quando o texto não é autoexplicativo.
- `alt` em todas as imagens.
- `prefers-reduced-motion` respeitado.
- Contraste WCAG AA mínimo.
- Estados vazios com mensagem clara.

### Estados vazios do carrinho
"Seu carrinho está vazio. Explore nossos produtos e adicione o que precisa!"

## Info da empresa (preencher)
- **Cidade/Estado:** [A DEFINIR]
- **WhatsApp:** [A DEFINIR]
- **Horário de atendimento:** Seg a Sex, 8h às 18h
