
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';

interface UseProductActionsProps {
  createProduct: (productData: Omit<Product, 'id' | 'featured'>) => Promise<Product>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductStatus: (id: string, ativo: boolean) => Promise<Product>;
  getActiveProductIds: () => string[];
}

export const useProductActions = ({
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getActiveProductIds,
}: UseProductActionsProps) => {
  const { toast } = useToast();

  const handleCreateProduct = async (productData: Omit<Product, 'id' | 'featured'>): Promise<Product> => {
    try {
      console.log('Criando produto:', productData);
      const newProduct = await createProduct(productData);
      toast({
        title: 'Sucesso!',
        description: 'Produto criado com sucesso',
      });
      return newProduct;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar produto',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleUpdateProduct = async (editingProduct: Product, productData: Omit<Product, 'id' | 'featured'>): Promise<Product> => {
    try {
      console.log('Atualizando produto:', editingProduct.id, productData);
      const updatedProduct = await updateProduct(editingProduct.id, productData);
      toast({
        title: 'Sucesso!',
        description: 'Produto atualizado com sucesso',
      });
      return updatedProduct;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar produto',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDeleteProduct = async (productToDelete: Product) => {
    try {
      console.log('Deletando produto:', productToDelete.id);
      await deleteProduct(productToDelete.id);
      toast({
        title: 'Sucesso!',
        description: 'Produto excluído com sucesso',
      });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir produto',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      const activeIds = getActiveProductIds();
      const isCurrentlyActive = activeIds.includes(product.id);
      console.log('Alterando status do produto:', product.id, 'para:', !isCurrentlyActive);
      await toggleProductStatus(product.id, !isCurrentlyActive);
      toast({
        title: 'Sucesso!',
        description: `Produto ${!isCurrentlyActive ? 'ativado' : 'desativado'} com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao alterar status do produto:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao alterar status do produto',
        variant: 'destructive',
      });
    }
  };

  return {
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleToggleStatus,
  };
};
