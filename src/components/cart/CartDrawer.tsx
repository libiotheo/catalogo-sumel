import { Link } from "@tanstack/react-router";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/whatsapp";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { empresa } from "@/config/empresa";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function QuantitySelector({
  productId,
  quantity,
  minQuantity = 1,
  onChange,
}: {
  productId: string;
  quantity: number;
  minQuantity?: number;
  onChange: (qty: number) => void;
}) {
  const handleDecrement = () => {
    if (quantity > minQuantity) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    onChange(quantity + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= minQuantity) {
      onChange(val);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= minQuantity}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Diminuir quantidade"
      >
        −
      </button>
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={minQuantity}
        className="h-8 w-12 rounded-lg border border-border bg-card text-center text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Quantidade"
      />
      <button
        type="button"
        onClick={handleIncrement}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Aumentar quantidade"
      >
        +
      </button>
    </div>
  );
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, clearCart, cartTotal } = useCart();

  // Sem pedido mínimo — qualquer valor pode ser enviado.

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="px-4 pb-2">
          <div className="flex items-center justify-between">
            <DrawerTitle className="font-heading text-xl">Carrinho</DrawerTitle>
            <DrawerClose className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Fechar carrinho">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </DrawerClose>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="mt-2 text-sm text-muted-foreground underline transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Limpar carrinho
            </button>
          )}
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {items.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
              <svg className="mb-3 h-12 w-12 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="font-heading text-base font-semibold text-foreground">Seu carrinho está vazio</p>
              <p className="mt-1 text-sm text-muted-foreground">Adicione produtos para começar</p>
            </div>
          ) : (
            <ul className="space-y-4" aria-label="Itens do carrinho">
              {items.map((item) => {
                const subtotal = item.product.price * item.quantity;
                return (
                  <li key={item.product.id} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                    <img
                      src={item.product.imageUrl}
                      alt={`Foto de ${item.product.name}`}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          to={`/produto/${item.product.slug}`}
                          onClick={() => onOpenChange(false)}
                          className="font-heading text-sm font-semibold text-card-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-0.5 py-0.5 -mx-0.5 -my-0.5"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatPrice(item.product.price)} / {item.product.unit}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <QuantitySelector
                          productId={item.product.id}
                          quantity={item.quantity}
                          minQuantity={item.product.minQuantity || 1}
                          onChange={(qty) => updateQuantity(item.product.id, qty)}
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-primary">
                            {formatPrice(subtotal)}
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`Remover ${item.product.name}`}
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <DrawerFooter className="border-t border-border px-4 pt-4">
            <div className="mb-3 rounded-xl bg-secondary/50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="font-heading text-xl font-bold text-primary">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              
            </div>
            <Button
              asChild
              className="w-full"
              size="lg"
            >
              <Link to="/checkout" onClick={() => onOpenChange(false)}>
                Finalizar Pedido
              </Link>
            </Button>

          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
