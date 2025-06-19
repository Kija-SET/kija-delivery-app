
import { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { ProductVariation, ProductComplement } from '@/types';

export const ProductModal = () => {
  const { 
    selectedProduct, 
    isProductModalOpen, 
    setProductModalOpen, 
    addToCart 
  } = useStore();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>();
  const [selectedComplements, setSelectedComplements] = useState<ProductComplement[]>([]);

  if (!selectedProduct) return null;

  const basePrice = selectedProduct.price + (selectedVariation?.price || 0);
  const complementsPrice = selectedComplements.reduce((sum, comp) => sum + comp.price, 0);
  const totalPrice = (basePrice + complementsPrice) * quantity;

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedVariation, selectedComplements);
    setProductModalOpen(false);
    // Reset state
    setQuantity(1);
    setSelectedVariation(undefined);
    setSelectedComplements([]);
  };

  const toggleComplement = (complement: ProductComplement) => {
    setSelectedComplements(prev => {
      const exists = prev.find(c => c.id === complement.id);
      if (exists) {
        return prev.filter(c => c.id !== complement.id);
      } else {
        return [...prev, complement];
      }
    });
  };

  return (
    <Dialog open={isProductModalOpen} onOpenChange={setProductModalOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10"
            onClick={() => setProductModalOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h2>
            <p className="text-gray-600 mt-1">{selectedProduct.description}</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              R$ {selectedProduct.price.toFixed(2)}
            </p>
          </div>

          {/* Variations */}
          {selectedProduct.variations && selectedProduct.variations.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tamanho</h3>
              <div className="grid grid-cols-3 gap-2">
                {selectedProduct.variations.map((variation) => (
                  <Button
                    key={variation.id}
                    variant={selectedVariation?.id === variation.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedVariation(variation)}
                    className={selectedVariation?.id === variation.id ? "gradient-purple text-white" : ""}
                  >
                    {variation.name}
                    {variation.price !== 0 && (
                      <span className="ml-1">
                        {variation.price > 0 ? '+' : ''}R$ {variation.price.toFixed(2)}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Complements */}
          {selectedProduct.complements && selectedProduct.complements.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Complementos</h3>
              <div className="space-y-2">
                {selectedProduct.complements.map((complement) => (
                  <div
                    key={complement.id}
                    className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleComplement(complement)}
                  >
                    <span className="text-sm">{complement.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">+R$ {complement.price.toFixed(2)}</span>
                      {selectedComplements.find(c => c.id === complement.id) && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          ✓
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-2">Quantidade</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Total and Add to Cart */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-purple-600">
                R$ {totalPrice.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={handleAddToCart}
                className="w-full gradient-purple text-white hover-lift"
                size="lg"
              >
                Adicionar ao carrinho
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setProductModalOpen(false)}
              >
                Continuar comprando
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
