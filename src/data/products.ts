
import { Product, StoreInfo } from '@/types';

export const storeInfo: StoreInfo = {
  name: 'Açaí Kija',
  status: 'open',
  closingTime: '02:00',
  rating: 4.9,
  reviewCount: 693,
  estimatedDelivery: '30-50 min',
  deliveryFee: 0,
  distance: '2,3 km'
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Açaí Tradicional 500ml',
    description: 'Açaí puro cremoso servido com granola, banana e mel. Uma explosão de sabor e energia!',
    price: 15.90,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
    category: 'Açaiteria',
    featured: true,
    available: true,
    variations: [
      { id: 'v1', name: '300ml', price: -3.00 },
      { id: 'v2', name: '500ml', price: 0 },
      { id: 'v3', name: '700ml', price: 5.00 }
    ],
    complements: [
      { id: 'c1', name: 'Granola', price: 2.00 },
      { id: 'c2', name: 'Banana', price: 1.50 },
      { id: 'c3', name: 'Morango', price: 3.00 },
      { id: 'c4', name: 'Leite Condensado', price: 2.50 },
      { id: 'c5', name: 'Mel', price: 1.00 }
    ]
  },
  {
    id: '2',
    name: 'Açaí Premium 500ml',
    description: 'Açaí especial com frutas selecionadas, granola artesanal e cobertura de chocolate',
    price: 22.90,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
    category: 'Açaiteria',
    featured: true,
    available: true,
    variations: [
      { id: 'v1', name: '300ml', price: -4.00 },
      { id: 'v2', name: '500ml', price: 0 },
      { id: 'v3', name: '700ml', price: 6.00 }
    ],
    complements: [
      { id: 'c1', name: 'Granola Premium', price: 3.50 },
      { id: 'c2', name: 'Mix de Frutas', price: 4.00 },
      { id: 'c3', name: 'Nutella', price: 5.00 },
      { id: 'c4', name: 'Amendoim', price: 2.50 }
    ]
  },
  {
    id: '3',
    name: 'Sorvete Artesanal Chocolate',
    description: 'Sorvete cremoso de chocolate belga, feito artesanalmente com ingredientes premium',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
    category: 'Sorveteria',
    featured: false,
    available: true,
    variations: [
      { id: 'v1', name: '1 Bola', price: -3.00 },
      { id: 'v2', name: '2 Bolas', price: 0 },
      { id: 'v3', name: '3 Bolas', price: 4.00 }
    ]
  },
  {
    id: '4',
    name: 'Milkshake de Açaí',
    description: 'Cremoso milkshake de açaí batido com sorvete e leite condensado',
    price: 18.90,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
    category: 'Bebidas',
    featured: true,
    available: true,
    variations: [
      { id: 'v1', name: '300ml', price: -2.00 },
      { id: 'v2', name: '500ml', price: 0 },
      { id: 'v3', name: '700ml', price: 4.00 }
    ]
  },
  {
    id: '5',
    name: 'Brownie com Sorvete',
    description: 'Brownie quentinho acompanhado de sorvete de baunilha e calda de chocolate',
    price: 16.90,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
    category: 'Doces',
    featured: false,
    available: true
  },
  {
    id: '6',
    name: 'Agua Mineral 500ml',
    description: 'Água mineral natural gelada',
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
    category: 'Bebidas',
    featured: false,
    available: true
  },
  {
    id: '7',
    name: 'Refrigerante Coca-Cola 350ml',
    description: 'Coca-Cola gelada lata 350ml',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
    category: 'Bebidas',
    featured: false,
    available: true
  },
  {
    id: '8',
    name: 'Torta de Morango',
    description: 'Fatia de torta de morango com chantilly e morangos frescos',
    price: 14.90,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
    category: 'Doces',
    featured: false,
    available: true
  }
];

export const categories = [
  'Açaiteria',
  'Sorveteria', 
  'Bebidas',
  'Doces'
];

export const featuredProducts = products.filter(product => product.featured);
export const promotionalBanners = [
  {
    id: '1',
    title: 'Pague 1 Leve 2',
    subtitle: 'Em açaís selecionados',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=200&fit=crop'
  },
  {
    id: '2', 
    title: 'Frete Grátis',
    subtitle: 'Acima de R$ 30,00',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=200&fit=crop'
  }
];
