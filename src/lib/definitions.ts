// Onde você pode adicionar novos campos nos produtos.
// Altere esta interface para adicionar ou remover propriedades dos seus produtos.
// Lembre-se de atualizar também a estrutura no Firestore e os formulários no painel de admin.
export type Product = {
  id: string;
  name: string;
  shortDescription: string;
  description?: string;
  imageUrls: string[]; // Alterado de imageUrl para imageUrls
  imageHint: string;
  basePrice: number;
  categoryId: string;
  variations: {
    models?: string[];
    materials?: string[];
    formats: string[];
    colors?: string[];
    finishings: string[];
    quantities: number[];
  };
  createdAt?: any; // Can be a server timestamp
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
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  productName: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  cpf?: string;
  birthDate?: Date;
  companyName?: string;
  tradingName?: string;
  cnpj?: string;
};

// Add the 'createdAt' field to the Product entity in backend.json
// This is important for sorting new products.
// "createdAt": {
//   "type": "string",
//   "format": "date-time",
//   "description": "Timestamp when the product was created."
// }
