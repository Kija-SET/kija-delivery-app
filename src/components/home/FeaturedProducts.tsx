
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { featuredProducts } from '@/data/products';

export const FeaturedProducts = () => {
  const { setSelectedProduct, setProductModalOpen } = useStore();

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        ⭐ Produtos em Destaque
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift cursor-pointer animate-fade-in"
            onClick={() => handleProductClick(product)}
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <Badge className="absolute top-3 left-3 gradient-purple text-white">
                ⭐ Destaque
              </Badge>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">
                  R$ {product.price.toFixed(2)}
                </span>
                <Button
                  size="sm"
                  className="gradient-purple text-white hover-lift"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Button
          variant="outline"
          size="lg"
          className="border-purple-600 text-purple-600 hover:bg-purple-50"
        >
          Ver Cardápio Completo
        </Button>
      </div>
    </section>
  );
};
