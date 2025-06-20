
import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/common/ProductGrid';

const categoryEmojis = {
  'acai': '🍇',
  'complementos': '🥜',
  'bebidas': '🥤',
  'sobremesas': '🍮',
  'vitaminas': '🥤'
};

export const ProductCatalog = () => {
  const { products, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string>('');

  // Agrupar produtos por categoria
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category || 'outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categoryName = entry.target.getAttribute('data-category');
            if (categoryName) {
              setActiveCategory(categoryName);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.keys(productsByCategory).forEach((category) => {
      const element = document.getElementById(`category-${category.toLowerCase()}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [productsByCategory]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (Object.keys(productsByCategory).length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum produto disponível no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {Object.entries(productsByCategory).map(([category, categoryProducts]) => {
        const emoji = categoryEmojis[category.toLowerCase() as keyof typeof categoryEmojis] || '📦';
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        
        return (
          <section
            key={category}
            id={`category-${category.toLowerCase()}`}
            data-category={category}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {emoji} {categoryName} ({categoryProducts.length})
            </h2>
            
            <ProductGrid
              products={categoryProducts}
              mode="customer"
              emptyMessage={`Nenhum produto disponível em ${categoryName}.`}
            />
          </section>
        );
      })}
    </div>
  );
};
