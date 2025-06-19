
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';

export const CartDrawer = () => {
  const { 
    cartItems, 
    isCartOpen, 
    toggleCart, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal 
  } = useStore();

  if (!isCartOpen) return null;

  const total = getCartTotal();

  return (
    <div className="fixed inset-0 z-50 md:relative md:inset-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 md:hidden" 
        onClick={toggleCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 animate-slide-up md:relative md:animate-none">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Seu Pedido
            </h2>
            <Button variant="ghost" size="icon" onClick={toggleCart}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart className="h-12 w-12 mb-4" />
                <p>Seu carrinho está vazio</p>
                <p className="text-sm">Adicione alguns itens deliciosos!</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.product.id}-${item.selectedVariation?.id || 'default'}`} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.product.name}</h3>
                        
                        {item.selectedVariation && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {item.selectedVariation.name}
                          </Badge>
                        )}
                        
                        {item.selectedComplements && item.selectedComplements.length > 0 && (
                          <div className="text-xs text-gray-600 mt-1">
                            +{item.selectedComplements.map(c => c.name).join(', ')}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-bold text-purple-600">
                              R$ {item.totalPrice.toFixed(2)}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 h-auto p-0 text-xs"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-purple-600">
                  R$ {total.toFixed(2)}
                </span>
              </div>
              
              <div className="space-y-2">
                <Button className="w-full gradient-purple text-white hover-lift" size="lg">
                  Finalizar Compra
                </Button>
                <Button variant="outline" className="w-full" onClick={toggleCart}>
                  Continuar Comprando
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
