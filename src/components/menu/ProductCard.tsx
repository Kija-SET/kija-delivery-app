
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Product } from '@/types/product';
import { Complement } from '@/types/complement';
import { useComplements } from '@/hooks/useComplements';
import { useToast } from '@/hooks/use-toast';

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
  const { setSelectedProduct, setProductModalOpen, addToCart } = useStore();
  const { getComplementsByProduct } = useComplements();
  const [availableComplements, setAvailableComplements] = useState<Complement[]>([]);
  const [selectedComplements, setSelectedComplements] = useState<Complement[]>([]);
  const [showComplements, setShowComplements] = useState(false);
  const { toast } = useToast();

  // Carregar complementos disponíveis para o produto
  useEffect(() => {
    const loadComplements = async () => {
      if (mode === 'customer') {
        const complements = await getComplementsByProduct(product.id);
        setAvailableComplements(complements);
      }
    };
    
    loadComplements();
  }, [product.id, mode, getComplementsByProduct]);

  const handleClick = () => {
    if (mode === 'customer') {
      if (availableComplements.length > 0) {
        setShowComplements(!showComplements);
      } else {
        console.log('Abrindo modal do produto:', product);
        setSelectedProduct(product);
        setProductModalOpen(true);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Clique em editar produto:', product);
    onEdit?.(product);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Clique em deletar produto:', product);
    onDelete?.(product);
  };

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Clique em alterar status do produto:', product);
    onToggleStatus?.(product);
  };

  const handleComplementToggle = (complement: Complement, checked: boolean) => {
    if (checked) {
      setSelectedComplements(prev => [...prev, complement]);
    } else {
      setSelectedComplements(prev => prev.filter(c => c.id !== complement.id));
    }
  };

  const calculateTotalPrice = () => {
    const complementsPrice = selectedComplements.reduce((sum, comp) => sum + comp.preco, 0);
    return product.price + complementsPrice;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Adicionando produto ao carrinho:', product, 'com complementos:', selectedComplements);
    
    // Criar item do carrinho com complementos
    const cartItem = {
      product,
      quantity: 1,
      selectedComplements: selectedComplements.map(comp => ({
        id: comp.id,
        name: comp.nome,
        price: comp.preco
      })),
      totalPrice: calculateTotalPrice()
    };

    // Adicionar ao carrinho (você pode precisar ajustar o método addToCart no store)
    addToCart(product, undefined, selectedComplements.map(comp => ({
      id: comp.id,
      name: comp.nome,
      price: comp.preco
    })));

    toast({
      title: 'Produto adicionado!',
      description: `${product.name} foi adicionado ao carrinho${selectedComplements.length > 0 ? ` com ${selectedComplements.length} complemento(s)` : ''}`,
    });

    // Resetar seleção de complementos
    setSelectedComplements([]);
    setShowComplements(false);
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
        {mode === 'customer' && availableComplements.length > 0 && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-purple-100 text-purple-800">
              {availableComplements.length} complementos
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

        {/* Seção de Complementos */}
        {mode === 'customer' && showComplements && availableComplements.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Escolha seus complementos:</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableComplements.map((complement) => (
                <div key={complement.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`complement-${complement.id}`}
                    checked={selectedComplements.some(c => c.id === complement.id)}
                    onCheckedChange={(checked) => handleComplementToggle(complement, checked as boolean)}
                  />
                  <Label htmlFor={`complement-${complement.id}`} className="flex-1 cursor-pointer text-xs">
                    {complement.nome} (+R$ {complement.preco.toFixed(2)})
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-purple-600">
            {mode === 'customer' && showComplements ? (
              <>
                <span className={selectedComplements.length > 0 ? 'line-through text-gray-400 text-sm' : ''}>
                  R$ {product.price.toFixed(2)}
                </span>
                {selectedComplements.length > 0 && (
                  <span className="block">R$ {calculateTotalPrice().toFixed(2)}</span>
                )}
              </>
            ) : (
              `R$ ${product.price.toFixed(2)}`
            )}
          </span>
          {mode === 'customer' ? (
            <Button size="sm" className="gradient-purple" onClick={handleAddToCart}>
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
