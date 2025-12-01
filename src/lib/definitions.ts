'use client'
// Onde você pode adicionar novos campos nos produtos.
// Altere esta interface para adicionar ou remover propriedades dos seus produtos.
// Lembre-se de atualizar também a estrutura no Firestore e os formulários no painel de admin.
export type Product = {
  id: string;
  name: string;
  shortDescription: string;
  description?: string;
  imageUrl: string[]; // Padronizado para imageUrl
  imageHint?: string;
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
  keywords?: string[];
  createdAt?: any; // Can be a server timestamp
};

export type Category = {
  id: string;
  name: string;
  imageUrl?: string;
  imageHint?: string;
  parentId?: string; // ID da categoria pai
  showOnHome?: boolean;
  showInMenu?: boolean;
};

export type OrderStatus = 'Em análise' | 'Em produção' | 'Pronto para retirada' | 'Entregue' | 'Cancelado';

export type Order = {
  id?: string; // ID is now optional as it's set after creation
  customerId: string; // Adicionado para rastrear o dono do pedido
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
  isAdmin?: boolean;
};

export type CartItem = {
  id: string; // Unique ID for the cart item, combines product ID and variations
  product: Product;
  quantity: number;
  selectedFormat: string;
  selectedFinishing: string;
  totalPrice: number; // Agora é usado apenas para exibição no cliente
};

export type Favorite = {
  id: string;
  productId: string;
  createdAt: any;
};


// Add the 'createdAt' field to the Product entity in backend.json
// This is important for sorting new products.
// "createdAt": {
//   "type": "string",
//   "format": "date-time",
//   "description": "Timestamp when the product was created."
// }
