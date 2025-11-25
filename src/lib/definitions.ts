// Onde você pode adicionar novos campos nos produtos.
// Altere esta interface para adicionar ou remover propriedades dos seus produtos.
// Lembre-se de atualizar também a estrutura no Firestore e os formulários no painel de admin.
export type Product = {
  id: string;
  name: string;
  shortDescription: string;
  description?: string;
  imageUrl: string;
  imageHint: string;
  basePrice: number;
  category: string;
  variations: {
    models?: string[];
    materials?: string[];
    formats: string[];
    colors?: string[];
    finishings: string[];
    quantities: number[];
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
