
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/store/useStore';
import { products, categories } from '@/data/products';

export const ProductCatalog = () => {
  const { setSelectedProduct, setProductModalOpen } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('Açaiteria');

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🍽️ Nosso Cardápio
      </h2>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="data-[state=active]:gradient-purple data-[state=active]:text-white"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-6">
            {/* Featured items for this category */}
            {getProductsByCategory(category).some(p => p.featured) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  ⭐ Destaques de {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {getProductsByCategory(category)
                    .filter(product => product.featured)
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() => handleProductClick(product)}
                        featured
                      />
                    ))}
                </div>
              </div>
            )}

            {/* All items for this category */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Todos os itens de {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getProductsByCategory(category).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

interface ProductCardProps {
  product: any;
  onClick: () => void;
  featured?: boolean;
}

const ProductCard = ({ product, onClick, featured = false }: ProductCardProps) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover-lift cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover"
        />
        {featured && (
          <Badge className="absolute top-2 left-2 gradient-purple text-white text-xs">
            ⭐ Destaque
          </Badge>
        )}
        {!product.available && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
            Indisponível
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-purple-600">
            R$ {product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            className="gradient-purple text-white hover-lift"
            disabled={!product.available}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
};
