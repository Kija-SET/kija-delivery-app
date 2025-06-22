
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ProductForm } from '../ProductForm';
import { Product } from '@/types/product';

interface ProductModalsProps {
  isFormOpen: boolean;
  editingProduct: Product | null;
  deletingProduct: Product | null;
  onFormOpenChange: (open: boolean) => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  onCreateProduct: (productData: Omit<Product, 'id' | 'featured'>) => Promise<Product>;
  onUpdateProduct: (productData: Omit<Product, 'id' | 'featured'>) => Promise<Product>;
  onCancelForm: () => void;
}

export const ProductModals = ({
  isFormOpen,
  editingProduct,
  deletingProduct,
  onFormOpenChange,
  onDeleteConfirm,
  onDeleteCancel,
  onCreateProduct,
  onUpdateProduct,
  onCancelForm,
}: ProductModalsProps) => {
  return (
    <>
      {/* Modal de Criação */}
      <Dialog open={isFormOpen && !editingProduct} onOpenChange={onFormOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Produto</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={onCreateProduct}
            onCancel={onCancelForm}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isFormOpen && !!editingProduct} onOpenChange={onFormOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={onUpdateProduct}
              onCancel={onCancelForm}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={!!deletingProduct} onOpenChange={onDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{deletingProduct?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onDeleteCancel}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDeleteConfirm}
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
