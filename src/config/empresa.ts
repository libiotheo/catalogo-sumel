// Dados institucionais da Sumel — tudo que é dado da empresa vai aqui.
// Nenhum dado de empresa deve aparecer hardcoded em componentes.

export const empresa = {
  nome: "Sumel",
  tagline: "Doces que fazem a festa acontecer",
  descricao:
    "A Sumel é referência em confeitaria no Rio Grande do Sul. Fornecemos para lanchonetes, restaurantes, pizzarias, açaiterias e deliverys com produtos de qualidade, preço justo e entrega pontual.",

  whatsapp: "5599999999999", // formato: DDD + número, só números

  endereco: "Rua das Flores, 123 — Centro, Sapucaia do Sul — RS",

  horarios: "Seg a Sex: 7h às 18h | Sáb: 7h às 12h",

  pedidoMinimo: "Pedido mínimo: R$ 50,00",

  redes: {
    instagram: "https://instagram.com/sumel",
    facebook: "https://facebook.com/sumel",
  },

  // Links do menu
  links: {
    inicio: "/",
    produtos: "/produtos",
    confeitaria: "/produtos/confeitaria",
    guloseimas: "/produtos/guloseimas",
    embalagens: "/produtos/embalagens",
  },
} as const;
