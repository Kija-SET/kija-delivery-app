
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariation, ProductComplement, CustomerInfo, Order } from '@/types';

interface StoreState {
  // Cart state
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product, variation?: ProductVariation, complements?: ProductComplement[]) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  
  // Location state
  isLocationModalOpen: boolean;
  userLocation: { state: string; city: string } | null;
  setLocationModalOpen: (open: boolean) => void;
  setUserLocation: (location: { state: string; city: string }) => void;
  
  // Product modal state
  selectedProduct: Product | null;
  isProductModalOpen: boolean;
  setSelectedProduct: (product: Product | null) => void;
  setProductModalOpen: (open: boolean) => void;
  
  // Order state
  currentOrder: Order | null;
  customerInfo: CustomerInfo | null;
  setCustomerInfo: (info: CustomerInfo) => void;
  createOrder: () => void;
  
  // Mobile menu state
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart state
      cartItems: [],
      isCartOpen: false,
      
      addToCart: (product, variation, complements) => {
        const cartItems = get().cartItems;
        const basePrice = product.price + (variation?.price || 0);
        const complementsPrice = complements?.reduce((sum, comp) => sum + comp.price, 0) || 0;
        const totalPrice = basePrice + complementsPrice;
        
        // Create unique key for cart item
        const itemKey = `${product.id}-${variation?.id || 'default'}-${complements?.map(c => c.id).sort().join(',') || 'none'}`;
        
        const existingItemIndex = cartItems.findIndex(item => {
          const existingKey = `${item.product.id}-${item.selectedVariation?.id || 'default'}-${item.selectedComplements?.map(c => c.id).sort().join(',') || 'none'}`;
          return existingKey === itemKey;
        });
        
        if (existingItemIndex >= 0) {
          const updatedItems = [...cartItems];
          updatedItems[existingItemIndex].quantity += 1;
          updatedItems[existingItemIndex].totalPrice = (basePrice + complementsPrice) * updatedItems[existingItemIndex].quantity;
          set({ cartItems: updatedItems });
        } else {
          const newItem: CartItem = {
            product,
            quantity: 1,
            selectedVariation: variation,
            selectedComplements: complements,
            totalPrice
          };
          set({ cartItems: [...cartItems, newItem] });
        }
      },
      
      removeFromCart: (productId) => {
        set({ cartItems: get().cartItems.filter(item => item.product.id !== productId) });
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        const updatedItems = get().cartItems.map(item => {
          if (item.product.id === productId) {
            const basePrice = item.product.price + (item.selectedVariation?.price || 0);
            const complementsPrice = item.selectedComplements?.reduce((sum, comp) => sum + comp.price, 0) || 0;
            const unitPrice = basePrice + complementsPrice;
            return { ...item, quantity, totalPrice: unitPrice * quantity };
          }
          return item;
        });
        set({ cartItems: updatedItems });
      },
      
      clearCart: () => set({ cartItems: [] }),
      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
      
      getCartTotal: () => {
        return get().cartItems.reduce((total, item) => total + item.totalPrice, 0);
      },
      
      getCartItemsCount: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0);
      },
      
      // Location state
      isLocationModalOpen: false,
      userLocation: null,
      setLocationModalOpen: (open) => set({ isLocationModalOpen: open }),
      setUserLocation: (location) => set({ userLocation: location }),
      
      // Product modal state
      selectedProduct: null,
      isProductModalOpen: false,
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      setProductModalOpen: (open) => set({ isProductModalOpen: open }),
      
      // Order state
      currentOrder: null,
      customerInfo: null,
      setCustomerInfo: (info) => set({ customerInfo: info }),
      createOrder: () => {
        const { cartItems, customerInfo } = get();
        if (!customerInfo || cartItems.length === 0) return;
        
        const order: Order = {
          id: Math.random().toString(36).substr(2, 9),
          items: cartItems,
          total: get().getCartTotal(),
          customerInfo,
          status: 'received',
          createdAt: new Date(),
          estimatedDelivery: new Date(Date.now() + 35 * 60 * 1000) // 35 minutes from now
        };
        
        set({ currentOrder: order, cartItems: [], isCartOpen: false });
      },
      
      // Mobile menu state
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
    }),
    {
      name: 'acai-kija-store',
      partialize: (state) => ({
        cartItems: state.cartItems,
        userLocation: state.userLocation,
        customerInfo: state.customerInfo,
      }),
    }
  )
);
