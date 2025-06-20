
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus } from 'lucide-react';
import { useAdminBanners, Banner } from '@/hooks/useAdminBanners';
import { BannerPreview } from './BannerPreview';
import { BannerForm } from './BannerForm';

interface BannersTabProps {
  banners: Banner[];
}

export const BannersTab = ({ banners }: BannersTabProps) => {
  const { createBanner, updateBanner, deleteBanner, toggleBannerStatus } = useAdminBanners();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);

  const handleSubmit = async (bannerData: Omit<Banner, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, bannerData);
      } else {
        await createBanner(bannerData);
      }
      
      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar banner:', error);
    }
  };

  const resetForm = () => {
    setEditingBanner(null);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingBanner) return;
    try {
      await deleteBanner(deletingBanner.id);
      setDeletingBanner(null);
    } catch (error) {
      console.error('Erro ao deletar banner:', error);
    }
  };

  const handleToggleStatus = async (banner: Banner) => {
    try {
      await toggleBannerStatus(banner.id, !banner.ativo);
    } catch (error) {
      console.error('Erro ao alterar status do banner:', error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gerenciar Banners Promocionais ({banners.length})</CardTitle>
            <Button onClick={() => setIsFormOpen(true)} className="gradient-purple">
              <Plus className="h-4 w-4 mr-2" />
              Novo Banner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <BannerPreview
            showControls={true}
            onEdit={handleEdit}
            onDelete={setDeletingBanner}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>

      {/* Modal de Criação/Edição */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? 'Editar Banner' : 'Novo Banner'}
            </DialogTitle>
          </DialogHeader>
          <BannerForm
            banner={editingBanner}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              resetForm();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={!!deletingBanner} onOpenChange={() => setDeletingBanner(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o banner "{deletingBanner?.titulo}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
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
