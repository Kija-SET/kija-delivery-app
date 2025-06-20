
import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';

// Produtos mockados organizados por categoria
const productsByCategory = {
  'Açaí': [
    {
      id: '1',
      name: 'Açaí 300ml',
      description: 'Açaí puro com granola e banana',
      price: 12.90,
      image: '/placeholder.svg',
      category: 'Açaí',
      available: true,
    },
    {
      id: '2',
      name: 'Açaí 500ml',
      description: 'Açaí puro com granola, banana e leite condensado',
      price: 18.90,
      image: '/placeholder.svg',
      category: 'Açaí',
      available: true,
    },
    {
      id: '3',
      name: 'Açaí 700ml',
      description: 'Açaí puro com granola, banana, leite condensado e frutas',
      price: 24.90,
      image: '/placeholder.svg',
      category: 'Açaí',
      available: true,
    },
  ],
  'Vitaminas': [
    {
      id: '4',
      name: 'Vitamina de Açaí',
      description: 'Vitamina cremosa de açaí com banana',
      price: 15.90,
      image: '/placeholder.svg',
      category: 'Vitaminas',
      available: true,
    },
    {
      id: '5',
      name: 'Vitamina de Morango',
      description: 'Vitamina refrescante de morango',
      price: 14.90,
      image: '/placeholder.svg',
      category: 'Vitaminas',
      available: true,
    },
  ],
  'Sobremesas': [
    {
      id: '6',
      name: 'Sorvete de Açaí',
      description: 'Sorvete cremoso de açaí',
      price: 8.90,
      image: '/placeholder.svg',
      category: 'Sobremesas',
      available: true,
    },
    {
      id: '7',
      name: 'Pudim de Leite',
      description: 'Pudim caseiro tradicional',
      price: 6.90,
      image: '/placeholder.svg',
      category: 'Sobremesas',
      available: true,
    },
  ],
  'Bebidas': [
    {
      id: '8',
      name: 'Suco de Laranja',
      description: 'Suco natural de laranja',
      price: 7.90,
      image: '/placeholder.svg',
      category: 'Bebidas',
      available: true,
    },
    {
      id: '9',
      name: 'Água de Coco',
      description: 'Água de coco natural gelada',
      price: 5.90,
      image: '/placeholder.svg',
      category: 'Bebidas',
      available: true,
    },
  ],
};

export const ProductCatalog = () => {
  const [activeCategory, setActiveCategory] = useState<string>('');

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
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {Object.entries(productsByCategory).map(([category, products]) => (
        <section
          key={category}
          id={`category-${category.toLowerCase()}`}
          data-category={category}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {category === 'Açaí' && '🍇'} 
            {category === 'Vitaminas' && '🥤'} 
            {category === 'Sobremesas' && '🍮'} 
            {category === 'Bebidas' && '🥤'} 
            {category}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
