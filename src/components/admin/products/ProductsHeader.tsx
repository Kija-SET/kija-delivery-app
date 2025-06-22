
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface ProductsHeaderProps {
  productsCount: number;
  onAddNew: () => void;
}

export const ProductsHeader = ({ productsCount, onAddNew }: ProductsHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>Gerenciar Produtos ({productsCount})</CardTitle>
        <Button onClick={onAddNew} className="gradient-purple">
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>
    </CardHeader>
  );
};
