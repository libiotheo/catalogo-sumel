import { useState, useEffect, useCallback, useMemo } from "react";
import type { Product, CartItem } from "@/types";

const CART_KEY = "sumel_cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // localStorage indisponível
  }
}

/**
 * Normaliza a quantidade para respeitar o minQuantity do produto.
 * Retorna 0 para sinalizar que o item deve ser removido.
 */
function normalizeQuantity(product: Product, quantity: number): number {
  const min = product.minQuantity ?? 1;
  if (quantity < min) return 0;
  return quantity;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());

  useEffect(() => {
    saveCart(items);
  }, [items]);

  /**
   * Adiciona produto ao carrinho.
   * Se o produto já existe, soma a quantidade — nunca abaixo do minQuantity.
   */
  const addItem = useCallback((product: Product, quantity: number = 1) => {
    const min = product.minQuantity ?? 1;
    const safeQty = Math.max(quantity, min);
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        const newQty = normalizeQuantity(product, existing.quantity + safeQty);
        if (newQty === 0) return prev.filter((i) => i.product.id !== product.id);
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { product, quantity: safeQty }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  /**
   * Atualiza quantidade de um item no carrinho.
   * Se a nova quantidade for inferior ao minQuantity, remove o item.
   */
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (!item) return prev;
      const normalized = normalizeQuantity(item.product, quantity);
      if (normalized === 0) {
        return prev.filter((i) => i.product.id !== productId);
      }
      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: normalized } : i
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const cartTotal = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items]
  );

  const isInCart = useCallback(
    (productId: string) => items.some((i) => i.product.id === productId),
    [items]
  );

  const getQuantity = useCallback(
    (productId: string) => items.find((i) => i.product.id === productId)?.quantity ?? 0,
    [items]
  );

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    isInCart,
    getQuantity,
  };
}
