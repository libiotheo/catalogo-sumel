import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { empresa } from "@/config/empresa";
import { useCart } from "@/hooks/useCart";
import { formatPrice, buildWhatsAppUrl } from "@/lib/whatsapp";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface FormData {
  nome: string;
  telefone: string;
  empresa: string;
  cidadeBairro: string;
  entrega: "retirada" | "entrega";
  observacoes: string;
}

interface FormErrors {
  nome?: string;
  telefone?: string;
  cidadeBairro?: string;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.nome.trim()) {
    errors.nome = "Nome é obrigatório";
  }

  if (!data.telefone.trim()) {
    errors.telefone = "Telefone é obrigatório";
  } else {
    const digits = data.telefone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 11) {
      errors.telefone = "Telefone inválido";
    }
  }

  if (!data.cidadeBairro.trim()) {
    errors.cidadeBairro = "Cidade/bairro é obrigatório";
  }

  return errors;
}

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: `Finalizar Pedido — ${empresa.nome}` },
      { name: "description", content: "Finalize seu pedido e envie pelo WhatsApp." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    telefone: "",
    empresa: "",
    cidadeBairro: "",
    entrega: "retirada",
    observacoes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Sem pedido mínimo — qualquer valor pode ser enviado.

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-lg px-4 py-12 text-center">
          <svg
            className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Carrinho vazio
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Adicione produtos ao carrinho para fazer seu pedido.
          </p>
          <Button asChild className="mt-6">
            <Link to="/produtos">Ver Produtos</Link>
          </Button>
        </main>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Build WhatsApp URL
    const waUrl = buildWhatsAppUrl(
      empresa.whatsapp,
      items,
      formData.nome,
      buildExtraNote(formData)
    );

    window.open(waUrl, "_blank");
    setSubmitted(true);
    setShowSuccessDialog(true);
  };

  const buildExtraNote = (data: FormData): string => {
    let note = "";
    if (data.empresa.trim()) {
      note += `*Empresa:* ${data.empresa.trim()}\n`;
    }
    note += `*Local:* ${data.cidadeBairro.trim()}\n`;
    note += `*Entrega:* ${data.entrega === "entrega" ? "Entrega" : "Retirada no local"}\n`;
    if (data.observacoes.trim()) {
      note += `*Observações:* ${data.observacoes.trim()}`;
    }
    return note;
  };

  const handleClearAndContinue = () => {
    clearCart();
    setShowSuccessDialog(false);
    navigate({ to: "/" });
  };

  const handleKeepShopping = () => {
    setShowSuccessDialog(false);
    navigate({ to: "/produtos" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6">
          <Link
            to="/produtos"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 py-0.5 -mx-1 -my-0.5"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Continuar comprando
          </Link>
        </div>

        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Finalizar Pedido
        </h1>



        <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
          {/* Dados do cliente */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="font-heading text-lg font-semibold text-card-foreground">
              Seus dados
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="nome" className="required">
                  Nome completo *
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Maria da Silva"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className={errors.nome ? "border-destructive" : ""}
                  autoComplete="name"
                  required
                />
                {errors.nome && (
                  <p className="mt-1 text-xs text-destructive">{errors.nome}</p>
                )}
              </div>

              <div>
                <Label htmlFor="telefone" className="required">
                  Telefone / WhatsApp *
                </Label>
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(51) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className={errors.telefone ? "border-destructive" : ""}
                  autoComplete="tel"
                  required
                />
                {errors.telefone && (
                  <p className="mt-1 text-xs text-destructive">{errors.telefone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="empresa">Empresa / Loja</Label>
                <Input
                  id="empresa"
                  type="text"
                  placeholder="Confeitaria Bela"
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  autoComplete="organization"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="cidadeBairro" className="required">
                  Cidade / Bairro *
                </Label>
                <Input
                  id="cidadeBairro"
                  type="text"
                  placeholder="Sapucaia do Sul, Centro"
                  value={formData.cidadeBairro}
                  onChange={(e) => setFormData({ ...formData, cidadeBairro: e.target.value })}
                  className={errors.cidadeBairro ? "border-destructive" : ""}
                  required
                />
                {errors.cidadeBairro && (
                  <p className="mt-1 text-xs text-destructive">{errors.cidadeBairro}</p>
                )}
              </div>
            </div>
          </section>

          {/* Forma de entrega */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="font-heading text-lg font-semibold text-card-foreground">
              Forma de retirada
            </h2>

            <div className="mt-4 flex gap-3">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:text-primary">
                <input
                  type="radio"
                  name="entrega"
                  value="retirada"
                  checked={formData.entrega === "retirada"}
                  onChange={() => setFormData({ ...formData, entrega: "retirada" })}
                  className="sr-only"
                />
                Retirada
              </label>
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:text-primary">
                <input
                  type="radio"
                  name="entrega"
                  value="entrega"
                  checked={formData.entrega === "entrega"}
                  onChange={() => setFormData({ ...formData, entrega: "entrega" })}
                  className="sr-only"
                />
                Entrega
              </label>
            </div>
          </section>

          {/* Observações */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="font-heading text-lg font-semibold text-card-foreground">
              Observações
            </h2>
            <div className="mt-4">
              <textarea
                id="observacoes"
                placeholder="Alguma observação sobre o pedido?"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
                className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </section>

          {/* Resumo do pedido */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="font-heading text-lg font-semibold text-card-foreground">
              Resumo do pedido
            </h2>

            <ul className="mt-4 space-y-3" aria-label="Itens do pedido">
              {items.map((item) => {
                const subtotal = item.product.price * item.quantity;
                return (
                  <li key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-heading text-base font-semibold text-card-foreground">Total</span>
              <span className="font-heading text-xl font-bold text-primary">
                {formatPrice(cartTotal)}
              </span>
            </div>
          </section>

          {/* Botão de envio */}
          <Button
            type="submit"
  
            className="w-full"
            size="lg"
          >
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar pedido pelo WhatsApp
          </Button>


        </form>
      </main>

      {/* Diálogo de sucesso */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <DialogTitle className="text-center">Pedido enviado!</DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-muted-foreground">
            Seu pedido foi direcionado para o WhatsApp da Sumel. Deseja limpar o carrinho ou continuar comprando?
          </p>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button onClick={handleClearAndContinue} variant="outline" className="w-full">
              Limpar carrinho e ir para home
            </Button>
            <Button onClick={handleKeepShopping} className="w-full">
              Continuar comprando
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {empresa.nome}. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
