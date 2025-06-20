
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/common/ProductGrid';

export const FeaturedProducts = () => {
  const { products, loading } = useProducts();
  
  // Filtrar produtos em destaque (usando os 3 primeiros produtos ativos como exemplo)
  const featuredProducts = products.filter(product => product.featured || products.indexOf(product) < 3);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          ⭐ Produtos em Destaque
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        ⭐ Produtos em Destaque
      </h2>
      
      <ProductGrid
        products={featuredProducts}
        mode="customer"
        emptyMessage="Nenhum produto em destaque no momento."
      />
    </section>
  );
};
