
import { ProductCard } from '@/components/menu/ProductCard';

// Produtos em destaque mockados
const featuredProducts = [
  {
    id: '1',
    name: 'Açaí 300ml',
    description: 'Açaí puro com granola e banana',
    price: 12.90,
    image: '/placeholder.svg',
    category: 'Açaí',
    featured: true,
  },
  {
    id: '2',
    name: 'Açaí 500ml',
    description: 'Açaí puro com granola, banana e leite condensado',
    price: 18.90,
    image: '/placeholder.svg',
    category: 'Açaí',
    featured: true,
  },
  {
    id: '3',
    name: 'Vitamina de Açaí',
    description: 'Vitamina cremosa de açaí com banana',
    price: 15.90,
    image: '/placeholder.svg',
    category: 'Vitaminas',
    featured: true,
  },
];

export const FeaturedProducts = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        ⭐ Produtos em Destaque
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
