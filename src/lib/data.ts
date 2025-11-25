import { Category, Product, Order } from './definitions';

export const categories: Category[] = [
  { id: 'adesivos', name: 'Adesivos', imageUrl: 'https://picsum.photos/seed/cat1/500/500', imageHint: 'sticker design' },
  { id: 'banners', name: 'Banners', imageUrl: 'https://picsum.photos/seed/cat2/500/500', imageHint: 'conference banner' },
  { id: 'panfletos', name: 'Panfletos', imageUrl: 'https://picsum.photos/seed/cat3/500/500', imageHint: 'flyer mockup' },
  { id: 'placas', name: 'Placas', imageUrl: 'https://picsum.photos/seed/cat4/500/500', imageHint: 'store sign' },
  { id: 'etiquetas', name: 'Etiquetas', imageUrl: 'https://picsum.photos/seed/cat5/500/500', imageHint: 'product label' },
  { id: 'brindes', name: 'Brindes', imageUrl: 'https://picsum.photos/seed/cat6/500/500', imageHint: 'corporate gifts' },
];

export const products: Product[] = [
  {
    id: 'cartao-visita',
    name: 'Cartão de Visita',
    shortDescription: 'Couchê 300g, 4x4 cores, verniz total.',
    imageUrl: 'https://picsum.photos/seed/prod1/600/400',
    imageHint: 'business card',
    basePrice: 89.90,
    category: 'cartoes-visita',
    variations: {
      sizes: ['9x5 cm', '8x5 cm'],
      quantities: [100, 500, 1000],
      finishings: ['Verniz Total Frente', 'Laminação Fosca', 'Corte Especial'],
    },
  },
  {
    id: 'panfleto-a5',
    name: 'Panfleto A5',
    shortDescription: 'Couchê 115g, 4x4 cores.',
    imageUrl: 'https://picsum.photos/seed/prod2/600/400',
    imageHint: 'flyer design',
    basePrice: 159.90,
    category: 'panfletos',
    variations: {
      sizes: ['A5 (14.8x21 cm)', 'A6 (10.5x14.8 cm)'],
      quantities: [500, 1000, 2500],
      finishings: ['Dobra central', 'Sem acabamento'],
    },
  },
  {
    id: 'adesivo-vinil',
    name: 'Adesivo Vinil',
    shortDescription: 'Impressão digital, a prova d\'água.',
    imageUrl: 'https://picsum.photos/seed/prod3/600/400',
    imageHint: 'vinyl sticker',
    basePrice: 50.00,
    category: 'adesivos',
    variations: {
      sizes: ['5x5 cm', '10x10 cm', 'Personalizado'],
      quantities: [100, 250, 500],
      finishings: ['Recorte eletrônico', 'Meio corte'],
    },
  },
  {
    id: 'banner-rollup',
    name: 'Banner Roll-up',
    shortDescription: 'Lona 440g, com estrutura de alumínio.',
    imageUrl: 'https://picsum.photos/seed/prod4/600/400',
    imageHint: 'rollup banner',
    basePrice: 250.00,
    category: 'banners',
    variations: {
      sizes: ['80x200 cm', '100x200 cm'],
      quantities: [1, 2, 5],
      finishings: ['Estrutura inclusa'],
    },
  },
  {
    id: 'caneca-personalizada',
    name: 'Caneca Personalizada',
    shortDescription: 'Caneca de cerâmica, 325ml.',
    imageUrl: 'https://picsum.photos/seed/prod5/600/400',
    imageHint: 'custom mug',
    basePrice: 35.00,
    category: 'brindes',
    variations: {
      sizes: ['325ml'],
      quantities: [1, 10, 50],
      finishings: ['Caixinha Individual', 'Sem caixinha'],
    },
  },
  {
    id: 'placa-pvc',
    name: 'Placa PVC',
    shortDescription: 'PVC 2mm com adesivo impresso.',
    imageUrl: 'https://picsum.photos/seed/cat4/600/400',
    imageHint: 'pvc sign',
    basePrice: 75.00,
    category: 'placas',
     variations: {
      sizes: ['30x40 cm', '50x70 cm', 'Personalizado'],
      quantities: [1, 5, 10],
      finishings: ['Furos para fixação', 'Sem furos'],
    },
  },
  {
    id: 'agenda-2025',
    name: 'Agenda 2025',
    shortDescription: 'Capa dura personalizada, miolo padrão.',
    imageUrl: 'https://picsum.photos/seed/prod7/600/400',
    imageHint: 'planner 2025',
    basePrice: 55.00,
    category: 'agendas',
    variations: {
      sizes: ['14x20 cm'],
      quantities: [10, 25, 50, 100],
      finishings: ['Wire-o', 'Espiral'],
    },
  },
  {
    id: 'calendario-mesa',
    name: 'Calendário de Mesa',
    shortDescription: 'Base em papel triplex, 12 lâminas.',
    imageUrl: 'https://picsum.photos/seed/prod8/600/400',
    imageHint: 'desk calendar',
    basePrice: 25.00,
    category: 'agendas',
    variations: {
      sizes: ['15x10 cm'],
      quantities: [50, 100, 250],
      finishings: ['Wire-o'],
    },
  },
];

export const orders: Order[] = [
    { id: 'ORD001', customerName: 'Empresa Alpha', customerEmail: 'contato@alpha.com', date: '2024-07-20', total: 189.90, status: 'Entregue', productName: 'Cartão de Visita' },
    { id: 'ORD002', customerName: 'Restaurante Sabor', customerEmail: 'contato@sabor.com', date: '2024-07-22', total: 350.00, status: 'Em produção', productName: 'Panfleto A5' },
    { id: 'ORD003', customerName: 'Loja Beta', customerEmail: 'contato@beta.com', date: '2024-07-23', total: 95.50, status: 'Pronto para retirada', productName: 'Adesivo Vinil' },
    { id: 'ORD004', customerName: 'Hospital Central', customerEmail: 'compras@central.com', date: '2024-07-25', total: 500.00, status: 'Em análise', productName: 'Banner Roll-up' },
    { id: 'ORD005', customerName: 'Empresa Alpha', customerEmail: 'contato@alpha.com', date: '2024-07-28', total: 70.00, status: 'Em produção', productName: 'Caneca Personalizada' },
];
