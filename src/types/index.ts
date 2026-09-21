export type Category = "confeitaria" | "guloseimas" | "embalagens";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number; // em centavos (ex: 1590 = R$ 15,90)
  description: string;
  imageUrl: string;
  unit: string; // "kg", "pacote", "cento", "unidade"
  minQuantity?: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  confeitaria: "Confeitaria",
  guloseimas: "Guloseimas",
  embalagens: "Embalagens",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  confeitaria: "bg-rosa-doce text-chocolate",
  guloseimas: "bg-amber-100 text-amber-800",
  embalagens: "bg-emerald-100 text-emerald-800",
};
