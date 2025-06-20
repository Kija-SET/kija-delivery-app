
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';

export const FloatingCart = () => {
  const navigate = useNavigate();
  const { getCartItemsCount, getCartTotal, toggleCart } = useStore();
  const itemsCount = getCartItemsCount();
  const total = getCartTotal();

  if (itemsCount === 0) return null;

  const handleCartClick = () => {
    toggleCart();
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-4 md:w-auto">
      {/* Mobile: Show checkout button */}
      <div className="md:hidden">
        <Button
          onClick={handleCheckout}
          className="w-full gradient-purple text-white shadow-lg hover-lift h-14"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemsCount}
                </span>
              </div>
              <span className="font-medium">Fazer Pedido</span>
            </div>
            <span className="font-bold">R$ {total.toFixed(2)}</span>
          </div>
        </Button>
      </div>

      {/* Desktop: Show cart toggle button */}
      <div className="hidden md:block">
        <Button
          onClick={handleCartClick}
          className="gradient-purple text-white shadow-lg hover-lift h-12 px-6"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemsCount}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium text-sm">Ver Carrinho</span>
              <span className="font-bold text-xs">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};
