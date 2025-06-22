
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import { ProductGrid } from '@/components/common/ProductGrid';
import { Product } from '@/types/product';
import { ProductsHeader } from './products/ProductsHeader';
import { ProductModals } from './products/ProductModals';
import { useProductActions } from './products/ProductActions';

export const ProductsTab = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct, toggleProductStatus, getActiveProductIds } = useAdminProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const {
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleToggleStatus,
  } = useProductActions({
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    getActiveProductIds,
  });

  const handleEdit = (product: Product) => {
    console.log('Editando produto:', product);
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    console.log('Preparando para deletar produto:', product);
    setDeletingProduct(product);
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

  const handleFormOpenChange = (open: boolean) => {
    if (!open) handleCancelForm();
  };

  const handleDeleteConfirm = async () => {
    if (deletingProduct) {
      await handleDeleteProduct(deletingProduct);
      setDeletingProduct(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeletingProduct(null);
  };

  const handleCreateProductWrapper = async (productData: Omit<Product, 'id' | 'featured'>): Promise<Product> => {
    const result = await handleCreateProduct(productData);
    setIsFormOpen(false);
    return result;
  };

  const handleUpdateProductWrapper = async (productData: Omit<Product, 'id' | 'featured'>): Promise<Product> => {
    if (!editingProduct) throw new Error('No product to update');
    const result = await handleUpdateProduct(editingProduct, productData);
    setEditingProduct(null);
    setIsFormOpen(false);
    return result;
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
        <ProductsHeader
          productsCount={products.length}
          onAddNew={handleAddNew}
        />
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

      <ProductModals
        isFormOpen={isFormOpen}
        editingProduct={editingProduct}
        deletingProduct={deletingProduct}
        onFormOpenChange={handleFormOpenChange}
        onDeleteConfirm={handleDeleteConfirm}
        onDeleteCancel={handleDeleteCancel}
        onCreateProduct={handleCreateProductWrapper}
        onUpdateProduct={handleUpdateProductWrapper}
        onCancelForm={handleCancelForm}
      />
    </>
  );
};
