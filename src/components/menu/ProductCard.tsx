
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/store/useStore';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { setSelectedProduct, setProductModalOpen } = useStore();

  const handleClick = () => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  return (
    <Card className="overflow-hidden hover-lift cursor-pointer" onClick={handleClick}>
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-purple-600">
            R$ {product.price.toFixed(2)}
          </span>
          <Button size="sm" className="gradient-purple">
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
