import type { CartItem } from "@/types";

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function formatCartMessage(items: CartItem[], clientName?: string, note?: string): string {
  const lines: string[] = [];

  lines.push("*Pedido — Sumel*\n");
  if (clientName && clientName.trim()) {
    lines.push(`*Cliente:* ${clientName.trim()}`);
  }
  lines.push("\n*Itens:*");

  let total = 0;
  for (const item of items) {
    const unitPrice = item.product.price;
    const subtotal = unitPrice * item.quantity;
    total += subtotal;
    lines.push(
      `- ${item.quantity}x ${item.product.name} (${formatPrice(unitPrice)}/${item.product.unit}) = ${formatPrice(subtotal)}`
    );
  }

  lines.push(`\n*Total:* ${formatPrice(total)}`);

  if (note && note.trim()) {
    lines.push(`\n*Observação:* ${note.trim()}`);
  }

  return lines.join("\n");
}

export function buildWhatsAppUrl(
  waNumber: string,
  items: CartItem[],
  clientName?: string,
  note?: string
): string {
  const cleanNumber = waNumber.replace(/\D/g, "");
  const message = formatCartMessage(items, clientName, note);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/55${cleanNumber}?text=${encoded}`;
}
