
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus } from 'lucide-react';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import { ProductGrid } from '@/components/common/ProductGrid';
import { ProductForm } from './ProductForm';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

export const ProductsTab = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct, toggleProductStatus, getActiveProductIds } = useAdminProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const handleCreateProduct = async (productData: Omit<Product, 'id' | 'featured'>) => {
    try {
      console.log('Criando produto:', productData);
      await createProduct(productData);
      setIsFormOpen(false);
      toast({
        title: 'Sucesso!',
        description: 'Produto criado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar produto',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateProduct = async (productData: Omit<Product, 'id' | 'featured'>) => {
    if (!editingProduct) return;
    try {
      console.log('Atualizando produto:', editingProduct.id, productData);
      await updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
      toast({
        title: 'Sucesso!',
        description: 'Produto atualizado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar produto',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      console.log('Deletando produto:', deletingProduct.id);
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
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

  const handleEdit = (product: Product) => {
    console.log('Editando produto:', product);
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    console.log('Preparando para deletar produto:', product);
    setDeletingProduct(product);
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

  const handleAddNew = () => {
    console.log('Abrindo formulário para novo produto');
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    console.log('Cancelando formulário');
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gerenciar Produtos ({products.length})</CardTitle>
            <Button onClick={handleAddNew} className="gradient-purple">
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ProductGrid
            products={products}
            mode="admin"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            activeProducts={getActiveProductIds()}
            emptyMessage="Nenhum produto cadastrado ainda."
          />
        </CardContent>
      </Card>

      {/* Modal de Criação */}
      <Dialog open={isFormOpen && !editingProduct} onOpenChange={(open) => !open && handleCancelForm()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Produto</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleCreateProduct}
            onCancel={handleCancelForm}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isFormOpen && !!editingProduct} onOpenChange={(open) => !open && handleCancelForm()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={handleUpdateProduct}
              onCancel={handleCancelForm}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{deletingProduct?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingProduct(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProduct}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
