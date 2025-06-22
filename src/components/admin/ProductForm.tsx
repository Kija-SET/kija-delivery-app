
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { useAdminComplements } from '@/hooks/useAdminComplements';
import { ProductFormFields } from './forms/ProductFormFields';
import { ProductImageUpload } from './forms/ProductImageUpload';
import { ProductComplementsSection } from './forms/ProductComplementsSection';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Omit<Product, 'id' | 'featured'>) => Promise<Product | void>;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    image: product?.image || '',
  });
  const [selectedComplements, setSelectedComplements] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { associateComplementToProduct } = useAdminComplements();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome do produto é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (formData.price <= 0) {
      toast({
        title: 'Erro',
        description: 'Preço deve ser maior que zero',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Salvando produto:', formData);
      const savedProduct = await onSubmit(formData);
      
      // Associar complementos ao produto - verifica se o produto foi retornado ou usa o ID existente
      let productId: string | undefined;
      if (savedProduct && typeof savedProduct === 'object' && 'id' in savedProduct) {
        productId = savedProduct.id;
      } else if (product?.id) {
        productId = product.id;
      }
      
      if (productId) {
        await associateComplementToProduct(productId, selectedComplements);
        console.log('Complementos associados ao produto:', selectedComplements);
      }
      
      toast({
        title: 'Sucesso!',
        description: `Produto ${product ? 'atualizado' : 'criado'} com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar produto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Cancelando formulário de produto');
    onCancel();
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ProductFormFields
        formData={formData}
        onFormDataChange={setFormData}
      />

      <ProductComplementsSection
        productId={product?.id}
        selectedComplements={selectedComplements}
        onComplementsChange={setSelectedComplements}
      />

      <ProductImageUpload
        imageUrl={formData.image}
        onImageChange={handleImageChange}
      />

      <div className="flex space-x-2 pt-4">
        <Button 
          type="submit" 
          disabled={loading} 
          className="flex-1 gradient-purple"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          {product ? 'Atualizar' : 'Criar'} Produto
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleCancel} 
          className="flex-1"
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};
