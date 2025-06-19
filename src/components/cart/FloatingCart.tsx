
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

export const FloatingCart = () => {
  const { toggleCart, getCartItemsCount, getCartTotal } = useStore();
  const itemsCount = getCartItemsCount();
  const total = getCartTotal();

  if (itemsCount === 0) return null;

  return (
    <Button
      onClick={toggleCart}
      className="fixed bottom-4 left-4 right-4 z-40 gradient-purple text-white shadow-lg hover-lift h-14 md:left-auto md:right-4 md:w-auto md:px-6"
    >
      <div className="flex items-center justify-between w-full md:gap-3 md:w-auto">
        <div className="flex items-center gap-2">
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {itemsCount}
            </span>
          </div>
          <span className="font-medium">Ver carrinho</span>
        </div>
        <span className="font-bold">R$ {total.toFixed(2)}</span>
      </div>
    </Button>
  );
};
