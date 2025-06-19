
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2, Edit, Plus, Eye, EyeOff } from 'lucide-react';
import { useAdminProducts, Product } from '@/hooks/useAdminProducts';
import { ProductForm } from './ProductForm';

export const ProductsTab = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct, toggleProductStatus } = useAdminProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const handleCreateProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    await createProduct(productData);
    setIsFormOpen(false);
  };

  const handleUpdateProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, productData);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    await deleteProduct(deletingProduct.id);
    setDeletingProduct(null);
  };

  const handleToggleStatus = async (product: Product) => {
    await toggleProductStatus(product.id, !product.ativo);
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
            <Button onClick={() => setIsFormOpen(true)} className="gradient-purple">
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((produto) => (
              <div key={produto.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                    {produto.imagem_url ? (
                      <img 
                        src={produto.imagem_url} 
                        alt={produto.nome}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-purple-600 text-xs">Sem foto</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{produto.nome}</h3>
                    <p className="text-gray-600">R$ {produto.preco.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{produto.categoria}</p>
                    {produto.descricao && (
                      <p className="text-sm text-gray-400 truncate max-w-md">{produto.descricao}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={produto.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {produto.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleToggleStatus(produto)}
                    title={produto.ativo ? 'Desativar' : 'Ativar'}
                  >
                    {produto.ativo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setEditingProduct(produto)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => setDeletingProduct(produto)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Nenhum produto cadastrado ainda.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Criação */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Produto</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleCreateProduct}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={handleUpdateProduct}
              onCancel={() => setEditingProduct(null)}
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
              Tem certeza que deseja excluir o produto "{deletingProduct?.nome}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
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
