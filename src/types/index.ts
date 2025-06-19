
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  available?: boolean;
  variations?: ProductVariation[];
  complements?: ProductComplement[];
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
}

export interface ProductComplement {
  id: string;
  name: string;
  price: number;
  required?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariation?: ProductVariation;
  selectedComplements?: ProductComplement[];
  totalPrice: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: CustomerInfo;
  status: OrderStatus;
  createdAt: Date;
  estimatedDelivery: Date;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  paymentMethod: 'pix' | 'card';
}

export type OrderStatus = 'received' | 'preparing' | 'out-for-delivery' | 'delivered';

export interface StoreInfo {
  name: string;
  status: 'open' | 'closed';
  closingTime: string;
  rating: number;
  reviewCount: number;
  estimatedDelivery: string;
  deliveryFee: number;
  distance: string;
}
