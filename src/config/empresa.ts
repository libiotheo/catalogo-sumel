// Dados institucionais da Sumel — tudo que é dado da empresa vai aqui.
// Nenhum dado de empresa deve aparecer hardcoded em componentes.

export const empresa = {
  nome: "Sumel",
  tagline: "Atacado para Confeitaria, Guloseimas e Embalagens",
  descricao:
    "A Sumel fornece produtos para confeitaria, guloseimas, embalagens e muito mais. Atendemos lanchonetes, restaurantes, pizzarias, deliverys, açaiterias e outros negócios com qualidade e preço justo.",

  whatsapp: "5134744368", // formato: DDD + número, só números

  instagram: "@Sumellojas",
  site: "https://www.sumel.com.br",

  lojas: [
    {
      nome: "Sapucaia do Sul",
      endereco: "Av. João Pereira de Vargas, 943 — Camboim",
    },
    {
      nome: "Esteio",
      endereco: "Av. Padre Claret, 382 — Centro",
    },
    {
      nome: "São Leopoldo",
      endereco: "Rua Independência, 878 — Centro",
    },
  ],

  horarios: {
    diasUteis: "Seg a Sex: 8h30–12h / 13h30–18h30",
    sabado: "Sábado: 9h–12h / 13h30–17h",
    domingo: "Domingo: fechado",
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
