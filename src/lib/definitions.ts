// Onde você pode adicionar novos campos nos produtos.
// Altere esta interface para adicionar ou remover propriedades dos seus produtos.
// Lembre-se de atualizar também a estrutura no Firestore e os formulários no painel de admin.
export type Product = {
  id: string;
  name: string;
  shortDescription: string;
  imageUrl: string;
  imageHint: string;
  basePrice: number;
  category: string;
  variations: {
    sizes: string[];
    quantities: number[];
    finishings: string[];
  };
};

export type Category = {
  id: string;
  name: string;
  imageUrl: string;
  imageHint: string;
};

export type OrderStatus = 'Em análise' | 'Em produção' | 'Pronto para retirada' | 'Entregue' | 'Cancelado';

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: OrderStatus;
  productName: string;
};

export type User = {
  name: string;
  email: string;
  avatarUrl: string;
};
