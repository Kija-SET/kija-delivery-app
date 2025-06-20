
import { ProductCard } from '@/components/menu/ProductCard';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  mode?: 'customer' | 'admin';
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onToggleStatus?: (product: Product) => void;
  activeProducts?: string[];
  emptyMessage?: string;
}

export const ProductGrid = ({ 
  products, 
  mode = 'customer',
  onEdit,
  onDelete,
  onToggleStatus,
  activeProducts,
  emptyMessage = "Nenhum produto encontrado."
}: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const isActive = mode === 'admin' 
          ? activeProducts?.includes(product.id) ?? true
          : true;

        return (
          <ProductCard
            key={product.id}
            product={product}
            mode={mode}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
            isActive={isActive}
          />
        );
      })}
    </div>
  );
};
