
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  mode?: 'customer' | 'admin';
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onToggleStatus?: (product: Product) => void;
  isActive?: boolean;
}

export const ProductCard = ({ 
  product, 
  mode = 'customer',
  onEdit,
  onDelete,
  onToggleStatus,
  isActive = true
}: ProductCardProps) => {
  const { setSelectedProduct, setProductModalOpen } = useStore();

  const handleClick = () => {
    if (mode === 'customer') {
      setSelectedProduct(product);
      setProductModalOpen(true);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(product);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(product);
  };

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStatus?.(product);
  };

  return (
    <Card className={`overflow-hidden hover-lift ${mode === 'customer' ? 'cursor-pointer' : ''} ${!isActive && mode === 'admin' ? 'opacity-60' : ''}`} onClick={handleClick}>
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {mode === 'admin' && (
          <div className="absolute top-2 right-2">
            <Badge className={isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {isActive ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        {product.category && (
          <p className="text-xs text-purple-600 mb-2 uppercase tracking-wide">{product.category}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-purple-600">
            R$ {product.price.toFixed(2)}
          </span>
          {mode === 'customer' ? (
            <Button size="sm" className="gradient-purple">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          ) : (
            <div className="flex space-x-1">
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleToggleStatus}
                title={isActive ? 'Desativar' : 'Ativar'}
              >
                {isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleEdit}
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={handleDelete}
                title="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
